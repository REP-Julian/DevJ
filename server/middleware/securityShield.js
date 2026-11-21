// High-Grade Security Shield: IP Lockout, Honeypots, Anti-Bot & Threat Mitigation

class SecurityShield {
    constructor() {
        // bannedIPs: Map<ip, { unbanTime: number, reason: string, bannedAt: number }>
        this.bannedIPs = new Map();

        // failedLogins: Map<ip, { count: number, resetTime: number }>
        this.failedLogins = new Map();

        // 24 hours in milliseconds
        this.LOCKOUT_DURATION = 24 * 60 * 60 * 1000;
        this.MAX_LOGIN_ATTEMPTS = 5;
        this.LOGIN_WINDOW = 15 * 60 * 1000; // 15 mins window for counting failed attempts

        // Honeypot traps: paths exclusively accessed by automated scanners and malicious reconnaissance
        this.honeypotPaths = new Set([
            '/.env',
            '/.git',
            '/.git/config',
            '/.aws',
            '/.aws/credentials',
            '/wp-admin',
            '/wp-login.php',
            '/admin.php',
            '/phpmyadmin',
            '/phpinfo.php',
            '/xmlrpc.php',
            '/actuator',
            '/actuator/health',
            '/eval',
            '/shell.php',
            '/cgi-bin',
            '/server-status',
            '/debug/default/view',
            '/.vscode',
        ]);

        // Known malicious scanning tools and vulnerability exploiters
        this.maliciousUserAgents = [
            /sqlmap/i,
            /nikto/i,
            /wpscan/i,
            /masscan/i,
            /acunetix/i,
            /nmap/i,
            /havij/i,
            /zgrab/i,
            /dirbuster/i,
            /gobuster/i,
        ];

        // Periodic maintenance cleanup every 10 minutes
        const interval = setInterval(() => {
            const now = Date.now();
            for (const [ip, info] of this.bannedIPs.entries()) {
                if (now >= info.unbanTime) {
                    this.bannedIPs.delete(ip);
                }
            }
            for (const [ip, info] of this.failedLogins.entries()) {
                if (now >= info.resetTime) {
                    this.failedLogins.delete(ip);
                }
            }
        }, 10 * 60 * 1000);

        if (interval.unref) interval.unref();
    }

    getClientIP(req) {
        const forwarded = req.headers['x-forwarded-for'];
        if (forwarded && typeof forwarded === 'string') {
            return forwarded.split(',')[0].trim();
        }
        return req.socket?.remoteAddress || req.ip || '127.0.0.1';
    }

    banIP(ip, reason, durationMs = this.LOCKOUT_DURATION) {
        const now = Date.now();
        this.bannedIPs.set(ip, {
            bannedAt: now,
            unbanTime: now + durationMs,
            reason,
        });
        // Clear login attempt tracker once banned
        this.failedLogins.delete(ip);
        console.warn(`[SECURITY SHIELD BAN] IP: ${ip} restricted for ${durationMs / 3600000}h. Reason: ${reason}`);
    }

    isBanned(ip) {
        const banInfo = this.bannedIPs.get(ip);
        if (!banInfo) return null;

        const now = Date.now();
        if (now >= banInfo.unbanTime) {
            this.bannedIPs.delete(ip);
            return null;
        }

        return banInfo;
    }

    recordFailedLogin(ip) {
        const now = Date.now();
        let record = this.failedLogins.get(ip);

        if (!record || now >= record.resetTime) {
            record = { count: 1, resetTime: now + this.LOGIN_WINDOW };
            this.failedLogins.set(ip, record);
        } else {
            record.count += 1;
        }

        if (record.count >= this.MAX_LOGIN_ATTEMPTS) {
            this.banIP(ip, `Excessive failed authentication attempts (${record.count}/${this.MAX_LOGIN_ATTEMPTS}). Locked for 24h.`);
            return {
                isBanned: true,
                lockoutSeconds: Math.ceil(this.LOCKOUT_DURATION / 1000),
                remainingAttempts: 0,
            };
        }

        return {
            isBanned: false,
            remainingAttempts: Math.max(0, this.MAX_LOGIN_ATTEMPTS - record.count),
        };
    }

    recordSuccessfulLogin(ip) {
        this.failedLogins.delete(ip);
    }

    // Middleware: Enforce IP Ban check
    ipGatekeeper() {
        return (req, res, next) => {
            const ip = this.getClientIP(req);
            const ban = this.isBanned(ip);

            if (ban) {
                const remainingSeconds = Math.ceil((ban.unbanTime - Date.now()) / 1000);
                res.setHeader('Retry-After', remainingSeconds);
                return res.status(403).json({
                    error: 'Access Restricted',
                    message: `Your IP has been restricted due to suspicious or unauthorized activity. Reason: ${ban.reason}`,
                    restrictedUntil: new Date(ban.unbanTime).toISOString(),
                    remainingSeconds,
                });
            }

            next();
        };
    }

    // Middleware: Scanner & Bot detection
    botScannerFilter() {
        return (req, res, next) => {
            const ua = req.headers['user-agent'] || '';
            const ip = this.getClientIP(req);

            for (const pattern of this.maliciousUserAgents) {
                if (pattern.test(ua)) {
                    this.banIP(ip, `Automated exploit scanner user-agent detected: ${ua.slice(0, 50)}`);
                    return res.status(403).json({
                        error: 'Forbidden',
                        message: 'Automated vulnerability scanning tools are prohibited.',
                    });
                }
            }

            next();
        };
    }

    // Middleware: Honeypot traps for malicious recon
    honeypotTrap() {
        return (req, res, next) => {
            const path = req.path.toLowerCase();
            const ip = this.getClientIP(req);

            if (this.honeypotPaths.has(path) || path.includes('/.env') || path.includes('/.git')) {
                this.banIP(ip, `Security honeypot trap triggered: unauthorized probe on ${path}`);
                return res.status(403).json({
                    error: 'Access Denied',
                    message: 'Unauthorized security probe detected. IP has been flagged and restricted for 24 hours.',
                });
            }

            next();
        };
    }

    // Middleware: Strict HTTP Security Headers
    securityHeaders() {
        return (req, res, next) => {
            res.removeHeader('X-Powered-By');
            res.setHeader('X-Content-Type-Options', 'nosniff');
            res.setHeader('X-Frame-Options', 'DENY');
            res.setHeader('X-XSS-Protection', '1; mode=block');
            res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
            res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
            res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
            next();
        };
    }
}

export const securityShield = new SecurityShield();
