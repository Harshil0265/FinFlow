# SMS Transaction Import Guide

## 🚀 Overview

The SMS Import feature allows you to automatically extract and import transaction data from your bank SMS messages. This powerful feature uses AI-powered parsing to convert your transaction SMS messages into organized expense and income records.

## ✨ Features

### Smart Transaction Parsing
- **Multi-Bank Support**: Works with HDFC, SBI, ICICI, and most major Indian banks
- **Intelligent Amount Detection**: Automatically extracts transaction amounts
- **Merchant Recognition**: Identifies merchant names and locations
- **Auto-Categorization**: Smart category assignment based on merchant and transaction type
- **Confidence Scoring**: Each parsed transaction gets a confidence score (0-100%)

### Security & Privacy
- **Local Processing**: SMS data is processed securely and never stored permanently
- **Encrypted Transmission**: All data transmission is encrypted
- **No SMS Storage**: Only extracted transaction data is saved, not the original SMS
- **User Control**: You approve each transaction before it's added

### Batch Processing
- **Multiple Messages**: Import multiple SMS messages at once
- **Duplicate Detection**: Automatically skips duplicate transactions
- **Bulk Approval**: Option to auto-approve high-confidence transactions

## 📱 How to Use

### Step 1: Access SMS Import
1. Navigate to **SMS Import** from the main menu
2. Or use the SMS Import widget on your dashboard

### Step 2: Prepare Your SMS Messages
1. Open your SMS app on your phone
2. Find transaction messages from your bank
3. Copy the SMS messages you want to import

### Step 3: Import Process
1. Paste your SMS messages in the text area
2. Separate multiple messages with blank lines
3. Adjust settings:
   - **Auto-approve**: Automatically add high-confidence transactions
   - **Minimum Confidence**: Set the confidence threshold (50-100%)
4. Click "Import Transactions"

### Step 4: Review & Approve
1. Review the parsed transactions
2. Check the confidence scores
3. Approve individual transactions or use bulk approval
4. Transactions are added to your expense tracker

## 🏦 Supported Banks

### Fully Supported
- **HDFC Bank** - Complete SMS pattern recognition
- **State Bank of India (SBI)** - Full transaction parsing
- **ICICI Bank** - Comprehensive support
- **Generic Bank Format** - Works with most Indian banks

### SMS Format Examples

#### HDFC Bank
```
HDFC Bank: Rs.500.00 debited from A/C **1234 on 15-Dec-23 at SWIGGY BANGALORE. Avl Bal: Rs.10,000.00
```

#### SBI
```
SBI: Rs.1,200.00 credited to A/C **5678 on 14-Dec-23 salary from COMPANY NAME. Avl Bal: Rs.15,000.00
```

#### ICICI Bank
```
ICICI Bank: Rs.250.00 spent on Debit Card **9876 at AMAZON on 13-Dec-23. Avl Bal: Rs.8,500.00
```

## 🎯 Smart Categorization

The system automatically categorizes transactions based on merchant names:

### Food & Dining
- Swiggy, Zomato, Dominos, McDonald's, KFC
- Restaurants, Cafes, Food courts

### Transportation
- Uber, Ola, Rapido, Metro
- Petrol pumps, Parking

### Shopping
- Amazon, Flipkart, Myntra, Ajio
- Malls, Stores, Markets

### Utilities
- Electricity, Water, Gas bills
- Internet, Mobile recharges

### Healthcare
- Hospitals, Pharmacies, Medical stores

### Entertainment
- Movies, Netflix, Spotify, Games

## ⚙️ Configuration Options

### Auto-Approval Settings
- **Enabled**: High-confidence transactions (80%+) are automatically added
- **Disabled**: All transactions require manual approval

### Confidence Threshold
- **50%**: Include all possible transactions (may have false positives)
- **70%**: Balanced approach (recommended)
- **90%**: Only very confident matches (may miss some transactions)

## 📊 Confidence Scoring

### High Confidence (80-100%)
- ✅ Clear bank name identification
- ✅ Exact amount extraction
- ✅ Merchant name detected
- ✅ Transaction type clearly indicated

### Medium Confidence (60-79%)
- ⚠️ Most elements detected correctly
- ⚠️ Minor ambiguities in parsing
- ⚠️ Requires manual review

### Low Confidence (50-59%)
- ❌ Significant parsing uncertainties
- ❌ Manual verification required
- ❌ May need manual correction

## 🔒 Privacy & Security

### Data Protection
- **No Permanent Storage**: Original SMS messages are not stored
- **Encrypted Processing**: All data is encrypted during processing
- **Local Parsing**: Transaction extraction happens securely
- **User Control**: You control what gets imported

### What We Store
- ✅ Transaction amount, date, and category
- ✅ Merchant name (if detected)
- ✅ Transaction type (income/expense)
- ✅ Confidence score for reference
- ❌ Original SMS content (deleted after processing)
- ❌ Personal banking details
- ❌ Account numbers or sensitive data

## 🚨 Troubleshooting

### Common Issues

#### "No transactions found"
- **Cause**: SMS format not recognized
- **Solution**: Check if your bank is supported, try adjusting confidence threshold

#### "Low confidence scores"
- **Cause**: Unusual SMS format or incomplete information
- **Solution**: Review transactions manually, adjust settings

#### "Duplicate transactions"
- **Cause**: Same transaction imported multiple times
- **Solution**: System automatically detects and skips duplicates

### Best Practices

1. **Clean SMS Messages**: Remove extra formatting or forwarded message headers
2. **Separate Messages**: Use blank lines between different SMS messages
3. **Recent Messages**: Import recent messages for better accuracy
4. **Review Results**: Always review parsed transactions before approval
5. **Regular Imports**: Import SMS messages regularly to avoid large batches

## 📈 Analytics & Insights

### Import Statistics
- **Total Imported**: Number of transactions imported via SMS
- **This Month**: Current month's SMS imports
- **Success Rate**: Percentage of successfully parsed messages
- **Category Breakdown**: Distribution of auto-categorized transactions

### Dashboard Integration
- SMS import widget shows recent activity
- Quick access to import more messages
- Statistics and trends visualization

## 🔄 Integration with Other Features

### Recurring Transactions
- SMS imports can identify recurring patterns
- Suggest setting up recurring transaction rules
- Automatic categorization for known recurring payments

### Budget Tracking
- Imported transactions automatically count toward budget limits
- Category-wise budget impact analysis
- Real-time budget alerts for SMS imports

### Analytics
- SMS imported transactions included in all analytics
- Spending pattern analysis
- Monthly/yearly trend reports

## 🆘 Support & Feedback

### Getting Help
1. Check this guide for common solutions
2. Review the FAQ section
3. Contact support for technical issues

### Feature Requests
- Request support for additional banks
- Suggest improvements to parsing accuracy
- Report any issues with specific SMS formats

## 🔮 Future Enhancements

### Planned Features
- **Real-time SMS Integration**: Direct SMS access (with permissions)
- **More Bank Support**: Additional regional and international banks
- **Enhanced AI**: Improved parsing accuracy and merchant recognition
- **Bulk Operations**: Advanced bulk editing and approval tools
- **Custom Rules**: User-defined parsing rules for specific formats

---

**Note**: This feature requires manual SMS copying and pasting. We do not access your SMS messages directly without explicit permission. All processing is done securely and privately.