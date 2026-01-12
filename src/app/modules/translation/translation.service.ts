// modules/translation/translation.service.ts
import config from '../../config'; 
import { TranslationCache } from './translationCache.model';
import axios from 'axios';
import { randomUUID } from 'crypto';
import logger from '../../utils/logger';

const translateText = async (text: string) => {
  try {
    const lowerText = text.toLowerCase().trim();

    // 1. CHECK DATABASE FIRST
    const cached = await TranslationCache.findOne({ german: lowerText });
    if (cached) {
      logger.debug('Translation cache hit', { text: lowerText });
      return cached.english;
    }

    // 2. PREPARE AZURE TRANSLATOR REQUEST
    logger.debug('Fetching translation from Azure', { text });

    const { key, endpoint, region } = config.azure.translator;
    
    if (!key || !endpoint) {
      throw new Error('Azure Translator configuration missing');
    }

    // Build the request URL
    const translateUrl = `${endpoint}/translate?api-version=3.0&from=de&to=en`;

    // Prepare the request body
    const requestBody = [
      {
        text: text
      }
    ];

    // 3. CALL AZURE TRANSLATOR API
    const response = await axios.post(translateUrl, requestBody, {
      headers: {
        'Ocp-Apim-Subscription-Key': key,
        'Ocp-Apim-Subscription-Region': region,
        'Content-Type': 'application/json',
        'X-ClientTraceId': randomUUID()
      }
    });

    // 4. VALIDATE RESPONSE
    if (!response.data || !Array.isArray(response.data) || response.data.length === 0) {
      logger.error('Azure Translator Unexpected Response', { response: response.data });
      throw new Error('No translation returned from Azure Translator API');
    }

    const translationResult = response.data[0];
    
    if (!translationResult.translations || translationResult.translations.length === 0) {
      throw new Error('No translations found in Azure response');
    }

    const translatedText = translationResult.translations[0].text;

    // 5. SAVE TO DATABASE
    await TranslationCache.create({
      german: lowerText,
      english: translatedText
    });

    logger.debug('Translation completed', { from: text, to: translatedText });
    return translatedText;

  } catch (error) {
    logger.error('Translation Service Error', { error, text });
    // Return original text as fallback
    return text;
  }
};

export const TranslationServices = {
  translateText,
};