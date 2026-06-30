import mongoose from "mongoose";
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
			enum: ["Easy", "Medium", "Hard"],
			required: true
		},
		platform: {
			type: String,
			enum: ["Codeforces", "CodeChef", "LeetCode", "AtCoder", "HackerRank", "CSES", "Other"],
			required: true
		},
		status: {
			type: String,
			enum: ["Solved", "Attempted,", "Not Started"],
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
		}
	},
	{ timestamps: true }
);

const Question = mongoose.model("Question", questionSchema);
export default Question;
