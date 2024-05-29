import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { v4 } from "uuid";

async function getSpaces(
  event: APIGatewayProxyEvent,
  dynamoDBClientObj: DynamoDBClient
): Promise<APIGatewayProxyResult> {
  // Getting data of particular ID
  if (event.queryStringParameters) {
    // If "id" is there is the query string parameter
    if ("id" in event.queryStringParameters) {
      const spaceID = event.queryStringParameters["id"]; // Will get the ID
      const getItemResponse = await dynamoDBClientObj.send(
        new GetItemCommand({
          TableName: process.env.TABLE_NAME,
          Key: {
            id: { S: spaceID },
          },
        })
      );
      // If item of particular ID is found
      if (getItemResponse.Item) {
        const unmarshalledItemResponse = unmarshall(getItemResponse.Item); // This will remove the "type of data" that is appended while sending response like {id: {S:"34444"}}, here "S" denotes that id is of string type
        console.log(unmarshalledItemResponse);
        return {
          statusCode: 200,
          body: JSON.stringify(unmarshalledItemResponse),
        };
      }
      // If item of particular ID not found
      else {
        return {
          statusCode: 400,
          body: JSON.stringify("Cannot find item, Invalid ID provided"),
        };
      }
    }
    // If "id" is not there is query string parameter
    else {
      return {
        statusCode: 400,
        body: JSON.stringify("ID required!!!"),
      };
    }
  }

  // Getting all the data from table
  const result = await dynamoDBClientObj.send(
    new ScanCommand({
      TableName: process.env.TABLE_NAME,
    })
  );

  // UnMarshalling does not work on array as it works on individual object. To make it work on arrays, we need to use "map" and iterate through each object in array and unmarshall it individually
  const unmarshalledResponseData = result.Items?.map((data) =>
    unmarshall(data)
  );
  console.log(unmarshalledResponseData);

  return {
    statusCode: 200,
    body: JSON.stringify(unmarshalledResponseData), // Sending the ID of the data which we stored in DynamoDB Table
  };
}

export { getSpaces };
