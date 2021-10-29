const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name']
    },
    email: {
        type: String,
        required: [true, 'Please mention your email ID'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email ID']
    },
    photo: String,
    role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'user'
    },
    password: {
        type: String,
        require: [true, 'Please provide a simple passwaord'],
        minlength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        //To validate confirmPassword and password
        validate: {
            //This works only on CREATE and SAVE
            validator: function (el) {
                return el === this.password;
            },
            message: 'Passwords are not the same'
        }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false
    }
});

/* ------------------------------- Middleware ------------------------------- */
//Hasing the Password before saving the data and receiving the data by use of pre hook middleware
// userSchema.pre('save', async function (next) {
//     //Only run this function if password was really modified
//     if (!this.isModified('password')) return next();

//     //12 represents cost(SALT value) the higher the value the better is the hashing string and the more CPU intensive it becomes
//     this.password = await bcrypt.hash(this.password, 12);

//     //To delete a field that not is required to store in DB
//     this.passwordConfirm = undefined;

//     next();
// });

// userSchema.pre('save', function(next) {
//     if(!this.isModified('password') || this.isNew) return next();

//     this.passwordChangedAt = Date.now() - 1000;
//     next();
// });

userSchema.pre('/^find/', function (next) {
    // this points to current query
    this.find({ active: { $ne: false } });
    next();
});

/* ------------------------- Global Instance Object ------------------------ */
//To compare the hashed password with the user password
userSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword
) {
    //candidatePassword: Coming from the user, userPassword: the hashed password stored in DB
    return await bcrypt.compare(candidatePassword, userPassword);
};

//To check if the user has changed the password after the token was issued
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10
        );

        return JWTTimestamp < changedTimestamp;
    }

    //False means that the password was not changed
    return false;
};

userSchema.methods.createPasswordResetToken = function () {
    //create a new reset token
    const resetToken = crypto.randomBytes(32).toString('hex');

    //hash that new reset token
    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    console.log({ resetToken }, this.passwordResetToken);

    //add the time in minutes and convert it into milliSeconds: * 60 * 1000
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    //return the plain resetToken(the uncrypted one) to send in the email
    return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
