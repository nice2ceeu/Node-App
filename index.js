const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const UserRoute = require('./Route/userRoute');
const ProductRoute = require('./Route/productRoute');
const AdminRoute = require('./Route/adminRoute');
require ('dotenv').config()


const app = express()


const MONGO_URL = process.env.MONGO_URL;
const PORT = process.env.PORT || 3001;

let connectionPromise;

const connectDatabase = async () => {
    if (mongoose.connection.readyState === 1) return mongoose.connection;

    if (!MONGO_URL) {
        throw new Error('MONGO_URL is not configured.');
    }

    if (!connectionPromise) {
        connectionPromise = mongoose.connect(MONGO_URL, {
            serverSelectionTimeoutMS: 10000,
        }).catch((error) => {
            connectionPromise = undefined;
            throw error;
        });
    }

    await connectionPromise;
    return mongoose.connection;
};

app.use(express.json())

app.use(express.static(path.join(__dirname, 'view')))

// Static pages do not need a database connection. API requests do.
app.use(['/user', '/product', '/admin-api'], async (req, res, next) => {
    try {
        await connectDatabase();
        next();
    } catch (error) {
        console.error('Database connection failed:', error.message);
        res.status(503).json({ message: 'The database is temporarily unavailable.' });
    }
});

// app.post('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'view', 'index.html'));
// });

// app.post('/dashboard.html', (req, res) => {
//     res.sendFile(path.join(__dirname, 'view', 'dashboard.html'));
// });

app.use('/user',UserRoute)

app.use('/product', ProductRoute)

app.use('/admin-api', AdminRoute)

// Vercel imports the Express app and manages the HTTP server itself.
// A local Node process still needs to open a port.
if (require.main === module) {
    connectDatabase()
        .then(() => {
            app.listen(PORT, () => {
                console.log(`Connected to MongoDB — http://localhost:${PORT}`);
            });
        })
        .catch((error) => {
            console.error('Unable to start server:', error.message);
            process.exitCode = 1;
        });
}

module.exports = app;

