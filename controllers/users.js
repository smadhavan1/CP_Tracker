import User from "../models/user.js";
import setToastAndRedirect from "../helpers/setToast.js";

import difficultyLevels from "../constants/difficultyLevels.js";
import Question from "../models/question.js";

const registerForm = (req, res) => {
	if (req.isAuthenticated()) {
		return setToastAndRedirect(res, "You are already logged in!", "info", "/dashboard");
	}
	res.render("users/register");
};

const register = async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = new User({ email });
		const registeredUser = await User.register(user, password);
		req.login(registeredUser, (error) => {
			if (error) return next(error);
			setToastAndRedirect(res, "Welcome to CP Tracker!", "success", "/dashboard");
		});
	} catch (error) {
		setToastAndRedirect(res, `${error.message}`, "error", "/register");
	}
};

const loginForm = (req, res, next) => {
	if (req.isAuthenticated()) {
		return setToastAndRedirect(res, "You are already logged in!", "info", "/dashboard");
	}
	if (req.session?.messages) {
		const messages = req.session.messages.map((message) => message).join(",");
		req.session.messages = null;
		return setToastAndRedirect(res, `${messages}`, "error", "/login");
	}
	res.render("users/login");
};

const login = (req, res) => {
	const redirectURL = res.locals.returnTo || "/dashboard";
	delete req.session.returnTo;
	setToastAndRedirect(res, "Welcome back!", "success", redirectURL);
};

const logout = (req, res) => {
	if (!req.isAuthenticated()) {
		return setToastAndRedirect(res, "You are not logged in!", "info", "/login");
	}
	req.logout(function (error) {
		if (error) return next(error);
		setToastAndRedirect(res, "Goodbye!", "success", "/login");
	});
};

const dashboard = async (req, res) => {
	const difficultyPipeline = [{ $match: { owner: req.user._id } }, { $group: { _id: "$difficulty", count: { $count: {} } } }, { $addFields: { __order: { $indexOfArray: [difficultyLevels, "$_id"] } } }, { $sort: { __order: 1 } }];
	const difficultyCounts = await Question.aggregate(difficultyPipeline);
	const difficultyData = {
		labels: difficultyCounts.map((difficultyCount) => {
			return difficultyCount._id;
		}),
		datasets: [
			{
				data: difficultyCounts.map((difficultyCount) => {
					return difficultyCount.count;
				}),
				backgroundColor: ["rgb(99, 255, 125)", "rgb(235, 193, 54)", "rgb(255, 86, 142)"],
				hoverOffset: 4
			}
		]
	};
	const difficultyConfig = {
		type: "doughnut",
		data: difficultyData
	};
	res.render("users/dashboard", { difficultyConfig });
};

export { registerForm, register, loginForm, login, logout, dashboard };
