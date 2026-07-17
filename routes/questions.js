import express from "express";
import { validateQuestion, isLoggedIn, isOwner } from "../expressMiddleware.js";
import * as questions from "../controllers/questions.js";

const router = express.Router();

router.get("/:last/new", isLoggedIn, questions.newForm);

router
.get("/",(req,res)=>res.redirect("/questions/1"))
.get("/:page", isLoggedIn, questions.index)
.post("/:last", isLoggedIn, validateQuestion, questions.addQuestion);

router
.get("/:page/:id", isLoggedIn, isOwner, questions.getQuestion)
.patch("/:page/:id", isLoggedIn, isOwner, validateQuestion, questions.editQuestion)
.delete("/:page/:id", isLoggedIn, isOwner, questions.deleteQuestion);

router.get("/:page/:id/edit", isLoggedIn, isOwner, questions.editForm);

export default router;
