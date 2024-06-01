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
import { addCORSHeader } from "../../utils/addCORSHeader";

// Creating DynamoDB object
const dynamoDBObj = new DynamoDBClient({});

// "spacesHandler" function that returns a simple message with a 200 status code
async function spacesHandler(event: APIGatewayProxyEvent, context: Context) {
  // Response message
  let response: APIGatewayProxyResult;

  try {
    switch (event.httpMethod) {
      case "GET":
        const getResponse = await getSpaces(event, dynamoDBObj);
        response = getResponse;
        break;

      case "POST":
        const postResponse = await postSpaces(event, dynamoDBObj); // Calling postSpace function which handles the logic of inserting data into DynamoDB Table
        response = postResponse;
        break;

      case "PUT":
        const putResponse = await updateSpace(event, dynamoDBObj); // Calling postSpace function which handles the logic of inserting data into DynamoDB Table
        response = putResponse;
        break;

      case "DELETE":
        const deleteResponse = await deleteSpace(event, dynamoDBObj);
        response = deleteResponse;
        break;

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

  addCORSHeader(response); // Adding CORS Header
  return response;
}

export { spacesHandler };
