import { google } from 'googleapis';

export const AuthServiceGoogle = {
  getGoogleProfile: async (accessToken: string): Promise<any> => {
    // Create a Google OAuth2 client
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: decodeURI(accessToken) });

    // Retrieve the user's profile information using the Google People API
    const people = google.people({ version: 'v1', auth: oauth2Client });
    const { data } = await people.people.get({
      resourceName: 'people/me',
      personFields: 'names,emailAddresses,photos',
    });

    // Extract the user profile information from the response
    const profile = {
      name: {
        familyName: data.names[0].familyName,
        givenName: data.names[0].givenName,
      },
      picture: data.photos[0].url,
      email: data.emailAddresses[0].value,
    };

    return profile;
  },

  devalidateGoogleAccessToken: async (accessToken: string): Promise<any> => {
    // Create a Google OAuth2 client
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: decodeURI(accessToken) });

    // Revoke the access token using the Google OAuth2 API
    const response = await oauth2Client.revokeToken(accessToken);

    return response;
  },
};
