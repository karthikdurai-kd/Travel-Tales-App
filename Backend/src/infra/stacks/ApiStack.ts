import { Stack, StackProps } from "aws-cdk-lib";
import {
  AuthorizationType,
  CognitoUserPoolsAuthorizer,
  LambdaIntegration,
  MethodOptions,
  RestApi,
} from "aws-cdk-lib/aws-apigateway";
import { IUserPool } from "aws-cdk-lib/aws-cognito";
import { Construct } from "constructs";

// Thi stack is used for linking API's with Lambda function which has the NodeJS Server file

interface ApiStackProps extends StackProps {
  // This is the standard away of creating and accessing props which comes to this stack from some other stack
  spacesLambdaIntegration: LambdaIntegration;
  userPool: IUserPool;
}

export class ApiStack extends Stack {
  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    // Creating AWS API Gateway
    const api = new RestApi(this, "SpacesApi"); // Name of the API, think of file like a filename

    // Securing APIs by using Authorization
    const authorizer = new CognitoUserPoolsAuthorizer(
      this,
      "SpacesApiAuthorizer",
      {
        cognitoUserPools: [props.userPool],
        identitySource: "method.request.header.Authorization",
      }
    );
    authorizer._attachToApi(api);

    const optionsWithAuth: MethodOptions = {
      authorizationType: AuthorizationType.COGNITO,
      authorizer: {
        authorizerId: authorizer.authorizerId,
      },
    };

    const spaceResources = api.root.addResource("spaces"); // API End point - /spaces
    spaceResources.addMethod(
      "GET",
      props.spacesLambdaIntegration,
      optionsWithAuth
    ); // This API is a GET request and we are linking the lamdda function
    spaceResources.addMethod(
      "POST",
      props.spacesLambdaIntegration,
      optionsWithAuth
    ); // This API is a POST request and we are linking the lanbda function
    spaceResources.addMethod(
      "PUT",
      props.spacesLambdaIntegration,
      optionsWithAuth
    ); // This API is a POST request and we are linking the lanbda function
    spaceResources.addMethod(
      "DELETE",
      props.spacesLambdaIntegration,
      optionsWithAuth
    ); //  This API is a POST request and we are linking the lanbda function
  }
}
