# ms_AuthService

This is an example microservice that handles authentication using Express.js. It provides endpoints for Google authentication and token verification.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Docker (optional, for containerization)

### Installation

1. Clone the repository:

    ```
    git clone <repository_url>
    cd express-authentication-microservice
    ```
2. Install the dependencies
    ```
    npm install
    ```

3. Set up environment variables:
    - Create a .env file in the project root directory.
    - Add the following environment variables and update their values accordingly:
    ```env
    PORT=3000
    GOOGLE_CLIENT_ID=<your_google_client_id>
    GOOGLE_CLIENT_SECRET=<your_google_client_secret>
    MONGODB_URI=<your_mongodb_connection_uri>
    MONGO_PASSWORD=<mongo_password>
    MONGO_USERNAME=<mongo_username>
    ```
    Note: You need to create a Google API project and obtain the client ID and secret. Follow the Google Developer Console documentation to set up the project and obtain the credentials. Also, make sure to provide the MongoDB connection URI for your database.

4. Start the application
    ```
    npm run start
    ```
    The microservice will start running on http://localhost:3000.

## Docker Containerization
To build and run the application inside a Docker container, follow these steps:
1. Build the Docker image:
    ```
    docker build -t auth-microservice .
    ```

2. Run the Docker container:
    ```
    docker run -p 3000:2902 -d auth-microservice
    ```
    The microservice will be accessible on http://localhost:3000 within the Docker container, and the container's port 3000 will be mapped to port 3000 on your local machine.

    Note: If you prefer a different port mapping, modify the -p flag in the docker run command accordingly.

## API Endpoints
- GET /auth/google: Initiates the Google OAuth flow for authentication.
- POST /auth/google/verify: Verifies the Google OAuth token and returns user details.