import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import config from './index';
import { User } from '../modules/user/user.model';
import { UserServices } from '../modules/user/user.service';
import logger from '../utils/logger';

// Configure Google OAuth Strategy
logger.info('🔧 Google OAuth Config:', {
  clientID: config.google?.client_id ? '✅ Present' : '❌ Missing',
  clientSecret: config.google?.client_secret ? '✅ Present' : '❌ Missing', 
  callbackURL: config.google?.callback_url ? '✅ Present' : '❌ Missing'
});

passport.use(
  new GoogleStrategy(
    {
      clientID: config.google.client_id as string,
      clientSecret: config.google.client_secret as string,
      callbackURL: config.google.callback_url as string,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        logger.debug('🔍 Google Profile:', { name: profile.displayName, email: profile.emails?.[0]?.value });
        
        // Check if user already exists with this Google ID
        let existingUser = await User.findOne({ 
          googleId: profile.id 
        }).populate('student');

        if (existingUser) {
          logger.info('✅ Existing Google user found:', { email: existingUser.email });
          return done(null, existingUser as any);
        }

        // Check if user exists with same email (link accounts)
        const email = profile.emails?.[0]?.value;
        if (email) {
          existingUser = await User.findOne({ 
            email: email 
          }).populate('student');
        }

        if (existingUser) {
          logger.info('🔗 Linking existing email account with Google', { email: existingUser.email });
          
          // Link Google account to existing user
          existingUser.googleId = profile.id;
          const profilePhoto = profile.photos?.[0]?.value;
          if (profilePhoto) {
            existingUser.profileImage = profilePhoto;
          }
          await existingUser.save();
          
          // Re-populate after save
          const linkedUser = await User.findById(existingUser._id).populate('student');
          return done(null, linkedUser as any);
        }

        // Create new user with Google account using your existing logic
        logger.info('🆕 Creating new student from Google profile', { email: profile.emails?.[0]?.value });
        
        const googleUserPayload = {
          name: profile.displayName || '',
          email: profile.emails?.[0]?.value || '',
          profileImage: profile.photos?.[0]?.value || '',
          // No password needed for Google users
        };

        // Use your existing createStudentIntoDB service
        // But we need to modify it slightly to handle Google users
        const newUser = await createGoogleStudent(googleUserPayload, profile.id);
        
        if (newUser) {
          logger.info('✅ New Google student created', { userId: newUser.id });
          return done(null, newUser as any);
        } else {
          return done(new Error('Failed to create Google user'), undefined);
        }
        
      } catch (error) {
        logger.error('❌ Google OAuth Error:', { error });
        return done(error as Error, undefined);
      }
    }
  )
);

// Create Google student using your existing logic
const createGoogleStudent = async (payload: any, googleId: string) => {
  // Use your existing UserService but adapt for Google OAuth
  const userData = {
    ...payload,
    password: undefined, // No password for Google users
    googleId: googleId,
    needsPasswordChange: true, // Google users need to set a password
  };

  // Call your existing createStudentIntoDB with modification
  const createdStudent = await UserServices.createStudentIntoDB(userData);
  
  // Return the user with populated student data
  const userWithStudent = await User.findOne({ _id: createdStudent.user }).populate('student');
  return userWithStudent;
};

// Serialize user for session
passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

// Deserialize user from session
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id).populate('student');
    if (!user) {
      return done(null, false);
    }
    done(null, user as any);
  } catch (error) {
    done(error, null);
  }
});

export default passport;