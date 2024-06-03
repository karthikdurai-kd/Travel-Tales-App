# Travel Tales App

Travel Tales App is a serverless web application designed to provide users with an interactive platform to share and explore travel experiences. The frontend is built with React and TypeScript, while the backend is developed with AWS services to create a robust, scalable, and efficient infrastructure.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Architecture](#architecture)
- [Installation](#installation)
- [Running the Application](#app-run)

## Features

- Users can create and share their travel experiences with others through the app. They can write detailed narratives, share photos, locations to enrich their stories.
- Users can explore a diverse collection of travel stories shared by other members of the community
- User authentication powered by AWS Cognito, ensuring that only authorized users can access and interact with the application. AWS Cognito Identity Pool is utilized to provide authenticated users with temporary credentials to access AWS services securely.
- AWS S3 Bucket is used to securely store photos uploaded by users. This ensures that photos are stored safely and are accessible only to authorized users.

## Technologies Used

### Frontend

- React
- TypeScript
- AWS Amplify

### Backend

- AWS Lambda
- AWS API Gateway
- AWS DynamoDB
- AWS S3
- AWS Cognito (User Pool and Identity Pool)
- AWS CDK
- AWS CloudFormation

## Architecture

The Travel Tales App is a serverless application using follows AWS services:

- **AWS CDK**: Used for defining cloud infrastructure as code.
- **AWS Lambda**: Functions to handle backend logic.
- **AWS API Gateway**: Created RESTful APIs and linked them with NodeJS Lambda functions.
- **AWS S3**: Created S3 Bucket to store the images uploaded by the user and stored S3 URL in the DynamoDb table
- **AWS DynamoDB**: NoSQL database for storing user data and travel tales.
- **AWS Cognito**: Manages user authentication and authorization.
- **AWS Amplify**: Facilitates interaction between the React frontend and AWS services.
- **AWS CloudFormation**: Uses Template files created by AWS CDK in order to create various AWS infrastructure stacks

## Installation

### Prerequisites

- Node.js
- AWS CLI configured with appropriate permissions
- AWS CDK installed globally (`npm install -g aws-cdk`)

### Steps

1. **Clone the repository:**

   ```bash
   git clone https://github.com/karthikdurai-kd/Travel-Tales-App.git
   cd Travel-Tales-App
   ```

2. **Install frontend dependencies:**

   ```bash
   cd Frontend
   npm install
   ```

3. **Deploy backend services:**
   ```bash
   cd ../Backend
   cdk deploy
   ```

## Running the Frontend

To start the application, navigate to the frontend directory and run:

```bash
cd Frontend
npm run dev
```
