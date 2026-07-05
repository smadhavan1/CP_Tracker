import User from "../models/user.js";
import setToastAndRedirect from "../helpers/setToast.js";

const registerForm = (req, res) => {
	if (req.isAuthenticated()) {
		return setToastAndRedirect(res, "You are already logged in!", "info", "/");
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
			setToastAndRedirect(res, "Welcome to CP Tracker!", "success", "/questions");
		});
	} catch (error) {
		setToastAndRedirect(res, `${error.message}`, "error", "/register");
	}
};

const loginForm = (req, res, next) => {
	if (req.isAuthenticated()) {
		return setToastAndRedirect(res, "You are already logged in!", "info", "/");
	}
	if (req.session?.messages) {
		const messages = req.session.messages.map((message) => message).join(",");
		req.session.messages = null;
		return setToastAndRedirect(res, `${messages}`, "error", "/login");
	}
	res.render("users/login");
};

const login = (req, res) => {
	const redirectURL = req.session.returnTo || "/";
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

export { registerForm, register, loginForm, login, logout };
