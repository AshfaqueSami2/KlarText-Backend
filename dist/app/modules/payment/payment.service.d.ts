import { IPaymentInitData, IPaymentValidationData } from './payment.interface';
declare class SSLCommerzService {
    private isLive;
    private storeId;
    private storePassword;
    constructor();
    initPayment(paymentData: IPaymentInitData): Promise<{
        success: boolean;
        gatewayUrl: any;
        sessionKey: any;
    }>;
    validatePayment(validationData: IPaymentValidationData): Promise<{
        success: boolean;
        data: any;
    }>;
}
declare const _default: SSLCommerzService;
export default _default;
//# sourceMappingURL=payment.service.d.ts.map