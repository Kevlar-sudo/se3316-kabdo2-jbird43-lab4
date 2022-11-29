const router = require('express').Router();
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require('bcryptjs');
const { cookie } = require('express/lib/response');
const jwt = require('jsonwebtoken');
let db = new sqlite3.Database('./music.db');


router.post('/register', async (req, res) => {

    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const administrator = req.body.administrator;
    const deactivated = req.body.administrator;
    //HASH PASSWORD
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    let taken = false;

    //Checking if username and email exist
    db.all(`SELECT username, email FROM users`, [], (err, rows) => {
        if (err) {
            throw err;
        }
        for (let i = 0; i < rows.length; i++) {
            if (rows[i].username == username || rows[i].email == email) {
                console.log("Username or email already exist");
                taken = true;
            }
        }
        //If username or email already exists
        if (taken == true) {
            return res.json({ status: 400, send: "Username and email already exist" })
        } else {
            try {
                // insert one row into the langs table
                db.run(`INSERT INTO users(username, email, password, administrator, deactivated) VALUES(?,?,?,?,?)`, [username, email, hashPassword, administrator, deactivated], function (err) {
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
        }
    });

});

//Login
router.post('/login', async (req, res) => {

    let exists = false;
    let index = 0;
    const email = req.body.email;
    const password = req.body.password;


    //Checking if email exists
    db.all(`SELECT username, email, password FROM users`, [], async (err, rows) => {
        if (err) {
            throw err;
        }
        for (let i = 0; i < rows.length; i++) {
            if (rows[i].email == email) {
                console.log("Email exists");
                exists = true;
                index = i;
            }

        }

        const userDetails = {
            username: rows[index].username,
            email: rows[index].email,
            password: rows[index].password,
            administrator: rows[index].administrator

        };

        if (exists == false) {
            console.log("email does not exist");
            return res.json({ status: 400, send: "Email does not exist" });
        } else {

            //Password is correct
            const validPass = await bcrypt.compare(password, rows[index].password);
            if (!validPass) {
                console.log('Wrong password');
                return res.json({ status: 400, send: 'invalid password' });
            } else {
                //Create and assign jwt token
                const token = jwt.sign({ _id: rows[index].username }, 'shhhhhhh');
                res.cookie("auth", token);
                return res.json("Logged-in")
                console.log(token); //REMOVE THIS LINE (FOR SECURITY)
            }
        }
    });


});


module.exports = router;