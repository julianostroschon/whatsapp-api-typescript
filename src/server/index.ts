// import { verify } from 'jsonwebtoken';
import { buildClient } from '../services/whatsapp';
import { createServer } from 'http';

// import { validateRequest } from '../util';
// import WhatsAppClient from '../services/whatsapp';

export async function buildServer(clientId = 'client-one') {
  const { sendMessage } = await buildClient(clientId);

  const app = createServer(async (request, response) => {
    console.log(request, response)
    // await client.initialize()
    // validateRequest(request, response);
    // if (response.statusCode === HTTP_STATUS.OK) {
    //   request.on('data', (data) => {
    //     const { token } = JSON.parse(data.toString());
    //     verify(
    //       token,
    //       SECRET,
    //       { complete: true },
    //       async (errorInValidationToken, decoded) => {
    //         response.writeHead(HTTP_STATUS.OK, {
    //           'Content-Type': 'application/json',
    //         });
    //         if (errorInValidationToken) {
    //           return constructResponse(response, errorMessage('Invalid token'));
    //         }
    //         const {
    //           phonenumber = null,
    //           message = null,
    //           origin = null,
    //         } = decoded?.payload;
    //         if (!message) {
    //           return constructResponse(
    //             response,
    //             errorMessage('Payload not found')
    //           );
    //         }
    //         return constructResponse(
    //           response,
    //           await sendMessage(phonenumber, message, origin)
    //         );
    //       }
    //     );
    //   });
    // }
  });

  return {
    listen: async (port: number | string) => {
      // await client.initialize()
      app.listen(port);
      console.log(`Server running in port ${port}!`);
    },
  };
}

module.exports = { buildServer };
