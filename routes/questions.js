import express from "express";

import Question from "../models/question.js";
import tagList from "../constants/tags.js";
import difficultyLevels from "../constants/difficultyLevels.js";
import platforms from "../constants/platforms.js";
import statusOptions from "../constants/statusOptions.js";
import setToastAndRedirect from "../helpers/setToast.js";

import { validateQuestion, isLoggedIn, isOwner } from "../middleware.js";

const router = express.Router({ mergeParams: true });

router.get("/new", isLoggedIn, (req, res) => {
	res.render("questions/new", { difficultyLevels, platforms, statusOptions, tagList });
});

router.get("/", isLoggedIn, async (req, res) => {
	const questions = await Question.find({ owner: req.user?._id });
	res.render("questions/index", { questions });
});

router.post("/", isLoggedIn, validateQuestion, async (req, res) => {
	let question = req.body.question;
	question.owner = req.user;

	await Question.insertOne({ ...question });
	setToastAndRedirect(res, "Successfully added the question!", "success", "/questions");
});

router.get("/:id", isLoggedIn, isOwner, async (req, res) => {
	const { id } = req.params;
	const question = await Question.findById(id).lean();
	res.render("questions/details", { ...question });
});

router.get("/:id/edit", isLoggedIn, isOwner, async (req, res) => {
	const { id } = req.params;
	const question = await Question.findById(id).lean();

	question.solvedDate = question.solvedDate ? question.solvedDate.toISOString().split("T")[0] : null;
	question.lastRevisionDate = question.lastRevisionDate ? question.lastRevisionDate.toISOString().split("T")[0] : null;
	question.nextRevisionDate = question.nextRevisionDate ? question.nextRevisionDate.toISOString().split("T")[0] : null;

	res.render("questions/edit", { ...question, difficultyLevels, platforms, statusOptions, tagList });
});

router.patch("/:id", isLoggedIn, isOwner, validateQuestion, async (req, res) => {
	const { id } = req.params;
	let question = req.body.question;

	if (question.status !== "Solved") question.solvedDate = "";
	question.tags = question.tags || [];

	await Question.findByIdAndUpdate(id, { ...question }, { runValidators: true });
	setToastAndRedirect(res, "Successfully edited the question!", "success", `/questions/${id}`);
});

router.delete("/:id", isLoggedIn, isOwner, async (req, res) => {
	const { id } = req.params;
	const question = await Question.findByIdAndDelete(id);
	setToastAndRedirect(res, "Successfully deleted the question!", "success", "/questions");
});

export default router;
