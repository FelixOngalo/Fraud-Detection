// Node.js code to handle the preprocessing operations
const express = require('express');
const mongoose = require('mongoose');
const _ = require('lodash');
const app = express();

// Connect to the MongoDB database
mongoose.connect('mongodb://localhost/fraud_detection', { useNewUrlParser: true });

// Define a schema for the transaction data
const transactionSchema = new mongoose.Schema({
  amount: Number,
  transactionType: String,
  location: String,
  timeOfDay: String
});

// Define a model for the transaction data
const Transaction = mongoose.model('Transaction', transactionSchema);

// Handle the preprocessing operation
app.post('/preprocess', async (req, res) => {
  let transactions = await Transaction.find();

  // Perform the selected preprocessing operations
  if (req.body.removeDuplicates) {
    transactions = _.uniqBy(transactions, (transaction) => {
      return `${transaction.amount}-${transaction.transactionType}-${transaction.location}-${transaction.timeOfDay}`;
    });
  }

  if (req.body.removeMissingValues) {
    transactions = _.filter(transactions, (transaction) => {
      return transaction.amount && transaction.transactionType && transaction.location && transaction.timeOfDay;
    });
  }

  if (req.body.removeOutliers) {
    const amounts = _.map(transactions, 'amount');
    const std = _.std(amounts);
    const mean = _.mean(amounts);

    transactions = _.filter(transactions, (transaction) => {
      const diff = Math.abs(transaction.amount - mean);
      return diff < (2 * std);
    });
  }

  res.render('transactions', { transactions });
});

// Start the server
app.listen(3000, () => console.log('Server started!'));
