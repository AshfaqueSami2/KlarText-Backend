import { ISubscriptionPlan } from './subscription.interface';
export declare const PREMIUM_LEVELS: string[];
export declare const FREE_LEVELS: string[];
export declare const SUBSCRIPTION_PLANS: ISubscriptionPlan[];
export declare const getPlanByName: (planName: string) => ISubscriptionPlan | undefined;
export declare const requiresPremium: (level: string) => boolean;
//# sourceMappingURL=subscription.constant.d.ts.map