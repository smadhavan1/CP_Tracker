import express from "express";
import path from "node:path";
import ejsMate from "ejs-mate";
import Question from "./models/question.js";
import mongoose from "mongoose";

mongoose
	.connect("mongodb://127.0.0.1:27017/cp_tracker")
	.then(() => {
		console.log("Connected to DB.");
	})
	.catch((e) => {
		console.log(`Error: ${e}`);
	});

const __dirname = import.meta.dirname;

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use(express.urlencoded({ extended: true }));

app.listen(3000, () => {
	console.log("Listening on port 3000!");
});

app.get("/", (req, res) => {
	res.render("home");
});

app.get("/new", (req, res) => {
	res.render("new");
});

app.post("/questions", async (req, res) => {
	await Question.insertOne({ ...req.body });
	res.redirect("/");
});
