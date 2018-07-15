import {errors} from 'tramway-core';
import RestfulRoutePreparationUtility from './RestfulRoutePreparationUtility';
import Route from '../entities/Route';
import RestfulRoute from '../entities/RestfulRoute';
let {AbstractMethodError} = errors;

export default class RoutePreparationUtility {
    /**
     * @static
     * @param {Object[]} routes
     * @param {DependencyResolver} resolver DependencyResolver for DI
     * @returns {Route[]}
     * 
     * @memberOf RoutePreparationTemplate
     */
    static convertToUniformRoutes(routes, resolver) {
        if (!Array.isArray(routes)) {
            routes = Object.values(routes);
        }

        return routes
            .map((route) => {
                if (resolver && 'string' === typeof route.controller) {
                    route.controller = resolver.getService(route.controller);
                }

                if (resolver && 'string' === typeof route.policy) {
                    route.policy = resolver.getService(route.policy);
                }

                if (!Array.isArray(route.methods)) {
                    route.methods = Object.values(route.methods);
                }
                
                if (RestfulRoutePreparationUtility.isRestfulRoute(route)) {
                    return RestfulRoutePreparationUtility.convertRestfulRoute(new RestfulRoute(route));
                } 
                return [new Route(route)];
            }).reduce((a, b) => a.concat(b));
    }
}