import User from "../models/user.js";
import setToastAndRedirect from "../helpers/setToast.js";

import difficultyLevels from "../constants/difficultyLevels.js";
import Question from "../models/question.js";
import platforms from "../constants/platforms.js";
import tagList from "../constants/tags.js";
import statusOptions from "../constants/statusOptions.js";

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
	const owned = await Question.find({ owner: req.user._id });
	if (owned.length === 0) {
		return res.render("users/dashboard", { isEmpty: true });
	}
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
		data: difficultyData,
		options: { plugins: { legend: { labels: { boxWidth: 25 } } } }
	};

	const statusPipeline = [{ $match: { owner: req.user._id } }, { $group: { _id: "$status", count: { $count: {} } } }, { $addFields: { __order: { $indexOfArray: [statusOptions, "$_id"] } } }, { $sort: { __order: 1 } }];
	const statusCounts = await Question.aggregate(statusPipeline);
	const statusData = {
		labels: statusCounts.map((statusCount) => {
			return statusCount._id;
		}),
		datasets: [
			{
				data: statusCounts.map((statusCount) => {
					return statusCount.count;
				}),
				backgroundColor: ["rgb(99, 255, 125)", "rgb(235, 193, 54)", "rgb(255, 86, 142)"],
				hoverOffset: 4
			}
		]
	};
	const statusConfig = {
		type: "doughnut",
		data: statusData,
		options: { plugins: { legend: { labels: { boxWidth: 25 } } } }
	};

	const platformPipeline = [{ $match: { owner: req.user._id } }, { $group: { _id: "$platform", count: { $count: {} } } }, { $addFields: { __order: { $indexOfArray: [platforms, "$_id"] } } }, { $sort: { __order: 1 } }];
	const platformCounts = await Question.aggregate(platformPipeline);

	const platformData = {
		labels: platformCounts.map((platformCount) => {
			return platformCount._id;
		}),
		datasets: [
			{
				data: platformCounts.map((platformCount) => {
					return platformCount.count;
				}),
				backgroundColor: "rgba(54, 162, 235, 0.2)",
				borderColor: "rgb(54, 162, 235)",
				borderWidth: 1,
				categoryPercentage: 0.25,
				barPercentage: 0.75,
				hoverOffset: 4
			}
		]
	};
	const platformConfig = {
		type: "bar",
		data: platformData,
		options: {
			indexAxis: "x",
			plugins: { legend: { display: false } }
		}
	};

	const topicPipeline = [{ $match: { owner: req.user._id } }, { $unwind: "$tags" }, { $group: { _id: "$tags", count: { $count: {} } } }, { $sort: { count: -1 } }];
	const topicCounts = await Question.aggregate(topicPipeline);

	const topicData = {
		labels: topicCounts.map((topicCount) => {
			return topicCount._id;
		}),
		datasets: [
			{
				data: topicCounts.map((topicCount) => {
					return topicCount.count;
				}),
				backgroundColor: "rgba(75, 192, 192, 0.2)",
				borderColor: "rgb(75, 192, 192)",
				borderWidth: 1,
				hoverOffset: 4
			}
		]
	};
	const topicConfig = {
		type: "bar",
		data: topicData,
		options: {
			indexAxis: "y",
			plugins: { legend: { display: false } },
			scales: { x: { ticks: { precision: 0 } } }
		}
	};
	res.render("users/dashboard", { isEmpty: false, difficultyConfig, platformConfig, topicConfig, statusConfig });
};

export { registerForm, register, loginForm, login, logout, dashboard };
