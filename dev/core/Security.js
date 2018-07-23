import Authentication from "./Authentication";
import {AuthenticationStrategy} from "./policies";
import { HttpStatus } from "../index";

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
                return res.redirect(HttpStatus.UNAUTHORIZED, authenticationPolicy.getRedirectRoute());
            }

            res.locals = result;
            return next();
        };
    }
}