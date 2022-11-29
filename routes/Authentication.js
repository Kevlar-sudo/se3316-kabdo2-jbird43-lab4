const router = require('express').Router();
const verify = require('./VerifyToken');
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
let db = new sqlite3.Database('./music.db');

//For functions that need authentication to use
router.get('/', verify, (req, res) => {

    res.json({ posts: { title: 'posts', description: 'DATA YOU NEED TO AUTH TO USE' } });

})


//Add a playlist to the playlist db
router.put('/playlist', verify, (req, res) => {

    const user = req.header('Cookie');
    //Get the user from cookies
    let [key, value] = user.split(';');
    let [key2, value2] = value.split('=');

    const username = value2;
    const playlistName = req.body.playlistName;
    const numberOfTracks = 0;
    const playTime = 0;
    let exist = false;
    let playlistExists = false;



    //Checking if email exists
    db.all(`SELECT username FROM users`, [], async (err, rows) => {
        if (err) {
            throw err;
        }
        for (let i = 0; i < rows.length; i++) {
            if (rows[i].username == username) {
                console.log("username exists");
                exist = true;

            }

        }
        //If user name does not exist return
        if (exist == false) {
            console.log("username does not exist");
            return res.json({ status: 400, send: "Username does not exist" });
        } else { //If username does exist
            db.all(`SELECT username, playlistName FROM playlists`, [], async (err, rows) => { //Check is the playlist assiociated with the user already exists
                if (err) {
                    throw err;
                }
                for (let i = 0; i < rows.length; i++) {
                    if (rows[i].username == username && rows[i].playlistName == playlistName) {
                        console.log("PlaylistName Already exists");
                        playlistExists = true;
                    }

                }

                //If playlist does not exist yet add it to the db
                if (playlistExists == false) {
                    try {
                        // insert one row into the langs table
                        db.run(`INSERT INTO playlists(username, playlistName, numberOfTracks, playTime) VALUES(?,?,?,?)`, [username, playlistName, numberOfTracks, playTime], function (err) {
                            if (err) {
                                return res.json({ status: 300, success: false, error: err })
                            }
                            // get the last insert id
                            console.log(`A row has been inserted with rowid ${this.lastID}`);
                            return res.json({ status: 200, success: true })
                        });
                    } catch (err) {
                        return res.json({ status: 400, send: err });
                    }
                } else { //Else return
                    console.log("Playlist name exists");
                    return res.json({ status: 400, send: "playlist name already exists" });
                }
            });
        }
    });

});

  //Created a create review put request, we prob need to move it to the authentication.js file and 



  router.put("/reviews", verify,(req, res) => {

    const user = req.header('Cookie');
    //Get the user from cookies
    let [key, value] = user.split(';');
    let [key2, value2] = value.split('=');
    
    //we specify the playlist_name (playlist to be added to) and track_id (track to be added) in JSON body
    try {
    
      const { username, playlistName, reviewDate, rating, comments } = req.body;

      sql = `INSERT INTO reviews ( username, playlistName, reviewDate, rating, comments) VALUES (?,?,?,?,?)`;
      db.run(sql, [username,playlistName,reviewDate,rating,comments], (err) => {
        if (err) return res.json({ status: 300, success: false, error: err });

        console.log(
          "successful input of review"
        );
        
      });
      return res.json({
        status: 200,
        success: true,
        
      });
    } catch (error) {
      return res.json({
        status: 400,
        success: false,
      });
    }
  })




















module.exports = router;