// import { URL_PREFIX } from "@src/constants";
// import { Context } from "@src/contracts/context";
// import { FastifyInstance, RouteHandlerMethod } from "fastify";
// import { IncomingMessage, ServerResponse } from "http";

// type Oito = RouteHandlerMethod
// type Fn = (req: IncomingMessage, res: ServerResponse, ctx: Context) => Oito
// export function applyRoute (app: FastifyInstance, entrie: [string, Fn], ctx: Context) {
//   const [route, cb] = entrie;
//   const path = `${URL_PREFIX}${route}`;
//   ctx.parentLogger.debug(`Registering route ${path}`);

//   const handler = (req: IncomingMessage, res: ServerResponse) => cb(req, res, ctx) as unknown as RouteHandlerMethod;
//   return app.post(path, handler);
// }