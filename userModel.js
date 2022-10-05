const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: "Name is mandatory",
    },
    email: {
        type: String,
        required: "Email is mandatory",
    },
    password: {
        type: String,
        required: "Password is mandatory",
    },
});

// userSchema.pre("save", function (next) {
//     const salt = bcrypt.genSaltSync(10);
//     this.password = bcrypt.hashSync(this.password, salt);
//     next();
// });

module.exports = mongoose.model("User", userSchema);