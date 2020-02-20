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

//Grab all thoughts
app.get("/showerThoughts", (req, res) => {
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

const FBAuth = (req, res, next) => {
  //middleware to check if the user thats posting a thought is logged in (token used here to auth)
  let idToken;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    idToken = req.headers.authorization.split('Bearer ')[1];
  } else {
    console.error("No token found");
    return res.status(403).json({ error: "Unauthorized" });
  }
  admin
    .auth()
    .verifyIdToken(idToken)
    .then(decodedToken => {
      req.user = decodedToken;
      console.log('decodedToken:      ',decodedToken);
      return db
        .collection("users")
        .where("userId", "==", req.user.uid)
        .limit(1)
        .get();
    })
    .then(data => {
      req.user.handle = data.docs[0].data().handle;
      return next();
    })
    .catch(err => {
      console.error("Error while verifying token", err);
      return res.status(403).json(err);
    });
};

//Post just one thoughts
app.post("/showerThought", FBAuth, (req, res) => {
  if (req.body.body.trim() === "") {
    return res.status(400).json({ body: "Body must not be empty" });
  }

  const newThought = {
    body: req.body.body,
    userHandle: req.user.handle,
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

//user input validation//
//helper function to determine if a field is empty
const isEmpty = string => {
  if (string.trim() === "") return true;
  else return false;
};
//check if email is valid email or not
const isEmail = email => {
  const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(regEx)) return true;
  else return false;
};

//Signup route
app.post("/signup", (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    handle: req.body.handle
  };

  let errors = {};

  if (isEmpty(newUser.email)) {
    errors.email = "Must not be empty";
  } else if (!isEmail(newUser.email)) {
    errors.email = "Must be a valid email address";
  }
  if (isEmpty(newUser.password)) errors.password = "Must not be empty";
  if (newUser.password !== newUser.confirmPassword)
    errors.confirmPassword = "Passwords must match";
  if (isEmpty(newUser.handle)) errors.handle = "Must not be empty";

  //check for errors, break if they exist
  if (Object.keys(errors).length > 0) {
    console.log("errors exist breaking!!!");
    return res.status(400).json(errors);
  }

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
        email: newUser.email,
        createdAt: new Date().toISOString(),
        userId
      };
      return db.doc(`/users/${newUser.handle}`).set(userCredentials);
    })
    .then(() => {
      return res.status(201).json({ token });
    })
    .catch(err => {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        return res.status(400).json({ email: "email already in use" });
      } else {
        return res.status(500).json({ error: err.code });
      }
    });
});

app.post("/login", (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password
  };
  //validate login
  let errors = {};
  if (isEmpty(user.email)) errors.email = "Must not be empty";
  if (isEmpty(user.password)) errors.password = "Must not be empty";
  if (Object.keys(errors).length > 0) return res.json(errors);
  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then(data => {
      return data.user.getIdToken();
    })
    .then(token => {
      return res.json({ token });
    })
    .catch(err => {
      console.error(err);
      if (err.code === "auth/user-not-found") {
        return res
          .status(403)
          .json({ general: "Wrong credentials, please try again" });
      } else {
        return res.status(500).json({ error: err.code });
      }
    });
});
exports.api = functions.https.onRequest(app);
