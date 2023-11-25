require('dotenv').config();
const express = require('express');
const setupDB = require('./db');
const logsRouter = require('./routes/logs');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/logs', logsRouter);


setupDB();

const server = app.listen(process.env.PORT, () => {
  console.log(
    `Listening on port ${process.env.PORT}. Visit http://localhost:${process.env.PORT}/ in your browser.`
  );
});

// socket(server);
