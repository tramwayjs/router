import {errors} from 'tramway-core';
import RestfulRoutePreparationUtility from './RestfulRoutePreparationUtility';
import Route from '../entities/Route';
import RestfulRoute from '../entities/RestfulRoute';
let {AbstractMethodError} = errors;

export default class RoutePreparationUtility {
    /**
     * @static
     * @param {Object[]} routes
     * @returns {Route[]}
     * 
     * @memberOf RoutePreparationTemplate
     */
    static convertToUniformRoutes(routes) {
        return routes
            .map((route) => {
                if (RestfulRoutePreparationUtility.isRestfulRoute(route)) {
                    return RestfulRoutePreparationUtility.convertRestfulRoute(new RestfulRoute(route));
                } 
                return [new Route(route)];
            }).reduce((a, b) => a.concat(b));
    }  

    
}