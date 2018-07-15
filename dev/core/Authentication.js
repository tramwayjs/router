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
     * @memberOf Authentication
     */
    async login() {
        return await this.strategy.login();
    }

    /**
     * @memberOf Authentication
     */
    async logout() {
        return await this.strategy.logout();
    }

    /**
     * @memberOf Authentication
     */
    async check() {
        return await this.strategy.check();
    }

    /**
     * @returns {AuthenticationStrategy}
     * @memberOf Authentication
     */
    getStrategy() {
        return this.strategy;
    }
}