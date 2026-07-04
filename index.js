import express from "express";
import path from "node:path";
import ejsMate from "ejs-mate";
import mongoose from "mongoose";
import methodOverride from "method-override";
import session from "express-session";
import cookieParser from "cookie-parser";
import passport from "passport";
import LocalStrategy from "passport-local";

import sessionCookieConfig from "./config/sessionCookie.js";
import AppError from "./helpers/AppError.js";
import User from "./models/user.js";
import questionRoutes from "./routes/questions.js";
import userRoutes from "./routes/users.js";

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

app.use("/questions", questionRoutes);
app.use("/", userRoutes);

app.get("/", (req, res) => {
	res.render("home");
});

app.all("/{*path}", (req, res, next) => {
	next(new AppError("Page not found.", 404));
});

app.use((err, req, res, next) => {
	const { statusCode = 500 } = err;
	if (!err.message) err.message = "An error occurred.";
	res.status(statusCode).render("error", { err });
});
