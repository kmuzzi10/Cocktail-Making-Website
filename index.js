import express from "express";
import axios from "axios";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");


app.get("/", (req, res) => {
    res.render("index.ejs", { cocktail: "" });
});

app.post("/get-cocktail", async (req, res) => {
    try {
        const result = await axios.get("https://www.thecocktaildb.com/api/json/v1/1/random.php?key=1");
        const randomCocktail = result.data.drinks[0];

        res.render("index.ejs", { cocktail: randomCocktail });
    } catch (err) {
        res.render("index.ejs", { cocktail: null });
    }
});

app.listen(port, () => {
    console.log(`server started at port ${port}`);
});
