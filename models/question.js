import mongoose from "mongoose";
import difficultyLevels from "../constants/difficultyLevels.js";
import platforms from "../constants/platforms.js";
import statusOptions from "../constants/statusOptions.js";
import tagList from "../constants/tags.js";

const questionSchema = new mongoose.Schema(
	{
		ID: {
			type: String,
			required: true
		},
		title: {
			type: String,
			required: true
		},
		link: {
			type: String,
			required: true
		},
		difficulty: {
			type: String,
			enum: difficultyLevels,
			required: true
		},
		platform: {
			type: String,
			enum: platforms,
			required: true
		},
		status: {
			type: String,
			enum: statusOptions,
			required: true
		},
		tags: {
			type: [String],
			enum: tagList
		},
		solvedDate: {
			type: Date
		},
		timeTaken: {
			type: Number
		},
		notes: {
			type: String
		},
		favourite: {
			type: Boolean,
			default: false
		},
		solutionLink: {
			type: String
		},
		lastRevisionDate: {
			type: Date
		},
		nextRevisionDate: {
			type: Date
		},
		revisionCount: {
			type: Number,
			default: 0,
			min: 0
		},
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		}
	},
	{ timestamps: true }
);

const Question = mongoose.model("Question", questionSchema);
export default Question;
