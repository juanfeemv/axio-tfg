import { Request, Response, NextFunction } from 'express';

// Rate limiting en memoria usando un Map. Sin dependencias externas (importante para ARM/RPi).
// Cada entrada guarda { count, resetAt } por IP. Si count > max en la ventana → 429.
// Se limpia solo: cuando el resetAt expira, la entrada se sobrescribe.

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

const hits = new Map<string, RateLimitEntry>(); // Almacén en memoria: IP → { count, resetAt }

export const rateLimit = (options: RateLimitOptions) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const key = options.keyGenerator ? options.keyGenerator(req) : req.ip || 'unknown'; // Identificar al cliente por IP
    const now = Date.now();
    const existing = hits.get(key);

    // Si no existe entrada o ya expiró la ventana → reiniciar contador
    if (!existing || existing.resetAt <= now) {
      hits.set(key, { count: 1, resetAt: now + options.windowMs });
      return next();
    }

    // Si superó el límite → bloquear con 429
    if (existing.count >= options.max) {
      const retryAfter = Math.ceil((existing.resetAt - now) / 1000);
      res.setHeader('Retry-After', retryAfter.toString()); // Informar cuándo reintentar
      return res.status(429).json({ message: options.message || 'Demasiadas solicitudes' });
    }

    existing.count += 1; // Incrementar contador y dejar pasar
    return next();
  };
};
