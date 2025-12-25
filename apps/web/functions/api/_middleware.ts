// Types for Cloudflare Pages Functions
interface Env {
    DB: D1Database;
    FIREBASE_PROJECT_ID: string;
    ADMIN_UIDS: string;
}

interface AuthContext {
    uid?: string;
    isAdmin?: boolean;
}

type ContextData = EventContext<Env, string, AuthContext>;

// Firebase ID Token verification for Cloudflare Workers
// Using manual JWT verification since firebase-admin doesn't work in Workers

interface FirebaseJWTPayload {
    aud: string;
    iss: string;
    sub: string;
    exp: number;
    iat: number;
    auth_time: number;
    user_id: string;
    email?: string;
    email_verified?: boolean;
}

interface GoogleKey {
    kid: string;
    n: string;
    e: string;
    kty: string;
    alg: string;
    use: string;
}

// Cache for Google public keys
let cachedKeys: { keys: GoogleKey[]; expiry: number } | null = null;

async function getGooglePublicKeys(): Promise<GoogleKey[]> {
    const now = Date.now();
    if (cachedKeys && cachedKeys.expiry > now) {
        return cachedKeys.keys;
    }

    const response = await fetch(
        'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com'
    );

    if (!response.ok) {
        throw new Error('Failed to fetch Google public keys');
    }

    const cacheControl = response.headers.get('cache-control');
    let maxAge = 3600; // Default 1 hour
    if (cacheControl) {
        const match = cacheControl.match(/max-age=(\d+)/);
        if (match) {
            maxAge = parseInt(match[1], 10);
        }
    }

    const certsData = await response.json() as Record<string, string>;

    // Convert PEM certificates to keys - we'll use a simplified approach
    // by fetching from the JWK endpoint instead
    const jwkResponse = await fetch(
        'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com'
    );

    if (!jwkResponse.ok) {
        throw new Error('Failed to fetch Google JWK keys');
    }

    const jwkData = await jwkResponse.json() as { keys: GoogleKey[] };

    cachedKeys = {
        keys: jwkData.keys,
        expiry: now + (maxAge * 1000)
    };

    return jwkData.keys;
}

function base64UrlDecode(str: string): Uint8Array {
    // Add padding if necessary
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
        base64 += '=';
    }
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
}

function decodeJWT(token: string): { header: { kid: string; alg: string }; payload: FirebaseJWTPayload } {
    const parts = token.split('.');
    if (parts.length !== 3) {
        throw new Error('Invalid JWT format');
    }

    const header = JSON.parse(new TextDecoder().decode(base64UrlDecode(parts[0])));
    const payload = JSON.parse(new TextDecoder().decode(base64UrlDecode(parts[1])));

    return { header, payload };
}

async function importKey(key: GoogleKey): Promise<CryptoKey> {
    const jwk = {
        kty: key.kty,
        n: key.n,
        e: key.e,
        alg: key.alg,
        use: key.use
    };

    return await crypto.subtle.importKey(
        'jwk',
        jwk,
        {
            name: 'RSASSA-PKCS1-v1_5',
            hash: { name: 'SHA-256' }
        },
        false,
        ['verify']
    );
}

async function verifyFirebaseToken(token: string, projectId: string): Promise<FirebaseJWTPayload | null> {
    try {
        const { header, payload } = decodeJWT(token);

        // Validate claims
        const now = Math.floor(Date.now() / 1000);

        if (payload.exp < now) {
            console.log('Token expired');
            return null;
        }

        if (payload.iat > now + 300) { // 5 min clock skew allowed
            console.log('Token issued in the future');
            return null;
        }

        if (payload.aud !== projectId) {
            console.log('Invalid audience');
            return null;
        }

        if (payload.iss !== `https://securetoken.google.com/${projectId}`) {
            console.log('Invalid issuer');
            return null;
        }

        if (!payload.sub || payload.sub.length === 0) {
            console.log('Missing subject');
            return null;
        }

        // Verify signature
        const keys = await getGooglePublicKeys();
        const key = keys.find(k => k.kid === header.kid);

        if (!key) {
            console.log('Key not found');
            return null;
        }

        const cryptoKey = await importKey(key);
        const parts = token.split('.');
        const signatureArray = base64UrlDecode(parts[2]);
        const dataArray = new TextEncoder().encode(`${parts[0]}.${parts[1]}`);

        const valid = await crypto.subtle.verify(
            'RSASSA-PKCS1-v1_5',
            cryptoKey,
            signatureArray,
            dataArray
        );

        if (!valid) {
            console.log('Invalid signature');
            return null;
        }

        return payload;
    } catch (error) {
        console.error('Token verification error:', error);
        return null;
    }
}

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
    { method: 'GET', pattern: /^\/api\/tests$/ },
    { method: 'GET', pattern: /^\/api\/tests\/\d+$/ }
];

function isPublicRoute(method: string, pathname: string): boolean {
    return PUBLIC_ROUTES.some(route =>
        route.method === method && route.pattern.test(pathname)
    );
}

export const onRequest: PagesFunction<Env, string, AuthContext> = async (context) => {
    const { request, env } = context;
    const url = new URL(request.url);
    const method = request.method;
    const pathname = url.pathname;

    // Check if this is a public route
    if (isPublicRoute(method, pathname)) {
        return await context.next();
    }

    // Get Authorization header
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return new Response(JSON.stringify({ error: 'Unauthorized: Missing token' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const token = authHeader.substring(7);

    // Verify Firebase ID Token
    const payload = await verifyFirebaseToken(token, env.FIREBASE_PROJECT_ID);

    if (!payload) {
        return new Response(JSON.stringify({ error: 'Unauthorized: Invalid token' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    // Attach user info to context
    context.data.uid = payload.sub;

    // Check admin status
    const adminUids = (env.ADMIN_UIDS || '').split(',').map(u => u.trim()).filter(Boolean);
    context.data.isAdmin = adminUids.includes(payload.sub);

    // Admin routes require admin access
    if (pathname.startsWith('/api/admin') && !context.data.isAdmin) {
        return new Response(JSON.stringify({ error: 'Forbidden: Admin access required' }), {
            status: 403,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    return await context.next();
};
