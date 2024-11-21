const express = require('express')
const mongoose = require('mongoose')
const UserRoute = require('./Route/userRoute');
const ProductRoute = require('./Route/productRoute');
require ('dotenv').config()


const app = express()


const MONGO_URL = process.env.MONGO_URL;
const PORT = process.env.PORT || 3001;

mongoose.connect(MONGO_URL)
.then(() =>{app.listen(PORT,() =>{
    console.log(`to port ${PORT}`);
}),
console.log('Connected!')},

).catch((error)=>{
    console.log(error)}
)

app.use(express.json())
app.use(express.static('view'))

// app.post('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'view', 'index.html'));
// });

// app.post('/dashboard.html', (req, res) => {
//     res.sendFile(path.join(__dirname, 'view', 'dashboard.html'));
// });


app.use('/user',UserRoute)

app.use('/product', ProductRoute)



