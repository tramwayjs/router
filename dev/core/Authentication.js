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
    async login(request) {
        return await this.strategy.login(request);
    }

    /**
     * @memberOf Authentication
     */
    async logout(request) {
        return await this.strategy.logout(request);
    }

    /**
     * @memberOf Authentication
     */
    async check(request) {
        return await this.strategy.check(request);
    }

    /**
     * @returns {AuthenticationStrategy}
     * @memberOf Authentication
     */
    getStrategy() {
        return this.strategy;
    }
}