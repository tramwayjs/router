import {AbstractMethodError} from '../errors';
import Policy from './Policy';

/**
 * @abstract
 * @export
 * @class AuthenticationStrategy
 */
export default class AuthenticationStrategy extends Policy {
    /**
     * Creates an instance of AuthenticationStrategy.
     * @param {string} redirectRoute
     * 
     * @memberOf AuthenticationStrategy
     */
    constructor(redirectRoute) {
        super();
        this.redirectRoute = redirectRoute;
    }

    /**
     * @throws {Error}
     * @memberOf AuthenticationStrategy
     */
    async login(request) {
        throw new AbstractMethodError();
    }

    /**
     * @memberOf AuthenticationStrategy
     */
    async logout(request){
        throw new AbstractMethodError();
    }

    /**
     * @returns {string}
     * 
     * @memberOf AuthenticationStrategy
     */
    getRedirectRoute() {
        return this.redirectRoute;
    }
}
