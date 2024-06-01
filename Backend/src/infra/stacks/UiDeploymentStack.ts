import { CfnOutput, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { getAWSURLSuffix } from "../../utils/getSuffixData";
import { Bucket, BucketAccessControl } from "aws-cdk-lib/aws-s3";
import { join } from "path";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import { Distribution, OriginAccessIdentity } from "aws-cdk-lib/aws-cloudfront";
import { S3Origin } from "aws-cdk-lib/aws-cloudfront-origins";
import { existsSync } from "fs";

// This stack is used for hosting frontend

export class UiDeploymentStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // getting suffix [AWS Unique number at end of this stack URL]
    const suffix = getAWSURLSuffix(this);

    // Creating deployment bucket
    const deploymentBucket = new Bucket(this, "uiDeploymentBucket", {
      bucketName: `travel-tales-app-${suffix}`,
      accessControl: BucketAccessControl.PRIVATE, // Make bucket private
      websiteIndexDocument: "index.html",
    });

    const uiDir = join(__dirname, "..", "..", "..", "..", "Frontend", "dist");

    if (!existsSync(uiDir)) {
      console.warn("UI Directory not found");
      return;
    }
    // Setting up permission
    const originIdentity = new OriginAccessIdentity(
      this,
      "OriginAccessIdentity"
    );
    deploymentBucket.grantRead(originIdentity);

    const distribution = new Distribution(this, "TravelTalesAppDistribution", {
      defaultRootObject: "index.html",
      defaultBehavior: {
        origin: new S3Origin(deploymentBucket, {
          originAccessIdentity: originIdentity,
        }),
      },
    });

    new BucketDeployment(this, "travel-tales-app-deployment", {
      destinationBucket: deploymentBucket,
      sources: [Source.asset(uiDir)],
      distribution, // Invalidate CloudFront cache after deployment
      distributionPaths: ["/*"],
    });

    new CfnOutput(this, "TravelTalesAppURL", {
      value: distribution.distributionDomainName,
    });
  }
}

// import { CfnOutput, Stack, StackProps } from "aws-cdk-lib";
// import { Construct } from "constructs";
// import { getAWSURLSuffix } from "../../utils/getSuffixData";
// import { Bucket, BucketAccessControl } from "aws-cdk-lib/aws-s3";
// import { join } from "path";
// import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
// import {
//   Distribution,
//   OriginAccessIdentity,
//   ViewerProtocolPolicy,
// } from "aws-cdk-lib/aws-cloudfront";
// import { S3Origin } from "aws-cdk-lib/aws-cloudfront-origins";
// import { existsSync } from "fs";
// import { PolicyStatement, Effect } from "aws-cdk-lib/aws-iam";

// export class UiDeploymentStack extends Stack {
//   constructor(scope: Construct, id: string, props?: StackProps) {
//     super(scope, id, props);

//     // Getting suffix [AWS Unique number at end of this stack URL]
//     const suffix = getAWSURLSuffix(this);

//     // Creating deployment bucket
//     const deploymentBucket = new Bucket(this, "uiDeploymentBucket", {
//       bucketName: `travel-tales-app-${suffix}`,
//       accessControl: BucketAccessControl.PRIVATE, // Make bucket private
//       websiteIndexDocument: "index.html",
//     });

//     const uiDir = join(__dirname, "..", "..", "..", "..", "Frontend", "dist");

//     if (!existsSync(uiDir)) {
//       console.warn("UI Directory not found");
//       return;
//     }

//     // Setting up Origin Access Identity
//     const originIdentity = new OriginAccessIdentity(
//       this,
//       "OriginAccessIdentity"
//     );

//     // Attach Bucket Policy to allow CloudFront access
//     deploymentBucket.addToResourcePolicy(
//       new PolicyStatement({
//         effect: Effect.ALLOW,
//         actions: ["s3:GetObject"],
//         resources: [deploymentBucket.bucketArn + "/*"],
//         principals: [originIdentity.grantPrincipal],
//       })
//     );

//     // Creating CloudFront Distribution
//     const distribution = new Distribution(this, "TravelTalesAppDistribution", {
//       defaultRootObject: "index.html",
//       defaultBehavior: {
//         origin: new S3Origin(deploymentBucket, {
//           originAccessIdentity: originIdentity,
//         }),
//         viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
//       },
//     });

//     // Deploy the UI files to the S3 bucket
//     new BucketDeployment(this, "travel-tales-app-deployment", {
//       destinationBucket: deploymentBucket,
//       sources: [Source.asset(uiDir)],
//       distribution, // Invalidate CloudFront cache after deployment
//       distributionPaths: ["/*"],
//     });

//     // Output the CloudFront Distribution Domain Name
//     new CfnOutput(this, "TravelTalesAppURL", {
//       value: distribution.distributionDomainName,
//     });
//   }
// }
