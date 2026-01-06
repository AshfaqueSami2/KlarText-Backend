export type TSubscriptionPlan = 'monthly' | 'yearly' | 'lifetime';
export interface ISubscriptionPlan {
    name: TSubscriptionPlan;
    displayName: string;
    price: number;
    durationDays: number | null;
    features: string[];
    discount?: string;
}
export interface ISubscriptionUpgrade {
    plan: TSubscriptionPlan;
    transactionId?: string;
}
//# sourceMappingURL=subscription.interface.d.ts.map