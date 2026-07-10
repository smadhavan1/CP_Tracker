import express from "express";
import passport from "passport";

import * as users from "../controllers/users.js";
import { isLoggedIn, storeReturnTo } from "../middleware.js";

const router = express.Router();

router
.get("/register", users.registerForm)
.post("/register", users.register);

router
.get("/login", users.loginForm)
.post("/login", storeReturnTo, passport.authenticate("local", { failureMessage: "Invalid username or password!", failureRedirect: "/login" }), users.login);

router.get("/logout", users.logout);

router.get("/dashboard", isLoggedIn, users.dashboard);

export default router;
