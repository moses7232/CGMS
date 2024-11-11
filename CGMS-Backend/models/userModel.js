// userModel.js

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin', 'Department'], default: 'user' },
    verified: { type: Boolean, default: false },
    verificationCode: { type: String }, // Temporary field for storing the verification code
    codeExpiry: { type: Date }, // Field to store code expiry timestamp
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
