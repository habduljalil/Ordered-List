const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const db = new sqlite3.Database(
    path.join(__dirname, "../data/ordered_list.db"),
    (err) => {
        if (err) {
            console.error("Database connection failed:", err.message);
            return;
        }

        console.log("Connected to SQLite");
    }
);

db.serialize(() => {

    db.run(
        `CREATE TABLE IF NOT EXISTS lists (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`
    );

    db.run(
        `CREATE TABLE IF NOT EXISTS items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            list_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            position INTEGER NOT NULL,

            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

            FOREIGN KEY (list_id)
                REFERENCES lists(id)
                ON DELETE CASCADE,

            UNIQUE(list_id, position)
        )`
    );

});

module.exports = db;
 