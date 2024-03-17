import jwt from 'jsonwebtoken';

export default function refreshAccessToken(req, res, next) {
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

  console.log('shouldnt be heare if token not expired');
  // Verify the JWT token using the extracted user information
  try {
    jwt.verify(currToken, process.env.JWT_SECRET);
    // Token is valid, return the same token
    console.log('Token verified');
    return next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      // If expired, generate a new token and return it
      const newToken = jwt.sign(
        { username: user.username, id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '5m' }
      );
      res.cookie('sessionCookie', newToken, { httpOnly: true, secure: false });
      console.log('Token refreshed');
      return res(200).json({ message: 'Token refreshed' });
    } else {
      console.error('JWT Verification Error:', error);
      return res.status(500).json({ error: 'Token verification failed' });
    }
  }
}
