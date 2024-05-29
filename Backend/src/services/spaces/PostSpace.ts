import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { v4 } from "uuid";
import { validateSpaceEntry } from "../validator/Validator";
import { jsonParser } from "../../utils/jsonParser";

async function postSpaces(
  event: APIGatewayProxyEvent,
  dynamoDBClientObj: DynamoDBClient
): Promise<APIGatewayProxyResult> {
  // Generating random id using UUID library
  const randomID = v4();
  const data = jsonParser(event.body); // Calling jsonParser method for checking whether json data sent from frontend is valid or invalid
  // Adding randomID which we generated to body messgage
  data.id = randomID;
  validateSpaceEntry(data); // Calling "validateSpaceEntry" method for checking if any data is missed while sending

  // Now saving the body messge in DynamoDB Table
  const result = await dynamoDBClientObj.send(
    new PutItemCommand({
      TableName: process.env.TABLE_NAME,
      Item: marshall(data), // Marshalling here means datatype of each field which we added below will be done automatically
      /*Item: {
      //   id: {
      //     S: randomID, // "S" stands for String. In each data which we get from front-end we need to add id. We have set this rule in "DataStack"
      //   },
      //   location: {
      //     S: data.location, // we will recieve the "location" field from front end
      //   },
      // }*/
    })
  );
  console.log(result);

  return {
    statusCode: 201,
    body: JSON.stringify({
      id: randomID,
      message: "Data is added successfully",
    }), // Sending the ID of the data which we stored in DynamoDB Table
  };
}

export { postSpaces };
