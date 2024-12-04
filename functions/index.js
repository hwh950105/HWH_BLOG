const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.cleanupOldMessages = functions.pubsub
  .schedule("every 1 hours") // 매시간 실행
  .onRun(async (context) => {
    const db = admin.database();
    const messagesRef = db.ref("messages");

    const snapshot = await messagesRef.once("value");
    const data = snapshot.val();

    if (data) {
      const keys = Object.keys(data);
      if (keys.length > 1000) {
        const excessKeys = keys.slice(0, keys.length - 1000);
        for (const key of excessKeys) {
          await messagesRef.child(key).remove();
        }
        console.log(`${excessKeys.length} old messages deleted.`);
      }
    }

    return null;
  });
