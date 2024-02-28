const allowedOrigins = ["http://127.0.0.1:3000", "http://localhost:3000"];

function checkOrigin(origin, callback) {
    if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
    } else {
        callback(new Error('Not allowed by CORS'));
    }
}

const corsCheck = {
    origin: checkOrigin
};

module.exports = corsCheck;
