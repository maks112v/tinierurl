const functions = require('firebase-functions');

const metaData = require('url-metadata');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   response.send('Hello from Firebase!');
// });

exports.getMetaData = functions.firestore
  .document('domains/{domainId}/redirects/{redirectId}')
  .onCreate(change => {
    const data = change.after.data();

    metaData(`https://cors-anywhere.herokuapp.com/${data.url}`).then(
      function(metadata) {
        console.log(metadata);
        return change.after.ref.set(
          {
            metaData: {
              title: metadata.title,
              description: metadata.description,
            },
          },
          { merge: true },
        );
      },
      function(error) {
        console.log(error);
        return change.after.ref.set({ metaData: false }, { merge: true });
      },
    );
  });
