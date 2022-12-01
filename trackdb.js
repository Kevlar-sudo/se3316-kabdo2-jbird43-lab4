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

            deleteTableTracks(db);
            createTableTracks(db);
        });
        return new sqlite3.Database(filepath);

    } else {

        console.log("This database doesn't exist");
    }
}
//this database will store the review info
function createTableTracks(db) {
    db.exec(`
    CREATE TABLE IF NOT EXISTS playlistTracks
    (
    username                 VARCHAR(20),
    playlistName             VARCHAR(20),
    trackID                  VARCHAR(20),
    trackName                VARCHAR(500),
    playTime                 VARCHAR(50)
    )
    `
    );
}

function deleteTableTracks(db) {
    db.exec(`
    DROP TABLE IF EXISTS playlistTracks
    `
    );
}


//we connect to the database after creating it
module.exports = connectToDatabase();