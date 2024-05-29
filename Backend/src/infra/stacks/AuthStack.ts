import { CfnOutput, Stack, StackProps } from "aws-cdk-lib";
import {
  CfnIdentityPool,
  CfnUserPoolGroup,
  UserPool,
  CfnIdentityPoolRoleAttachment,
  UserPoolClient,
} from "aws-cdk-lib/aws-cognito";
import { Construct } from "constructs";
import {
  FederatedPrincipal,
  Role,
  PolicyStatement,
  Effect,
} from "aws-cdk-lib/aws-iam";

export class AuthStack extends Stack {
  public userPool: UserPool;
  private userPoolClient: UserPoolClient;
  private identityPool: CfnIdentityPool;
  private authenticatedRole: Role;
  private unAuthenticatedRole: Role;
  private adminRole: Role;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.createUserPool(); // Creating User Pool
    this.createUserPoolClient(); // Creating User Pool Client
    this.createIdentityPool(); // Creating Identity Pool for issuing Temporary access token to the user for accessing AWS Resources. Refer - https://chatgpt.com/c/78c0ea90-8d09-4e38-b754-6b2d6d66acd5
    this.createRoles(); // Creating Idetity Roles
    this.attachRoles(); // Attaching Roles
    this.createAdminsGroup(); // Creating Admins group
  }

  // createUserPool method
  private createUserPool() {
    this.userPool = new UserPool(this, "SpaceUserPool", {
      selfSignUpEnabled: true,
      signInAliases: {
        username: true,
        email: true,
      },
    });
    // Creating Output
    new CfnOutput(this, "SpaceUserPoolID", {
      value: this.userPool.userPoolId,
    });
  }

  // createUserPoolClient method
  private createUserPoolClient() {
    this.userPoolClient = this.userPool.addClient("SpaceUserPoolClient", {
      authFlows: {
        adminUserPassword: true,
        custom: true,
        userPassword: true,
        userSrp: true,
      },
    });
    // Creating Output
    new CfnOutput(this, "SpaceUserPoolClientID", {
      value: this.userPoolClient.userPoolClientId,
    });
  }

  private createAdminsGroup() {
    new CfnUserPoolGroup(this, "SpaceAdmins", {
      userPoolId: this.userPool.userPoolId,
      groupName: "admins",
      roleArn: this.adminRole.roleArn,
    });
  }

  // createIdentityPool() method for creating IdentityPool
  private createIdentityPool() {
    this.identityPool = new CfnIdentityPool(this, "SpaceIdentityPool", {
      allowUnauthenticatedIdentities: true,
      cognitoIdentityProviders: [
        {
          clientId: this.userPoolClient.userPoolClientId,
          providerName: this.userPool.userPoolProviderName,
        },
      ],
    });
    new CfnOutput(this, "SpaceIdentityPoolID", {
      value: this.identityPool.ref,
    });
  }

  private createRoles() {
    this.authenticatedRole = new Role(this, "CognitoDefaultAuthenticatedRole", {
      assumedBy: new FederatedPrincipal(
        "cognito-identity.amazonaws.com",
        {
          StringEquals: {
            "cognito-identity.amazonaws.com:aud": this.identityPool.ref,
          },
          "ForAnyValue:StringLike": {
            "cognito-identity.amazonaws.com:amr": "authenticated",
          },
        },
        "sts:AssumeRoleWithWebIdentity"
      ),
    });
    this.unAuthenticatedRole = new Role(
      this,
      "CognitoDefaultUnauthenticatedRole",
      {
        assumedBy: new FederatedPrincipal(
          "cognito-identity.amazonaws.com",
          {
            StringEquals: {
              "cognito-identity.amazonaws.com:aud": this.identityPool.ref,
            },
            "ForAnyValue:StringLike": {
              "cognito-identity.amazonaws.com:amr": "unauthenticated",
            },
          },
          "sts:AssumeRoleWithWebIdentity"
        ),
      }
    );
    this.adminRole = new Role(this, "CognitoAdminRole", {
      assumedBy: new FederatedPrincipal(
        "cognito-identity.amazonaws.com",
        {
          StringEquals: {
            "cognito-identity.amazonaws.com:aud": this.identityPool.ref,
          },
          "ForAnyValue:StringLike": {
            "cognito-identity.amazonaws.com:amr": "authenticated",
          },
        },
        "sts:AssumeRoleWithWebIdentity"
      ),
    });
    this.adminRole.addToPolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ["s3:ListAllMyBuckets"],
        resources: ["*"],
      })
    );
  }

  private attachRoles() {
    new CfnIdentityPoolRoleAttachment(this, "RolesAttachment", {
      identityPoolId: this.identityPool.ref,
      roles: {
        authenticated: this.authenticatedRole.roleArn,
        unauthenticated: this.unAuthenticatedRole.roleArn,
      },
      roleMappings: {
        adminsMapping: {
          type: "Token",
          ambiguousRoleResolution: "AuthenticatedRole",
          identityProvider: `${this.userPool.userPoolProviderName}:${this.userPoolClient.userPoolClientId}`,
        },
      },
    });
  }
}
