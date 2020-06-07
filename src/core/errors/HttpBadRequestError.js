import { BAD_REQUEST } from "http-status-codes";
import HttpError from "./HttpError";

export default class HttpBadRequestError extends HttpError {
    statusCode = BAD_REQUEST;
}