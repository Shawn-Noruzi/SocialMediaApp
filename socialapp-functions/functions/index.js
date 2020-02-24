const functions = require("firebase-functions");
const {db} = require('./util/admin')

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
  getAuthenticatedUser,
  getUserDetails,
  markNotificationsRead
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
app.get('/user/:handle', getUserDetails);
app.post('/notifications', FBAuth, markNotificationsRead);


exports.api = functions.region('us-central1').https.onRequest(app);
//when someone likes 
exports.createNotificationOnLike = functions
  .region('us-central1')
  .firestore.document('likes/{id}')
  .onCreate((snapshot) => {
      console.log('--------------triggered------------')
    return db
      .doc(`/showerThought/${snapshot.data().thoughtId}`)
      .get()
      .then((doc) => {
        if (
          doc.exists &&
          doc.data().userHandle !== snapshot.data().userHandle
        ) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: 'like',
            read: false,
            thoughtId: doc.id
          });
        }
      })
      .catch((err) => console.error(err));
  });

  //when someone likes but then unlikes
  exports.deleteNotificationOnUnLike = functions
  .region('us-central1')
  .firestore.document('likes/{id}')
  .onDelete((snapshot) => {
    return db
      .doc(`/notifications/${snapshot.id}`)
      .delete()
      .catch((err) => {
        console.error(err);
        return;
      });
  });


//when someone comments
exports.createNotificationOnComment = functions
  .region('us-central1')
  .firestore.document('comments/{id}')
  .onCreate((snapshot) => {
    return db
      .doc(`/showerThought/${snapshot.data().thoughtId}`)
      .get()
      .then((doc) => {
        if (
          doc.exists &&
          doc.data().userHandle !== snapshot.data().userHandle
        ) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: 'comment',
            read: false,
            thoughtId: doc.id
          });
        }
      })
      .catch((err) => {
        console.error(err);
        return;
      });
  });

  //when user changes their image -> all their images on all their thoughts get changed
  exports.onUserImageChange = functions
  .region('us-central1')
  .firestore.document('/users/{userId}')
  .onUpdate((change) => {
    console.log(change.before.data());
    console.log(change.after.data());
    if (change.before.data().imageUrl !== change.after.data().imageUrl) {
      console.log('image has changed');
      const batch = db.batch();
      return db
        .collection('showerThought')
        .where('userHandle', '==', change.before.data().handle)
        .get()
        .then((data) => {
          data.forEach((doc) => {
            const thought = db.doc(`/showerThought/${doc.id}`);
            batch.update(thought, { userImage: change.after.data().imageUrl });
          });
          return batch.commit();
        });
    } else return true;
  });

  exports.onThoughtDelete = functions
  .region('us-central1')
  .firestore.document('/showerThought/{thoughtId}')
  .onDelete((snapshot, context) => {
    const thoughtId = context.params.thoughtId;
    const batch = db.batch();
    return db
      .collection('comments')
      .where('thoughtId', '==', thoughtId)
      .get()
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/comments/${doc.id}`));
        });
        return db
          .collection('likes')
          .where('thoughtId', '==', thoughtId)
          .get();
      })
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/likes/${doc.id}`));
        });
        return db
          .collection('notifications')
          .where('thoughtId', '==', thoughtId)
          .get();
      })
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/notifications/${doc.id}`));
        });
        return batch.commit();
      })
      .catch((err) => console.error(err));
  });