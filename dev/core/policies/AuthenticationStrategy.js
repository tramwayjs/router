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
     * @param {function(Error, Object)} cb
     * @returns {function(Error, Object)} cb
     * 
     * @memberOf AuthenticationStrategy
     */
    login(cb) {
        throw new AbstractMethodError();
    }

    /**
     * @param {function(Error, Object)} cb
     * @returns {function(Error, Object)} cb
     * 
     * @memberOf AuthenticationStrategy
     */
    logout(cb){
        throw new AbstractMethodError();
    }

    /**
     * @param {function(Error, boolean)} cb
     * @returns {function(Error, boolean)} cb
     * 
     * @memberOf AuthenticationStrategy
     */
    check(cb){
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