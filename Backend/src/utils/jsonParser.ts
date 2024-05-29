import { JsonError } from "../services/validator/Validator";

// This method is used to parse json data which we get from front end and if "data" is not in form of json or if there is any error in parsing the data, then it will send error to front end
export function jsonParser(arg: string) {
  try {
    return JSON.parse(arg);
  } catch (err) {
    throw new JsonError(err); // Returning JsonError class
  }
}
