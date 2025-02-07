const fs = require('fs').promises;
const path = require('path');

const logFilePath = path.join(__dirname, '../../logs.json');

const logAction = async (action, data) => {
  try {
    let logs = [];
    try {
      const logContent = await fs.readFile(logFilePath, 'utf8');
      logs = JSON.parse(logContent);
    } catch (err) {
      if (err.code !== 'ENOENT') throw err;
    }

    logs.push({ ...data, timestamp: new Date().toISOString(), action });
    await fs.writeFile(logFilePath, JSON.stringify(logs, null, 2));
  } catch (error) {
    console.error('Error logging action:', error.message);
  }
};

module.exports = { logAction };