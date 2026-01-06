export interface ITransaction {
    userId: string;
    transactionId: string;
    plan: 'monthly' | 'yearly' | 'lifetime';
    amount: number;
    status: 'pending' | 'success' | 'failed' | 'cancelled';
    valId?: string;
    cardType?: string;
    paymentMethod?: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare const Transaction: import("mongoose").Model<ITransaction, {}, {}, {}, import("mongoose").Document<unknown, {}, ITransaction, {}, import("mongoose").DefaultSchemaOptions> & ITransaction & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any, ITransaction>;
//# sourceMappingURL=transaction.model.d.ts.map