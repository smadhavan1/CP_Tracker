import { questionSchemaJoi } from "./schemas.js";
import AppError from "./helpers/AppError.js";
import setToastAndRedirect from "./helpers/setToast.js";
import Question from "./models/question.js";

const validateQuestion = (req, res, next) => {
	if (req.body.question.favourite === "on") req.body.question.favourite = true;
	else req.body.question.favourite = false;

	if (req.body.question.status !== "Solved") req.body.question.solvedDate = "";

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
		return setToastAndRedirect(res, "You must be signed in first!", "error", "/login");
	}
	next();
};

const isOwner = async (req, res, next) => {
	const { id } = req.params;
	const question = await Question.findById(id);

	if (!question) {
		return setToastAndRedirect(res, "Cannot find the question!", "error", "/questions");
	}

	if (!question.owner.equals(req.user._id)) {
		return setToastAndRedirect(res, "You are not allowed to do that!", "error", "/");
	}
	next();
};

const storeReturnTo = (req, res, next) => {
	if (req.session.returnTo) {
		res.locals.returnTo = req.session.returnTo;
	}
	next();
};

export { validateQuestion, isLoggedIn, isOwner, storeReturnTo };
