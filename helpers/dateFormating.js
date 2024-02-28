const bcrypt = require("bcrypt");

function formatAppointmentDate(date) {
    const options = {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit', timeZone: 'UTC'
    };
    const appointmentDate = new Date(date);
    return new Intl.DateTimeFormat('en-GB', options).format(appointmentDate);
}

function formatDateTime(dateString) {
    const months = {
        'January': '01',
        'February': '02',
        'March': '03',
        'April': '04',
        'May': '05',
        'June': '06',
        'July': '07',
        'August': '08',
        'September': '09',
        'October': '10',
        'November': '11',
        'December': '12'
    };
    const parts = dateString.split(' ');
    const day = parts[1].length === 1 ? '0' + parts[1] : parts[1];
    const month = months[parts[2]];
    const year = parts[3];
    const time = parts[5];
    const formattedDate = `${year}-${month}-${day}T${time}:00.000Z`;
    return formattedDate;
}

module.exports = { formatAppointmentDate, formatDateTime };


