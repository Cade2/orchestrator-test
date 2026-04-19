process.env.NODE_ENV = 'test';
process.env.DATABASE_URL ??= 'postgresql://postgres:postgres@localhost:5432/workshop_inspect_lite_test';
process.env.SESSION_SECRET ??= 'test-session-secret';
process.env.PORT ??= '4001';
process.env.CORS_ORIGIN ??= 'http://localhost:5173';
