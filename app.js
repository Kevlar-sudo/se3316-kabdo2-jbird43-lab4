const express = require("express");
const fs = require('fs');
const res = require("express/lib/response");
const app = express();
const sqlite = require("sqlite3").verbose();
const url = require("url");
const router = express.Router();
const authRoute = require('./routes/auth');
const authenticationNeededRoute = require('./routes/Authentication');
let sql;

app.use(express.json());
//for password encryption
const bcrypt = require("bcrypt");
const { brotliDecompress } = require("zlib");
//how many rounds of salt
const saltRounds = 10;

//to store playlist variable noOfTracks and duration
let myArr = {};
let playlists = [];

//establishing a connection to the database CHANGE to ./music.db after tests
const db = new sqlite.Database("./music.db", sqlite.OPEN_READWRITE, (err) => {
  if (err) return console.error(err);
});

//setup seving front-end code
app.use("/", express.static("static"));

//setup middleware to do logging
app.use((req, res, next) => {
  //for all routes
  console.log(`${req.method} request for ${req.url}`);
  next(); //keep going
});

router.use(express.json());

//Routes for /api/tracks
router
  .route("/tracks/") //all the routes to the tracks

  //post req we can use this later for adding songs to the playlist (it worked for album before)
  .post((req, res) => {
    try {
      const {
        album_comments,
        album_date_created,
        album_date_released,
        album_engineer,
      } = req.body;
      sql =
        "INSERT INTO albums(album_comments,album_date_created,album_date_released,album_engineer) VALUES (?,?,?,?)";
      db.run(
        sql,
        [
          album_comments,
          album_date_created,
          album_date_released,
          album_engineer,
        ],
        (err) => {
          if (err) return res.json({ status: 300, success: false, error: err });

          console.log(
            "successful input",
            album_comments,
            album_date_created,
            album_date_released,
            album_engineer
          );
        }
      );
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

  //get request we want to limit it to only the first 30 tracks not to overload insomnia
  .get((req, res) => {
    sql = "SELECT * FROM tracks LIMIT 0,30";
    try {
      //we parse the URL to get the query params
      const queryObject = url.parse(req.url, true).query; // query paramaters grabbing
      //if query params exist
      if (queryObject.name) {
        console.log("Searching based on query param: " + queryObject.name);
        //we search our SQLite database based on those query params, we want a match for album_title or track_title
        // n = 10, return first 10 results only
        sql = `SELECT * FROM 'tracks' WHERE album_title LIKE '%${queryObject.name}%' OR track_title LIKE '%${queryObject.name}%' LIMIT 0,10`;
      }
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

router
  .route("/tracks/:track_id") //all routes with specified track_id

  //Get details of a specific track
  .get((req, res) => {
    sql = `SELECT * FROM tracks WHERE track_id = ${parseInt(
      req.params.track_id
    )}`;
    console.log(`We are looking for track ${parseInt(req.params.track_id)}`);
    try {
      db.all(sql, [], (err, rows) => {
        if (err) return res.json({ status: 300, success: false, error: err });

        if (rows.length < 1)
          return res.json({ status: 300, success: false, error: "No match" });

        return res.json({ status: 200, data: rows, success: true }); //if match is found
      });
    } catch (error) {
      //if some client side error occurs
      return res.json({
        status: 400,
        success: false,
      });
    }
  });

//Getting artist info with a given artist_id
router
  .route("/artists/:artist_id") //all routes with specified artist_id

  //Get details of a specific artist
  .get((req, res) => {
    sql = `SELECT * FROM artists WHERE artist_id = ${parseInt(
      req.params.artist_id
    )}`;
    console.log(`We are looking for artist ${parseInt(req.params.artist_id)}`);
    try {
      db.all(sql, [], (err, rows) => {
        if (err) return res.json({ status: 300, success: false, error: err });

        if (rows.length < 1)
          return res.json({ status: 300, success: false, error: "No match" });

        return res.json({ status: 200, data: rows, success: true }); //if match is found
      });
    } catch (error) {
      //if some client side error occurs
      return res.json({
        status: 400,
        success: false,
      });
    }
  });

//get artist info without specifiying an id
router
  .route("/artists")
  //get request we want to limit it to only the first 30 tracks not to overload/crash pc
  .get((req, res) => {
    sql = `SELECT * FROM artists LIMIT 0,30`;
    //if the user has included a query parameter for the artist name
    try {
      //we parse the URL to get the query params
      const queryObject = url.parse(req.url, true).query; // query paramaters grabbing
      //if query params exist
      if (queryObject.name) {
        console.log(queryObject.name);
        //we search our SQLite database based on those query params
        sql = `SELECT * FROM 'artists' WHERE artist_handle LIKE '%${queryObject.name}%'`;
      }
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

//get genre info without specifying an id
router
  .route("/genres")
  //get request for al lthe genre info
  .get((req, res) => {
    sql = `SELECT * FROM genres`;
    //if the user has included a query parameter for the artist name
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

//all routes that lead to playlist
router
  .route("/playlist")

  //working to get all the playlists (genres, tracks and artists are protected tables in the db not to be accessed by the user)
  .get((req, res) => {
    sql = `SELECT name FROM sqlite_schema WHERE 
    type = 'table' AND name NOT LIKE 'genres'
    AND type = 'table' AND name NOT LIKE 'tracks'
    AND type = 'table' AND name NOT LIKE 'artists'
    AND type = 'table' AND name NOT LIKE 'users'`;
    //if the user has included a query parameter for the artist name
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
  })

  .post((req, res) => {
    //we specify the playlist_name (playlist to be added to) and track_id (track to be added) in JSON body
    try {
      const { playlist_name, track_id } = req.body;

      //first we check if the playlist we are inserting into exists
      if (playlists.includes(playlist_name) == false) {
        return res.json({
          status: 300,
          success: false,
          error: "This playlist doesn't exist",
        });
      }

      sql = `INSERT INTO ${playlist_name} ( track_id) VALUES (?)`;
      db.run(sql, [track_id], (err) => {
        if (err) return res.json({ status: 300, success: false, error: err });

        console.log(
          "successful input track: " + track_id + ` into list ${playlist_name}`
        );
        myArr[playlist_name] = ++myArr[playlist_name];
      });
      return res.json({
        status: 200,
        success: true,
        noOfTracks: myArr[playlist_name],
      });
    } catch (error) {
      return res.json({
        status: 400,
        success: false,
      });
    }
  })

  //this is used to delete a playlist, the playlist name is specified in JSON body
  .delete((req, res) => {
    const { playlist_name } = req.body;
    console.log("we want to delete playlist: " + playlist_name);
    //add the playlist to our data structure

    //don't let the user delete any of these 3 playlists since they are protected (INPUT SANITIZATION)
    if (
      playlist_name == "genres" ||
      playlist_name == "artists" ||
      playlist_name == "tracks" ||
      playlist_name == "users" ||
      playlist_name == "reviews"
    ) {
      console.log("500 This database is protected and can't be deleted");
      return res.json({
        status: 500,
        success: false,
      });
    }
    // //if the playlsit doesn't exist we return an error
    // if (playlists.includes(playlist_name) == false) {
    //   return res.json({
    //     status: 300,
    //     success: false,
    //     error: "This playlist doesn't exist",
    //   });
    // }

    try {
      const { playlist_name } = req.body;
      sql = `DROP TABLE IF EXISTS ${playlist_name}`;

      db.run(sql, (err) => {
        if (err) return res.json({ status: 300, success: false, error: err });

        playlists.pop(playlist_name);
        console.log("successful delete");
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
  });

//get genre info with specifying a playlist name
router
  .route("/playlist/:name")
  //get request for all the genre info

  .get((req, res) => {
    sql = `SELECT * FROM ${req.params.name}`;
    console.log(`We are looking for playlist ${req.params.name}`);

    try {
      db.all(sql, [], (err, rows) => {
        if (err) return res.json({ status: 300, success: false, error: err });

        if (rows.length < 1)
          return res.json({ status: 300, success: false, error: "No match" });

        return res.json({
          status: 200,
          data: rows,
          success: true,
          noOfTracks: myArr[req.params.name],
        });
      });
    } catch (error) {
      return res.json({
        status: 400,
        success: false,
      });
    }
  });

//routes to a specific playlist
router
  .route("/playlist/:name")

  //we want to delete a specific track from a specific playlist
  //the playlist name will be part of the url and the track we want to delete is part of the JSON parameters
  .delete((req, res) => {
    const { track_id } = req.body;
    console.log(
      "we want to delete track: " +
      track_id +
      "from playlist: " +
      req.params.name
    );
    //add the playlist to our data structure

    if (
      req.params.name == "genres" ||
      req.params.name == "artists" ||
      req.params.name == "tracks" ||
      req.params.name == "users"
    ) {
      console.log("500 This database is protected and can't be deleted");
      return res.json({
        status: 500,
        success: false,
      });
    }
    try {
      const { track_id } = req.body;
      sql = `DELETE FROM ${req.params.name} where track_id = ${track_id}`;
      db.run(sql, (err) => {
        if (err) return res.json({ status: 300, success: false, error: err });

        console.log("successful delete");
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
  });

//for the text files

//for dmca
router
  .route("/text/dmca") //all the routes to the dmca

  //this is the get request that simply gets the text file contents
  .get((req, res) => {
    try {

      let fileString = fs.readFileSync("static\\dmca.txt").toString();

      return res.json({
        status: 200,
        success: true,
        text: fileString
      });
    } catch (error) {
      return res.json({
        status: 400,
        success: false,
      });
    }
  })
  .put((req, res) => {
    try {
      const {
        new_text
      } = req.body;

      //we update the text file with our new content; new_text
      fs.writeFile('static\\dmca.txt', new_text, 'utf8', function (err) {
        if (err) return console.log(err);
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
  });

//for acceptable user policy
router
  .route("/text/aup") //all the routes to the dmca

  //this is the get request that simply gets the text file contents
  .get((req, res) => {
    try {

      let fileString = fs.readFileSync("static\\aup.txt").toString();

      return res.json({
        status: 200,
        success: true,
        text: fileString
      });
    } catch (error) {
      return res.json({
        status: 400,
        success: false,
      });
    }
  })
  .put((req, res) => {
    try {
      const {
        new_text
      } = req.body;

      //we update the text file with our new content; new_text
      fs.writeFile('static\\aup.txt', new_text, 'utf8', function (err) {
        if (err) return console.log(err);
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
  });



//for sec and privacy
router
  .route("/text/sp") //all the routes to the dmca

  //this is the get request that simply gets the text file contents
  .get((req, res) => {
    try {

      let fileString = fs.readFileSync("static\\sp.txt").toString();

      return res.json({
        status: 200,
        success: true,
        text: fileString
      });
    } catch (error) {
      return res.json({
        status: 400,
        success: false,
      });
    }
  })
  .put((req, res) => {
    try {
      const {
        new_text
      } = req.body;

      //we update the text file with our new content; new_text
      fs.writeFile('static\\sp.txt', new_text, 'utf8', function (err) {
        if (err) return console.log(err);
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


//Get all public playlist data
router.route("/playlists/public/list")

  .get((req, res) => {

    let username = [];
    let playlistName = [];
    let numberOfTracks = [];
    let playTime = [];
    let description = [];
    let lastModified = [];
    let found = false;
    let k = 0;

    let trackID = [];
    let trackName = [];
    let trackPlayTime = [];
    let albumName = [];
    let artistName = [];
    let l = 0;

    let userWhoMadeReview = [];
    let playlistOwner = [];
    let playlistOwner2 = [];
    let reviewPlaylist = [];
    let reviewPlaylist2 = [];
    let reviewDate = [];
    let rating = [];
    let comments = [];
    let m = 0;

    db.all(`SELECT * FROM playlists ORDER By lastModified`, [], async (err, rows) => {
      if (err) {
        throw err;
      }
      //Add all public playlist details
      for (let i = 0; i < rows.length; i++) {
        if (rows[i].public == '1') {
          username[k] = rows[i].username
          playlistName[k] = rows[i].playlistName;
          numberOfTracks[k] = rows[i].numberOfTracks;
          playTime[k] = rows[i].playTime;
          description[k] = rows[i].description;
          lastModified[k] = rows[i].lastModified
          found = true;
          k++;
        }
      }
    });

    //Select all track data for public playlists
    db.all('SELECT * FROM playlistTracks', [], async (err, rows) => {
      if (err) {
        throw err;
      }

      for (let i = 0; i < rows.length; i++) {
        for (let j = 0; j < playlistName.length; j++) {
          if (rows[i].playlistName == playlistName[j] && rows[i].username == username[j] && rows[i].hidden != '1') {
            trackID[l] = rows[i].trackID;
            trackName[l] = rows[i].trackName;
            trackPlayTime[l] = rows[i].playTime;
            albumName[l] = rows[i].albumName;
            artistName[l] = rows[i].artistName;
            l++;

          }
        }
      }

    });

    //Select all public playlist data from reviews db
    db.all('SELECT * FROM reviews', [], async (err, rows) => {

      for (let i = 0; i < rows.length; i++) {
        for (let j = 0; j < playlistName.length; j++) {
          if (rows[i].playlistName == playlistName[j] && rows[i].playlistUsername == username[j]) {
            userWhoMadeReview[m] = rows[i].username;
            playlistOwner[m] = rows[i].playlistUsername;
            playlistOwner2[m] = rows[i].playlistUsername;
            reviewPlaylist[m] = rows[i].playlistName;
            reviewPlaylist2[m] = rows[i].playlistName;
            reviewDate[m] = rows[i].reviewDate;
            rating[m] = rows[i].rating;
            comments[m] = rows[i].comments;
            m++;
          }
        }
      }

      if (!found) {
        return res.json({ staus: 400, error: "Error" });
      } else {
        res.json({ status: 200, message: "found all playlists", username: username, playName: playlistName, lastModified: lastModified, noOfTracks: numberOfTracks, playT: playTime, des: description, trackID: trackID, trackName: trackName, trackPlayTime: trackPlayTime, albumName: albumName, artistName: artistName, userMadeReview: userWhoMadeReview, playlistOwner: playlistOwner, reviewPlaylist: reviewPlaylist, reviewDate: reviewDate, rating: rating, comments: comments });
      }

    });

  })

  .post((req, res) => {

    let playlistName = req.body.playlistName;
    let playlistCreater = req.body.playlistCreater;
    let ratings = [];
    let avgRating = 0;
    let k = 0;



    db.all(`SELECT * FROM reviews`, [], (err, rows) => {

      for (let i = 0; i < rows.length; i++) {
        if (rows[i].playlistUsername == playlistCreater && rows[i].playlistName == playlistName) {

          ratings[k] = rows[i].rating;
          k++;
        }
      }

      for(let i = 0; i<ratings.length; i++){
        avgRating += ratings[i];
      }

      let decimalRating = Math.ceil((avgRating/2).toFixed());


      res.json({ratings: decimalRating });
    });



  })










//the backend for the users
//currently in testing needs more work

//For register and login
app.use('/api/user', authRoute);

//install the router at /api
app.use("/api", router);

app.use('/api/auth', authenticationNeededRoute);

app.listen(3000);
console.log("Listening on port 3000");