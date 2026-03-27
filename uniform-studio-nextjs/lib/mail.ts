import nodemailer from 'nodemailer';

/**
 * Mail Utility for Uniform Studio 81
 * Handles sending verification and password reset emails.
 */

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:5173';
const FROM_EMAIL = process.env.SMTP_FROM || '"Uniform Studio 81" <noreply@efzeefashion.com>';

/**
 * Send Verification Email
 */
export async function sendVerificationEmail(email: string, token: string) {
    const verifyUrl = `${APP_URL}?verifyToken=${token}`;

    const mailOptions = {
        from: FROM_EMAIL,
        to: email,
        subject: 'Verify Your Email - Uniform Studio 81',
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 8px;">
                <h1 style="color: #1e293b; font-size: 24px; font-weight: 900; margin-bottom: 16px;">Welcome to Studio 81</h1>
                <p style="color: #475569; font-size: 16px; line-height: 24px;">Please click the button below to verify your email address and activate your account.</p>
                <div style="margin: 32px 0;">
                    <a href="${verifyUrl}" style="background-color: #eab308; color: #000; padding: 12px 24px; border-radius: 8px; font-weight: 900; text-decoration: none; display: inline-block; text-transform: uppercase; letter-spacing: 0.05em; font-size: 14px;">Verify Email Address</a>
                </div>
                <p style="color: #94a3b8; font-size: 12px;">If you didn't create an account, you can safely ignore this email.</p>
                <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
                <p style="color: #94a3b8; font-size: 10px; text-transform: uppercase;">Uniform Studio 81 - Secure Ops</p>
            </div>
        `,
    };

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.log('--- MOCK EMAIL (Verification) ---');
        console.log(`To: ${email}`);
        console.log(`URL: ${verifyUrl}`);
        console.log('--------------------------------');
        return;
    }

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending verification email:', error);
        throw new Error(`Failed to send verification email: ${error instanceof Error ? error.message : String(error)}`);
    }
}

/**
 * Send Password Reset Email
 */
export async function sendPasswordResetEmail(email: string, token: string) {
    const resetUrl = `${APP_URL}?resetToken=${token}`;

    const mailOptions = {
        from: FROM_EMAIL,
        to: email,
        subject: 'Reset Your Password - Uniform Studio 81',
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 8px;">
                <h1 style="color: #1e293b; font-size: 24px; font-weight: 900; margin-bottom: 16px;">Password Reset Request</h1>
                <p style="color: #475569; font-size: 16px; line-height: 24px;">Click the button below to reset your password. This link will expire in 1 hour.</p>
                <div style="margin: 32px 0;">
                    <a href="${resetUrl}" style="background-color: #1e293b; color: #eab308; padding: 12px 24px; border-radius: 8px; font-weight: 900; text-decoration: none; display: inline-block; text-transform: uppercase; letter-spacing: 0.05em; font-size: 14px;">Reset Password</a>
                </div>
                <p style="color: #94a3b8; font-size: 12px;">If you didn't request a password reset, you can safely ignore this email.</p>
                <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
                <p style="color: #94a3b8; font-size: 10px; text-transform: uppercase;">Uniform Studio 81 - Secure Ops</p>
            </div>
        `,
    };

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.log('--- MOCK EMAIL (Password Reset) ---');
        console.log(`To: ${email}`);
        console.log(`URL: ${resetUrl}`);
        console.log('-----------------------------------');
        return;
    }

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending password reset email:', error);
        throw new Error(`Failed to send password reset email: ${error instanceof Error ? error.message : String(error)}`);
    }
}
