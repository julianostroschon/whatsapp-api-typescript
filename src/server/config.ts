export const HOST = 'http://localhost:3001/api/v1/send';
export const SECRET = process.env.SECRET || 'segredo';
export const BASE_ROUTE = '/api/v1/send';
export const ALLOWED_METHODS = ['POST'];

export const HTTP_STATUS = {
  METHOD_NOT_ALLOWED: 405,
  NOT_FOUND: 404,
  OK: 200,
};