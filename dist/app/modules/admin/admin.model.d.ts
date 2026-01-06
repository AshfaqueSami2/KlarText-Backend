import { Schema } from 'mongoose';
import { IAdmin } from './admin.interface';
export declare const Admin: import("mongoose").Model<IAdmin, {}, {}, {}, import("mongoose").Document<unknown, {}, IAdmin, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & IAdmin & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, Schema<IAdmin, import("mongoose").Model<IAdmin, any, any, any, import("mongoose").Document<unknown, any, IAdmin, any, import("mongoose").DefaultSchemaOptions> & IAdmin & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any, IAdmin>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, IAdmin, import("mongoose").Document<unknown, {}, IAdmin, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & IAdmin & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, {
    user?: import("mongoose").SchemaDefinitionProperty<import("mongoose").Types.ObjectId, IAdmin, import("mongoose").Document<unknown, {}, IAdmin, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & IAdmin & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    id?: import("mongoose").SchemaDefinitionProperty<string, IAdmin, import("mongoose").Document<unknown, {}, IAdmin, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & IAdmin & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    name?: import("mongoose").SchemaDefinitionProperty<string, IAdmin, import("mongoose").Document<unknown, {}, IAdmin, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & IAdmin & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    email?: import("mongoose").SchemaDefinitionProperty<string, IAdmin, import("mongoose").Document<unknown, {}, IAdmin, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & IAdmin & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    profileImage?: import("mongoose").SchemaDefinitionProperty<string | undefined, IAdmin, import("mongoose").Document<unknown, {}, IAdmin, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & IAdmin & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    isDeleted?: import("mongoose").SchemaDefinitionProperty<boolean, IAdmin, import("mongoose").Document<unknown, {}, IAdmin, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & IAdmin & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    needsPasswordChange?: import("mongoose").SchemaDefinitionProperty<boolean, IAdmin, import("mongoose").Document<unknown, {}, IAdmin, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & IAdmin & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
}, IAdmin>, IAdmin>;
//# sourceMappingURL=admin.model.d.ts.map