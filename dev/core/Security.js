import Authentication from "./Authentication";
import AuthenticationStrategy from "./policies/AuthenticationStrategy";

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
            try {
                await authentication.check();
            } catch (e) {
                return res.redirect(401, authenticationPolicy.getRedirectRoute());
            }
            return next();
        };
    }
}