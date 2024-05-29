import { Fn, Stack } from "aws-cdk-lib";

export function getAWSURLSuffix(stack: Stack) {
  const shortStackID = Fn.select(2, Fn.split("/", stack.stackId));
  const suffix = Fn.select(4, Fn.split("-", shortStackID));
  return suffix; //This will return the unique number present at the end of Stack URL
}
