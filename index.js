import express from "express";
import path from "node:path";
import ejsMate from "ejs-mate";
import Question from "./models/question.js";
import mongoose from "mongoose";
import methodOverride from "method-override";
import session from "express-session";
import Toastify from "toastify-js";
import cookieParser from "cookie-parser";

import tagList from "./constants/tags.js";
import difficultyLevels from "./constants/difficultyLevels.js";
import platforms from "./constants/platforms.js";
import statusOptions from "./constants/statusOptions.js";
import AppError from "./helpers/AppError.js";
import validateQuestion from "./validators/question.js";

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
app.use(cookieParser());

const config = {
	name: "CPTrackerSessionID",
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: false,
	cookie: {
		httpOnly: true,
		maxAge: 1000 * 60 * 60 * 24 * 7
	}
};
app.use(session(config));

app.listen(3000, () => {
	console.log("Listening on port 3000!");
});

app.use((req, res, next) => {
	const ToastMessage = req.cookies?.ToastMessage || null;
	const ToastType = req.cookies?.ToastType || null;

	res.locals.ToastMessage = ToastMessage;
	res.locals.ToastType = ToastType;

	if (ToastMessage && ToastType) {
		res.clearCookie("ToastMessage");
		res.clearCookie("ToastType");
	}

	next();
});

const toastCookieConfig = { maxAge: 10000, httpOnly: true };

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

app.post("/questions", validateQuestion, async (req, res) => {
	let question = req.body.question;
	if (question.favourite === "on") question.favourite = true;
	else question.favourite = false;

	if (question.status !== "Solved") question.solvedDate = "";

	await Question.insertOne({ ...question });
	res.cookie("ToastMessage", "Successfully added the question!", toastCookieConfig);
	res.cookie("ToastType", "success", toastCookieConfig);
	res.redirect("/questions");
});

app.get("/questions/:id", async (req, res) => {
	const { id } = req.params;
	const question = await Question.findById(id).lean();
	if (!question) {
		res.cookie("ToastMessage", "Cannot find the question!", toastCookieConfig);
		res.cookie("ToastType", "error", toastCookieConfig);
		return res.redirect("/questions");
	}
	res.render("questions/details", { ...question });
});

app.get("/questions/:id/edit", async (req, res) => {
	const { id } = req.params;
	const question = await Question.findById(id).lean();

	if (!question) {
		res.cookie("ToastMessage", "Cannot find the question!", toastCookieConfig);
		res.cookie("ToastType", "error", toastCookieConfig);
		return res.redirect("/questions");
	}

	question.solvedDate = question.solvedDate ? question.solvedDate.toISOString().split("T")[0] : null;
	question.lastRevisionDate = question.lastRevisionDate ? question.lastRevisionDate.toISOString().split("T")[0] : null;
	question.nextRevisionDate = question.nextRevisionDate ? question.nextRevisionDate.toISOString().split("T")[0] : null;

	res.render("questions/edit", { ...question, difficultyLevels, platforms, statusOptions, tagList });
});

app.patch("/questions/:id", validateQuestion, async (req, res) => {
	const { id } = req.params;
	let question = req.body.question;
	if (question.favourite === "on") question.favourite = true;
	else question.favourite = false;

	if (question.status !== "Solved") question.solvedDate = "";
	question.tags = question.tags || [];

	await Question.findByIdAndUpdate(id, { ...question }, { runValidators: true });
	res.cookie("ToastMessage", "Successfully updated the question!", toastCookieConfig);
	res.cookie("ToastType", "success", toastCookieConfig);
	res.redirect(`/questions/${id}`);
});

app.delete("/questions/:id", async (req, res) => {
	const { id } = req.params;
	const question = await Question.findByIdAndDelete(id);
	res.cookie("ToastMessage", "Successfully deleted the question!", toastCookieConfig);
	res.cookie("ToastType", "success", toastCookieConfig);
	res.redirect("/questions");
});

app.all("/{*path}", (req, res, next) => {
	next(new AppError("Page not found.", 404));
});

app.use((err, req, res, next) => {
	const { statusCode = 500 } = err;
	if (!err.message) err.message = "An error occurred.";
	res.status(statusCode).render("error", { err });
});
