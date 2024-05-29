import { AuthService } from "./AuthService";
import { ListBucketsCommand, S3Client } from "@aws-sdk/client-s3";
import * as path from "path";
import * as dotenv from "dotenv";

// Setting up dotenv file path
dotenv.config({ path: path.join(__dirname, "../.env") });
async function testAuth() {
  const authServiceObj = new AuthService();
  // 1. Logging In User and getting JWT Tokens
  const loginResponse = await authServiceObj.loginUser(
    process.env.AWS_USER_1_USERNAME,
    process.env.AWS_USER_1_PASSWORD
  );

  // 2. Getting Temporary tokens in order to access AWS Resources
  const credentials = await authServiceObj.generateTemporaryCredentials(
    loginResponse
  );

  // 3. Accessing AWS Resources, here we are accessing AWS S3 buckets
  const buckets = await listBuckets(credentials);
  console.log(buckets);
}

async function listBuckets(credentials: any) {
  const client = new S3Client({
    credentials: credentials,
  });
  const command = new ListBucketsCommand({});
  const result = await client.send(command);
  return result;
}

testAuth();
