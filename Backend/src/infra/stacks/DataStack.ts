import { CfnOutput, Stack, StackProps } from "aws-cdk-lib";
import { AttributeType, ITable, Table } from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";
import { getAWSURLSuffix } from "../../utils/getSuffixData";
import {
  Bucket,
  BucketAccessControl,
  HttpMethods,
  IBucket,
} from "aws-cdk-lib/aws-s3";
import { AnyPrincipal, PolicyStatement } from "aws-cdk-lib/aws-iam";

// This stack is used to store data in DynamoDB Table

export class DataStack extends Stack {
  // To access dynamodb table "spacesTable", we create a read only field spacesTable
  public readonly spacesTable: ITable;

  // To access S3 Bucket "photosBucket", we create a read only field photosBucket
  public readonly photosBucket: IBucket;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // We will get the AWS URL Suffix data in order to append them in Table name to make every table unique
    const suffix = getAWSURLSuffix(this);

    // Here we will create DynamoDB Table
    this.spacesTable = new Table(this, "SpacesTable", {
      partitionKey: {
        name: "id",
        type: AttributeType.STRING,
      },
      tableName: `SpacesTable-${suffix}`,
    });

    // Here will create S3 Bucket for saving photos uploaded by the user from frontend
    this.photosBucket = new Bucket(this, "TableFinderPhotosBucket", {
      bucketName: `space-finder-photos-${suffix}`,
      cors: [
        {
          allowedMethods: [HttpMethods.HEAD, HttpMethods.GET, HttpMethods.PUT],
          allowedOrigins: ["*"],
          allowedHeaders: ["*"],
        },
      ],

      blockPublicAccess: {
        blockPublicAcls: false,
        blockPublicPolicy: false,
        ignorePublicAcls: false,
        restrictPublicBuckets: false,
      },
    });

    // // Add a bucket policy to allow public read access
    this.photosBucket.addToResourcePolicy(
      new PolicyStatement({
        actions: ["s3:GetObject"],
        resources: [`${this.photosBucket.bucketArn}/*`],
        principals: [new AnyPrincipal()],
      })
    );
    new CfnOutput(this, "TableFinderBucketName", {
      value: this.photosBucket.bucketName,
    });
  }
}
