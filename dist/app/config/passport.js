"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const index_1 = __importDefault(require("./index"));
const user_model_1 = require("../modules/user/user.model");
const user_service_1 = require("../modules/user/user.service");
const logger_1 = __importDefault(require("../utils/logger"));
logger_1.default.info('🔧 Google OAuth Config:', {
    clientID: index_1.default.google?.client_id ? '✅ Present' : '❌ Missing',
    clientSecret: index_1.default.google?.client_secret ? '✅ Present' : '❌ Missing',
    callbackURL: index_1.default.google?.callback_url ? '✅ Present' : '❌ Missing'
});
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: index_1.default.google.client_id,
    clientSecret: index_1.default.google.client_secret,
    callbackURL: index_1.default.google.callback_url,
}, async (accessToken, refreshToken, profile, done) => {
    try {
        logger_1.default.debug('🔍 Google Profile:', { name: profile.displayName, email: profile.emails?.[0]?.value });
        let existingUser = await user_model_1.User.findOne({
            googleId: profile.id
        }).populate('student');
        if (existingUser) {
            logger_1.default.info('✅ Existing Google user found:', { email: existingUser.email });
            return done(null, existingUser);
        }
        const email = profile.emails?.[0]?.value;
        if (email) {
            existingUser = await user_model_1.User.findOne({
                email: email
            }).populate('student');
        }
        if (existingUser) {
            logger_1.default.info('🔗 Linking existing email account with Google', { email: existingUser.email });
            existingUser.googleId = profile.id;
            const profilePhoto = profile.photos?.[0]?.value;
            if (profilePhoto) {
                existingUser.profileImage = profilePhoto;
            }
            await existingUser.save();
            const linkedUser = await user_model_1.User.findById(existingUser._id).populate('student');
            return done(null, linkedUser);
        }
        logger_1.default.info('🆕 Creating new student from Google profile', { email: profile.emails?.[0]?.value });
        const googleUserPayload = {
            name: profile.displayName || '',
            email: profile.emails?.[0]?.value || '',
            profileImage: profile.photos?.[0]?.value || '',
        };
        const newUser = await createGoogleStudent(googleUserPayload, profile.id);
        if (newUser) {
            logger_1.default.info('✅ New Google student created', { userId: newUser.id });
            return done(null, newUser);
        }
        else {
            return done(new Error('Failed to create Google user'), undefined);
        }
    }
    catch (error) {
        logger_1.default.error('❌ Google OAuth Error:', { error });
        return done(error, undefined);
    }
}));
const createGoogleStudent = async (payload, googleId) => {
    const userData = {
        ...payload,
        password: undefined,
        googleId: googleId,
        needsPasswordChange: false,
    };
    const createdStudent = await user_service_1.UserServices.createStudentIntoDB(userData);
    const userWithStudent = await user_model_1.User.findOne({ _id: createdStudent.user }).populate('student');
    return userWithStudent;
};
passport_1.default.serializeUser((user, done) => {
    done(null, user._id);
});
passport_1.default.deserializeUser(async (id, done) => {
    try {
        const user = await user_model_1.User.findById(id).populate('student');
        if (!user) {
            return done(null, false);
        }
        done(null, user);
    }
    catch (error) {
        done(error, null);
    }
});
exports.default = passport_1.default;
//# sourceMappingURL=passport.js.map