require('dotenv').config();
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');

const MONGODB_URI = process.env.MONGODB_URI;
const CSV_PATH = path.join(__dirname, '../../truestate_assignment_dataset.csv');
const BATCH_SIZE = 5000; // Insert in batches for better performance

async function importData() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB Atlas');

    // Check if data already exists
    const existingCount = await Transaction.countDocuments();
    if (existingCount > 0) {
      console.log(`Database already has ${existingCount} records.`);
      const readline = require('readline');
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      const answer = await new Promise(resolve => {
        rl.question('Do you want to clear and reimport? (yes/no): ', resolve);
      });
      rl.close();

      if (answer.toLowerCase() !== 'yes') {
        console.log('Import cancelled.');
        process.exit(0);
      }

      console.log('Clearing existing data...');
      await Transaction.deleteMany({});
    }

    console.log('Reading CSV file...');
    const transactions = [];
    let processedCount = 0;
    let insertedCount = 0;

    const parseRow = (row) => {
      // Parse tags from comma-separated string
      const tags = row['Tags'] ? row['Tags'].replace(/"/g, '').split(',').map(t => t.trim()) : [];
      
      return {
        transactionId: parseInt(row['Transaction ID']),
        date: new Date(row['Date']),
        customerId: row['Customer ID'],
        customerName: row['Customer Name'],
        phoneNumber: row['Phone Number'],
        gender: row['Gender'],
        age: parseInt(row['Age']),
        customerRegion: row['Customer Region'],
        customerType: row['Customer Type'],
        productId: row['Product ID'],
        productName: row['Product Name'],
        brand: row['Brand'],
        productCategory: row['Product Category'],
        tags: tags,
        quantity: parseInt(row['Quantity']),
        pricePerUnit: parseFloat(row['Price per Unit']),
        discountPercentage: parseFloat(row['Discount Percentage']),
        totalAmount: parseFloat(row['Total Amount']),
        finalAmount: parseFloat(row['Final Amount']),
        paymentMethod: row['Payment Method'],
        orderStatus: row['Order Status'],
        deliveryType: row['Delivery Type'],
        storeId: row['Store ID'],
        storeLocation: row['Store Location'],
        salespersonId: row['Salesperson ID'],
        employeeName: row['Employee Name']
      };
    };

    await new Promise((resolve, reject) => {
      fs.createReadStream(CSV_PATH)
        .pipe(csv())
        .on('data', async (row) => {
          try {
            const transaction = parseRow(row);
            transactions.push(transaction);
            processedCount++;

            // Insert in batches
            if (transactions.length >= BATCH_SIZE) {
              const batch = transactions.splice(0, BATCH_SIZE);
              await Transaction.insertMany(batch, { ordered: false });
              insertedCount += batch.length;
              console.log(`Processed: ${processedCount}, Inserted: ${insertedCount}`);
            }
          } catch (err) {
            console.error('Error parsing row:', err);
          }
        })
        .on('end', async () => {
          // Insert remaining transactions
          if (transactions.length > 0) {
            await Transaction.insertMany(transactions, { ordered: false });
            insertedCount += transactions.length;
          }
          resolve();
        })
        .on('error', reject);
    });

    console.log(`\nImport completed!`);
    console.log(`Total processed: ${processedCount}`);
    console.log(`Total inserted: ${insertedCount}`);

    // Create indexes for better query performance
    console.log('\nCreating indexes...');
    await Transaction.collection.createIndex({ date: 1 });
    await Transaction.collection.createIndex({ productCategory: 1 });
    await Transaction.collection.createIndex({ brand: 1 });
    await Transaction.collection.createIndex({ customerRegion: 1 });
    console.log('Indexes created successfully!');

  } catch (error) {
    console.error('Import error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed.');
    process.exit(0);
  }
}

importData();
