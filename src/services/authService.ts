import jwt from 'jsonwebtoken';
import { User } from '../models/user';
import { google } from 'googleapis';

const jwtSecret = 'secret-key';

export const AuthService = {
  generateToken: (user: User): string => {
    const payload = {
      username: user.name,
      email: user.email,
      accessToken: user.accessToken
    };

    const token = jwt.sign(payload, jwtSecret, { expiresIn: '90d' });
    return token;
  },

  verifyToken: (token: string): any => {
    const decoded = jwt.verify(token, jwtSecret);
    return decoded;
  },

  getGoogleProfile: async (accessToken: string): Promise<any> => {
    // Create a Google OAuth2 client
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: accessToken });

    // Retrieve the user's profile information using the Google People API
    const people = google.people({ version: 'v1', auth: oauth2Client });
    const { data } = await people.people.get({
      resourceName: 'people/me',
      personFields: 'names,emailAddresses',
    });

    // Extract the user profile information from the response
    const profile = {
      name: {
        familyName: data.names[0].familyName,
        givenName: data.names[0].givenName,
      },
      email: data.emailAddresses[0].value,
    };

    return profile;
  }
};
