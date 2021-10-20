const express = require('express');
const cors = require('cors');
const DbConnect = require('./database');
require('dotenv').config();
const app = express();

// routes
const authRouter = require("./routes/auth-routes");

const PORT = process.env.PORT || 5500;

// database connection
DbConnect();

// middlewares
const corsOption = {
    credentials: true,
    origin: [process.env.ORIGIN],
};
app.use(cors(corsOption));
app.use('/storage', express.static('storage'));
app.use(express.json({ limit: '5mb' }));

// routes
app.use("/api/auth",authRouter);

// server
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));