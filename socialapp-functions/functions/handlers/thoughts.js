const { db } = require('../util/admin');

exports.getAllThoughts = (req, res) => {
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
  }

exports.postOneThought = (req, res) => {
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
  }