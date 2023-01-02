const mongoose = require('mongoose');

mongoose.connect(process.env.URI)
        .then((success) => console.log('Connected to database'))
        .catch((error) => console.log('Error connecting to database'));