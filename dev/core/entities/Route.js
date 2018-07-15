import {services} from 'tramway-core';
import AuthenticationStrategy from '../policies/AuthenticationStrategy';
import { Controller } from '../..';
let {TypeEnforcementService} = services;

/**
 * @export
 * @class Route
 */
export default class Route {
    /**
     * Creates an instance of Route.
     * 
     * @param {Object} route
     * 
     * @memberOf Route
     */
    constructor(route) {
        this.setPath(route.path)
            .setArguments(route.arguments)
            .setMethods(route.methods)
            .setController(route.controller)
            .setAction(route.action)
            .setPolicy(route.policy);
    }

    /**
     * @returns {string}
     * 
     * @memberOf Route
     */
    getPath() {
        return this.path;
    }

    /**
     * @param {string} path
     * @returns {Route}
     * 
     * @memberOf Route
     */
    setPath(path) {
        this.path = TypeEnforcementService.enforceTypes(path, "string", path => "");
        return this;
    }

    /**
     * @returns {string[]}
     * 
     * @memberOf Route
     */
    getArguments() {
        return this.arguments;
    }

    /**
     * @param {string[]} args
     * @returns {Route}
     * 
     * @memberOf Route
     */
    setArguments(args = "") {
        this.arguments = args;
        return this;
    }

    /**
     * @returns {string[]}
     * 
     * @memberOf Route
     */
    getMethods() {
        return this.methods;
    }

    /**
     * @param {string[]} methods
     * @returns {Route}
     * 
     * @memberOf Route
     */
    setMethods(methods = ["get"]) {
        this.methods = methods;
        return this;
    }

    /**
     * @returns {Controller}
     * 
     * @memberOf Route
     */
    getController() {
        return this.controller;
    }

    /**
     * @param {Controller} controller
     * @returns {Route}
     * 
     * @memberOf Route
     */
    setController(controller) {
        this.controller = controller || null;
        return this;
    }

    /**
     * @returns {string}
     */
    getAction() {
        return this.action;
    }

    /**
     * 
     * @param {string} action Name of the Controller method for the route
     * @returns {Route}
     */
    setAction(action) {
        this.action = action;
        return this;
    }

    /**
     * @returns {AuthenticationStrategy|null}
     * 
     * @memberOf Route
     */
    getPolicy() {
        return this.policy;
    }

    /**
     * @param {AuthenticationStrategy} policy
     * @returns {Route}
     * 
     * @memberOf Route
     */
    setPolicy(policy) {
        this.policy = TypeEnforcementService.enforceInstance(policy, AuthenticationStrategy, policy => null);
        return this;
    }

}