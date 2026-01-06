import { TSubscriptionPlan } from './subscription.interface';
export declare const SubscriptionServices: {
    getSubscriptionPlans: () => Promise<{
        plans: import("./subscription.interface").ISubscriptionPlan[];
        currency: string;
        freeLevels: string[];
        premiumLevels: string[];
    }>;
    getSubscriptionStatus: (userId: string) => Promise<{
        subscriptionStatus: "free" | "premium";
        subscriptionPlan: "monthly" | "yearly" | "lifetime" | null | undefined;
        isPremium: boolean;
        isExpired: boolean;
        subscriptionExpiry: Date | null | undefined;
        subscriptionPrice: number | undefined;
        accessLevels: string[];
    }>;
    upgradeToPremium: (userId: string, plan: TSubscriptionPlan, transactionId?: string) => Promise<{
        success: boolean;
        message: string;
        subscription: {
            status: "premium";
            plan: "monthly" | "yearly" | "lifetime";
            expiry: Date | null;
            price: number;
            accessLevels: string[];
        };
    }>;
    cancelSubscription: (userId: string) => Promise<{
        success: boolean;
        message: string;
        subscription: {
            status: "free";
            plan: null;
            accessLevels: string[];
        };
    }>;
    hasActivePremium: (userId: string) => Promise<boolean>;
};
//# sourceMappingURL=subscription.service.d.ts.map