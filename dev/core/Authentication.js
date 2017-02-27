import AuthenticationStrategy from './policies/AuthenticationStrategy';
import {services} from 'tramway-core';
let {TypeEnforcementService} = services;

/**
 * @export
 * @class Authentication
 */
export default class Authentication {
    /**
     * Creates an instance of Authentication.
     * @param {AuthenticationStrategy} authenticationStrategy
     * 
     * @memberOf Authentication
     */
    constructor(authenticationStrategy) {
        this.strategy = TypeEnforcementService.enforceInstance(authenticationStrategy, AuthenticationStrategy);
    }

    /**
     * @param {function(Error, Object)} cb
     * @returns {function(Error, Object)} cb
     * 
     * @memberOf Authentication
     */
    login(cb) {
        return this.strategy.login(cb);
    }

    /**
     * @param {function(Error, Object)} cb
     * @returns {function(Error, Object)} cb
     * 
     * @memberOf Authentication
     */
    logout(cb) {
        return this.strategy.logout(cb);
    }

    /**
     * @param {function(Error, boolean)} cb
     * @returns {function(Error, boolean)} cb
     * 
     * @memberOf Authentication
     */
    check(cb) {
        return this.strategy.check(cb);
    }

    /**
     * @returns {AuthenticationStrategy}
     * @memberOf Authentication
     */
    getStrategy() {
        return this.strategy;
    }
}