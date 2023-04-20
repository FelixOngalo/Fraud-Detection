// Node.js code to handle the form submission and store the collected data
const express = require('express');
const mongoose = require('mongoose');
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

// Handle the form submission
app.post('/transactions', async (req, res) => {
  const transactionData = req.body;
  const transaction = new Transaction(transactionData);
  await transaction.save();
  res.send('Transaction saved successfully!');
});

// Start the server
app.listen(3000, () => console.log('Server started!'));
