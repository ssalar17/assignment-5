const express = require('express');
const exphbs = require('express-handlebars');
const db = require('./model/dataDB');
const app = express();
const bodyParser = require('body-parser');
const clientSessions = require("client-sessions"); //assign3
const dataServiceAuth = require("./model/dataAuthUsers.js"); //assign3
const data = require("./model/dataClerk.js");
const ds = require("./model/cart");
const cart = require("./model/cart.js");

require('dotenv').config({ path: "./config/keys.env" });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(clientSessions({ //assign3
    cookieName: "session",
    secret: "web322Assignment",
    duration: 2 * 60 * 1000,
    activeDuration: 1000 * 60
}));

app.use(clientSessions({ //assign3
    cookieName: "dataClerkSession",
    secret: "web322Assignment_dataclerk",
    duration: 2 * 60 * 1000,
    activeDuration: 1000 * 60
}));

app.use(function (req, res, next) { //assign3
    res.locals.session = req.session;
    next();
});

app.use(function (req, res, next) {
    res.locals.dataClerkSession = req.dataClerkSession;
    next();
})

function ensureLogin(req, res, next) { //assign3 
    if (!req.session.user) {
        res.redirect("/login");
    } else {
        next();
    }
}

function ensureDataClerkLogin(req, res, next) { //assign3 
    if (!req.dataClerkSession.user) {
        res.redirect("/login");
    } else {
        next();
    }
}

app.get("/", (req, res) => {
    data.topMealPackage().then((packageData) => {
        res.render("home", {
            title: "Home Page",
            topMeals: packageData,
            hero: "Meals and grocery delivered."
        });
    }).catch((err) => {
        res.status(500).send("Unable to find top packages: " + err);
    });

});

app.get("/AllPackages", (req, res) => {
    data.topMealPackage().then((packageData) => {
        res.render("page", {
            title: "All Packages",
            mealPackages: packageData,
            hero: "Our meal packages"
        });
    }).catch((err) => {
        res.status(500).send("Unable to find top packages: " + err);
    });


});

app.get("/login", (req, res) => {
    res.render("login", {
        title: "Login",
        hero: "Meals and grocery delivered."
    })
})

app.get("/signup", (req, res) => {
    res.render("signup", {
        title: "signup",
        hero: "Meals and grocery delivered."
    })
})

app.post("/login", (req, res) => {
    const errors = [];
    if (req.body.Email === "") {
        errors.push("You must enter an email address");
    }
    if (req.body.Password === "") {
        errors.push("Please enter correct password");
    }
    if (errors.length > 0) {
        res.render("login", {
            title: "Login",
            hero: "Meals and grocery delivered.",
            errorMessages: errors
        })
    }
    else {
        req.body.userAgent = req.get('User-Agent');
        dataServiceAuth.checkUser(req.body).then((user) => {
            if (!user.dataClerk) {
                req.session.user = {
                    Email: user.Email,
                    loginHistory: user.loginHistory,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    dataClerk: user.dataClerk
                }

                res.redirect('/userDashboard');
            }
            else {
                req.dataClerkSession.user = {
                    Email: user.Email,
                    loginHistory: user.loginHistory,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    dataClerk: user.dataClerk
                }
                res.redirect('/Dataclerk')
            }
        }).catch((err) => {
            res.render("login", { error: err, Email: req.body.Email, title: "Login", hero: "Meals and grocery delivered." });
        });
    }
});

app.get("/logout", (req, res) => {
    req.session.reset();
    req.dataClerkSession.reset();
    res.redirect('/');
})

app.post("/signup", (req, res) => {
    const errors = [];
    const regex = /^[a-zA-Z0-9]*$/;
    const regex2 = /^[a-zA-Z]*$/;
    const { firstName, lastName, Email, Password } = req.body;
    req.body.dataClerk = false;
    if (firstName === "") {
        errors.push("You must enter a first name");
    }
    if (lastName === "") {
        errors.push("you must enter a last name");
    }
    if (Email === "") {
        errors.push("You must enter an email address");
    }
    if (Password === "") {
        errors.push("Please input a password");
    }
    if (!regex.test(Password)) {
        errors.push("Password may only contain letters and numbers");
    }
    if (!regex2.test(firstName)) {
        errors.push("Please enter only letters for your first name");
    }
    if (!regex2.test(lastName)) {
        errors.push("Please enter only letters for your last name");
    }
    if (errors.length > 0) {
        res.render("signup", {
            title: "Sign up",
            hero: "Meals and grocery delivered.",
            errorMessages: errors,
            fNameVal: firstName,
            lNameVal: lastName,
            emailVal: Email,
            passVal: Password
        })
    }
    else {
        dataServiceAuth.registerUser(req.body).then(() => {

            const sgMail = require('@sendgrid/mail');
            sgMail.setApiKey(`${process.env.SENDGRID_API_KEY}`);
            const msg = {
                to: `${Email}`,
                from: 'saeed.e.salar@gmail.com',
                subject: 'Welcome to Speghettio!',
                html: `Hello ${firstName} ${lastName}, welcome to Speghettio!<br>Here you can mix and match between a variety of dishes.
        <br>Best regards<br>Chef Noodle`
            };
            sgMail.send(msg);
            res.redirect("/");
        })
    }
})

app.get("/userDashboard", ensureLogin, (req, res) => {
    res.render("userDashboard", { title: "Dashboard" })
});

app.get("/Dataclerk", ensureDataClerkLogin, (req, res) => {
    res.render("Dataclerk", { title: "Dashboard" })
});

app.get("/addPackages", (req, res) => { //assign4
    res.render("addPackages", {
        title: "Create Meal Packages",
        hero: "Meals and grocery delivered."
    })
});

app.get("/package/:title", (req, res) => {

    data.findName(req.params.title).then((packageData) => {
        res.render("package", {
            title: "Package Page",
            package: packageData[0]
        })
    })

});

app.post("/addPackage/:title", (req, res) => {
    ds.addPackage(req.params.title)
        .then((numPackages) => {
            res.render({ data: numPackages });
        }).catch(() => {
            res.render({ message: "error adding" });
        })
});

app.get("/cart", (req, res) => {
    var data = {
        cart: [],
        total: 0
    };
    cart.getCart().then((items) => {
        data.cart = items;
        cart.checkout().then((total) => {
            data.total = total;
            res.render("checkout", { data: data, layout: false });
        }).catch((err) => {
            res.send("There was an error getting total: " + err);
        });
    })
        .catch((err) => {
            res.send("There was an error: " + err);
        });
});

app.post("/removeItem", (req, res) => { 
    var data = {
        cart: [],
        total: 0
    };
    cart.removeItem(req.body.name).then(cart.checkout)
        .then((inTotal) => {
            data.total = inTotal;
            cart.getCart().then((items) => {
                data.cart = items;
                res.render({ data: data });
            }).catch((err) => {
                res.render({ error: err });
            });
        }).catch((err) => {
            res.render({ error: err });
        })
});

const PORT = process.env.PORT || 3000;

dataServiceAuth.initialize()
    .then(data.initialize())
    .then(function () {
        app.listen(PORT, function () {
            console.log("app listening on: " + PORT)
        });
    }).catch(function (err) {
        console.log("unable to start server: " + err);
    }); 