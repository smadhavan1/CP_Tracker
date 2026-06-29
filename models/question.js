import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
	{
		questionID: {
			type: String,
			required: true
		},
		questionTitle: {
			type: String,
			required: true
		},
		questionLink: {
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
			type: [String]
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
