/**
 * Real-time SMS Integration Service
 * Handles automatic SMS reading and transaction processing
 */

import { SMSTransactionParser } from './sms-parser';
import Transaction from './models/Transaction';
import connectDB from './mongodb';

export interface SMSConnection {
  userId: string;
  phoneNumber: string;
  isActive: boolean;
  permissions: {
    readSMS: boolean;
    autoProcess: boolean;
    realTimeSync: boolean;
  };
  settings: {
    autoApprove: boolean;
    minConfidence: number;
    categories: string[];
    excludeKeywords: string[];
  };
  lastSyncTime: Date;
  totalProcessed: number;
}

export interface SMSWebhookPayload {
  phoneNumber: string;
  message: string;
  timestamp: Date;
  sender: string;
  messageId: string;
}

export class SMSIntegrationService {
  private static instance: SMSIntegrationService;
  private connections: Map<string, SMSConnection> = new Map();
  private webhookEndpoint = '/api/sms/webhook';

  static getInstance(): SMSIntegrationService {
    if (!SMSIntegrationService.instance) {
      SMSIntegrationService.instance = new SMSIntegrationService();
    }
    return SMSIntegrationService.instance;
  }

  /**
   * Register a phone number for SMS monitoring
   */
  async registerPhoneNumber(
    userId: string,
    phoneNumber: string,
    permissions: SMSConnection['permissions'],
    settings: SMSConnection['settings']
  ): Promise<{ success: boolean; webhookUrl?: string; error?: string }> {
    try {
      // Validate phone number format
      if (!this.isValidPhoneNumber(phoneNumber)) {
        return { success: false, error: 'Invalid phone number format' };
      }

      // Check if phone number is already registered
      const existingConnection = Array.from(this.connections.values())
        .find(conn => conn.phoneNumber === phoneNumber && conn.userId !== userId);
      
      if (existingConnection) {
        return { success: false, error: 'Phone number already registered by another user' };
      }

      const connection: SMSConnection = {
        userId,
        phoneNumber,
        isActive: true,
        permissions,
        settings,
        lastSyncTime: new Date(),
        totalProcessed: 0
      };

      this.connections.set(userId, connection);

      // Store in database
      await this.saveConnectionToDB(connection);

      // Generate webhook URL for SMS service integration
      const webhookUrl = `${process.env.NEXTAUTH_URL}${this.webhookEndpoint}`;

      return { 
        success: true, 
        webhookUrl,
      };
    } catch (error: any) {
      console.error('Phone registration error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Process incoming SMS webhook
   */
  async processIncomingSMS(payload: SMSWebhookPayload): Promise<{
    success: boolean;
    transactionCreated?: boolean;
    transactionId?: string;
    confidence?: number;
    error?: string;
  }> {
    try {
      // Find connection for this phone number
      const connection = Array.from(this.connections.values())
        .find(conn => conn.phoneNumber === payload.phoneNumber && conn.isActive);

      if (!connection) {
        return { success: false, error: 'Phone number not registered or inactive' };
      }

      // Check if message is from a bank (basic filtering)
      if (!this.isBankSMS(payload.sender, payload.message)) {
        return { success: true, transactionCreated: false };
      }

      // Parse the SMS message
      const parsedTransaction = SMSTransactionParser.parseSMS(payload.message);
      
      if (!parsedTransaction) {
        return { success: true, transactionCreated: false };
      }

      // Check confidence threshold
      if (parsedTransaction.confidence < connection.settings.minConfidence) {
        // Store as pending review if below threshold
        await this.storePendingTransaction(connection.userId, parsedTransaction, payload);
        return { 
          success: true, 
          transactionCreated: false, 
          confidence: parsedTransaction.confidence 
        };
      }

      // Auto-approve if settings allow and confidence is high
      if (connection.settings.autoApprove && parsedTransaction.confidence >= 0.8) {
        const transactionId = await this.createTransaction(connection.userId, parsedTransaction, payload);
        
        // Update connection stats
        connection.totalProcessed++;
        connection.lastSyncTime = new Date();
        await this.saveConnectionToDB(connection);

        // Send real-time notification
        await this.sendRealTimeNotification(connection.userId, parsedTransaction);

        return { 
          success: true, 
          transactionCreated: true, 
          transactionId,
          confidence: parsedTransaction.confidence 
        };
      }

      // Store for manual review
      await this.storePendingTransaction(connection.userId, parsedTransaction, payload);
      
      return { 
        success: true, 
        transactionCreated: false, 
        confidence: parsedTransaction.confidence 
      };

    } catch (error: any) {
      console.error('SMS processing error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get connection status for a user
   */
  getConnectionStatus(userId: string): SMSConnection | null {
    return this.connections.get(userId) || null;
  }

  /**
   * Update connection settings
   */
  async updateConnectionSettings(
    userId: string, 
    settings: Partial<SMSConnection['settings']>
  ): Promise<boolean> {
    const connection = this.connections.get(userId);
    if (!connection) return false;

    connection.settings = { ...connection.settings, ...settings };
    await this.saveConnectionToDB(connection);
    return true;
  }

  /**
   * Deactivate SMS monitoring
   */
  async deactivateConnection(userId: string): Promise<boolean> {
    const connection = this.connections.get(userId);
    if (!connection) return false;

    connection.isActive = false;
    await this.saveConnectionToDB(connection);
    this.connections.delete(userId);
    return true;
  }

  /**
   * Get pending transactions for review
   */
  async getPendingTransactions(userId: string): Promise<any[]> {
    try {
      await connectDB();
      
      // This would typically be stored in a separate PendingTransaction model
      // For now, we'll use a simple query
      const pendingTransactions = await Transaction.find({
        userId,
        source: 'sms_pending',
        confidence: { $lt: 0.8 }
      }).sort({ createdAt: -1 });

      return pendingTransactions;
    } catch (error) {
      console.error('Error fetching pending transactions:', error);
      return [];
    }
  }

  /**
   * Approve a pending transaction
   */
  async approvePendingTransaction(userId: string, transactionId: string): Promise<boolean> {
    try {
      await connectDB();
      
      const transaction = await Transaction.findOne({
        _id: transactionId,
        userId,
        source: 'sms_pending'
      });

      if (!transaction) return false;

      // Update transaction to approved status
      transaction.source = 'sms_import';
      await transaction.save();

      return true;
    } catch (error) {
      console.error('Error approving transaction:', error);
      return false;
    }
  }

  // Private helper methods

  private isValidPhoneNumber(phoneNumber: string): boolean {
    // Basic phone number validation (can be enhanced)
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phoneNumber.replace(/[\s\-\(\)]/g, ''));
  }

  private isBankSMS(sender: string, message: string): boolean {
    const bankKeywords = [
      'bank', 'hdfc', 'sbi', 'icici', 'axis', 'kotak', 'pnb', 'bob',
      'debited', 'credited', 'transaction', 'payment', 'transfer'
    ];
    
    const senderLower = sender.toLowerCase();
    const messageLower = message.toLowerCase();
    
    return bankKeywords.some(keyword => 
      senderLower.includes(keyword) || messageLower.includes(keyword)
    );
  }

  private async createTransaction(
    userId: string, 
    parsedTransaction: any, 
    smsPayload: SMSWebhookPayload
  ): Promise<string> {
    await connectDB();
    
    const transaction = new Transaction({
      userId,
      title: parsedTransaction.merchant || parsedTransaction.description,
      amount: parsedTransaction.amount,
      type: parsedTransaction.type === 'debit' ? 'expense' : 'income',
      category: parsedTransaction.category || 'Other',
      paymentMethod: 'Bank Transfer',
      date: parsedTransaction.date,
      description: parsedTransaction.description,
      notes: `Auto-imported from SMS (${(parsedTransaction.confidence * 100).toFixed(1)}% confidence)`,
      source: 'sms_import',
      confidence: parsedTransaction.confidence,
      originalSMS: smsPayload.message
    });

    await transaction.save();
    return transaction._id.toString();
  }

  private async storePendingTransaction(
    userId: string, 
    parsedTransaction: any, 
    smsPayload: SMSWebhookPayload
  ): Promise<void> {
    await connectDB();
    
    const transaction = new Transaction({
      userId,
      title: parsedTransaction.merchant || parsedTransaction.description,
      amount: parsedTransaction.amount,
      type: parsedTransaction.type === 'debit' ? 'expense' : 'income',
      category: parsedTransaction.category || 'Other',
      paymentMethod: 'Bank Transfer',
      date: parsedTransaction.date,
      description: parsedTransaction.description,
      notes: `Pending review - SMS import (${(parsedTransaction.confidence * 100).toFixed(1)}% confidence)`,
      source: 'sms_pending',
      confidence: parsedTransaction.confidence,
      originalSMS: smsPayload.message
    });

    await transaction.save();
  }

  private async saveConnectionToDB(connection: SMSConnection): Promise<void> {
    // This would typically save to a SMSConnection model
    // For now, we'll store in user preferences or a separate collection
    console.log('Saving connection to DB:', connection);
  }

  private async sendRealTimeNotification(userId: string, transaction: any): Promise<void> {
    // Send push notification or websocket update
    console.log('Sending real-time notification for transaction:', transaction);
  }
}

export default SMSIntegrationService;