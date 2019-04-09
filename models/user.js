const mongoose = require('mongoose');

// mongoose.connect('mongodb://localhost/passportapp', (err) => {
//     if (err) {
//         console.log(err);

//     } else {
//         console.log('ok connection to db');

//     }
// })
mongoose.connect('mongodb://localhost/passportapp', {
    useNewUrlParser: true
}, () => {
    if (mongoose.connection.readyState == 1) {
        let db = mongoose.connection;
        models = db.modelNames()
        name = db.db.databaseName
        console.log(`connect to DB : ${name} and has models : ${models}`);
        // db.useDb()switched between data bases
        // console.log(name);
    } else {
        console.log('not connection to db');
    }
})

const bcrypt = require('bcryptjs');

//user Schema

const UserSchema = mongoose.Schema({
    name: {
        type: String,

    },
    username: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
});

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.registerUser = (newUser, callback) => {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) {
                console.log(err)
            } else {
                newUser.password = hash
                newUser.save(callback)
            }
        })
    })

}

module.exports.getUserByUsername = ((username, callback) => {
    const query = {
        username: username
    }
    User.findOne(query, callback)
})

module.exports.getUserById = ((id, callback) => {

    User.findById(id, callback)
})


module.exports.comparePassword = ((candidatePassword, hash, callback) => {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if (err) throw err;
        callback(null, isMatch)
    })
})