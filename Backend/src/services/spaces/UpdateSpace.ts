import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

async function updateSpace(
  event: APIGatewayProxyEvent,
  dynamoDBClientObj: DynamoDBClient
): Promise<APIGatewayProxyResult> {
  if (
    event.queryStringParameters &&
    "id" in event.queryStringParameters &&
    event.body
  ) {
    // Get all the data sent in body from the front end
    const parsedRequestBody = JSON.parse(event.body);
    const spaceID = event.queryStringParameters["id"];
    const updateFieldKey = Object.keys(parsedRequestBody)[0]; // Getting the key to be updated
    const updateFieldValue = parsedRequestBody[updateFieldKey]; // Geting the value to be updated
    const updateResult = await dynamoDBClientObj.send(
      new UpdateItemCommand({
        TableName: process.env.TABLE_NAME,
        Key: {
          id: { S: spaceID },
        },
        UpdateExpression: "set #zzzNew= :new",
        ExpressionAttributeValues: {
          ":new": {
            S: updateFieldValue,
          },
        },
        ExpressionAttributeNames: {
          "#zzzNew": updateFieldKey,
        },
        ReturnValues: "UPDATED_NEW",
      })
    );
    return {
      statusCode: 200,
      body: JSON.stringify(`Data of ID ${spaceID} is updated successfully`), // Sending the updated result
    };
  } else {
    return {
      statusCode: 400,
      body: JSON.stringify("Please provide valid arguments!!!"),
    };
  }
}

export { updateSpace };
