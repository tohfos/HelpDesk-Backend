const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const mongoURI = process.env.DB_URL; // Update with your MongoDB URI
const BACKUP_DIR = path.join(__dirname, 'backups'); // Update with your backup directory

async function restoreLatestBackup() {
  try {
    // Read all files in the backup directory
    const files = fs.readdirSync(BACKUP_DIR);
    // Filter out non-backup files
    const backupFiles = files.filter((file) => {
      // Modify the condition to match your backup file naming pattern
      return file.startsWith('backup');
    });
    // Sort the backup files based on their timestamps
    // Example of backup file names:

    backupFiles.sort((a, b) => {
      const timestampA = Date.parse(a.replace('backup_', '').replace(/-/g, '/').replace(/,/g, '').replace(/_/g, ':'));
      const timestampB = Date.parse(b.replace('backup_', '').replace(/-/g, '/').replace(/,/g, '').replace(/_/g, ':'));
      return timestampB - timestampA;
    });

    console.log(backupFiles);


    if (backupFiles.length > 0) {
      let latestBackup = path.join(BACKUP_DIR, backupFiles[0]);
      console.log(latestBackup);
      const backupWithHelpDesk = path.join(latestBackup, 'HelpDesk'); // Append 'HelpDesk' to the latest backup path

      console.log("latestBackup", latestBackup)
      const child = spawn('mongorestore', [
        `--uri=${mongoURI}`, // Use --drop to drop the existing database before restoring
        `--gzip`,
        `${backupWithHelpDesk}`, // Specify the path to the latest backup file
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
        else console.log('Restore is successful ✅');
      });
    } else {
      console.log('No backup files found.');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

module.exports = restoreLatestBackup; // Export the function to perform the restore
