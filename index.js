import express from "express";
import path from "node:path";
import ejsMate from "ejs-mate";
import mongoose from "mongoose";
import methodOverride from "method-override";
import session from "express-session";
import Toastify from "toastify-js";
import cookieParser from "cookie-parser";
import passport from "passport";
import LocalStrategy from "passport-local";

import tagList from "./constants/tags.js";
import difficultyLevels from "./constants/difficultyLevels.js";
import platforms from "./constants/platforms.js";
import statusOptions from "./constants/statusOptions.js";
import sessionCookieConfig from "./config/sessionCookie.js";
import toastCookieConfig from "./config/toastCookie.js";
import AppError from "./helpers/AppError.js";
import Question from "./models/question.js";
import User from "./models/user.js";

import { validateQuestion, isLoggedIn, isOwner } from "./middleware.js";

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
app.use(express.static(path.join(__dirname, "/public")));

app.use(session(sessionCookieConfig));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy({ usernameField: "email" }, User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.listen(3000, () => {
	console.log("Listening on port 3000!");
});

app.use((req, res, next) => {
	res.locals.currentUser = req.user;
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

app.get("/", (req, res) => {
	res.render("home");
});

app.get("/questions/new", isLoggedIn, (req, res) => {
	res.render("questions/new", { difficultyLevels, platforms, statusOptions, tagList });
});

app.get("/questions", isLoggedIn, async (req, res) => {
	const questions = await Question.find({ owner: req.user?._id });
	res.render("questions/index", { questions });
});

app.post("/questions", isLoggedIn, validateQuestion, async (req, res) => {
	let question = req.body.question;
	if (question.favourite === "on") question.favourite = true;
	else question.favourite = false;

	if (question.status !== "Solved") question.solvedDate = "";

	question.owner = req.user;

	await Question.insertOne({ ...question });
	res.cookie("ToastMessage", "Successfully added the question!", toastCookieConfig);
	res.cookie("ToastType", "success", toastCookieConfig);
	res.redirect("/questions");
});

app.get("/questions/:id", isLoggedIn, isOwner, async (req, res) => {
	const { id } = req.params;
	const question = await Question.findById(id).lean();
	if (!question) {
		res.cookie("ToastMessage", "Cannot find the question!", toastCookieConfig);
		res.cookie("ToastType", "error", toastCookieConfig);
		return res.redirect("/questions");
	}
	res.render("questions/details", { ...question });
});

app.get("/questions/:id/edit", isLoggedIn, isOwner, async (req, res) => {
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

app.patch("/questions/:id", isLoggedIn, isOwner, validateQuestion, async (req, res) => {
	const { id } = req.params;
	let question = req.body.question;
	if (question.favourite === "on") question.favourite = true;
	else question.favourite = false;

	if (question.status !== "Solved") question.solvedDate = "";
	question.tags = question.tags || [];

	await Question.findByIdAndUpdate(id, { ...question }, { runValidators: true });
	res.cookie("ToastMessage", "Successfully edited the question!", toastCookieConfig);
	res.cookie("ToastType", "success", toastCookieConfig);
	res.redirect(`/questions/${id}`);
});

app.delete("/questions/:id", isLoggedIn, isOwner, async (req, res) => {
	const { id } = req.params;
	const question = await Question.findByIdAndDelete(id);
	res.cookie("ToastMessage", "Successfully deleted the question!", toastCookieConfig);
	res.cookie("ToastType", "success", toastCookieConfig);
	res.redirect("/questions");
});

app.get("/register", (req, res) => {
	if (req.isAuthenticated()) {
		res.cookie("ToastMessage", "You are already logged in!", toastCookieConfig);
		res.cookie("ToastType", "info", toastCookieConfig);
		return res.redirect("/");
	}
	res.render("users/register");
});

app.post("/register", async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = new User({ email });
		const registeredUser = await User.register(user, password);
		req.login(registeredUser, (error) => {
			if (error) return next(error);
			res.cookie("ToastMessage", "Welcome to CP Tracker!", toastCookieConfig);
			res.cookie("ToastType", "success", toastCookieConfig);
			res.redirect("/questions");
		});
	} catch (error) {
		res.cookie("ToastMessage", `${error.message}`, toastCookieConfig);
		res.cookie("ToastType", "error", toastCookieConfig);
		res.redirect("register");
	}
});

app.get("/login", (req, res, next) => {
	if (req.isAuthenticated()) {
		res.cookie("ToastMessage", "You are already logged in!", toastCookieConfig);
		res.cookie("ToastType", "info", toastCookieConfig);
		return res.redirect("/");
	}
	if (req.session?.messages) {
		const messages = req.session.messages.map((message) => message).join(",");
		res.cookie("ToastMessage", `${messages}`, toastCookieConfig);
		res.cookie("ToastType", "failure", toastCookieConfig);
		req.session.messages = null;
		return res.redirect("/login");
	}
	res.render("users/login");
});

app.post("/login", passport.authenticate("local", { failureMessage: "Invalid username or password!", failureRedirect: "/login" }), (req, res) => {
	const redirectURL = req.session.returnTo || "/";
	delete req.session.returnTo;
	res.cookie("ToastMessage", "Welcome back!", toastCookieConfig);
	res.cookie("ToastType", "success", toastCookieConfig);
	res.redirect(redirectURL);
});

app.get("/logout", (req, res) => {
	if (!req.isAuthenticated()) {
		res.cookie("ToastMessage", "You are not logged in!", toastCookieConfig);
		res.cookie("ToastType", "info", toastCookieConfig);
		return res.redirect("/login");
	}
	req.logout(function (error) {
		if (error) return next(error);
		res.cookie("ToastMessage", "Goodbye!", toastCookieConfig);
		res.cookie("ToastType", "success", toastCookieConfig);
		res.redirect("/login");
	});
});

app.all("/{*path}", (req, res, next) => {
	next(new AppError("Page not found.", 404));
});

app.use((err, req, res, next) => {
	const { statusCode = 500 } = err;
	if (!err.message) err.message = "An error occurred.";
	res.status(statusCode).render("error", { err });
});
