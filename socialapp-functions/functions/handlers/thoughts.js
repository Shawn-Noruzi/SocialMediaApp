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
    userImage: req.user.imageUrl,
    createdAt: new Date().toISOString(),
    likeCount: 0,
    commentCount: 0
  };

  db.collection("showerThought")
    .add(newThought)
    .then(doc => {
      const resThought = newThought;
      resThought.thoughtId = doc.id;
      res.json({ resThought });
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

      return doc.ref.update({commentCount: doc.data().commentCount + 1})
    }).then(() => {
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

// Like a thought
exports.likeThought = (req, res) => {
  const likeDocument = db
    .collection('likes')
    .where('userHandle', '==', req.user.handle)
    .where('thoughtId', '==', req.params.thoughtId)
    .limit(1);

  const thoughtDocument = db.doc(`/showerThought/${req.params.thoughtId}`);


  let thoughtData;

  thoughtDocument
    .get()
    .then((doc) => {
      if (doc.exists) {
        thoughtData = doc.data();
        console.log('doc.data', doc.data() )
        thoughtData.thoughtId = doc.id;

        return likeDocument.get();
      } else {
        return res.status(404).json({ error: 'thought not found' });
      }
    })
    .then((data) => {
      if (data.empty) {
        return db
          .collection('likes')
          .add({
            thoughtId: req.params.thoughtId,
            userHandle: req.user.handle
          })
          .then(() => {
            thoughtData.likeCount++;
            console.log('add 1 to like count', thoughtData.likeCount )
            return thoughtDocument.update({ likeCount: thoughtData.likeCount });
          })
          .then(() => {
            return res.json(thoughtData);
          });
      } else {
        return res.status(400).json({ error: 'thought already liked' });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

exports.unlikeThought = (req, res) => {
  //connect to like DB + grab data
  //since req.params.thoughtId contains the user ID that wants to like a thought 
  //we're able to connect the like functionality to thoughtId 
  const likeDocument = db
    .collection('likes')
    .where('userHandle', '==', req.user.handle)
    .where('thoughtId', '==', req.params.thoughtId)
    .limit(1);

  //connect to the showerThought 
  const thoughtDocument = db.doc(`/showerThought/${req.params.thoughtId}`);

  let thoughtData;

  thoughtDocument
    .get()
    .then((doc) => {
      if (doc.exists) {
        thoughtData = doc.data();
        console.log('doc.data', doc.data() )

        thoughtData.thoughtId = doc.id;
        return likeDocument.get();
      } else {
        return res.status(404).json({ error: 'thought not found' });
      }
    })
    .then((data) => {
      if (data.empty) {
        console.log('data is empty')
        return res.status(400).json({ error: 'thought not liked' });
      } else {
        return db
          .doc(`/likes/${data.docs[0].id}`)
          .delete()
          .then(() => {
            console.log('decrementing like')
            thoughtData.likeCount--;
            return thoughtDocument.update({ likeCount: thoughtData.likeCount });
          })
          .then(() => {
            res.json(thoughtData);
          });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

// Delete a thought
exports.deleteThought = async (req, res) => {
  const document =  db.doc(`/showerThought/${req.params.thoughtId}`);
  document
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: 'thought not found' });
      }
      if (doc.data().userHandle !== req.user.handle) {
        console.log('doc handle', doc.data().userHandle)
        console.log('user handle', req.user.handle)
        return res.status(403).json({ error: 'Unauthorized' });
      } else {
        return document.delete();
      }
    })
    .then(() => {
      res.json({ message: 'thought deleted successfully' });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};