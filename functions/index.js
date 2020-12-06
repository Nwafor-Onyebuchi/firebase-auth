const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { user } = require("firebase-functions/lib/providers/auth");
admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

exports.addAdmin = functions.https.onCall((data, context) => {
  // Check that request is being made by an admin
  if (context.auth.token.admin !== true) {
    return { error: "Only admins can create admins, dumbo" };
  }
  //get user and add custom claim
  return admin
    .auth()
    .getUserByEmail(data.email)
    .then((user) => {
      return admin.auth().setCustomUserClaims(user.uid, {
        admin: true,
      });
    })
    .then(() => {
      return {
        message: `Success! ${data.email} is now an admin.`,
      };
    })
    .catch((err) => {
      return err;
    });
});
