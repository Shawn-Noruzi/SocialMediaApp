const {admin, db} = require('./admin')

module.exports = (req, res, next) => {
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
        return db
          .collection("users")
          .where("userId", "==", req.user.uid)
          .limit(1)
          .get();
      })
      .then(data => {
        req.user.handle = data.docs[0].data().handle;
        req.user.imageUrl = data.docs[0].data().imageUrl;
        return next();
      })
      .catch(err => {
        console.error("Error while verifying token", err);
        return res.status(403).json(err);
      });
  };