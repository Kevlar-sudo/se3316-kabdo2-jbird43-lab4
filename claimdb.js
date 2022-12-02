//this js script will be used for creating the database of claims
//run this script after running db.js first
const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();
const filepath = "./music.db";


//the function we use to connect to the database
function connectToDatabase() {
    if (fs.existsSync(filepath)) {
        console.log("connected to existing database");
        const db = new sqlite3.Database(filepath, (error) => {

            deleteTableClaims(db);
            createTableClaims(db);
        });
        return new sqlite3.Database(filepath);

    } else {

        console.log("This database doesn't exist");
    }
}
//this database will store the claims info
function createTableClaims(db) {
    db.exec(`
    CREATE TABLE IF NOT EXISTS claims
    (
    type                     VARCHAR(100),
    date                     VARCHAR(100),
    playlistName             VARCHAR(100),
    reviewId                 VARCHAR(100)
    )
    `
    );
}

function deleteTableClaims(db) {
    db.exec(`
    DROP TABLE IF EXISTS claims
    `
    );
}


//we connect to the database after creating it
module.exports = connectToDatabase();