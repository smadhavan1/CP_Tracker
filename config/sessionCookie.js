import MongoStore from "connect-mongo";

const store = MongoStore.create({
	mongoUrl: process.env.DB_URL,
	touchAfter: 24 * 60 * 60,
	crypto: {
		secret: process.env.STORE_SECRET
	}
});

store.on("error", (e) => {
	console.log("Session Store Error!", e);
});

const sessionCookieConfig = {
	store,
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
