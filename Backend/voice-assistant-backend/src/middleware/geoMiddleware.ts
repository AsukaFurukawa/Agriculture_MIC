// Optional middleware for GeoIP-based detection.

import { Request, Response, NextFunction } from 'express';
import geoip from 'geoip-lite';

export const detectGeoLanguage = (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip;
    const geo = geoip.lookup(ip);
    req.headers['detected-language'] = geo?.country === 'IN' ? 'Hindi' : 'English';
    next();
};
