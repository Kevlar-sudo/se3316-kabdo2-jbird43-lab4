const router = require('express').Router();
const verify = require('./VerifyToken');
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
let db = new sqlite3.Database('./music.db');

//Get all playlists created by a user
router.get('/playlist', verify, (req, res) => {

    console.log(req.user._id);
    let username = req.user._id;
    let playlistNames = [];
    let found = false;
    let k = 0;

    db.all(`SELECT username, playlistName FROM playlists`, [], async (err, rows) => {
        if (err) {
            throw err;
        }
        for (let i = 0; i < rows.length; i++) {
            if (rows[i].username == username) {
                console.log(rows[i].playlistName);
                playlistNames[k] = (rows[i].playlistName);
                found = true;
                k++;
            }
        }
        if (!found) {
            return res.json({ staus: 400, error: err });
        } else {
            console.log(playlistNames);
            res.json({ status: 200, message: "found all playlists", array: playlistNames });
        }
    });


})


//Add a playlist to the playlist db
router.put('/playlist', verify, (req, res) => {

    //Get the loged in username
    const user = req.user._id;

    const username = user;
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
            res.json({ status: 400, send: "Username does not exist" });
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
                            } else {


                                // get the last insert id
                                console.log(`A row has been inserted with rowid ${this.lastID}`);
                                res.json({ status: 200, success: true })
                            }
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


router.delete('/playlist', verify, (req, res) => {

    const username = req.user._id;
    const playlistName = req.body.playlistName;




});

//Created a create review put request, we prob need to move it to the authentication.js file and 


router.put('/playlist/track', verify, (req, res) => {

    const username = req.user._id;
    const trackID = req.body.trackID;
    const playlistName = req.body.playlistName;
    let index = 0;
    let exist = false;


    // console.log(trackID);
    db.all(`SELECT track_id, track_title FROM tracks`, [], async (err, rows) => {
        if (err) {
            throw err;
        }
        for (let i = 0; i < rows.length; i++) {
            if (rows[i].track_id.toString() == trackID) {
                console.log("Track Exists");
                index = i;
                exist = true;
            }
        }

        if (exist) {
            db.run(`INSERT INTO playlistTracks(username, playlistName, trackID, trackName) VALUES(?,?,?,?)`, [username, playlistName, rows[index].track_id, rows[index].track_title], function (err) {
                if (err) {
                    return res.json({ status: 300, success: false, error: err })
                }
                // get the last insert id
                console.log(`A row has been inserted with rowid ${this.lastID}`);
                res.json({ status: 200, success: true })
            });
        } else {
            console.log("Track with that id does not exist");
            return res.json({ status: 400, send: "Track does not exist" })
        }
    });


});

router.post('/playlist/track', verify, (req, res) => {

    let username = req.user._id;
    let playlist = req.body.playlistName
    let trackID = [];
    let trackName = [];
    let exist = false;
    let k = 0;



    db.all(`SELECT * FROM playlistTracks`, [], async (err, rows) => {

        for (let i = 0; i < rows.length; i++) {
            if (rows[i].username == username && rows[i].playlistName == playlist) {
                trackID[k] = rows[i].trackID;
                trackName[k] = rows[i].trackName;
                k++;
                exist = true;
            }
        }

        if (exist) {
            res.json({ status: 200, array: trackID, array2: trackName });
        } else {
            return res.json({ status: 400, send: "Playlist or username not found" });
        }

    });


});

router.delete('/playlist/track', verify, (req, res) => {

    let username = req.user._id;
    console.log(username);
    let playlistName = req.body.playlistName;
    console.log(`Playlist Name: ${playlistName}`);
    let trackID = req.body.trackID;
    let index = 0;
    let exist = false;

    db.all(`SELECT username, playlistName, trackID FROM playlistTracks`, [], async (err, rows) => {
        for (let i = 0; i < rows.length; i++) {
            if (rows[i].username == username && rows[i].playlistName == playlistName && rows[i].trackID == trackID) {
                exist = true;
                index=i;
            }
        }
    if (exist) {
        db.run(`DELETE FROM playlistTracks WHERE username=? AND trackID=? AND playlistName=?`, username, trackID, playlistName, (err) => {
            if (err) return res.json({ status: 300, success: false, error: err });


            res.json({ status: 200, success: true });
            console.log("successful delete");
        });
    }else{
        return  res.json({ status: 400, message: "TRACK WITH THAT PLAYIST DOES NOT EXIST"});
    }
});




});


router.put("/reviews", verify, (req, res) => {

    const user = req.header('Cookie');


    //we specify the playlist_name (playlist to be added to) and track_id (track to be added) in JSON body
    try {

        const { username, playlistName, reviewDate, rating, comments } = req.body;

        sql = `INSERT INTO reviews ( username, playlistName, reviewDate, rating, comments) VALUES (?,?,?,?,?)`;
        db.run(sql, [username, playlistName, reviewDate, rating, comments], (err) => {
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

router.get('/loggedin', verify, (req, res) => {

    //Get the loged in username
    const user = req.user._id;
    sql = `SELECT * FROM 'users' WHERE username = '${user}'`;

    try {
        db.all(sql, [], (err, rows) => {
            if (err) return res.json({ status: 300, success: false, error: err });

            if (rows.length < 1)
                return res.json({ status: 300, success: false, error: "No match" });

            return res.json({ status: 200, data: rows, success: true });
        });
    } catch (error) {
        return res.json({
            status: 400,
            success: false,
        });
    }
});

//for granting admin priviledges

router.post('/grant', verify, async (req, res) => {

    let exists = false;
    let index = 0;

    const {
        username
    } = req.body;



    //Checking if email exists
    db.all(`SELECT username FROM users`, [], async (err, rows) => {
        if (err) {
            throw err;
        }
        for (let i = 0; i < rows.length; i++) {
            if (rows[i].username == username) {
                console.log("Username exists");
                exists = true;
                index = i;
            }

        }

        const userDetails = {
            username: rows[index].username,
            email: rows[index].email,
            password: rows[index].password,
            administrator: rows[index].administrator,
            deactivated: rows[index].deactivated

        };

        if (exists == false) {
            console.log("user does not exist");
            return res.json({ status: 400, send: "Username does not exist" });
        } else {
            try {
                // set the deactivated column for the account to 0
                db.run(`UPDATE users SET administrator = 1 WHERE username = '${rows[index].username}'`, [], function (err) {
                    if (err) {
                        return res.json({ status: 300, success: false, error: err })
                    }
                    // console log for confirmation
                    console.log(`We have updated administrator status`);
                    return res.json({ status: 200, success: true })
                });
            } catch (err) {
                return res.json({ status: 400, send: err });
            }

        }
    });


});



//for deactivating user accounts by admin

router.post('/deactivate', verify, async (req, res) => {

    let exists = false;
    let index = 0;

    const {
        username
    } = req.body;



    //Checking if user exists
    db.all(`SELECT username FROM users`, [], async (err, rows) => {
        if (err) {
            throw err;
        }
        for (let i = 0; i < rows.length; i++) {
            if (rows[i].username == username) {
                console.log("Username exists");
                exists = true;
                index = i;
            }

        }

        const userDetails = {
            username: rows[index].username,
            email: rows[index].email,
            password: rows[index].password,
            administrator: rows[index].administrator,
            deactivated: rows[index].deactivated

        };

        if (exists == false) {
            console.log("user does not exist");
            return res.json({ status: 400, send: "Username does not exist" });
        } else {
            try {
                // set the deactivated column for the account to 2, meaning that the account has been deactivated by an admin
                db.run(`UPDATE users SET deactivated = 2 WHERE username = '${rows[index].username}'`, [], function (err) {
                    if (err) {
                        return res.json({ status: 300, success: false, error: err })
                    }
                    // console log for confirmation
                    console.log(`We have updated activation status`);
                    return res.json({ status: 200, success: true })
                });
            } catch (err) {
                return res.json({ status: 400, send: err });
            }

        }
    });


});

//for deactivating user accounts by admin

router.post('/activate', verify, async (req, res) => {

    let exists = false;
    let index = 0;

    const {
        username
    } = req.body;



    //Checking if user exists
    db.all(`SELECT username FROM users`, [], async (err, rows) => {
        if (err) {
            throw err;
        }
        for (let i = 0; i < rows.length; i++) {
            if (rows[i].username == username) {
                console.log("Username exists");
                exists = true;
                index = i;
            }

        }

        const userDetails = {
            username: rows[index].username,
            email: rows[index].email,
            password: rows[index].password,
            administrator: rows[index].administrator,
            deactivated: rows[index].deactivated

        };

        if (exists == false) {
            console.log("user does not exist");
            return res.json({ status: 400, send: "Username does not exist" });
        } else {
            try {
                // set the deactivated column for the account to 0
                db.run(`UPDATE users SET deactivated = 0 WHERE username = '${rows[index].username}'`, [], function (err) {
                    if (err) {
                        return res.json({ status: 300, success: false, error: err })
                    }
                    // console log for confirmation
                    console.log(`We have updated activation status`);
                    return res.json({ status: 200, success: true })
                });
            } catch (err) {
                return res.json({ status: 400, send: err });
            }

        }
    });


});

module.exports = router;