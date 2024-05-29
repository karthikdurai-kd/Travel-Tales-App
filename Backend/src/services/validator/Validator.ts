import { SpaceEntry } from "../model/Model";

// Missing Field Error class - Only for missing fields data sent from front end
export class MissingFieldError extends Error {
  constructor(missingField: string) {
    super(`Value for ${missingField} expected!`);
  }
}

// JsonError class - Only for invalid json data sent from front end
export class JsonError extends Error {}

export function validateSpaceEntry(arg: any) {
  if ((arg as SpaceEntry).id == undefined) {
    throw new MissingFieldError("ID");
  }
  if ((arg as SpaceEntry).location == undefined) {
    throw new MissingFieldError("location");
  }
  if ((arg as SpaceEntry).name == undefined) {
    throw new MissingFieldError("name");
  }
}
