const functions = require("firebase-functions");
const admin = require("firebase-admin");


admin.initializeApp();

//Using express to handle cases here is best/cleaner. (ie. if req.method is POST or GET)
const express = require('express');
const app = express();

app.get('/showerThought', (req,res)=>{
    admin
    .firestore()
    .collection("showerThought")
    .orderBy('createdAt','desc')
    .get()
    .then((data) => {
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
})


app.post('/showerThought', (req,res) => {
  const newThought = {
    body: req.body.body,
    userHandle: req.body.userHandle,
    createdAt: new Date().toISOString()
  };

  admin
    .firestore()
    .collection("showerThought")
    .add(newThought)
    .then(doc => {
      res.json({ message: `document ${doc.id} created successfully ` });
    })
    .catch(err => {
      res.status(500).json({ error: "something went wrong!" });
      console.error(err);
    });
});


//this makes endpoint like this : https://baseurl.com/api
exports.api = functions.https.onRequest(app);