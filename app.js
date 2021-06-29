const port = process.env.PORT || 3000

const express = require('express');
const mysql = require('mysql');
const bodyParser = require("body-parser");
// const cookieParser = require('cookie-parser');
const session = require('express-session');
const sqlite = require("better-sqlite3"); 
const SqliteStore = require("better-sqlite3-session-store")(session);
const sqLitedb = new sqlite("sessions.db");
const path = require('path');

const {DB_HOST, DB_USERNAME, DB_PASSWORD, DB_DATABASE} = require('./config');

var options = {
    client: sqLitedb, 
    expired: {
        clear: true,
        intervalMs: 24 * 60 * 60 * 1000 //ms = 15min
    }
};

var sessionStore = new SqliteStore(options);
  
const db_config = {
    host: DB_HOST,
    user: DB_USERNAME,
	password: DB_PASSWORD,
	database: DB_DATABASE,
    multipleStatements: true,
};

const db = mysql.createPool(db_config);

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
    secret: 'jodsnfjan2934jdasd1', //key that will sign cookie,
    store: sessionStore,
    resave: false, // for every request to the server, dont create new session
    saveUninitialized: false,// if we have not modified the session, we dont want it to save
    cookie: {
        secure: false,
        // originalMaxAge: 30 * 24 * 60 * 60 * 1000,
        maxAge: 30 * 24 * 60 * 60 * 1000,
        // expires: 30 * 24 * 60 * 60 * 1000
    },
    // expires: new Date(Date.now() + (30 * 86400 * 1000)),
    // maxAge: Date.now() + (30 * 86400 * 1000)
    
}));

app.use(express.static("dist"));

const REQUEST_URL = DB_HOST == 'localhost' ? "http://localhost:8080" : "https://cs176smartalarm.herokuapp.com/"
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", REQUEST_URL); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Credentials', true)
    next();
});


//called when App.vue is created
app.get("/login", (req,res) => {
    req.session.isAuth = true;
    // if no user on current session, it means its the default user, so hardcode it; to ensure that only one session gets created for default user
    if (req.session.user == null) {
        req.session.user = 5;
        req.session.isLoggedIn = true;
        req.session.save();
    }
    console.log('Current User:' + req.session.user);
    res.send({id: req.session.user});
})

//CREATE DATABASE*************************************************************************************/
// app.get('/createdb', (req, res) => {
//     let query = 'CREATE DATABASE smartalarm';
//     db.query(query, (err, result) => {
//         if (err) {
//             console.log(err);
//         }
//         res.send('database created');
//         // console.log(result);
//     });
// })

//CREATE TABLES*************************************************************************************/
// app.get('/createusers', (req, res) => {
//     let query = 'DROP TABLE IF EXISTS users CASCADE; '
//     query += 'CREATE TABLE users(id int AUTO_INCREMENT, username VARCHAR(255), password VARCHAR(255), PRIMARY KEY (id))';
//     db.query(query, (err, result) => {
//         if (err) {
//             console.log(err);
//         }
//         res.send('users table created');
//         // console.log(result);
//     });
// });

// app.get('/createalarms', (req, res) => {
//     let query = 'DROP TABLE IF EXISTS alarms; '
//     query += 'CREATE TABLE alarms(id int AUTO_INCREMENT, userID int, time VARCHAR(255), isActive BOOL, repetitions VARCHAR(255), ampm VARCHAR(255), PRIMARY KEY (id), FOREIGN KEY (userID) REFERENCES users(id) ON DELETE CASCADE)'
//     db.query(query, (err, result) => {
//         if (err) {
//             console.log(err);
//         }
//         res.send('alarms table created');
//         // console.log(result);
//     });
// });

// app.get('/createsettings', (req, res) => {
//     //difficulty: 0- easy; 1- medium; 2-difficult
//     //mode: 0-light; 1-dark
//     let query = 'DROP TABLE IF EXISTS settings; '
//     query += 'CREATE TABLE settings(id int AUTO_INCREMENT,  userID int, difficulty VARCHAR(255), mode int, PRIMARY KEY (id), FOREIGN KEY (userID) REFERENCES users(id) ON DELETE CASCADE)'
//     db.query(query, (err, result) => {
//         if (err) {
//             console.log(err);
//         }
//         res.send('settings table created');
//         // console.log(result);
//     })
// })

// app.get('/createstatistics', (req, res) => {
//     //dateTime contains date and wake up time
//     let query = 'DROP TABLE IF EXISTS statistics; '
//     query += 'CREATE TABLE statistics(id int AUTO_INCREMENT,  userID int, snoozes int, timeToWake VARCHAR(255), wakeUpTime VARCHAR(255), mood int, dateCreated DATETIME DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (id), FOREIGN KEY (userID) REFERENCES users(id) ON DELETE CASCADE)'
//     db.query(query, (err, result) => {
//         if (err) {
//             console.log(err);
//         }
//         res.send('statistics table created');
//         // console.log(result);
//     })
// })

//INSERTING IN THE TABLES*************************************************************************************/
app.get('/adduser', (req, res) => {
    // generates random strings for username and pass; doesn't matter if not unique
    let post = {username: Math.random().toString(36).substring(7), password:Math.random().toString(36).substring(7)}
    let sql = 'INSERT INTO users SET ?';
    let query = db.query(sql, post, (err, result) => {
        if (err) {
            console.log(err);
        }
        res.send({id: result.insertId});
        console.log('user added');
        req.session.user = result.insertId;
        req.session.isLoggedIn = true;
        req.session.save();
        // res.cookie('id', result.insertId, { maxAge: 900000, httpOnly: true });
        // console.log(req.cookies);
        let sql2 = 'INSERT INTO settings SET ?'
        let post2 = {userID: result.insertId, difficulty: 'Easy', mode: 0}
        console.log(post2);
        let query2 = db.query(sql2, post2, (err, result) => {
            if (err) {
                console.log(err);
            }
            console.log('settings for user added');
            // res.send('settings added');
            // console.log(result);
        })
    });
});

