// Create a new instance of Connectia
var con = new Connectia(location.protocol);

/**
 * Login / Signup function
 * Sends cred object to the server
 */
function login(){
    var cred = {
        username: document.getElementById("username").value,
        password: document.getElementById("password").value
    }
    con.emit("login", cred); // Send login info to the server
}

/* Logout function, clears token and reloads page */
function logout(){
    document.cookie = "token = ";
    location.reload();
}

/* Token listener, fires on login and saves the token. Then reloads the page. */
con.on("token", token => {
    document.cookie = "token = "+token;
    location.reload();
})