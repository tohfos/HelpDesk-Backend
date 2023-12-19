const { spawn } = require('child_process');
const path = require('path');
const cron = require('node-cron');
//const { MongoClient } = require('mongodb'); 
const DB_NAME = 'HelpDesk';
const currentDateTime = new Date().toLocaleString('en-US', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false // Set to true for 12-hour format, false for 24-hour format
}).replace(/\//g, '-').replace(/:/g, '_'); // Replace slashes with dashes and colons with underscores

const ARCHIVE_PATH = path.join(__dirname, 'backups', `backup_${currentDateTime}`);
const mongoURI = process.env.DB_URL;
cron.schedule('0 0 * * *', () => backupMongoDB());

async function backupMongoDB() {
  try {
    // const client = await MongoClient.connect(mongoURI, { useNewUrlParser: true });
    // const db = client.db(DB_NAME);
    // const collection = db.collection('users'); // Replace with your collection name

    // const count = await collection.countDocuments();
    // console.log(`Number of documents to be backed up: ${count}`);

    const child = spawn('mongodump', [
      `--uri=${mongoURI}`,
      `--out=${ARCHIVE_PATH}`,
      '--gzip',
    ]);

    child.stdout.on('data', (data) => {
      console.log('stdout:\n', data);
    });

    child.stderr.on('data', (data) => {
      console.log('stderr:\n', Buffer.from(data).toString());
    });

    child.on('error', (error) => {
      console.log('error:\n', error);
    });

    child.on('exit', (code, signal) => {
      if (code) console.log('Process exit with code:', code);
      else if (signal) console.log('Process killed with signal:', signal);
      else console.log('Backup is successful ✅');

      // client.close(); // Close MongoDB connection after backup
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

module.exports = backupMongoDB; // Export the function to perform the backup
