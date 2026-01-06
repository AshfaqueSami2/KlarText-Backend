declare const _default: {
    port: string | undefined;
    database_url: string | undefined;
    bcrypt_salt_rounds: string | undefined;
    default_pass: string | undefined;
    jwt: {
        secret: string | undefined;
        refresh_secret: string | undefined;
        expires_in: string | undefined;
        refresh_expires_in: string | undefined;
    };
    env: string | undefined;
    cloudinary: {
        cloud_name: string | undefined;
        api_key: string | undefined;
        api_secret: string | undefined;
    };
    google: {
        client_id: string | undefined;
        client_secret: string | undefined;
        callback_url: string | undefined;
    };
    client_url: string;
    backend_url: string;
    gemini: {
        api_key: string | undefined;
    };
    azure: {
        speech: {
            key: string | undefined;
            region: string | undefined;
            voiceName: string | undefined;
        };
        blob: {
            connectionString: string | undefined;
            container: string | undefined;
        };
        translator: {
            key: string | undefined;
            endpoint: string | undefined;
            region: string | undefined;
        };
    };
    sslcommerz: {
        store_id: string | undefined;
        store_passwd: string | undefined;
        is_live: boolean;
    };
};
export default _default;
//# sourceMappingURL=index.d.ts.map