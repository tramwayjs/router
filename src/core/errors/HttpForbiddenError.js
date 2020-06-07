import HttpError from "./HttpError";
import { FORBIDDEN } from "http-status-codes";

export default class HttpForbiddenError extends HttpError {
    statusCode = FORBIDDEN;
}
