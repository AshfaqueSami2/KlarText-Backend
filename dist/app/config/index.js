"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const nodeEnv = process.env.NODE_ENV || 'development';
const envFile = nodeEnv === 'production' ? '.env.production' : '.env.development';
dotenv_1.default.config({ path: path_1.default.join(process.cwd(), envFile) });
exports.default = {
    port: process.env.PORT,
    database_url: process.env.DATABASE_URL,
    bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
    default_pass: process.env.DEFAULT_PASS,
    jwt: {
        secret: process.env.JWT_SECRET,
        refresh_secret: process.env.JWT_REFRESH_SECRET,
        expires_in: process.env.JWT_EXPIRES_IN,
        refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
    },
    env: process.env.ENV,
    cloudinary: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    },
    google: {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        callback_url: process.env.GOOGLE_CALLBACK_URL,
    },
    client_url: process.env.CLIENT_URL || 'https://kalrtext.vercel.app',
    backend_url: process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`,
    gemini: {
        api_key: process.env.GEMINI_API_KEY,
    },
    azure: {
        speech: {
            key: process.env.AZURE_SPEECH_KEY,
            region: process.env.AZURE_SPEECH_REGION,
            voiceName: process.env.AZURE_SPEECH_VOICE,
        },
        blob: {
            connectionString: process.env.AZURE_BLOB_CONNECTION_STRING,
            container: process.env.AZURE_BLOB_CONTAINER,
        },
        translator: {
            key: process.env.AZURE_TRANSLATOR_KEY,
            endpoint: process.env.AZURE_TRANSLATOR_ENDPOINT,
            region: process.env.AZURE_TRANSLATOR_REGION,
        },
    },
    sslcommerz: {
        store_id: process.env.SSLCOMMERZ_STORE_ID,
        store_passwd: process.env.SSLCOMMERZ_STORE_PASSWD,
        is_live: process.env.SSLCOMMERZ_IS_LIVE === 'true',
    },
};
//# sourceMappingURL=index.js.map