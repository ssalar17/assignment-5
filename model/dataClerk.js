const mongoose = require('mongoose'); //assign 4

let Schema = mongoose.Schema;

let packageSchema = new Schema ({
    title: String,
    price: Number,
    synopsis: String,
    foodCategory: String,
    numberOfMeals: Number,
    topPackage: Boolean,
    image: String
});

let Package;

module.exports.initialize = function() {
    return new Promise(function (resolve, reject) {
        let db = mongoose.createConnection(process.env.mongoKey,
            {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});

        db.on('error', (err)=>{
            reject(err);
        });
        db.once('open', ()=>{
            Package = db.model("packages", packageSchema);
            resolve();
        });
    });
};

module.exports.addPackage = function (packageData) {
    return new Promise(function (resolve, reject) {

        for (var prop in packageData) {
            if(packageData[prop] == '')
                packageData[prop] = null;
        }

        Package.create(packageData).then(()=> {
            resolve();
        }).catch((err)=> {
            console.log(err);
            reject("unable to create package");
        });
    });
};

module.exports.topMealPackage = function() {
    return new Promise (function (resolve, reject) {
        Package.find({topPackage: true}).lean().then((packageData) => {
            resolve(packageData);
        }).catch((err) => {
            reject("returned 0 results");
        });
    });
} 

module.exports.listMealPackage = function() {
    return new Promise (function (resolve, reject) {
        Package.find().lean().then((packageData) => {
            resolve(packageData);
        }).catch((err) => {
            reject("returned 0 results");
        });
    });
} 

module.exports.findName = function(name) {
    return new Promise (function (resolve, reject) {
        Package.find({title: name}).lean().then((packageData) => {
            resolve(packageData);
        }).catch((err) => {
            reject("returned 0 results");
        });
    });
} 