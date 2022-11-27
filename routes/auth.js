const router = require('express').Router();
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require('bcryptjs');
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
        if (taken == true) {
            return res.json({ status: 400, send: "Username and email already exist"})
        } else {
            try {
                // insert one row into the langs table
                db.run(`INSERT INTO users(username, email, password, administrator, deactivated) VALUES(?,?,?,?,?)`, [username, email, hashPassword, administrator,deactivated], function (err) {
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


module.exports = router;