import HttpError from "./HttpError";
import { UNAUTHORIZED } from 'http-status-codes';

export default class HttpUnauthorizedError extends HttpError {
    statusCode = UNAUTHORIZED;
}