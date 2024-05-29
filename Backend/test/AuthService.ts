import { CognitoUser } from "@aws-amplify/auth";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import { Amplify, Auth } from "aws-amplify";
import * as path from "path";
import * as dotenv from "dotenv";

// Setting up dotenv file path
dotenv.config({ path: path.join(__dirname, "../.env") });

const awsRegion = "us-east-1";

Amplify.configure({
  Auth: {
    region: awsRegion,
    userPoolId: process.env.USER_POOL_ID,
    userPoolWebClientId: process.env.USER_POOL_WEBCLIENT_ID,
    identityPoolId: process.env.IDENTITY_POOL_ID,
    authenticationFlowType: "USER_PASSWORD_AUTH",
  },
});

export class AuthService {
  // login method
  public async loginUser(username: string, password: string) {
    const result = await Auth.signIn({
      username,
      password,
    });
    return result;
  }

  // Creating temporary credentials for the user   by Identity Pool in order to access AWS resources
  public async generateTemporaryCredentials(user: CognitoUser) {
    const jwtToken = user.getSignInUserSession().getIdToken().getJwtToken();
    const cognitoIdentityPool = `cognito-idp.${awsRegion}.amazonaws.com/${process.env.USER_POOL_ID}`;
    const cognitoIdentity = new CognitoIdentityClient({
      credentials: fromCognitoIdentityPool({
        identityPoolId: process.env.IDENTITY_POOL_ID,
        logins: {
          [cognitoIdentityPool]: jwtToken,
        },
      }),
    });
    const credentials = await cognitoIdentity.config.credentials();
    return credentials;
  }
}
