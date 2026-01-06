"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TranslationServices = void 0;
const config_1 = __importDefault(require("../../config"));
const translationCache_model_1 = require("./translationCache.model");
const axios_1 = __importDefault(require("axios"));
const uuid_1 = require("uuid");
const logger_1 = __importDefault(require("../../utils/logger"));
const translateText = async (text) => {
    try {
        const lowerText = text.toLowerCase().trim();
        const cached = await translationCache_model_1.TranslationCache.findOne({ german: lowerText });
        if (cached) {
            logger_1.default.debug('Translation cache hit', { text: lowerText });
            return cached.english;
        }
        logger_1.default.debug('Fetching translation from Azure', { text });
        const { key, endpoint, region } = config_1.default.azure.translator;
        if (!key || !endpoint) {
            throw new Error('Azure Translator configuration missing');
        }
        const translateUrl = `${endpoint}/translate?api-version=3.0&from=de&to=en`;
        const requestBody = [
            {
                text: text
            }
        ];
        const response = await axios_1.default.post(translateUrl, requestBody, {
            headers: {
                'Ocp-Apim-Subscription-Key': key,
                'Ocp-Apim-Subscription-Region': region,
                'Content-Type': 'application/json',
                'X-ClientTraceId': (0, uuid_1.v4)()
            }
        });
        if (!response.data || !Array.isArray(response.data) || response.data.length === 0) {
            logger_1.default.error('Azure Translator Unexpected Response', { response: response.data });
            throw new Error('No translation returned from Azure Translator API');
        }
        const translationResult = response.data[0];
        if (!translationResult.translations || translationResult.translations.length === 0) {
            throw new Error('No translations found in Azure response');
        }
        const translatedText = translationResult.translations[0].text;
        await translationCache_model_1.TranslationCache.create({
            german: lowerText,
            english: translatedText
        });
        logger_1.default.debug('Translation completed', { from: text, to: translatedText });
        return translatedText;
    }
    catch (error) {
        logger_1.default.error('Translation Service Error', { error, text });
        return text;
    }
};
exports.TranslationServices = {
    translateText,
};
//# sourceMappingURL=translation.service.js.map