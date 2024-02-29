const cron = require("node-cron");
const sendReminderEmails = require('../controlers/messageSenderController');

cron.schedule('0 12 * * *', () => {
    console.log('Running sendReminderEmails...');
    sendReminderEmails();
}, {
    timezone: 'Europe/Kiev'
});
