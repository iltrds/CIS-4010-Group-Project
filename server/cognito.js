require('dotenv').config(); // Load environment variables from .env file

const jwt = require('jsonwebtoken'); // JSON Web Token library for creating and verifying user tokens
const jwks = require('jwks-rsa'); // Fetches public keys from Cognito to verify user tokens

// Setup JWKS to fetch keys from our Cognito user pool in AWS
const jwksClient = jwks({
    jwksUri: `https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}/.well-known/jwks.json`,
});

/**
 * Fetehes signing key using the keyID from the token header
 */
function handleSigningKey(err, key, callback) {

    // If there was an error fetching the key, call
    if (err) {
        return callback(err);
    }

    const publicSigningKey = key.getPublicKey(); // Get the public key from the key object found by the keyID
    callback(null, publicSigningKey); // Return the public key to the callback passed to getCognitoKey
}

/**
 * Get the Cognito key from the JWKS endpoint (cognito)
 */
function getCognitoKey(tokenHeader, callback) {

    const keyID = tokenHeader.kid; // get the keyID from the token header

    // Retrieve the matching signing key to the keyID from the JWKS endpoint (cognito)
    // Once found it will call handleSigningKey to return the public key
    jwksClient.getSigningKey(keyID, function(err, key) { 
        handleSigningKey(err, key, callback); 
    }); 
}

/**
 * Call back function to handle the outcome of the JWT verification
 */
function handleJWTVerificationOutcome(err, decodedToken, httpResponse, next) {
    // If there was an error verifying the token, return a 401 error
    if (err) {
        return httpResponse.status(401).json({ error: 'Unauthorized - Invalid/Expired token' });
    }

    // If the token is verified, set the user in the response locals and call the next middleware function
    httpResponse.locals.user = decodedToken;
    next();
}

/**
 * Verify the Cognito token
 */
function verifyCognitoToken(httpRequest, httpResponse, next) {

    const authHeader = httpRequest.headers.authorization;
    const tokenPrefix = 'Bearer ';

    // If there is no authorization header, return a 401 error
    if (!authHeader) {
        return httpResponse.status(401).json({ error: 'Unauthorized - No authorization header provided' });
    }

    // Ensure a bearer token is being provided
    if (!authHeader.startsWith(tokenPrefix)) {
        return httpResponse.status(401).json({ error: 'Unauthorized - Invalid authorization header format' });
    }

    const token = authHeader.slice(tokenPrefix.length); // Slice string at the prefix to extract the token only

    // Verify the the token using the jwt library
    // Cognito signs the token with RS256 specificakly
    jwt.verify(token, getCognitoKey, { algorithms: ['RS256'] }, function(err, decodedToken) {
        handleJWTVerificationOutcome(err, decodedToken, httpResponse, next);
    });
}

module.exports = verifyCognitoToken;
