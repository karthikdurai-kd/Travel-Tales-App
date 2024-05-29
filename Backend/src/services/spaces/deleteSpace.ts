import {
  DeleteItemCommand,
  DynamoDBClient,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { hasAdminsGroup } from "../../utils/hasAdmins";

async function deleteSpace(
  event: APIGatewayProxyEvent,
  dynamoDBClientObj: DynamoDBClient
): Promise<APIGatewayProxyResult> {
  // Checking if the user is part of "admins" group and if the user is part of group then he will be able to perform delete operation otherwise he cannot
  if (!hasAdminsGroup(event)) {
    return {
      statusCode: 401,
      body: JSON.stringify("You are not allowed to perform this operation!!!"),
    };
  }

  if (event.queryStringParameters && "id" in event.queryStringParameters) {
    const spaceID = event.queryStringParameters["id"];
    // Deleting the data based on "id" sent from front-end
    await dynamoDBClientObj.send(
      new DeleteItemCommand({
        TableName: process.env.TABLE_NAME,
        Key: {
          id: { S: spaceID },
        },
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify(`Deleted space of ID: ${spaceID}`), // Sending the updated result
    };
  } else {
    return {
      statusCode: 400,
      body: JSON.stringify("Please provide valid arguments!!!"),
    };
  }
}

export { deleteSpace };
