const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'weather.db'));

// Create a table to store recent searches
db.run(`
  CREATE TABLE IF NOT EXISTS recent_searches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    city TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Define the database methods
const database = {
  getRecentSearches(callback) {
    // Retrieve the 5 most recent searches from the database
    db.all(`
      SELECT city
      FROM recent_searches
      ORDER BY timestamp DESC
      LIMIT 5
    `, (err, rows) => {
      if (err) {
        console.error(err);
        callback([]);
      } else {
        const recentSearches = rows.map(row => row.city);
        callback(recentSearches);
      }
    });
  },
  insertSearch(city, callback) {
    // Insert the search into the database
    db.run(`
      INSERT INTO recent_searches (city)
      VALUES ($city)
    `, { $city: city }, err => {
      if (err) {
        console.error(err);
        callback(false);
      } else {
        callback(true);
      }
    });
  }
};

module.exports = database;
