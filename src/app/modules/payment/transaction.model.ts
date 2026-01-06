import { Schema, model } from 'mongoose';

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

const transactionSchema = new Schema<ITransaction>({
  userId: { type: String, required: true },
  transactionId: { type: String, required: true, unique: true },
  plan: { type: String, enum: ['monthly', 'yearly', 'lifetime'], required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'success', 'failed', 'cancelled'], default: 'pending' },
  valId: { type: String },
  cardType: { type: String },
  paymentMethod: { type: String },
}, { timestamps: true });

export const Transaction = model<ITransaction>('Transaction', transactionSchema);
