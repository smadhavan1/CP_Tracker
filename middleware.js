import toastCookieConfig from "./config/toastCookie.js";

const isLoggedIn = (req, res, next) => {
	if (!req.isAuthenticated()) {
		req.session.returnTo = req.originalUrl;
		res.cookie("ToastMessage", "You must be signed in first!", toastCookieConfig);
		res.cookie("ToastType", "error", toastCookieConfig);
		return res.redirect("/login");
	}
	next();
};

export { isLoggedIn };
