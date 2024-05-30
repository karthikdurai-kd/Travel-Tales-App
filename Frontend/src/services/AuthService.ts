import { type CognitoUser } from "@aws-amplify/auth";
import { Amplify, Auth } from "aws-amplify";
import { AuthStack } from "../../../Backend/outputs.json";

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
  private user: CognitoUser | undefined;

  public async login(
    userName: string,
    password: string
  ): Promise<object | undefined> {
    try {
      this.user = (await Auth.signIn(userName, password)) as CognitoUser;
      return this.user;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  public getUserName() {
    return this.user?.getUsername();
  }
}
