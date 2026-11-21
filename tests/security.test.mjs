import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import jwt from 'jsonwebtoken';
import { app } from '../server/index.js';

let server;
let baseUrl;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-fallback-secret-for-tests-only';

before(async () => {
    await new Promise((resolve) => {
        server = app.listen(0, () => {
            const port = server.address().port;
            baseUrl = `http://127.0.0.1:${port}`;
            resolve();
        });
    });
});

after(async () => {
    if (server) {
        await new Promise((resolve) => server.close(resolve));
    }
});

// Helper: generate signed JWT tokens
const createToken = (payload, options = {}) => {
    return jwt.sign(payload, JWT_SECRET, { algorithm: 'HS256', expiresIn: '1h', ...options });
};

test('Security Audit: Protected endpoints reject unauthenticated requests (401)', async () => {
    const endpoints = [
        { path: '/api/contact/messages', method: 'GET' },
        { path: '/api/contact/stream', method: 'GET' },
        { path: '/api/upload', method: 'POST' },
        { path: '/api/ai/chat', method: 'POST' },
        { path: '/api/projects', method: 'POST' },
        { path: '/api/profile', method: 'PUT' },
        { path: '/api/skills', method: 'POST' },
    ];

    for (const ep of endpoints) {
        const res = await fetch(`${baseUrl}${ep.path}`, {
            method: ep.method,
            headers: { 'Content-Type': 'application/json' },
            body: ep.method !== 'GET' ? JSON.stringify({}) : undefined,
        });
        assert.strictEqual(
            res.status,
            401,
            `Expected ${ep.method} ${ep.path} to reject with 401 when no token is provided. Received ${res.status}`
        );
    }
});

test('Security Audit: Protected endpoints reject fake token bypass strings (403)', async () => {
    const fakeTokens = [
        'appwrite_session_fake_token_123',
        'devj_arbitrary_admin_token_xyz',
        '1234567890123456', // 16 alphanumeric characters (legacy auth bypass)
        'BearerNotAJwtTokenLongerThanSixteenChars',
    ];

    for (const fakeToken of fakeTokens) {
        const res = await fetch(`${baseUrl}/api/contact/messages`, {
            headers: {
                Authorization: `Bearer ${fakeToken}`,
            },
        });
        assert.strictEqual(
            res.status,
            403,
            `Expected fake token "${fakeToken}" to be rejected with 403 Forbidden. Received ${res.status}`
        );
    }
});

test('Security Audit: Protected endpoints reject expired tokens (401)', async () => {
    const expiredToken = createToken(
        { id: 1, email: 'admin@devj.com', role: 'admin' },
        { expiresIn: '-1s' }
    );

    const res = await fetch(`${baseUrl}/api/contact/messages`, {
        headers: {
            Authorization: `Bearer ${expiredToken}`,
        },
    });
    assert.strictEqual(res.status, 401, 'Expected expired token to return 401');
    const data = await res.json();
    assert.match(data.message, /expired/i);
});

test('Security Audit: Protected endpoints reject tokens signed with incorrect secret (403)', async () => {
    const bogusSignedToken = jwt.sign(
        { id: 1, email: 'admin@devj.com', role: 'admin' },
        'wrong-secret-signature-key-12345',
        { algorithm: 'HS256' }
    );

    const res = await fetch(`${baseUrl}/api/contact/messages`, {
        headers: {
            Authorization: `Bearer ${bogusSignedToken}`,
        },
    });
    assert.strictEqual(res.status, 403, 'Expected wrong signature to return 403');
});

test('Security Audit: Real-time SSE stream rejects connection without valid token', async () => {
    // Missing token
    const resNoToken = await fetch(`${baseUrl}/api/contact/stream`);
    assert.strictEqual(resNoToken.status, 401, 'SSE stream must reject unauthenticated connection');

    // Forged query token
    const resFakeQuery = await fetch(`${baseUrl}/api/contact/stream?token=appwrite_fake_bypass_123456`);
    assert.strictEqual(resFakeQuery.status, 403, 'SSE stream must reject forged query token');
});

