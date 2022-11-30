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
    const deactivated = req.body.deactivated;
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
    db.all(`SELECT username, email, password, administrator, deactivated FROM users`, [], async (err, rows) => {
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
            administrator: rows[index].administrator,
            deactivated: rows[index].deactivated

        };

        console.log("deactivation status is: "+rows[index].deactivated);

        if(rows[index].deactivated == 2){
            return res.json({ status: 500, send: "This account has been deactivated" });
        }

        if(rows[index].deactivated == 1){
            return res.json({ status: 501, send: "This account hasn't verifies their email" });
        }


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


//confirmation code upon registration
router.put('/confirm', async (req, res) => {

    let exists = false;
    let index = 0;
    
    const email = req.body.email;
    
    
    
   //Checking if email exists
   db.all(`SELECT email FROM users`, [], async (err, rows) => {
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
        administrator: rows[index].administrator,
        deactivated: rows[index].deactivated

    };

    if (exists == false) {
        console.log("email does not exist");
        return res.json({ status: 400, send: "Email does not exist" });
    } else {
        try {
            console.log(`UPDATE users SET deactivted = 0 WHERE email = ${rows[index].email}`);
            // set the deactivated column for the account to 0
            db.run(`UPDATE users SET deactivated = 0 WHERE email = '${rows[index].email}'`, [], function (err) {
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


//for getting all the users in our system, will be used in the admin control page
//(to select a user to grant priviledges to)

router.get('/', (req, res) => {
    //Get all available users
    sql = `SELECT * FROM 'users'`;

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





module.exports = router;