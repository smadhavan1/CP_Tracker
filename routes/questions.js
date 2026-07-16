import express from "express";
import { validateQuestion, isLoggedIn, isOwner } from "../expressMiddleware.js";
import * as questions from "../controllers/questions.js";

const router = express.Router();

router.get("/new", isLoggedIn, questions.newForm);

router
.get("/",(req,res)=>res.redirect("/questions/1"))
.get("/:page", isLoggedIn, questions.index)
.post("/", isLoggedIn, validateQuestion, questions.addQuestion);

router
.get("/:id", isLoggedIn, isOwner, questions.getQuestion)
.patch("/:id", isLoggedIn, isOwner, validateQuestion, questions.editQuestion)
.delete("/:id", isLoggedIn, isOwner, questions.deleteQuestion);

router.get("/:id/edit", isLoggedIn, isOwner, questions.editForm);

export default router;
