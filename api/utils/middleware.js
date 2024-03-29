import jwt from 'jsonwebtoken';

export function refreshAccessToken(req, res, next) {
  const publicRoutes = ['/register', '/login', '/posts'];
  if (publicRoutes.includes(req.path)) {
    return next();
  }

  const currToken = req.cookies.sessionCookie;
  if (!currToken) {
    return res.status(401).json({ error: 'No token found' });
  }

  // Decode the HTTP-only cookie to extract user information
  let user;
  try {
    const decodedCookie = jwt.decode(currToken);
    console.log('Decoded cookie:', decodedCookie);
    if (!decodedCookie) {
      throw new Error('Invalid token');
    }
    user = decodedCookie.username;
    if (!user) {
      user = undefined;
      return next();
    }

    req.decoded = decodedCookie;
  } catch (error) {
    console.error('Error decoding token:', error);
    return res.status(500).json({ error: 'Token decoding failed' });
  }

  // Verify the JWT token using the extracted user information
  try {
    jwt.verify(currToken, process.env.JWT_SECRET);
    // Token is valid, return the same token
    console.log('Token verified');
    return next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      // If expired, generate a new token and return it
      // TODO: If token has been expired for more than 15min, redirect to login
      const newToken = jwt.sign(
        { username: user.username, id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '5m' }
      );
      res.cookie('sessionCookie', newToken, { httpOnly: true, secure: false });
      console.log('Token refreshed');
      return res.status(200).json({ message: 'Token refreshed' });
    } else {
      console.error('JWT Verification Error:', error);
      return res.status(500).json({ error: 'Token verification failed' });
    }
  }
}

// TODO:
export function updateLastActivity(req, res, next) {
  //logic here
  // 1. check if user is logged in
  // 2. if logged in, update the last activity field in the user session document
  return next();
}
