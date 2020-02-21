const functions = require("firebase-functions");


//Using express to handle cases here is best/cleaner. (ie. if req.method is POST or GET)
const app = require("express")();
const FBAuth = require('./util/fbAuth');

const {getAllThoughts, postOneThought} = require('./handlers/thoughts');
const {signup, login, uploadImage, addUserDetails, getAuthenticatedUser} = require('./handlers/users');


//Thought - routes
app.get("/showerThoughts", getAllThoughts);

//Post just one thoughts
app.post("/showerThought", FBAuth, postOneThought);

//Users route
app.post("/signup", signup);
app.post("/login", login);
app.post('/user/image', FBAuth ,uploadImage);
app.post('/user',FBAuth, addUserDetails)
app.get('/user', FBAuth, getAuthenticatedUser)

exports.api = functions.https.onRequest(app);
