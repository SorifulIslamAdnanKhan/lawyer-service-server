const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;

const app = express();
require('dotenv').config();

// middleware
app.use(express.json());
app.use(cors());


app.get('/', (req, res)=>{
    res.send('AKL Lawyer Service Running');
});

app.listen(port, ()=>{
    
});