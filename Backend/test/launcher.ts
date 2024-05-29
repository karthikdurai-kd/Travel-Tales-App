import { spacesHandler } from "../src/services/spaces/spacesHandler";

spacesHandler(
  {
    httpMethod: "POST",
    // queryStringParameters: {
    //   id: "ad67aa83-6c7f-484d-be1e-3b5543c90756", // JSON.stringify is used only when we need to send object, here we are directly sending string
    // },
    body: JSON.stringify({
      location: "California",
    }),
  } as any,
  {} as any
).then((response) => {
  console.log(response);
});
