import helmet from "helmet";

const connectSrcUrls = ["https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/", "https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/", "https://cdn.jsdelivr.net/npm/chart.umd.min.js.map", "https://cdn.jsdelivr.net/sm/cb4335d1b03e933ed85cb59fffa60cf51f07567ed09831438c60f59afd166464.map"];
const scriptSrcUrls = ["https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/", "https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/", "https://cdn.jsdelivr.net/npm/chart.js"];
const styleSrcUrls = ["https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/", "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/", "https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css"];
const fontSrcUrls = ["https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/"];

const ContentSecurityPolicy = helmet.contentSecurityPolicy({
	directives: {
		defaultSrc: ["'none'"],
		connectSrc: ["'self'", ...connectSrcUrls],
		scriptSrc: ["'self'", (req, res) => `'nonce-${res.locals.nonce}'`, ...scriptSrcUrls],
		styleSrc: ["'self'", ...styleSrcUrls],
		workerSrc: ["'none'"],
		objectSrc: ["'none'"],
		imgSrc: ["data:"],
		fontSrc: [...fontSrcUrls]
	}
});

export default ContentSecurityPolicy;
