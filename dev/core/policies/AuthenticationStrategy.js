import {errors} from 'tramway-core';
let {AbstractMethodError} = errors;

/**
 * @abstract
 * @export
 * @class AuthenticationStrategy
 */
export default class AuthenticationStrategy {
    /**
     * Creates an instance of AuthenticationStrategy.
     * @param {string} redirectRoute
     * 
     * @memberOf AuthenticationStrategy
     */
    constructor(redirectRoute) {
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
     * @memberOf AuthenticationStrategy
     */
    async check(request){
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