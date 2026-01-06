export interface ISSLCommerzConfig {
  store_id: string;
  store_passwd: string;
  is_live: boolean;
}

export interface IPaymentInitData {
  total_amount: number;
  currency: string;
  tran_id: string;
  success_url: string;
  fail_url: string;
  cancel_url: string;
  ipn_url?: string;
  cus_name: string;
  cus_email: string;
  cus_add1: string;
  cus_city: string;
  cus_country: string;
  cus_phone: string;
  product_name: string;
  product_category: string;
  product_profile: string;
}

export interface IPaymentValidationData {
  val_id: string;
  store_id: string;
  store_passwd: string;
  format?: string;
}
