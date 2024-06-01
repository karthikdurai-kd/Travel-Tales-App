import { AuthService } from "./AuthService";
import { DataStack } from "../../../Backend/outputs.json";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

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
    console.log("calling create space!!");
    if (photo) {
      const uploadUrl = await this.uploadPublicFile(photo);
      console.log(uploadUrl);
    }
    return "123";
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
