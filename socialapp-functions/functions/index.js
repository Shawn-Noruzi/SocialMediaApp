const functions = require("firebase-functions");
const admin = require("firebase-admin");

//Using express to handle cases here is best/cleaner. (ie. if req.method is POST or GET)
const app = require("express")();
admin.initializeApp();

const firebase = require("firebase");

const config = {
  apiKey: "AIzaSyCpxEJd2ad1It9hSI_W98k01FaR4bhLm2o",
  authDomain: "socialapp-4c8c3.firebaseapp.com",
  databaseURL: "https://socialapp-4c8c3.firebaseio.com",
  projectId: "socialapp-4c8c3",
  storageBucket: "socialapp-4c8c3.appspot.com",
  messagingSenderId: "910706923667",
  appId: "1:910706923667:web:2bfc1aece24ad15c8a1566",
  measurementId: "G-DFEHRRC3F2"
};

firebase.initializeApp(config);

const db = admin.firestore();

app.get("/showerThought", (req, res) => {
  db.collection("showerThought")
    .orderBy("createdAt", "desc")
    .get()
    .then(data => {
      let thoughts = [];
      data.forEach(doc => {
        thoughts.push({
          //Unique ID for each scream
          thoughtId: doc.id,
          //...doc.data()
          body: doc.data().body,
          userHandle: doc.data().userHandle,
          createdAt: doc.data().createdAt
        });
      });
      return res.json(thoughts);
    })
    .catch(err => console.error(err));
});

app.post("/showerThought", (req, res) => {
  const newThought = {
    body: req.body.body,
    userHandle: req.body.userHandle,
    createdAt: new Date().toISOString()
  };

  db.collection("showerThought")
    .add(newThought)
    .then(doc => {
      res.json({ message: `document ${doc.id} created successfully ` });
    })
    .catch(err => {
      res.status(500).json({ error: "something went wrong!" });
      console.error(err);
    });
});

//Signup route
app.post("/signup", (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    handle: req.body.handle
  };

  // TODO: validate Data
  let token, userId;
  db.doc(`/users/${newUser.handle}`)
    .get()
    .then(doc => {
      if (doc.exists) {
        //bad request if exists
        return res.status(400).json({ handle: "this handle is already taken" });
      } else {
        return firebase
          .auth()
          .createUserWithEmailAndPassword(newUser.email, newUser.password);
      }
    })
    .then(data => {
      //if we get here means that user is created -> now we need authentication token
     userId = data.user.uid;
      return data.user.getIdToken();
    })
    .then(idToken => {
        token = idToken;
        const userCredentials = {
            handle: newUser.handle,
            email : newUser.email,
            createdAt : new Date().toISOString(),
            userId
        };
      return db.doc(`/users/${newUser.handle}`).set(userCredentials);
    }).then(()=>{
        return res.status(201).json({token});
    })
    .catch(err => {
      console.error(err);
      if (err.code === 'auth/email-already-in-use'){
          return res.status(400).json({email: 'email already in use'})
          } else {
              return res.status(500).json({ error: err.code });
          }
      })
});
exports.api = functions.https.onRequest(app);
