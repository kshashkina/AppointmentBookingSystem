const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const session = require('express-session');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const connectDB = require('./mongooseConnection');
const authRoutes = require('./routes/authRoutes');
const indexRouter = require('./routes/indexRoutes');
const patientProfileRouter = require('./routes/profilePatientRoute');
const appointmentRouter = require('./routes/appointmentsRoutes');
const adminRoutes = require('./routes/adminRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const chatRoute = require('./routes/chatRoute')
const chatController = require('./controlers/socketController');
const corsCheck = require('./middleware/corsChecker');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

require('./controlers/remainderScheduled');


app.use(methodOverride('_method'));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors(corsCheck));


app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: 'auto', httpOnly: true }
}));

app.set('view engine', 'pug');
app.set('views', './views');

app.use('/', indexRouter);
app.use('/auth', authRoutes);
app.use('/patient', patientProfileRouter);
app.use('/appointments', appointmentRouter);
app.use('/admin', adminRoutes);
app.use('/doctor', doctorRoutes);
app.use(chatRoute);

chatController.handleSocketConnection(server);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
