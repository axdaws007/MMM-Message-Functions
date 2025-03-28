const { onSchedule } = require("firebase-functions/v2/scheduler");
const { getDatabase } = require("firebase-admin/database");
const { initializeApp } = require("firebase-admin/app");

// Initialize the Firebase app
initializeApp();

// Scheduled function that runs once a day
exports.deleteOldMessages = onSchedule({
  schedule: "0 0 * * *", // Every day at midnight
  timeZone: "UTC",       // Specify your timezone if needed
  retryCount: 3,         // Number of retry attempts if the function fails
  maxInstances: 1,       // Limit concurrent executions
}, async (event) => {
  // Calculate date threshold (e.g., 7 days ago)
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - 7);
  const cutoffTimestamp = cutoffDate.toISOString();
  
  // Get reference to messages
  const db = getDatabase();
  const messagesRef = db.ref('messages');
  
  // Query for old messages
  const oldMessagesQuery = await messagesRef.orderByChild('date').endAt(cutoffTimestamp).once('value');
  
  // Delete old messages
  const deletePromises = [];
  oldMessagesQuery.forEach((messageSnapshot) => {
    console.log(`Deleting message with key: ${messageSnapshot.key}, date: ${messageSnapshot.val().date}`);
    deletePromises.push(messagesRef.child(messageSnapshot.key).remove());
  });
  
  // Wait for all deletions to complete
  await Promise.all(deletePromises);
  
  const deletedCount = deletePromises.length;
  console.log(`Deleted ${deletedCount} messages older than ${cutoffTimestamp}`);
  return { deletedCount };
});