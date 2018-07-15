import Route from './entities/Route';
import RoutePreparationUtility from './router/RoutePreparationUtility';
import RouterStrategy from './router/RouterStrategy';
import {services} from "tramway-core";
let {TypeEnforcementService} = services;

/**
 * @class Router
 */
export default class Router {
    /**
     * Creates an instance of Router.
     * @param {[Object]} routes
     * @param {RouterStrategy} strategy
     * @param {DependencyResolver} resolver The DependencyResolver used to manage the dependency injection container
     * 
     * @memberOf Router
     */
    constructor(routes, strategy, resolver){
        this.routes = routes;
        this.strategy = TypeEnforcementService.enforceInstance(strategy, RouterStrategy);
        this.resolver = resolver;
    }

    /**
     * @returns app
     * 
     * @memberOf Router
     */
    initialize(){
        let routes = RoutePreparationUtility.convertToUniformRoutes(this.routes, this.resolver);
        return this.strategy.prepareRoutes(routes);
    }

    /**
     * @static
     * @params Variable number of strings
     * @returns {string} path
     * @memberOf Router
     */
    static buildPath() {
        let parts = Object.keys(arguments).map(key => arguments[key]).map(function(part){
            return part.replace(/^\/+|\/+$/gm,'');
        });
        return parts.join('/');
    }

    /**
     * @static
     * @param {Object} params
     * @returns {string} query string
     * 
     * @memberOf Router
     */
    static buildQuery(params) {
        return Object.keys(params).map(key => `${key}=${params[key]}`).join("&");
    }
}

