import Route from '../entities/Route';
import RestfulRoute from '../entities/RestfulRoute';
import RestfulController from '../controllers/RestfulController';
import {services} from 'tramway-core';
let {TypeEnforcementService} = services;

/**
 * @export
 * @class RestfulRouteFactory
 */
export default class RestfulRouteFactory {
    
    /**
     * @static
     * @param {RestfulRoute} route
     * @returns {Route[]}
     * 
     * @memberOf RestfulRouteFactory
     */
    static createRoutes(route) {
        route = TypeEnforcementService.enforceInstance(route, RestfulRoute);

        return [
            (new Route(route)).setMethods(['get']).setController(route.getControllerClass().get),
            (new Route(route)).setMethods(['get']).setController(route.getControllerClass().getAll).setArguments(""),
            (new Route(route)).setMethods(['post']).setController(route.getControllerClass().create).setArguments(""),
            (new Route(route)).setMethods(['put']).setController(route.getControllerClass().update),
            (new Route(route)).setMethods(['delete']).setController(route.getControllerClass().delete)
        ];
    }
    
}