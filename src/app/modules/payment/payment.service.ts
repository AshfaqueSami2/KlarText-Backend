import axios from 'axios';
import config from '../../config';
import { IPaymentInitData, IPaymentValidationData } from './payment.interface';
import logger from '../../utils/logger';

// SSLCommerz URLs
const SSLCOMMERZ_SANDBOX_URL = 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php';
const SSLCOMMERZ_LIVE_URL = 'https://securepay.sslcommerz.com/gwprocess/v4/api.php';
const SSLCOMMERZ_VALIDATION_URL = 'https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php';
const SSLCOMMERZ_VALIDATION_LIVE_URL = 'https://securepay.sslcommerz.com/validator/api/validationserverAPI.php';

class SSLCommerzService {
  private isLive: boolean;
  private storeId: string;
  private storePassword: string;

  constructor() {
    this.isLive = config.sslcommerz?.is_live || false;
    this.storeId = config.sslcommerz?.store_id || '';
    this.storePassword = config.sslcommerz?.store_passwd || '';
  }

  // Initialize payment
  async initPayment(paymentData: IPaymentInitData) {
    try {
      const url = this.isLive ? SSLCOMMERZ_LIVE_URL : SSLCOMMERZ_SANDBOX_URL;

      const data = {
        store_id: this.storeId,
        store_passwd: this.storePassword,
        ...paymentData
      };

      logger.info('Initiating SSLCommerz payment', { tran_id: paymentData.tran_id, amount: paymentData.total_amount });

      const response = await axios.post(url, new URLSearchParams(data as any).toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      if (response.data.status === 'SUCCESS') {
        logger.info('Payment initialization successful', { tran_id: paymentData.tran_id });
        return {
          success: true,
          gatewayUrl: response.data.GatewayPageURL,
          sessionKey: response.data.sessionkey
        };
      } else {
        logger.error('Payment initialization failed', response.data);
        throw new Error(response.data.failedreason || 'Payment initialization failed');
      }
    } catch (error: any) {
      logger.error('SSLCommerz payment init error', error);
      throw new Error(error.message || 'Failed to initialize payment');
    }
  }

  // Validate payment
  async validatePayment(validationData: IPaymentValidationData) {
    try {
      const url = this.isLive ? SSLCOMMERZ_VALIDATION_LIVE_URL : SSLCOMMERZ_VALIDATION_URL;

      const data = {
        val_id: validationData.val_id,
        store_id: this.storeId,
        store_passwd: this.storePassword,
        format: 'json'
      };

      logger.info('Validating SSLCommerz payment', { val_id: validationData.val_id });

      const response = await axios.get(url, {
        params: data
      });

      if (response.data.status === 'VALID' || response.data.status === 'VALIDATED') {
        logger.info('Payment validation successful', { val_id: validationData.val_id });
        return {
          success: true,
          data: response.data
        };
      } else {
        logger.error('Payment validation failed', response.data);
        return {
          success: false,
          data: response.data
        };
      }
    } catch (error: any) {
      logger.error('SSLCommerz payment validation error', error);
      throw new Error(error.message || 'Failed to validate payment');
    }
  }
}

export default new SSLCommerzService();
