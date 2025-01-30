const express = require('express')
const mongoose = require('mongoose')
const UserRoute = require('./Route/userRoute');
const ProductRoute = require('./Route/productRoute');
require ('dotenv').config()
const cors = require('cors')


const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('view'))



app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'view', 'index.html'));
});

const MONGO_URL = process.env.MONGO_URL;
const PORT = process.env.PORT || 3001;


mongoose.connect(MONGO_URL)
    .then(() => {
        console.log('Connected to MongoDB!');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Database connection error:', error);
    });


app.use('/user',UserRoute)
app.use('/product', ProductRoute)

module.exports = app;

