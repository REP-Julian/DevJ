// Memory-safe sliding-window rate limiter without external dependencies

class MemoryRateLimiter {
    constructor({ windowMs = 60 * 1000, max = 30, message = 'Too many requests, please try again later.' } = {}) {
        this.windowMs = windowMs;
        this.max = max;
        this.message = message;
        this.hits = new Map();

        // Periodically purge expired IP records every 5 minutes
        const interval = setInterval(() => {
            const now = Date.now();
            for (const [ip, record] of this.hits.entries()) {
                if (now > record.resetTime) {
                    this.hits.delete(ip);
                }
            }
        }, 5 * 60 * 1000);

        if (interval.unref) interval.unref();
    }

    middleware() {
        return (req, res, next) => {
            const ip = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket.remoteAddress || 'unknown';
            const now = Date.now();
            let record = this.hits.get(ip);

            if (!record || now > record.resetTime) {
                record = { count: 1, resetTime: now + this.windowMs };
                this.hits.set(ip, record);
            } else {
                record.count += 1;
            }

            res.setHeader('X-RateLimit-Limit', this.max);
            res.setHeader('X-RateLimit-Remaining', Math.max(0, this.max - record.count));
            res.setHeader('X-RateLimit-Reset', Math.ceil(record.resetTime / 1000));

            if (record.count > this.max) {
                const retryAfter = Math.ceil((record.resetTime - now) / 1000);
                res.setHeader('Retry-After', retryAfter);
                return res.status(429).json({
                    error: 'Too Many Requests',
                    message: this.message,
                    retryAfterSeconds: retryAfter,
                });
            }

            next();
        };
    }
}

// Pre-configured limiters for critical application surfaces
export const authLimiter = new MemoryRateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    message: 'Too many authentication attempts. Please try again in 15 minutes.',
}).middleware();

export const contactLimiter = new MemoryRateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    message: 'Too many contact submissions from this IP. Please wait before submitting again.',
}).middleware();

export const uploadLimiter = new MemoryRateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 25,
    message: 'Upload rate limit reached. Please wait before uploading more assets.',
}).middleware();

export const aiLimiter = new MemoryRateLimiter({
    windowMs: 60 * 1000, // 1 minute
    max: 20,
    message: 'AI assistant request rate limit exceeded. Please throttle requests.',
}).middleware();

export const globalLimiter = new MemoryRateLimiter({
    windowMs: 60 * 1000, // 1 minute
    max: 180,
    message: 'API rate limit exceeded. Please throttle requests.',
}).middleware();
