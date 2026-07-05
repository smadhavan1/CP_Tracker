import express from "express";
import { validateQuestion, isLoggedIn, isOwner } from "../middleware.js";
import * as questions from "../controllers/questions.js";

const router = express.Router();

router.get("/new", isLoggedIn, questions.newForm);

router
.get("/", isLoggedIn, questions.index)
.post("/", isLoggedIn, validateQuestion, questions.addQuestion);

router
.get("/:id", isLoggedIn, isOwner, questions.getQuestion)
.patch("/:id", isLoggedIn, isOwner, validateQuestion, questions.editQuestion)
.delete("/:id", isLoggedIn, isOwner, questions.deleteQuestion);

router.get("/:id/edit", isLoggedIn, isOwner, questions.editForm);

export default router;
