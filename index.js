import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");


app.get("/", (req, res) => {
    res.render("index.ejs", { randomCocktail: "", cocktailList: "" });
});
app.get("/index.ejs", (req, res) => {
    res.render("index.ejs", { randomCocktail: "", cocktailList: "" });
});
app.get("/contact.ejs", (req, res) => {
    res.render("contact.ejs");
});
app.post("/submit-contact", (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const comments = req.body.comments;

    
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: '', 
            pass: ''
        },
        port: 465, // or 465
        secure: true, // or true for port 465
    });
   

    
    const mailOptions = {
        from: '',
        to: email, 
        subject: 'Thank You for Contacting Us',
        text: `Hi ${name},\n\nThank you for contacting us. We will get back to you soon.\n\nBest regards,\nMuzammil`
    };

    
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.render("contact-error.ejs", { error }); // Render error page
        } else {
            console.log('Email sent: ' + info.response);
            res.render("contact-success.ejs", { name });
        }
    });
   

    res.render("contact-success.ejs", { name });
});

app.post("/get-cocktail", async (req, res) => {
    try {
        const result = await axios.get("https://www.thecocktaildb.com/api/json/v1/1/random.php?key=1");
        const randomCocktail = result.data.drinks[0];

        res.render("index.ejs", { randomCocktail: randomCocktail, cocktailList: "" });
    } catch (err) {
        res.render("index.ejs", { randomCocktail: null });
    }
});

app.post("/get-cocktail-by-name", async (req, res) => {
    try {
        const type = req.body.type;
        const result = await axios.get(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${type}`);
        const cocktailList = result.data.drinks;
        res.render("index.ejs", { cocktailList: cocktailList, randomCocktail: "" });
    } catch (err) {
        res.render("index.ejs", { cocktailList: null });
    }
});




app.listen(port, () => {
    console.log(`server started at port ${port}`);
});
