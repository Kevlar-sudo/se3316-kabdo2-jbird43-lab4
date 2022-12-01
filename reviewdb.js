//this js script will be used for creating the database of reviews
//run this script after running db.js first
const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();
const filepath = "./music.db";


//the function we use to connect to the database
function connectToDatabase() {
    if (fs.existsSync(filepath)) {
        console.log("connected to existing database");
        const db = new sqlite3.Database(filepath, (error) => {

            deleteTableReview(db);
            createTableReview(db);
        });
        return new sqlite3.Database(filepath);

    } else {

        console.log("This database doesn't exist");
    }
}
//this database will store the review info
function createTableReview(db) {
    db.exec(`
    CREATE TABLE IF NOT EXISTS reviews
    (
    username                 VARCHAR(20),
    playlistName             VARCHAR(20),
    playlistUsername         VARCHAR(20),
    reviewDate               VARCHAR(20),
    rating                   INT,
    comments                 VARCHAR(500),
    hidden                   CHAR(1) DEFAULT 0
    )
    `
    );
}

function deleteTableReview(db) {
    db.exec(`
    DROP TABLE IF EXISTS reviews
    `
    );
}


//we connect to the database after creating it
module.exports = connectToDatabase();