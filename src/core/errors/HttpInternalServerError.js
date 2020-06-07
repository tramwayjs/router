import HttpError from "./HttpError";
import { INTERNAL_SERVER_ERROR } from "http-status-codes";

export default class HttpInternalServerError extends HttpError {
    statusCode = INTERNAL_SERVER_ERROR;
}
