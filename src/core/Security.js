import Authentication from "./Authentication";
import {AuthenticationStrategy} from "./policies";
import { HttpStatus } from "../index";
import { HttpError } from "./errors";

/**
 * @export
 * @class Security
 */
export default class Security {
    /**
     * 
     * @param {AuthenticationStrategy} authenticationPolicy 
     */
    generateMiddleware(authenticationPolicy) {
        let authentication = new Authentication(authenticationPolicy);
        return async (req, res, next) => {
            let result;
            try {
                result = await authentication.check(req);
            } catch (e) {
                if (e instanceof HttpError) {
                    return res.status(e.getStatusCode()).send(e.getMessage());
                }

                if (authenticationPolicy.getRedirectRoute()) {
                    return res.redirect(HttpStatus.UNAUTHORIZED, authenticationPolicy.getRedirectRoute());
                }

                return res.sendStatus(HttpStatus.UNAUTHORIZED);
            }

            res.locals = result;
            return next();
        };
    }
}