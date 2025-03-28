# Firebase Cloud Functions - Message Cleanup

A Firebase Cloud Functions project that automatically deletes old messages from a Firebase Realtime Database after a specified retention period.

## Overview

This project contains a scheduled Firebase Cloud Function that runs daily to delete messages older than 7 days from your Firebase Realtime Database. The function helps maintain database efficiency and reduces storage costs by removing outdated data.

## Features

- **Scheduled Execution**: Automatically runs once per day at midnight (UTC)
- **Configurable Retention Period**: Currently set to delete messages older than 7 days
- **Logging**: Records the deletion process with message keys and timestamps
- **Error Handling**: Includes retry logic for improved reliability

## Prerequisites

- [Node.js](https://nodejs.org/) (v22 as specified in package.json)
- [Firebase CLI](https://firebase.google.com/docs/cli) installed globally
- A Firebase project with Realtime Database enabled

## Installation

1. Clone this repository:
   ```bash
   git clone <repository-url>
   cd <repository-name>
   ```

2. Install dependencies:
   ```bash
   cd functions
   npm install
   ```

3. Log in to Firebase:
   ```bash
   firebase login
   ```

4. Initialize your Firebase project (if not already initialized):
   ```bash
   firebase init
   ```

## Configuration

The function is configured to:
- Run every day at midnight (UTC)
- Delete messages older than 7 days
- Retry up to 3 times if the function fails
- Allow only one concurrent execution

To change the retention period, modify the following line in `functions/index.js`:

```javascript
// Change 7 to your desired number of days
cutoffDate.setDate(cutoffDate.getDate() - 7);
```

To change the schedule, modify the `schedule` parameter in the `onSchedule` configuration:

```javascript
schedule: "0 0 * * *", // Cron syntax: minute hour day month day-of-week
```

## Deployment

Deploy the function to Firebase:

```bash
firebase deploy --only functions
```

## Local Testing

To test the function locally:

```bash
firebase emulators:start --only functions
```

## Database Structure

The function expects your Realtime Database to have a `messages` node with child nodes containing a `date` field (ISO format string).

Example database structure:
```
/messages
  /message1
    date: "2023-04-01T12:00:00.000Z"
    content: "Hello world"
  /message2
    date: "2023-04-05T15:30:00.000Z"
    content: "Another message"
```

## Monitoring

You can monitor function executions and view logs using the Firebase Console or via CLI:

```bash
firebase functions:log
```

## License

[Add your license information here]

## Contributing

[Add contribution guidelines if applicable]

## Security

This function should be deployed with appropriate Firebase security rules to protect your data. Make sure only authorized users or systems can write to your database.

---

Created with ❤️ using Firebase Cloud Functions