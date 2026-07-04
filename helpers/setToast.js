import toastCookieConfig from "../config/toastCookie.js";

export default function setToastAndRedirect(res, text, type, redirect) {
	res.cookie("ToastMessage", `${text}`, toastCookieConfig);
	res.cookie("ToastType", `${type}`, toastCookieConfig);
	res.redirect(redirect);
}
