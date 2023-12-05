const { exec } = require('child_process');
const moment = require('moment');

// Function to execute mongodump command
function backupMongoDB() {
  const currentDate = moment().format('YYYY-MM-DD-HH-mm-ss');
  console.log(currentDate)
  const backupPath = `./backups/HelpDesk_backup-${currentDate}`;

  const mongodumpCommand = `mongodump --db HelpDesk --out ${backupPath}`;

  exec(mongodumpCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log(`Backup created successfully at: ${backupPath}`);
  });
}

// Schedule the backup to run daily at a specific time (e.g., 00:00 UTC)
function scheduleDailyBackup() {
  const now = moment();
  const targetTime = moment().utc().set({ hour: 0, minute: 0, second: 0 });

  if (now.isAfter(targetTime)) {
    targetTime.add(1, 'days');
  }

  const delay = targetTime.diff(now);

  setTimeout(() => {
    backupMongoDB();
    setInterval(backupMongoDB, 24 * 60 * 60 * 1000); // Repeat daily
  }, delay);
}

// Start the backup schedule
scheduleDailyBackup();
module.exports = backupMongoDB; 