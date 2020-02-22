const functions = require("firebase-functions");

//Using express to handle cases here is best/cleaner. (ie. if req.method is POST or GET)
const app = require("express")();
const FBAuth = require("./util/fbAuth");

const {
  getAllThoughts,
  postOneThought,
  getThought,
  commentOnThought,
  likeThought,
  unlikeThought,
  deleteThought
} = require("./handlers/thoughts");
const {
  signup,
  login,
  uploadImage,
  addUserDetails,
  getAuthenticatedUser
} = require("./handlers/users");

//Thought - routes
app.get("/showerThoughts", getAllThoughts);

//Post just one thoughts
app.post("/showerThought", FBAuth, postOneThought);
app.get("/showerThought/:thoughtId", getThought);

app.post("/showerThought/:thoughtId/comment", FBAuth, commentOnThought);
app.get("/showerThought/:thoughtId/like", FBAuth, likeThought);
app.get("/showerThought/:thoughtId/unlike", FBAuth, unlikeThought);
app.delete("/showerThought/:thoughtId", FBAuth, deleteThought);

//Users route
app.post("/signup", signup);
app.post("/login", login);
app.post("/user/image", FBAuth, uploadImage);
app.post("/user", FBAuth, addUserDetails);
app.get("/user", FBAuth, getAuthenticatedUser);

exports.api = functions.https.onRequest(app);
