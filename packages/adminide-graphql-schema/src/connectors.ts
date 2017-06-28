import * as Mongoose from 'mongoose';

// somewhere in the middle:
const MONGOLAB_URI = 'mongodb://localhost:27017/adminIde';
const mongo = Mongoose.connect(MONGOLAB_URI, function (err, res) {
    if (err) {
        console.log(`ERROR connecting to: ${MONGOLAB_URI}. ${err} `);
    } else {
        console.log(`Succeeded connected to: ${MONGOLAB_URI}`);
    }
});
