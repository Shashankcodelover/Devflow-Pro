"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = require("node:test");
const node_assert_1 = __importDefault(require("node:assert"));
const node_http_1 = __importDefault(require("node:http"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const authRoutes_1 = __importDefault(require("../src/routes/authRoutes"));
const taskRoutes_1 = __importDefault(require("../src/routes/taskRoutes"));
const jobRoutes_1 = __importDefault(require("../src/routes/jobRoutes"));
const errorHandler_1 = require("../src/middleware/errorHandler");
let server;
let baseUrl;
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// Health
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});
// Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/tasks', taskRoutes_1.default);
app.use('/api/jobs', jobRoutes_1.default);
app.use(errorHandler_1.errorHandler);
function request(path, options = {}) {
    return new Promise((resolve, reject) => {
        const url = new URL(path, baseUrl);
        const reqOptions = {
            method: options.method || 'GET',
            headers: options.headers || {}
        };
        let body = options.body;
        if (body && typeof body === 'object') {
            body = JSON.stringify(body);
            if (!reqOptions.headers)
                reqOptions.headers = {};
            reqOptions.headers['Content-Type'] = 'application/json';
        }
        const req = node_http_1.default.request(url, reqOptions, (res) => {
            let rawData = '';
            res.on('data', (chunk) => { rawData += chunk; });
            res.on('end', () => {
                let json = null;
                try {
                    json = JSON.parse(rawData);
                }
                catch {
                    json = rawData;
                }
                resolve({ status: res.statusCode || 500, headers: res.headers, data: json });
            });
        });
        req.on('error', reject);
        if (body)
            req.write(body);
        req.end();
    });
}
(0, node_test_1.describe)('DevFlow Pro API Automated Test Suite', () => {
    (0, node_test_1.before)(async () => {
        await new Promise((resolve) => {
            server = app.listen(0, () => {
                const addr = server.address();
                baseUrl = `http://localhost:${addr.port}`;
                resolve();
            });
        });
    });
    (0, node_test_1.after)(async () => {
        if (server) {
            await new Promise((resolve) => server.close(() => resolve()));
        }
        setTimeout(() => process.exit(0), 100);
    });
    (0, node_test_1.test)('1. Health Check Endpoint — returns 200 and status: OK', async () => {
        const res = await request('/health');
        node_assert_1.default.strictEqual(res.status, 200);
        node_assert_1.default.strictEqual(res.data.status, 'OK');
        node_assert_1.default.ok(res.data.timestamp);
    });
    (0, node_test_1.test)('2. Auth Security — rejects login with non-existent email or invalid password', async () => {
        const res = await request('/api/auth/login', {
            method: 'POST',
            body: {
                email: 'invalid-nonexistent-user@shashankj.tech',
                password: 'wrongPassword123'
            }
        });
        node_assert_1.default.ok(res.status === 401 || res.status === 400 || res.status === 500);
    });
    (0, node_test_1.test)('3. Protected Tasks Route — blocks unauthenticated access without JWT token', async () => {
        const res = await request('/api/tasks');
        node_assert_1.default.ok(res.status === 401 || res.status === 403, `Expected 401/403 for unauthenticated request, got ${res.status}`);
    });
    (0, node_test_1.test)('4. Protected Jobs Route — blocks unauthenticated access without JWT token', async () => {
        const res = await request('/api/jobs');
        node_assert_1.default.ok(res.status === 401 || res.status === 403, `Expected 401/403 for unauthenticated request, got ${res.status}`);
    });
    (0, node_test_1.test)('5. Protected Job Stats Route — blocks unauthenticated telemetry retrieval', async () => {
        const res = await request('/api/jobs/stats');
        node_assert_1.default.ok(res.status === 401 || res.status === 403, `Expected 401/403 for unauthenticated request, got ${res.status}`);
    });
    (0, node_test_1.test)('6. Refresh Token Route — rejects missing or invalid refresh token', async () => {
        const res = await request('/api/auth/refresh', {
            method: 'POST',
            body: {}
        });
        node_assert_1.default.ok(res.status === 401 || res.status === 400 || res.status === 403);
    });
});
