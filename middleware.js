import { questionSchemaJoi } from "./schemas.js";
import AppError from "./helpers/AppError.js";
import toastCookieConfig from "./config/toastCookie.js";
import Question from "./models/question.js";

const validateQuestion = (req, res, next) => {
	const { error } = questionSchemaJoi.validate(req.body);
	if (!req.body) {
		throw new AppError("Request is empty.", 400);
	} else if (error) {
		const messages = error.details.map((err) => err.message).join(",");
		throw new AppError(messages, 400);
	} else {
		next();
	}
};

const isLoggedIn = (req, res, next) => {
	if (!req.isAuthenticated()) {
		req.session.returnTo = req.originalUrl;
		res.cookie("ToastMessage", "You must be signed in first!", toastCookieConfig);
		res.cookie("ToastType", "error", toastCookieConfig);
		return res.redirect("/login");
	}
	next();
};

const isOwner = async (req, res, next) => {
	const { id } = req.params;
	const question = await Question.findById(id);

	if (!question.owner.equals(req.user._id)) {
		res.cookie("ToastMessage", "You are not allowed to do that!", toastCookieConfig);
		res.cookie("ToastType", "error", toastCookieConfig);
		return res.redirect("/");
	}
	next();
};

export { validateQuestion, isLoggedIn, isOwner };
