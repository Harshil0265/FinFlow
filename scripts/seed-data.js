const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/expense_manager';

// User schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  preferences: {
    currency: { type: String, default: 'USD' },
    dateFormat: { type: String, default: 'MM/dd/yyyy' },
    theme: { type: String, default: 'system' },
  },
}, { timestamps: true });

// Transaction schema
const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['income', 'expense'], required: true },
  category: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  date: { type: Date, required: true },
  description: { type: String, default: '' },
}, { timestamps: true });

// Budget schema
const budgetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  period: { type: String, enum: ['monthly', 'weekly', 'yearly'], default: 'monthly' },
  startDate: { type: Date, required: true },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
const Transaction = mongoose.model('Transaction', transactionSchema);
const Budget = mongoose.model('Budget', budgetSchema);

async function seedData() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Transaction.deleteMany({});
    await Budget.deleteMany({});
    console.log('Cleared existing data');

    // Create demo user
    const hashedPassword = await bcrypt.hash('demo123456', 12);
    const demoUser = await User.create({
      email: 'demo@example.com',
      password: hashedPassword,
      name: 'Demo User',
      preferences: {
        currency: 'USD',
        dateFormat: 'MM/dd/yyyy',
        theme: 'system',
      },
    });
    console.log('Created demo user');

    // Sample transactions
    const transactions = [
      // Income transactions
      {
        userId: demoUser._id,
        title: 'Monthly Salary',
        amount: 5000.00,
        type: 'income',
        category: 'Salary',
        paymentMethod: 'Bank Transfer',
        date: new Date('2024-01-01'),
        description: 'Monthly salary payment',
      },
      {
        userId: demoUser._id,
        title: 'Freelance Project',
        amount: 1200.00,
        type: 'income',
        category: 'Freelance',
        paymentMethod: 'PayPal',
        date: new Date('2024-01-15'),
        description: 'Web development project',
      },
      {
        userId: demoUser._id,
        title: 'Investment Dividend',
        amount: 150.00,
        type: 'income',
        category: 'Investment',
        paymentMethod: 'Bank Transfer',
        date: new Date('2024-01-20'),
        description: 'Quarterly dividend payment',
      },

      // Expense transactions
      {
        userId: demoUser._id,
        title: 'Grocery Shopping',
        amount: 125.50,
        type: 'expense',
        category: 'Food & Dining',
        paymentMethod: 'Credit Card',
        date: new Date('2024-01-02'),
        description: 'Weekly groceries at Whole Foods',
      },
      {
        userId: demoUser._id,
        title: 'Gas Station',
        amount: 45.20,
        type: 'expense',
        category: 'Transportation',
        paymentMethod: 'Debit Card',
        date: new Date('2024-01-03'),
        description: 'Fill up gas tank',
      },
      {
        userId: demoUser._id,
        title: 'Netflix Subscription',
        amount: 15.99,
        type: 'expense',
        category: 'Entertainment',
        paymentMethod: 'Credit Card',
        date: new Date('2024-01-05'),
        description: 'Monthly Netflix subscription',
      },
      {
        userId: demoUser._id,
        title: 'Electric Bill',
        amount: 89.45,
        type: 'expense',
        category: 'Bills & Utilities',
        paymentMethod: 'Bank Transfer',
        date: new Date('2024-01-07'),
        description: 'Monthly electricity bill',
      },
      {
        userId: demoUser._id,
        title: 'Coffee Shop',
        amount: 12.75,
        type: 'expense',
        category: 'Food & Dining',
        paymentMethod: 'Cash',
        date: new Date('2024-01-08'),
        description: 'Morning coffee and pastry',
      },
      {
        userId: demoUser._id,
        title: 'Online Shopping',
        amount: 89.99,
        type: 'expense',
        category: 'Shopping',
        paymentMethod: 'Credit Card',
        date: new Date('2024-01-10'),
        description: 'New headphones from Amazon',
      },
      {
        userId: demoUser._id,
        title: 'Gym Membership',
        amount: 49.99,
        type: 'expense',
        category: 'Healthcare',
        paymentMethod: 'Credit Card',
        date: new Date('2024-01-12'),
        description: 'Monthly gym membership',
      },
      {
        userId: demoUser._id,
        title: 'Restaurant Dinner',
        amount: 67.80,
        type: 'expense',
        category: 'Food & Dining',
        paymentMethod: 'Credit Card',
        date: new Date('2024-01-14'),
        description: 'Dinner with friends at Italian restaurant',
      },
      {
        userId: demoUser._id,
        title: 'Uber Ride',
        amount: 18.50,
        type: 'expense',
        category: 'Transportation',
        paymentMethod: 'Credit Card',
        date: new Date('2024-01-16'),
        description: 'Ride to downtown',
      },
      {
        userId: demoUser._id,
        title: 'Book Purchase',
        amount: 24.99,
        type: 'expense',
        category: 'Education',
        paymentMethod: 'Credit Card',
        date: new Date('2024-01-18'),
        description: 'Programming book from bookstore',
      },
      {
        userId: demoUser._id,
        title: 'Movie Tickets',
        amount: 32.00,
        type: 'expense',
        category: 'Entertainment',
        paymentMethod: 'Credit Card',
        date: new Date('2024-01-19'),
        description: 'Movie tickets for two',
      },
      {
        userId: demoUser._id,
        title: 'Phone Bill',
        amount: 65.00,
        type: 'expense',
        category: 'Bills & Utilities',
        paymentMethod: 'Bank Transfer',
        date: new Date('2024-01-21'),
        description: 'Monthly phone bill',
      },
    ];

    await Transaction.insertMany(transactions);
    console.log('Created sample transactions');

    // Sample budgets
    const budgets = [
      {
        userId: demoUser._id,
        category: 'Food & Dining',
        amount: 500.00,
        period: 'monthly',
        startDate: new Date('2024-01-01'),
      },
      {
        userId: demoUser._id,
        category: 'Transportation',
        amount: 200.00,
        period: 'monthly',
        startDate: new Date('2024-01-01'),
      },
      {
        userId: demoUser._id,
        category: 'Entertainment',
        amount: 150.00,
        period: 'monthly',
        startDate: new Date('2024-01-01'),
      },
      {
        userId: demoUser._id,
        category: 'Shopping',
        amount: 300.00,
        period: 'monthly',
        startDate: new Date('2024-01-01'),
      },
      {
        userId: demoUser._id,
        category: 'Bills & Utilities',
        amount: 400.00,
        period: 'monthly',
        startDate: new Date('2024-01-01'),
      },
      {
        userId: demoUser._id,
        category: 'Healthcare',
        amount: 100.00,
        period: 'monthly',
        startDate: new Date('2024-01-01'),
      },
    ];

    await Budget.insertMany(budgets);
    console.log('Created sample budgets');

    console.log('\n✅ Seed data created successfully!');
    console.log('\n📧 Demo User Credentials:');
    console.log('Email: demo@example.com');
    console.log('Password: demo123456');
    console.log('\n📊 Sample Data:');
    console.log(`- ${transactions.length} transactions`);
    console.log(`- ${budgets.length} budgets`);
    console.log('- Various categories and payment methods');

  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the seed function
if (require.main === module) {
  seedData();
}

module.exports = { seedData };