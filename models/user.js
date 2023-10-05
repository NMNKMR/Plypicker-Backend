const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    fName: {
        type: String,
        required: true
    },
    lName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true
    }
    //More fields like username, address, etc can be added.
})

//pre-hook to save user password after hashing using bcrypt hash method.
userSchema.pre('save', async function(next) {
    const user = this;
    const hashPassword = await bcrypt.hash(user.password, 10); //Salt Rounds = 10.

    user.password = hashPassword;
    next();
})

//Creating method for User Model to compare user entered password with database stored password using bcrypt compare method.
userSchema.methods.isValidPassword = async function(password){
    const user = this;
    const compare = await bcrypt.compare(password, user.password);

    return compare;
}

const User = new mongoose.model('User', userSchema);

module.exports = User;