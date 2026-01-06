"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const config_1 = __importDefault(require("../../config"));
const logger_1 = __importDefault(require("../../utils/logger"));
const SSLCOMMERZ_SANDBOX_URL = 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php';
const SSLCOMMERZ_LIVE_URL = 'https://securepay.sslcommerz.com/gwprocess/v4/api.php';
const SSLCOMMERZ_VALIDATION_URL = 'https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php';
const SSLCOMMERZ_VALIDATION_LIVE_URL = 'https://securepay.sslcommerz.com/validator/api/validationserverAPI.php';
class SSLCommerzService {
    constructor() {
        this.isLive = config_1.default.sslcommerz?.is_live || false;
        this.storeId = config_1.default.sslcommerz?.store_id || '';
        this.storePassword = config_1.default.sslcommerz?.store_passwd || '';
    }
    async initPayment(paymentData) {
        try {
            const url = this.isLive ? SSLCOMMERZ_LIVE_URL : SSLCOMMERZ_SANDBOX_URL;
            const data = {
                store_id: this.storeId,
                store_passwd: this.storePassword,
                ...paymentData
            };
            logger_1.default.info('Initiating SSLCommerz payment', { tran_id: paymentData.tran_id, amount: paymentData.total_amount });
            const response = await axios_1.default.post(url, new URLSearchParams(data).toString(), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            if (response.data.status === 'SUCCESS') {
                logger_1.default.info('Payment initialization successful', { tran_id: paymentData.tran_id });
                return {
                    success: true,
                    gatewayUrl: response.data.GatewayPageURL,
                    sessionKey: response.data.sessionkey
                };
            }
            else {
                logger_1.default.error('Payment initialization failed', response.data);
                throw new Error(response.data.failedreason || 'Payment initialization failed');
            }
        }
        catch (error) {
            logger_1.default.error('SSLCommerz payment init error', error);
            throw new Error(error.message || 'Failed to initialize payment');
        }
    }
    async validatePayment(validationData) {
        try {
            const url = this.isLive ? SSLCOMMERZ_VALIDATION_LIVE_URL : SSLCOMMERZ_VALIDATION_URL;
            const data = {
                val_id: validationData.val_id,
                store_id: this.storeId,
                store_passwd: this.storePassword,
                format: 'json'
            };
            logger_1.default.info('Validating SSLCommerz payment', { val_id: validationData.val_id });
            const response = await axios_1.default.get(url, {
                params: data
            });
            if (response.data.status === 'VALID' || response.data.status === 'VALIDATED') {
                logger_1.default.info('Payment validation successful', { val_id: validationData.val_id });
                return {
                    success: true,
                    data: response.data
                };
            }
            else {
                logger_1.default.error('Payment validation failed', response.data);
                return {
                    success: false,
                    data: response.data
                };
            }
        }
        catch (error) {
            logger_1.default.error('SSLCommerz payment validation error', error);
            throw new Error(error.message || 'Failed to validate payment');
        }
    }
}
exports.default = new SSLCommerzService();
//# sourceMappingURL=payment.service.js.map