import { auth } from 'express-oauth2-jwt-bearer';
import dotenv from 'dotenv';

dotenv.config();

// Middleware to validate the Auth0 JWT token
export const requireAuth = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER,
  tokenSigningAlg: 'RS256'
});

// Custom middleware to extract user ID and attach it to req.user for easy access
export const attachUser = (req, res, next) => {
  if (req.auth && req.auth.payload) {
    req.user = {
      auth0Id: req.auth.payload.sub,
      // You can extract custom claims here if configured in Auth0
    };
  }
  next();
};