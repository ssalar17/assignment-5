const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

let Schema = mongoose.Schema;

let userSchema = new Schema ({
    Email: {
        type: String,
        unique: true
    },
    Password: String,
    firstName: String,
    lastName: String,
    loginHistory: [{
        dateTime: Date,
        userAgent: String
    }],
    dataClerk: Boolean
});

let User; 

module.exports.initialize = function () {
    return new Promise(function (resolve, reject) {
        let db = mongoose.createConnection(process.env.mongoKey, 
            {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});

        db.on('error', (err)=>{
            reject(err); 
        });
        db.once('open', ()=>{
            User = db.model("users", userSchema);
            resolve();
        });
    });
};

module.exports.registerUser = function (userData) {
    return new Promise(function (resolve, reject) {

            bcrypt.genSalt(12, function (err, salt) {
                if (err) {
                    reject("There was an error encrypting the password");
                } else{
                    bcrypt.hash(userData.Password, salt, function (err, hash) {

                        if(err) {
                            reject("There was an error encrypting the password");
                        } else{
                            userData.Password = hash;
                            let newUser = new User(userData);

                            newUser.save((err) => {
                                if (err) {
                                    if (err.code == 11000){
                                        reject("User Name already taken");
                                    } else {
                                        reject("There was an error creating the user: " + err);
                                    }
                                        
                                    } else {
                                        resolve();
                                    }
                            });
                        }
                    });
                }
            });
    });
};

module.exports.checkUser = function(userData) {
    return new Promise(function (resolve, reject) {

        User.find({ Email: userData.Email})
            .exec()
            .then((users) => {
                if(users.length == 0){
                reject("Unable to find: " + userData.Email);
             } else{
                
                bcrypt.compare(userData.Password, users[0].Password).then((res) => {
                    if(res === true){
                        users[0].loginHistory.push({dataTime: (new Date()).toString(), userAgent: userData.userAgent});

                        User.updateOne({ Email: users[0].Email },
                            { $set: { loginHistory: users[0].loginHistory } }, 
                            {multi: false })
                            .exec()
                            .then(() => {
                                resolve(users[0]);
                                
                            })
                            .catch((err) => {
                                reject("There was an error verifying the user: " + err);
                            });
                        }else {
                            reject("Incorrect Password for user: " + userData.Email);
                        }
                    });
                }
            }).catch((err) => {
                reject("Unable to find user: " + userData.Email);
            });
    });
}