app.post('/addalarm/:userID/', (req, res) => {
    // generates random strings for username and pass; doesn't matter if not unique
    let alarmPost = req.body.alarm
    alarmPost.repetitions = JSON.stringify(alarmPost.repetitions);
    alarmPost['userID'] = req.params.userID;
    // console.log(data.stringify);
    console.log(alarmPost);
    let sql = 'INSERT INTO alarms SET ?';
    let query = db.query(sql, alarmPost, (err, result) => {
        if (err) {
            console.log(err);
        }
        res.send(200);
        console.log(result.insertId);
    });
});

app.post('/addstat/', (req, res) => {
    // generates random strings for username and pass; doesn't matter if not unique
    console.log(req.body.statPost);
    let post = req.body.statPost
    let sql = 'INSERT INTO statistics SET ?';
    let query = db.query(sql, post, (err, result) => {
        if (err) {
            console.log(err);
        }
        res.send(200);
        console.log(result);
    });
});


//GET INFO FROM TABLES*************************************************************************************/
app.get('/getusers', (req, res) => {
    let sql = 'SELECT * FROM users';
    let query = db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        }
        res.send(result);
        // console.log(result);
    });
});

app.get('/getuser/:userID', (req, res) => {
    let sql = `SELECT * FROM users WHERE id = ${req.params.userID}`;
    let query = db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        }
        res.send(result);
        console.log(result);
    });
});

app.get('/getstatistics', (req, res) => {
    let sql = `SELECT * FROM statistics`;
    let query = db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        }
        res.send(result);
        console.log(result);
    });
});

app.get('/getallstat/:userID', (req, res) => {
    let sql = `SELECT * FROM statistics WHERE userID = ${req.params.userID}`;
    let query = db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        }
        res.send(result);
        console.log(result);
    });
});

app.get('/getweekstat/:userID/', (req, res) => {
    let sql = `SELECT *, DAYOFWEEK(dateCreated) as dayOfWeek FROM statistics WHERE userID = ${req.params.userID} AND YEARWEEK(dateCreated,0) = YEARWEEK(CURDATE(),0);`;
    let query = db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        }
        res.send(result);
        console.log(result);
    });
});

app.get('/getsettings', (req, res) => {
    let sql = `SELECT * FROM settings`;
    let query = db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        }
        res.send(result);
        console.log(result);
    });
});

app.get('/getsetting/:userID', (req, res) => {
    let sql = `SELECT * FROM settings WHERE userId = ${req.params.userID}`;
    let query = db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        }
        res.send(result);
        console.log(result);
    });
});


app.get('/getalarms/:userID', (req, res) => {
        let sql = `SELECT * FROM alarms WHERE userId = ${req.params.userID}`;
        let query = db.query(sql, async (err, result) => {
            if (err) {
                console.log(err);
            }
            res.send(await printFiles(result));
            // res.send(result.forEach((item) => JSON.parse(item.repetitions)));
            // console.log(result[0].RowDataPacket);
    });
});

async function printFiles (result) {
    for (const item of result) {
        item.repetitions = JSON.parse(item.repetitions);
        // console.log(item);
    }
    result.sort((a, b) => (convertTime12to24(a) > convertTime12to24(b)) ? 1 : -1);
    // console.log("DONE")
    // console.log(result);
    return result;
}

function convertTime12to24(data) {
    let {time, ampm} = data;
    let [hours, minutes] = time.split(':');

    if (hours === '12') {
        hours = '00';
    }

    if (ampm === 'PM') {
        hours = parseInt(hours, 10) + 12;
    }

    return `${hours}:${minutes}`;
}


app.get('/getsessions', (req, res) => {
    let sql = `SELECT * FROM sessions`;
    let query = db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        }
        res.send(result);
        
    });
});
//UPDATE ITEM IN TABLES*************************************************************************************/
app.get('/updatesettings/:userID/:newDifficulty', (req, res) => {
    let sql = `UPDATE settings SET difficulty = '${req.params.newDifficulty}' WHERE userID = ${req.params.userID}`;
    let query = db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            return;
        }
        res.send(200);
        console.log(result);
    });
})

app.post('/togglealarm/:alarmID', (req, res) => {
    let sql = `UPDATE alarms SET isActive = ${req.body.isActive} WHERE id = ${req.params.alarmID}`;
    let query = db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        }
        res.send("alarm updated \n" + result);
        console.log(result);
    });
})


//DELETE FROM TABLES*************************************************************************************/
app.get('/deletealarm/:id', (req, res) => {
    let sql = `DELETE FROM alarms WHERE id = ${req.params.id}`;
    let query = db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        }
        res.send('alarm deleted');
        console.log(result);
    });
})

//if users uninstall the app ?
app.get('/deleteuser/:id', (req, res) => {
    let sql = `DELETE FROM users WHERE id = ${req.params.id}`;
    let query = db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        }
        res.send('user deleted'); 
        console.log(result);
    });
})

app.get('/deletealarms', (req, res) => {
    let sql = `DELETE FROM alarms`;
    let query = db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        }
        res.send('alarms deleted'); 
        console.log(result);
    });
})

app.get('*', function (req,res) {
    res.sendFile('index.html', { root: path.join(__dirname, './dist') });
});

app.listen(port, () => {
    console.log('Server started on port: '+ port);
});



