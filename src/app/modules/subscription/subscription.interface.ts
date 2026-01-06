export type TSubscriptionPlan = 'monthly' | 'yearly' | 'lifetime';

export interface ISubscriptionPlan {
  name: TSubscriptionPlan;
  displayName: string;
  price: number; // Price in BDT
  durationDays: number | null; // null for lifetime
  features: string[];
  discount?: string;
}

export interface ISubscriptionUpgrade {
  plan: TSubscriptionPlan;
  transactionId?: string; // For payment gateway integration
}
