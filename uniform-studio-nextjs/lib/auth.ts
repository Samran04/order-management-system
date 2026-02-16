// ============================================
// AUTHENTICATION UTILITIES
// ============================================
// This file contains all authentication-related functions
// including password hashing, JWT token generation/verification

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// ============================================
// CONFIGURATION
// ============================================

/**
 * JWT Secret Key
 * IMPORTANT: Change this in production!
 * Generate a secure key: openssl rand -base64 32
 */
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

/**
 * JWT Token Expiration
 * Examples: "15m", "1h", "7d", "30d"
 */
const JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';

/**
 * Bcrypt Salt Rounds
 * Higher = more secure but slower
 * 10 is a good balance for most applications
 */
const SALT_ROUNDS = 10;

// ============================================
// TYPE DEFINITIONS
// ============================================

/**
 * JWT Payload Interface
 * Data stored in the JWT token
 */
export interface JWTPayload {
    userId: string;
    email: string;
    role: string;
}

// ============================================
// PASSWORD FUNCTIONS
// ============================================

/**
 * Hash a plain text password
 * 
 * Uses bcrypt to securely hash passwords before storing in database.
 * NEVER store plain text passwords!
 * 
 * @param password - Plain text password to hash
 * @returns Promise<string> - Hashed password
 * 
 * @example
 * const hashedPassword = await hashPassword('myPassword123');
 * // Save hashedPassword to database
 */
export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Verify a password against its hash
 * 
 * Compares a plain text password with a hashed password
 * to check if they match.
 * 
 * @param password - Plain text password to verify
 * @param hash - Hashed password from database
 * @returns Promise<boolean> - True if password matches, false otherwise
 * 
 * @example
 * const isValid = await verifyPassword('myPassword123', user.passwordHash);
 * if (isValid) {
 *   // Password is correct
 * }
 */
export async function verifyPassword(
    password: string,
    hash: string
): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

// ============================================
// JWT TOKEN FUNCTIONS
// ============================================

/**
 * Generate a JWT token
 * 
 * Creates a signed JWT token containing user information.
 * This token is sent to the client and used for authentication.
 * 
 * @param payload - User data to include in token
 * @returns string - Signed JWT token
 * 
 * @example
 * const token = generateToken({
 *   userId: user.id,
 *   email: user.email,
 *   role: user.role
 * });
 * // Send token to client
 */
export function generateToken(payload: JWTPayload): string {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRY,
    });
}

/**
 * Verify and decode a JWT token
 * 
 * Verifies the token signature and returns the payload if valid.
 * Returns null if token is invalid or expired.
 * 
 * @param token - JWT token to verify
 * @returns JWTPayload | null - Decoded payload or null if invalid
 * 
 * @example
 * const payload = verifyToken(token);
 * if (payload) {
 *   // Token is valid, use payload.userId
 * } else {
 *   // Token is invalid or expired
 * }
 */
export function verifyToken(token: string): JWTPayload | null {
    try {
        return jwt.verify(token, JWT_SECRET) as JWTPayload;
    } catch (error) {
        // Token is invalid or expired
        return null;
    }
}

/**
 * Extract token from Authorization header
 * 
 * Extracts the JWT token from the "Bearer <token>" format
 * commonly used in Authorization headers.
 * 
 * @param authHeader - Authorization header value
 * @returns string | null - Extracted token or null if not found
 * 
 * @example
 * const token = extractTokenFromHeader(request.headers.get('authorization'));
 * if (token) {
 *   const payload = verifyToken(token);
 * }
 */
export function extractTokenFromHeader(authHeader: string | null): string | null {
    if (!authHeader) return null;

    // Check if header starts with "Bearer "
    if (!authHeader.startsWith('Bearer ')) return null;

    // Extract token (remove "Bearer " prefix)
    return authHeader.substring(7);
}

// ============================================
// AUTHENTICATION MIDDLEWARE HELPER
// ============================================

/**
 * Authenticate request and get user payload
 * 
 * Helper function to authenticate API requests.
 * Extracts and verifies the JWT token from the request.
 * 
 * @param authHeader - Authorization header from request
 * @returns JWTPayload | null - User payload if authenticated, null otherwise
 * 
 * @example
 * // In API route:
 * const user = authenticateRequest(request.headers.get('authorization'));
 * if (!user) {
 *   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
 * }
 * // User is authenticated, use user.userId
 */
export function authenticateRequest(authHeader: string | null): JWTPayload | null {
    const token = extractTokenFromHeader(authHeader);
    if (!token) return null;

    return verifyToken(token);
}

/**
 * Generate a random password reset token
 * 
 * Creates a secure random token for password reset functionality.
 * 
 * @returns string - Random token
 * 
 * @example
 * const resetToken = generateResetToken();
 * // Save resetToken to database with expiration
 * // Send resetToken to user via email
 */
export function generateResetToken(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
