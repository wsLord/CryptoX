const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/CryptoX_devlopment');

const db = mongoose.connection;

db.on('error',console.error.bind(console,"Error connecting to mongodb"));

db.once('open',function(){
    console.log('Connected to Database :: MongoDB');
});



module.exports=db;
