const fs = require("file-system")
const md5 = require("md5")
const cookie = require('cookie-parser');
// Load Connectia
const Connectia = require("Connectia")

// Example for saving users without database (not recommended, only for simple demonstration!)
var users = JSON.parse(fs.readFileSync("users.json", "utf8"))

// Create a new instance of Connecctia, and set the static folder /client
// First we enter the path of our static files, i.e js / css
// Then simply enter the port on where the server will be hosted (default 80)
// Last, we choose if we want to use static html or not. If we use pug, we do not want static files. 
// however, if your website is written in static html, it should be true.
const con = new Connectia(__dirname + "/public", 80, false)

// For pug, we need to set the view engine in the express app in Connectia to pug. This allowes us to send pug files.
con.app.set('view engine', 'pug')

// I'm also binding cookie parser to express so that I can read cookies
con.app.use(cookie());

// Let's route "/" to /index.pug, and render it out with some simple mixins
con.app.get("/", (req, res) => {
    if (req.cookies.token) {
        for (user of users) {
            if (user.username + "_" + user.password == req.cookies.token) {
                res.render("home.pug", {
                    username: user.username
                });
                return;
            }
        }
    }
    res.render("login.pug")
})

// Handle logins from the login screen with ajax
con.on("login", (cred, emit) => {
    // Make sure username and password is provided.
    if (cred.username && cred.password) {
        cred.password = md5(cred.password) // Encrypt password
        // Get user from database
        var user = getUser(cred.username)
        if (user) {
            // User exists
            if (user.password == cred.password) {
                // User authenticated and logged in.
                emit("token", user.username + "_" + user.password)
            } else {
                emit("err", "Wrong password")
            }
        } else {
            // Create new user
            user = cred; // Create a new user
            users.push(user); // Push user to the database
            saveUsers(); // Save database
            emit("token", user.username + "_" + user.password) // Emit login success
        }
    }
})

// Save users to storage
function saveUsers() {
    fs.writeFileSync("users.json", JSON.stringify(users));
}

/**
 * Get a user from the database
 * @param {String} username Username of user you want to get
 */
function getUser(username) {
    for (user of users) {
        if (user.username == username) return user;
    }
    return false;
}