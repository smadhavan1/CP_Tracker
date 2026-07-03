const sessionCookieConfig = {
	name: "CPTrackerSessionID",
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: false,
	cookie: {
		httpOnly: true,
		maxAge: 1000 * 60 * 60 * 24 * 7
	}
};

export default sessionCookieConfig;
