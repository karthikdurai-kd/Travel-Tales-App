import { type CognitoUser } from "@aws-amplify/auth";
import { Amplify, Auth } from "aws-amplify";
import { AuthStack } from "../../../Backend/outputs.json";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";

const awsRegion = "us-east-1";

Amplify.configure({
  Auth: {
    mandatorySignIn: false,
    region: awsRegion,
    userPoolId: AuthStack.SpaceUserPoolID,
    userPoolWebClientId: AuthStack.SpaceUserPoolClientID,
    identityPoolId: AuthStack.SpaceIdentityPoolID,
    authenticationFlowType: "USER_PASSWORD_AUTH",
  },
});

export class AuthService {
  // Saving User Data that we get from AWS Cognito
  private user: CognitoUser | undefined;

  // JWT Token that we from AWS Cognito
  public jwtToken: string | undefined;

  // Cognito User Pool Temporary Credentials
  private temporaryCredentials: object | undefined;

  // Check if the user is logged in or not
  public isAuthorized() {
    if (this.user) {
      return true;
    }
    return false;
  }

  public async login(
    userName: string,
    password: string
  ): Promise<object | undefined> {
    try {
      // Calling User Login API
      this.user = (await Auth.signIn(userName, password)) as CognitoUser;
      // Once user logged in, we get JWT Token
      this.jwtToken = this.user
        ?.getSignInUserSession()
        ?.getIdToken()
        .getJwtToken();
      return this.user;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  // Getting Temporary Credentials when needed by DataStack.ts. So Lazy Loading is implemented here
  public async getTemporaryCredentials() {
    if (this.temporaryCredentials) {
      return this.temporaryCredentials;
    }
    this.temporaryCredentials = await this.generateTemporaryCredentials();
    return this.temporaryCredentials;
  }

  // Generating AWS CognitoPool Temporary Credentials to access AWS S3 Bucket
  private async generateTemporaryCredentials() {
    const cognitoIdentityPool = `cognito-idp.${awsRegion}.amazonaws.com/${AuthStack.SpaceUserPoolID}`;
    const cognitoIdentity = new CognitoIdentityClient({
      credentials: fromCognitoIdentityPool({
        clientConfig: {
          region: awsRegion,
        },
        identityPoolId: AuthStack.SpaceIdentityPoolID,
        logins: {
          [cognitoIdentityPool]: this.jwtToken!,
        },
      }),
    });
    const credentials = await cognitoIdentity.config.credentials();
    return credentials;
  }

  // Getting Logged In Username
  public getUserName() {
    return this.user?.getUsername();
  }
}
