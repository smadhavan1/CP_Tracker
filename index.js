import express from "express";
import path from "node:path";
import ejsMate from "ejs-mate";
import Question from "./models/question.js";
import mongoose from "mongoose";
import methodOverride from "method-override";

import tagList from "./constants/tags.js";
import difficultyLevels from "./constants/difficultyLevels.js"
import platforms from "./constants/platforms.js"
import statusOptions from "./constants/statusOptions.js"

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

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));

app.listen(3000, () => {
	console.log("Listening on port 3000!");
});

app.get("/", (req, res) => {
	res.render("home");
});

app.get("/questions/new", (req, res) => {
	res.render("questions/new", { difficultyLevels, platforms, statusOptions, tagList });
});

app.get("/questions", async (req, res) => {
	const questions = await Question.find({});
	res.render("questions/index", { questions });
});

app.post("/questions", async (req, res) => {
	let question = req.body.question;
	if (question.favourite === "on") question.favourite = true;
	else question.favourite = false;

	if (question.status !== "Solved") question.solvedDate = "";

	if(!question.link.startsWith("https://"))
		question.link="https://"+question.link;
	if(question.solutionLink && !question.solutionLink.startsWith("https://"))
		question.solutionLink="https://"+question.solutionLink;

	await Question.insertOne({ ...question });
	res.redirect("/questions");
});

app.get("/questions/:id", async (req, res) => {
	const { id } = req.params;
	const question = await Question.findById(id).lean();
	res.render("questions/details", { ...question });
});

app.get("/questions/:id/edit", async (req, res) => {
	const { id } = req.params;
	const question = await Question.findById(id).lean();

	question.solvedDate = question.solvedDate ? question.solvedDate.toISOString().split("T")[0] : null;
	question.lastRevisionDate = question.lastRevisionDate ? question.lastRevisionDate.toISOString().split("T")[0] : null;
	question.nextRevisionDate = question.nextRevisionDate ? question.nextRevisionDate.toISOString().split("T")[0] : null;

	res.render("questions/edit", { ...question, difficultyLevels, platforms, statusOptions, tagList });
});

app.patch("/questions/:id", async (req, res) => {
	const { id } = req.params;
	let question = req.body.question;
	if (question.favourite === "on") question.favourite = true;
	else question.favourite = false;

	if(!question.link.startsWith("https://"))
		question.link="https://"+question.link;
	if(question.solutionLink && !question.solutionLink.startsWith("https://"))
		question.solutionLink="https://"+question.solutionLink;

	if (question.status !== "Solved") question.solvedDate = "";
	question.tags = question.tags || [];

	await Question.findByIdAndUpdate(id, { ...question });
	res.redirect(`/questions/${id}`);
});

app.delete("/questions/:id", async (req, res) => {
	const { id } = req.params;
	const question = await Question.findByIdAndDelete(id);
	res.redirect("/questions");
});
