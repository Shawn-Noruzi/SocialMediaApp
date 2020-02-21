const { db } = require("../util/admin");

exports.getAllThoughts = (req, res) => {
  db.collection("showerThought")
    .orderBy("createdAt", "desc")
    .get()
    .then(data => {
      let thoughts = [];
      data.forEach(doc => {
        thoughts.push({
          //Unique ID for each thought
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
};

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
};

exports.getThought = (req, res) => {
  let thoughtData = {};
  db.doc(`/showerThought/${req.params.thoughtId}`)
    .get()
    .then(doc => {
      console.log("doc", !doc.exists);
      console.log("doc.data", doc.data());
      if (!doc.exists) {
        return res.status(404).json({ error: "Thought not found" });
      }
      thoughtData = doc.data();
      thoughtData.thoughtId = doc.id;
      return db
        .collection("comments")
        .orderBy("createdAt", "desc")
        .where("thoughtId", "==", req.params.thoughtId)
        .get()
        .then(data => {
          thoughtData.comments = [];
          data.forEach(doc => {
            thoughtData.comments.push(doc.data());
          });
          return res.json(thoughtData);
        })
        .catch(err => {
          console.error(err);
          res.status(500).json({ error: err.code });
        });
    });
};

//comment on a comment
exports.commentOnThought = (req, res) => {
  //validate body
  if (req.body.body.trim() === "")
    return res.status(400).json({ error: "Must not be empty" });
  const newComment = {
    body: req.body.body,
    createdAt: new Date().toISOString(),
    thoughtId: req.params.thoughtId,
    userHandle: req.user.handle,
    userImage: req.user.imageUrl
  };
  //confirm thought exists
  db.doc(`/showerThought/${req.params.thoughtId}`)
    .get()
    .then(doc => {
      if (!doc.exists) {
        return res.status(404).json({ error: "thought not found/DNE" });
      }
      return db.collection("comments").add(newComment);
    })
    .then(() => {
      res.json(newComment);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "Something went wrong" });
    });
};
