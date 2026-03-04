import { cookies } from "next/headers";

const ADMIN_SECRET = process.env.ADMIN_SECRET || "default-admin-secret-change-me";
const COOKIE_NAME = "admin_session";

// Simple hash: HMAC-SHA256 based token
async function hmacSign(payload: string): Promise<string> {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
        "raw",
        encoder.encode(ADMIN_SECRET),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
    );
    const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
    const sigHex = Array.from(new Uint8Array(signature))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    return `${Buffer.from(payload).toString("base64")}.${sigHex}`;
}

async function hmacVerify(token: string): Promise<string | null> {
    const [payloadB64, sigHex] = token.split(".");
    if (!payloadB64 || !sigHex) return null;

    const payload = Buffer.from(payloadB64, "base64").toString("utf-8");
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
        "raw",
        encoder.encode(ADMIN_SECRET),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["verify"]
    );
    const sigBytes = new Uint8Array(sigHex.match(/.{2}/g)!.map((h) => parseInt(h, 16)));
    const valid = await crypto.subtle.verify("HMAC", key, sigBytes, encoder.encode(payload));
    return valid ? payload : null;
}

// Hash a password using SHA-256 (salted with the secret)
export async function hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + ADMIN_SECRET);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hashBuffer))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    const computed = await hashPassword(password);
    return computed === hash;
}

// Create a signed session token
export async function createSessionToken(userId: string, username: string): Promise<string> {
    const payload = JSON.stringify({ userId, username, iat: Date.now() });
    return hmacSign(payload);
}

// Verify token and return payload
export async function verifySessionToken(
    token: string
): Promise<{ userId: string; username: string } | null> {
    const payload = await hmacVerify(token);
    if (!payload) return null;
    try {
        const data = JSON.parse(payload);
        if (!data.userId || !data.username) return null;
        return { userId: data.userId, username: data.username };
    } catch {
        return null;
    }
}

// Set the session cookie
export async function setSessionCookie(token: string) {
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
    });
}

// Clear the session cookie
export async function clearSessionCookie() {
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0,
    });
}

// Get current admin user from cookie — returns null if not authenticated
export async function getSessionUser(): Promise<{ userId: string; username: string } | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    return verifySessionToken(token);
}
