import { AuthService } from "./AuthService";
import { DataStack, ApiStack } from "../../../Backend/outputs.json";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

// API Endpoint of our backend AWS API Gateway
const travelTalesAPIEndpoint = ApiStack.SpacesApiEndpoint36C4F3B6 + "spaces";

export class DataService {
  // Accessing AuthService methods like getting tokens etc...
  private authService: AuthService;
  // Creating S3 Client Object in order to upload Photos
  private s3Client: S3Client | undefined;
  private awsRegion = "us-east-1";

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  // createSpace method where "name", "location", "photo" will be saved in backend dynamodb table
  public async createSpace(name: string, location: string, photo?: File) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const spaceData = {} as any;
    spaceData.name = name;
    spaceData.location = location;
    if (photo) {
      const uploadUrl = await this.uploadPublicFile(photo);
      spaceData.photoURL = uploadUrl;
    }
    // Now we will call POST API for saving data - https://nvmj5xcujb.execute-api.us-east-1.amazonaws.com/prod/spaces
    const createSpaceAPIResponse = await fetch(travelTalesAPIEndpoint, {
      method: "POST",
      body: JSON.stringify(spaceData),
      headers: {
        Authorization: this.authService.jwtToken!, // We are using "!" because it indicates optional or access data if it is available
      },
    });
    const createSpaceAPIResponseJSON = await createSpaceAPIResponse.json();
    console.log(createSpaceAPIResponseJSON);
    return createSpaceAPIResponseJSON.id;
  }

  public isAuthorized() {
    return true;
  }

  // Upload Public file method where we will save photos in S3 Bucket and get the url of uploaded photo
  private async uploadPublicFile(file: File) {
    const credentials = await this.authService.getTemporaryCredentials();
    if (!this.s3Client) {
      this.s3Client = new S3Client({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        credentials: credentials as any,
        region: this.awsRegion,
      });
    }
    const command = new PutObjectCommand({
      Bucket: DataStack.TableFinderBucketName,
      Key: file.name,
      Body: file,
    });
    await this.s3Client.send(command);
    return `https://${command.input.Bucket}.s3.${this.awsRegion}.amazonaws.com/${command.input.Key}`;
  }
}
