import Joi from "joi";
import difficultyLevels from "./constants/difficultyLevels.js";
import platforms from "./constants/platforms.js";
import statusOptions from "./constants/statusOptions.js";
import tagList from "./constants/tags.js";

const currentTime = new Date(Date.now());
currentTime.setHours(0, 0, 0);

const questionSchemaJoi = Joi.object({
	question: Joi.object({
		ID: Joi.string().required(),
		title: Joi.string().required(),
		link: Joi.string().uri().required(),
		difficulty: Joi.string()
			.valid(...difficultyLevels)
			.required(),
		platform: Joi.string()
			.valid(...platforms)
			.required(),
		status: Joi.string()
			.valid(...statusOptions)
			.required(),
		tags: Joi.array().items(Joi.string().valid(...tagList)),
		solvedDate: Joi.date().max(currentTime).allow("").optional(),
		timeTaken: Joi.number().integer().min(0).allow("").optional(),
		notes: Joi.string().allow("").optional(),
		favourite: Joi.boolean(),
		solutionLink: Joi.string().uri().allow("").optional(),
		lastRevisionDate: Joi.date().max(currentTime).allow("").optional(),
		nextRevisionDate: Joi.date().min(currentTime).allow("").optional(),
		revisionCount: Joi.number().integer().min(0)
	}).required()
});

export { questionSchemaJoi };
