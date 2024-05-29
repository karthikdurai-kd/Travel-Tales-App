import { APIGatewayProxyEvent } from "aws-lambda";

export function hasAdminsGroup(event: APIGatewayProxyEvent) {
  const group = event.requestContext.authorizer?.claims["cognito:groups"];
  if (group) {
    return (group as string).includes("admins"); // Refer what is the use of this line - https://chatgpt.com/c/a4be3056-711d-4790-a8e5-5af67fb95360
  }
  return false;
}
