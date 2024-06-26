import { App } from "aws-cdk-lib";
import { DataStack } from "./stacks/DataStack";
import { LambdaStack } from "./stacks/LambdaStack";
import { ApiStack } from "./stacks/ApiStack";
import { AuthStack } from "./stacks/AuthStack";
import { UiDeploymentStack } from "./stacks/UiDeploymentStack";

const app = new App();

// Calling stacks which we created

// 1. Creating DataStack object
const dataStack = new DataStack(app, "DataStack");

// 2. Creating LambdaStack object
const lambdaStack = new LambdaStack(app, "LamdaStack", {
  spacesTable: dataStack.spacesTable,
});

// 3. Creating Authentication Stack
const authStack = new AuthStack(app, "AuthStack", {
  photosBucket: dataStack.photosBucket,
});

// 4. Creating API Gatewat Stack Object
new ApiStack(app, "ApiStack", {
  spacesLambdaIntegration: lambdaStack.spacesLambaIntegrationProp,
  userPool: authStack.userPool,
});

// 5. AWS S3 Bucket Stack for hosting frontend
//new UiDeploymentStack(app, "UiDeploymentStack");
