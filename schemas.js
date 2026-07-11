import BaseJoi from "joi";
import sanitizeHtml from "sanitize-html";

import difficultyLevels from "./constants/difficultyLevels.js";
import platforms from "./constants/platforms.js";
import statusOptions from "./constants/statusOptions.js";
import tagList from "./constants/tags.js";

const extension = (joi) => ({
	type: "string",
	base: joi.string(),
	messages: {
		"string.escapeHTML": "{{#label}} must not include HTML!"
	},
	rules: {
		escapeHTML: {
			validate(value, helpers) {
				const clean = sanitizeHtml(value, {
					allowedTags: [],
					allowedAttributes: {}
				});
				if (clean !== value) return helpers.error("string.escapeHTML", { value });
				return clean;
			}
		}
	}
});

const Joi = BaseJoi.extend(extension);

const startOfDay = new Date(Date.now()).setHours(0, 0, 0);
const endOfDay = new Date(Date.now()).setHours(23, 59, 59);

const questionSchemaJoi = Joi.object({
	question: Joi.object({
		ID: Joi.string().required().escapeHTML(),
		title: Joi.string().required().escapeHTML(),
		link: Joi.string()
			.uri({
				scheme: ["http", "https"]
			})
			.required()
			.escapeHTML(),
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
		solvedDate: Joi.date().max(endOfDay).allow("").optional(),
		timeTaken: Joi.number().integer().min(0).allow("").optional(),
		notes: Joi.string().allow("").optional().escapeHTML(),
		favourite: Joi.boolean(),
		solutionLink: Joi.string()
			.uri({
				scheme: ["http", "https"]
			})
			.allow("")
			.optional()
			.escapeHTML(),
		lastRevisionDate: Joi.date().max(endOfDay).allow("").optional(),
		nextRevisionDate: Joi.date().min(startOfDay).allow("").optional(),
		revisionCount: Joi.number().integer().min(0)
	}).required()
});

export { questionSchemaJoi };
