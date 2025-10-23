'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-hot-toast';
import { 
  Smartphone, 
  Shield, 
  Zap, 
  Settings, 
  CheckCircle, 
  AlertCircle,
  Phone,
  MessageSquare,
  Clock,
  TrendingUp,
  Eye,
  EyeOff,
  Trash2,
  RefreshCw
} from 'lucide-react';

interface SMSConnection {
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

export default function SMSConnectPage() {
  const { user } = useAuth();
  const [connection, setConnection] = useState<SMSConnection | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  
  // Setup form state
  const [phoneNumber, setPhoneNumber] = useState('');
  const [permissions, setPermissions] = useState({
    readSMS: true,
    autoProcess: true,
    realTimeSync: true,
  });
  const [settings, setSettings] = useState({
    autoApprove: false,
    minConfidence: 0.7,
    categories: [] as string[],
    excludeKeywords: [] as string[],
  });

  useEffect(() => {
    fetchConnectionStatus();
    fetchPendingCount();
  }, []);

  const fetchConnectionStatus = async () => {
    try {
      const response = await fetch('/api/sms/register', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      const data = await response.json();
      if (data.success && data.data) {
        setConnection(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch connection status:', error);
    }
  };

  const fetchPendingCount = async () => {
    try {
      const response = await fetch('/api/sms/pending', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setPendingCount(data.data.count);
      }
    } catch (error) {
      console.error('Failed to fetch pending count:', error);
    }
  };

  const handleRegisterPhone = async () => {
    if (!phoneNumber.trim()) {
      toast.error('Please enter a valid phone number');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/sms/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({
          phoneNumber,
          permissions,
          settings
        })
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Phone number registered successfully!');
        setShowSetup(false);
        fetchConnectionStatus();
      } else {
        toast.error(data.message || 'Failed to register phone number');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Failed to register phone number');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateSettings = async () => {
    if (!connection) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/sms/register', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify(settings)
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Settings updated successfully!');
        fetchConnectionStatus();
      } else {
        toast.error(data.message || 'Failed to update settings');
      }
    } catch (error) {
      console.error('Settings update error:', error);
      toast.error('Failed to update settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeactivate = async () => {
    if (!confirm('Are you sure you want to deactivate SMS monitoring? This will stop automatic transaction imports.')) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/sms/register', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      const data = await response.json();

      if (data.success) {
        toast.success('SMS monitoring deactivated');
        setConnection(null);
      } else {
        toast.error(data.message || 'Failed to deactivate');
      }
    } catch (error) {
      console.error('Deactivation error:', error);
      toast.error('Failed to deactivate SMS monitoring');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Smartphone className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">SMS Auto-Import</h1>
              <p className="text-gray-600">Connect your phone for automatic transaction tracking</p>
            </div>
          </div>

          {/* Status Banner */}
          {connection ? (
            <div className="flex items-center gap-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div className="flex-1">
                <div className="font-medium text-green-900">SMS Monitoring Active</div>
                <div className="text-sm text-green-700">
                  Connected: {connection.phoneNumber} • {connection.totalProcessed} transactions processed
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800">
                {connection.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          ) : (
            <div className="flex items-center gap-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <div className="flex-1">
                <div className="font-medium text-yellow-900">SMS Monitoring Not Connected</div>
                <div className="text-sm text-yellow-700">
                  Connect your phone number to start automatic transaction imports
                </div>
              </div>
              <Button onClick={() => setShowSetup(true)} size="sm">
                Connect Phone
              </Button>
            </div>
          )}
        </div>

        {/* Connection Setup */}
        {showSetup && (
          <Card className="p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Connect Your Phone Number</h2>
            
            <div className="space-y-6">
              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+91 9876543210"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Enter the phone number that receives your bank SMS messages
                </p>
              </div>

              {/* Permissions */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Permissions</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={permissions.readSMS}
                      onChange={(e) => setPermissions({...permissions, readSMS: e.target.checked})}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <div className="font-medium text-gray-900">Read SMS Messages</div>
                      <div className="text-sm text-gray-600">Allow reading transaction SMS messages</div>
                    </div>
                  </label>
                  
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={permissions.autoProcess}
                      onChange={(e) => setPermissions({...permissions, autoProcess: e.target.checked})}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <div className="font-medium text-gray-900">Auto-Process Transactions</div>
                      <div className="text-sm text-gray-600">Automatically parse and create transactions</div>
                    </div>
                  </label>
                  
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={permissions.realTimeSync}
                      onChange={(e) => setPermissions({...permissions, realTimeSync: e.target.checked})}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <div className="font-medium text-gray-900">Real-time Sync</div>
                      <div className="text-sm text-gray-600">Process SMS messages as they arrive</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Settings */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Processing Settings</h3>
                <div className="space-y-4">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={settings.autoApprove}
                      onChange={(e) => setSettings({...settings, autoApprove: e.target.checked})}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <div className="font-medium text-gray-900">Auto-approve high confidence transactions</div>
                      <div className="text-sm text-gray-600">Automatically add transactions with 80%+ confidence</div>
                    </div>
                  </label>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Minimum Confidence: {(settings.minConfidence * 100).toFixed(0)}%
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="1"
                      step="0.1"
                      value={settings.minConfidence}
                      onChange={(e) => setSettings({...settings, minConfidence: parseFloat(e.target.value)})}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>50%</span>
                      <span>100%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  onClick={handleRegisterPhone}
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Phone className="h-4 w-4 mr-2" />
                      Connect Phone
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowSetup(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Connection Details */}
        {connection && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Status Card */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold">Connection Status</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Phone Number</span>
                  <span className="font-medium">{connection.phoneNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <Badge className={connection.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                    {connection.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Sync</span>
                  <span className="font-medium">
                    {new Date(connection.lastSyncTime).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Processed</span>
                  <span className="font-medium">{connection.totalProcessed}</span>
                </div>
              </div>
            </Card>

            {/* Pending Transactions */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="h-5 w-5 text-yellow-600" />
                <h3 className="font-semibold">Pending Review</h3>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600 mb-2">{pendingCount}</div>
                <div className="text-sm text-gray-600 mb-4">Transactions awaiting approval</div>
                {pendingCount > 0 && (
                  <Button size="sm" onClick={() => window.location.href = '/sms-import'}>
                    Review Pending
                  </Button>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* Settings */}
        {connection && (
          <Card className="p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Settings className="h-5 w-5 text-gray-600" />
                <h3 className="font-semibold">Processing Settings</h3>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleUpdateSettings}
                disabled={isLoading}
              >
                {isLoading ? 'Updating...' : 'Update Settings'}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-3 mb-4">
                  <input
                    type="checkbox"
                    checked={settings.autoApprove}
                    onChange={(e) => setSettings({...settings, autoApprove: e.target.checked})}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="font-medium">Auto-approve high confidence transactions</span>
                </label>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Minimum Confidence: {(settings.minConfidence * 100).toFixed(0)}%
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="1"
                    step="0.1"
                    value={settings.minConfidence}
                    onChange={(e) => setSettings({...settings, minConfidence: parseFloat(e.target.value)})}
                    className="w-full"
                  />
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Permissions</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    {connection.permissions.readSMS ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span>Read SMS Messages</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {connection.permissions.autoProcess ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span>Auto-Process Transactions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {connection.permissions.realTimeSync ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span>Real-time Sync</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Actions */}
        {connection && (
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Manage Connection</h3>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={fetchConnectionStatus}
                disabled={isLoading}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Status
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.href = '/sms-import'}
              >
                <Eye className="h-4 w-4 mr-2" />
                View Import History
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeactivate}
                disabled={isLoading}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Deactivate
              </Button>
            </div>
          </Card>
        )}

        {/* How it Works */}
        <Card className="p-6 mt-6">
          <h3 className="font-semibold mb-4">How SMS Auto-Import Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="p-3 bg-blue-100 rounded-lg w-fit mx-auto mb-3">
                <Phone className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-medium mb-2">1. Connect Phone</h4>
              <p className="text-sm text-gray-600">Register your phone number with our secure system</p>
            </div>
            <div className="text-center">
              <div className="p-3 bg-green-100 rounded-lg w-fit mx-auto mb-3">
                <Zap className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-medium mb-2">2. Auto-Process</h4>
              <p className="text-sm text-gray-600">SMS messages are automatically parsed and processed</p>
            </div>
            <div className="text-center">
              <div className="p-3 bg-purple-100 rounded-lg w-fit mx-auto mb-3">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-medium mb-2">3. Track Expenses</h4>
              <p className="text-sm text-gray-600">Transactions appear in your dashboard automatically</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}