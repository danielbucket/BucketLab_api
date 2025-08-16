# BucketLab API

BucketLab API is a backend service designed to manage and process data for the BucketLab application. It provides a set of RESTful endpoints to handle various operations such as user management and storage, inter-user communications.
This api can be deployed on virtually any arm64 computer with an installed Docker deamon.
It was built on a RaspberryPi 5, where it is also currently deployed.

## Features
- User authentication and authorization
- Interuser communications
- Data encryption and tokenization
- Data management and processing
- Analytics and reporting

## Prerequisites
Ensure you have the following installed on your system:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Docker](https://www.docker.com/)

## Getting Started

Follow these steps to set up and run the application locally:

### 1. Clone the Repository
```bash
git clone https://git@github.com:danielbucket/BucketLab_api.git
cd BucketLab_api
```

### 2. Install Dependencies
Using npm:
```bash
npm install
```
Or using yarn:
```bash
yarn install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory and add the required environment variables:
```
MONGO_DB_PASSWORD=your_password for mongoDB
MONGO_DB_USERNAME=your_username for mongoDB
TUNNEL_TOKEN=cloudflared tunnel token
APP_RUN_MODE='dev' or 'prod'
JWT_SECRET=your_secret_key
```

### 4. Start the Application in Production
```bash
docker compose -f compose.production.yaml up --build -d
```

### 5. Access the API
Once the app is running, you can access the API at `http://localhost:4020`.
Or by navigating to the domain that the Cloudflare Tunnel is connected to.
Example: `https://api.bucketlab.io/`

## Running Tests
To run the test suite:
```bash
npm test
```

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any suggestions or improvements. 

## License
This project is licensed under the [MIT License](LICENSE).