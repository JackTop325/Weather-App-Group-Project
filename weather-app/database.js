const sqlite3 = require('sqlite3').verbose();
const data = require('./location.js');

// create database and table
const db = new sqlite3.Database('weather.db');
db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS locations (id INTEGER PRIMARY KEY, latitude REAL, longitude REAL)");
});

// insert data into table
const stmt = db.prepare("INSERT INTO locations (latitude, longitude) VALUES (?, ?)");
data.forEach((loc) => {
  stmt.run(loc.latitude, loc.longitude);
});

// close database connection
stmt.finalize();
db.close();