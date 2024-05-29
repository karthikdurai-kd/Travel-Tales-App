import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { v4 } from "uuid";
import { postSpaces } from "./PostSpace";
import { getSpaces } from "./GetSpace";
import { updateSpace } from "./UpdateSpace";
import { deleteSpace } from "./deleteSpace";
import { JsonError, MissingFieldError } from "../validator/Validator";

// Creating DynamoDB object
const dynamoDBObj = new DynamoDBClient({});

// "spacesHandler" function that returns a simple message with a 200 status code
async function spacesHandler(event: APIGatewayProxyEvent, context: Context) {
  // Response message
  let message: string;

  try {
    switch (event.httpMethod) {
      case "GET":
        const getResponse = await getSpaces(event, dynamoDBObj);
        return getResponse;

      case "POST":
        const postResponse = await postSpaces(event, dynamoDBObj); // Calling postSpace function which handles the logic of inserting data into DynamoDB Table
        return postResponse;

      case "PUT":
        const putResponse = await updateSpace(event, dynamoDBObj); // Calling postSpace function which handles the logic of inserting data into DynamoDB Table
        return putResponse;

      case "DELETE":
        const deleteResponse = await deleteSpace(event, dynamoDBObj);
        return deleteResponse;

      default:
        break;
    }
  } catch (err) {
    if (err instanceof MissingFieldError) {
      // Missing Field Errors
      return {
        statusCode: 400,
        body: JSON.stringify(err.message),
      };
    } else if (err instanceof JsonError) {
      // Json Parser Error
      return {
        statusCode: 400,
        body: JSON.stringify(err.message),
      };
    } else {
      return {
        // All other error are server errors
        statusCode: 500,
        body: JSON.stringify(err.messsage),
      };
    }
  }

  const response: APIGatewayProxyResult = {
    statusCode: 200,
    body: JSON.stringify(message),
  };
  console.log(event);
  return response;
}

export { spacesHandler };
