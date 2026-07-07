import Question from "../models/question.js";
import tagList from "../constants/tags.js";
import difficultyLevels from "../constants/difficultyLevels.js";
import platforms from "../constants/platforms.js";
import statusOptions from "../constants/statusOptions.js";
import setToastAndRedirect from "../helpers/setToast.js";

const newForm = (req, res) => {
	res.render("questions/new", { difficultyLevels, platforms, statusOptions, tagList });
};

const index = async (req, res) => {
<<<<<<< HEAD
	const questions = await Question.find({ owner: req.user?._id });
	res.render("questions/index", { questions });
=======
	const DBQuery = { owner: req.user?._id };
	const title = req.query.title;
	const difficulty = req.query.difficulty;
	const platform = req.query.platform;
	const status = req.query.status;
	const tags = req.query.tags;
	const DBQueryTags = tags ? (Array.isArray(tags) ? tags : [tags]) : [];

	if (title) DBQuery.title = new RegExp(title, "i");
	if (difficulty) DBQuery.difficulty = difficulty;
	if (platform) DBQuery.platform = platform;
	if (status) DBQuery.status = status;
	if (tags) DBQuery.tags = { $in: [...DBQueryTags] };

	const questions = await Question.find(DBQuery);
	const display = { ...DBQuery };
	display.title = req.query.title;
	display.tags = req.query.tags;
	res.render("questions/index", { questions, difficultyLevels, platforms, statusOptions, tagList, display });
>>>>>>> 478d5ae (Implement search and filter functionality)
};

const addQuestion = async (req, res) => {
	let question = req.body.question;
	question.owner = req.user;

	await Question.insertOne({ ...question });
	setToastAndRedirect(res, "Successfully added the question!", "success", "/questions");
};

const getQuestion = async (req, res) => {
	const { id } = req.params;
	const question = await Question.findById(id).lean();
	res.render("questions/details", { ...question });
};

const editForm = async (req, res) => {
	const { id } = req.params;
	const question = await Question.findById(id).lean();

	question.solvedDate = question.solvedDate ? question.solvedDate.toISOString().split("T")[0] : null;
	question.lastRevisionDate = question.lastRevisionDate ? question.lastRevisionDate.toISOString().split("T")[0] : null;
	question.nextRevisionDate = question.nextRevisionDate ? question.nextRevisionDate.toISOString().split("T")[0] : null;

	res.render("questions/edit", { ...question, difficultyLevels, platforms, statusOptions, tagList });
};

const editQuestion = async (req, res) => {
	const { id } = req.params;
	let question = req.body.question;

	if (question.status !== "Solved") question.solvedDate = "";
	question.tags = question.tags || [];

	await Question.findByIdAndUpdate(id, { ...question }, { runValidators: true });
	setToastAndRedirect(res, "Successfully edited the question!", "success", `/questions/${id}`);
};

const deleteQuestion = async (req, res) => {
	const { id } = req.params;
	const question = await Question.findByIdAndDelete(id);
	setToastAndRedirect(res, "Successfully deleted the question!", "success", "/questions");
};

export { newForm, index, addQuestion, getQuestion, editForm, editQuestion, deleteQuestion };
