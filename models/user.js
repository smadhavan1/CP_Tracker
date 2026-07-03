import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const userSchema = new mongoose.Schema({});

userSchema.plugin(passportLocalMongoose.default, { usernameField: "email" });

const User = mongoose.model("User", userSchema);

export default User;
