const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();
const port = process.env.port || 5000;
//middleware
app.use(cors({
    credentials: true,
    origin: `${process.env.FRONT_END_APP_URL}`
}));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(passport.initialize());
app.use(cookieParser());
//passport config
require('./config/passport')(passport);

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { 
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true 
});
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('database connected successfully');
});

const usersRouter = require('./routes/users');
const tweetsRouter = require('./routes/tweets');

app.use('/users', usersRouter);
app.use('/tweets', tweetsRouter);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});