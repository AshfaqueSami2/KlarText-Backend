import mongoose from 'mongoose';
export declare const mongooseOptions: mongoose.ConnectOptions;
export declare const setupMongooseEvents: () => void;
export declare const ensureIndexes: () => Promise<void>;
export declare const getDatabaseStatus: () => Record<string, unknown>;
export declare const connectDatabase: (uri: string) => Promise<void>;
export declare const closeDatabaseConnection: () => Promise<void>;
declare const _default: {
    mongooseOptions: mongoose.ConnectOptions;
    setupMongooseEvents: () => void;
    ensureIndexes: () => Promise<void>;
    getDatabaseStatus: () => Record<string, unknown>;
    connectDatabase: (uri: string) => Promise<void>;
    closeDatabaseConnection: () => Promise<void>;
};
export default _default;
//# sourceMappingURL=database.d.ts.map