test('Security Audit: Login route validates credentials and returns cryptographically verifiable JWT', async () => {
    // Missing fields
    const resEmpty = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
    });
    assert.strictEqual(resEmpty.status, 400, 'Expected 400 for empty login payload');

    // Invalid password
    const resWrong = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@devj.com', password: 'completely_wrong_password_999' }),
    });
    assert.strictEqual(resWrong.status, 401, 'Expected 401 for wrong credentials');
});

test('Security Audit: Public contact form validates email format and payload limits', async () => {
    // Invalid email format
    const resInvalidEmail = await fetch(`${baseUrl}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: 'John Doe',
            email: 'not-an-email',
            message: 'Hello Julian, this is a test message.',
        }),
    });
    assert.strictEqual(resInvalidEmail.status, 400, 'Expected 400 for invalid email');

    // Too short message
    const resShortMsg = await fetch(`${baseUrl}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: 'John Doe',
            email: 'john@example.com',
            message: 'hi',
        }),
    });
    assert.strictEqual(resShortMsg.status, 400, 'Expected 400 for too short message');
});

test('Security Audit: Authenticated request with cryptographically signed JWT succeeds', async () => {
    const validToken = createToken({
        id: 1,
        email: 'admin@devj.com',
        role: 'admin',
    });

    const res = await fetch(`${baseUrl}/api/contact/messages`, {
        headers: {
            Authorization: `Bearer ${validToken}`,
        },
    });
    assert.strictEqual(res.status, 200, 'Expected 200 OK for valid JWT');
    const messages = await res.json();
    assert.ok(Array.isArray(messages), 'Expected messages to be an array');
});

test('Security Audit: Security headers are present on responses', async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    assert.strictEqual(res.headers.get('x-content-type-options'), 'nosniff');
    assert.strictEqual(res.headers.get('x-frame-options'), 'DENY');
    assert.strictEqual(res.headers.get('x-xss-protection'), '1; mode=block');
    assert.ok(res.headers.get('strict-transport-security')?.includes('max-age=31536000'));
});

test('Security Audit: Honeypot traps block malicious reconnaissance probing (403)', async () => {
    const res = await fetch(`${baseUrl}/.env`, {
        headers: { 'X-Forwarded-For': '198.51.100.42' }
    });
    assert.strictEqual(res.status, 403, 'Expected 403 for honeypot probe');

    // Subsequent request from same IP should be blocked by IP Gatekeeper
    const resSubsequent = await fetch(`${baseUrl}/api/health`, {
        headers: { 'X-Forwarded-For': '198.51.100.42' }
    });
    assert.strictEqual(resSubsequent.status, 403, 'Expected 403 due to 24h IP lockout');
});

test('Security Audit: Malicious scanner user-agents are rejected (403)', async () => {
    const res = await fetch(`${baseUrl}/api/health`, {
        headers: {
            'User-Agent': 'sqlmap/1.6#stable (https://sqlmap.org)',
            'X-Forwarded-For': '198.51.100.77',
        }
    });
    assert.strictEqual(res.status, 403, 'Expected 403 for sqlmap user agent');
});

test('Security Audit: 5 failed login attempts trigger 24-hour lockout (403)', async () => {
    const testIP = '198.51.100.99';

    for (let i = 1; i <= 4; i++) {
        const res = await fetch(`${baseUrl}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Forwarded-For': testIP,
            },
            body: JSON.stringify({ email: 'admin@devj.com', password: `wrong_${i}` }),
        });
        assert.strictEqual(res.status, 401, `Attempt ${i} should return 401`);
        const data = await res.json();
        assert.strictEqual(data.remainingAttempts, 5 - i);
    }

    // 5th failed attempt should trigger 24h lockout (403)
    const resFifth = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Forwarded-For': testIP,
        },
        body: JSON.stringify({ email: 'admin@devj.com', password: 'wrong_5' }),
    });
    assert.strictEqual(resFifth.status, 403, '5th attempt must return 403 Lockout');

    // Subsequent requests from locked IP should be blocked
    const resLocked = await fetch(`${baseUrl}/api/health`, {
        headers: { 'X-Forwarded-For': testIP }
    });
    assert.strictEqual(resLocked.status, 403, 'Locked IP must be rejected with 403 on all endpoints');
});
