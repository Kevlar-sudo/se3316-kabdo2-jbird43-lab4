//this js script will be used for creating the database of users
//run this script after running db.js first
const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();
const filepath = "./music.db";





//the function we use to connect to the database
function connectToDatabase() {
  if (fs.existsSync(filepath)) {
    console.log("connected to existing database");
    const db =  new sqlite3.Database(filepath, (error) =>{
    deleteTableUser(db);
    createTableUser(db);
    });
    return new sqlite3.Database(filepath);
    
  } else {
    
    console.log("This database doesn't exist");
  }
}

//this database will store the user info, username and email will be stored as plaintext
//while password will be hashed using npm bcript in the back-end
//administrator status will be either 0 (standard user) or 1 (admin), default to standard user
//the same thing for deactivated, 0 meaning account is active while 1 has been deactivated
//for creating the user database
function createTableUser(db){
    db.exec(`
    CREATE TABLE IF NOT EXISTS users
    (
    username                 VARCHAR(20),
    email                    VARCHAR(20),
    password                 VARCHAR(20),
    administrator            CHAR(1) DEFAULT 0,
    deactivated              CHAR(1) DEFAULT 0
    )
    `
    );
  }

  function deleteTableUser(db){
    db.exec(`
    DROP TABLE IF EXISTS users
    `
    );
  }

  
  
//we connect to the database after creating it
module.exports = connectToDatabase();


