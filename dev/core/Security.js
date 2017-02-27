import Authentication from "./Authentication";
import AuthenticationStrategy from "./policies/AuthenticationStrategy";

/**
 * @export
 * @class Security
 */
export default class Security {
    /**
     * Creates an instance of Security.
     * @param {AuthenticationStrategy} authenticationPolicy
     * @return {function(Object, Object, function(Object, Object))}
     * @memberOf Security
     */
    constructor(authenticationPolicy){
        let authentication = new Authentication(authenticationPolicy);
        return function authenticate(req, res, next){
            return authentication.check(function(err, result) {
                if(err) {
                    return res.redirect(401, authenticationPolicy.getRedirectRoute());
                } else {
                    return next();
                }
            });
        }
    }
}