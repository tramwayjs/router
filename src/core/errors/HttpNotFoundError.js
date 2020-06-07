import { NOT_FOUND } from 'http-status-codes';
import HttpError from './HttpError';

export default class HttpNotFoundError extends HttpError {
    statusCode = NOT_FOUND;
}
