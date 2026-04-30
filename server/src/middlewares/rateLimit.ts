import { Request, Response, NextFunction } from 'express';

type RateLimitOptions = {
  windowMs: number;
  max: number;
  message?: string;
  keyGenerator?: (req: Request) => string;
};

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const hits = new Map<string, RateLimitEntry>();

export const rateLimit = (options: RateLimitOptions) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const key = options.keyGenerator ? options.keyGenerator(req) : req.ip;
    const now = Date.now();
    const existing = hits.get(key);

    if (!existing || existing.resetAt <= now) {
      hits.set(key, { count: 1, resetAt: now + options.windowMs });
      return next();
    }

    if (existing.count >= options.max) {
      const retryAfter = Math.ceil((existing.resetAt - now) / 1000);
      res.setHeader('Retry-After', retryAfter.toString());
      return res.status(429).json({ message: options.message || 'Demasiadas solicitudes' });
    }

    existing.count += 1;
    return next();
  };
};
