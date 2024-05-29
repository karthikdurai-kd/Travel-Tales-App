import { Stack, StackProps } from "aws-cdk-lib";
import { AttributeType, ITable, Table } from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";
import { getAWSURLSuffix } from "../../utils/getSuffixData";

export class DataStack extends Stack {
  // To access this stack, we create a instance for the "Table object"
  public readonly spacesTable: ITable;

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
  }
}
