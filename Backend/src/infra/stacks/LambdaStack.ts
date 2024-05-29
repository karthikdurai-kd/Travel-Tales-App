import { Stack, StackProps } from "aws-cdk-lib";
import { LambdaIntegration } from "aws-cdk-lib/aws-apigateway";
import { ITable } from "aws-cdk-lib/aws-dynamodb";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Code, Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { join } from "path";

interface LambdaStackProps extends StackProps {
  spacesTable: ITable;
}

export class LambdaStack extends Stack {
  public readonly spacesLambaIntegrationProp: LambdaIntegration;

  constructor(scope: Construct, id: string, props: LambdaStackProps) {
    super(scope, id, props);

    // Creating a NodeJS Lambda to execute NodeJS Backend code
    const spacesLambdaStack = new NodejsFunction(this, "SpacesLambda", {
      runtime: Runtime.NODEJS_18_X,
      handler: "spacesHandler",
      entry: join(
        __dirname,
        "..",
        "..",
        "services",
        "spaces",
        "spacesHandler.ts"
      ),
      environment: {
        TABLE_NAME: props.spacesTable.tableName,
      },
    });

    // Adding some rules and policy to our LamdaStack in order to insert data into DynamoDB Table
    spacesLambdaStack.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        resources: [props.spacesTable.tableArn],
        actions: [
          "dynamodb:PutItem",
          "dynamodb:Scan",
          "dynamodb:GetItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
        ],
      })
    );

    // Now we are saving the LambdaFunction object in the Lambda Integration
    this.spacesLambaIntegrationProp = new LambdaIntegration(spacesLambdaStack);
  }
}
