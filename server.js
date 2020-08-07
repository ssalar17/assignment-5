const express = require('express'); 
const exphbs = require('express-handlebars'); 
const db = require('./model/dataDB');
const app = express(); 
const bodyParser = require('body-parser');

require('dotenv').config({path:"./config/keys.env"});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
app.engine('handlebars', exphbs()); 
app.set('view engine', 'handlebars'); 

app.get("/", (req,res)=>{

    res.render("home", {
        title: "Home Page", 
        topMeals: db.topMealsDB,
        hero: "Meals and grocery delivered."
    });
});
app.get("/AllPackages", (req,res)=>{

    res.render("page", {
        title: "All Packages",
        mealPackages: db.mealPackagesDB,
        hero: "Our meal packages"
    });
});

app.get("/login", (req,res)=>{
    res.render("login", {
        title: "Login",
        hero: "Meals and grocery delivered."
    })
})
app.get("/signup", (req,res)=>{
    res.render("signup", {
        title: "signup",
        hero: "Meals and grocery delivered."
    })
})
app.post("/login", (req,res)=>{
    const errors = [];
    if(req.body.Email==="")
    {
        errors.push("You must enter an email address");
    }
    if(req.body.Password==="")
    {
        errors.push("Please enter correct password");    
    }
    if(errors.length > 0)
    {
        res.render("login", {
            title: "Login",
            hero: "Meals and grocery delivered.",
            errorMessages: errors
        })
    }
    else 
    { 
        res.redirect("/");
    }
})
app.post("/signup", (req,res)=>{
    const errors = [];
    const regex = /^[a-zA-Z0-9]*$/;
    const regex2 = /^[a-zA-Z]*$/;
    const {firstName, lastName, Email, Password} = req.body;
    if(firstName==="")
    {
        errors.push("You must enter a first name");
    }
    if(lastName==="")
    {
        errors.push("you must enter a last name");
    }
    if(Email==="")
    {
        errors.push("You must enter an email address");
    }
    if(Password==="")
    {
        errors.push("Please input a password");
    }
    if(!regex.test(Password)) 
    {
        errors.push("Password may only contain letters and numbers");
    }
    if(!regex2.test(firstName))
    {
        errors.push("Please enter only letters for your first name"); 
    }
    if(!regex2.test(lastName))
    {
        errors.push("Please enter only letters for your last name"); 
    }
    if(errors.length > 0)
    {
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
    else
    {
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
        }
    })
    app.listen(3000, ()=>{
        console.log("Web Server is up and running");
    });
