const express = require('express');
const sqlite3 = require('sqlite3');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to the database
const db = new sqlite3.Database(path.join(__dirname, 'database.db'), err => {
  if (err) {
    console.error(err);
  } else {
    console.log('Connected to the database');
  }
});

// Create a table to store recent searches with the city name and timestamp
db.run(
  `CREATE TABLE IF NOT EXISTS user_searches (
    user_id INTEGER,
    city TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,
  err => {
    if (err) {
      console.error(err);
    } else {
      console.log('Created the user_searches table');
    }
  }
);

module.exports = db;