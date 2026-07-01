import { questionSchemaJoi } from "../schemas.js";
import AppError from "../helpers/AppError.js";

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

export default validateQuestion;
