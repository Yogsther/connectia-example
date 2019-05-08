const Connectia = require("Connectia")
// Create a new instance of Connecctia, and set the static folder /client
const con = new Connectia(__dirname + "/client") 

var posts = []

// Post function, for submit posts
con.on("post", (message, emit) => {
    console.log(message)
    posts.push(message); // Save the post to the server object "posts"
    emit("posted"); // Send confirmation to the sender that their post was posted.
})

con.on("get_posts", (message, emit) => {
    emit("posts", posts);
})