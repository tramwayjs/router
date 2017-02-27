import RestfulRoute from '../entities/RestfulRoute';
import RestfulRouteFactory from './RestfulRouteFactory';

/**
 * @export
 * @class RestfulRoutePreparationUtility
 */
export default class RestfulRoutePreparationUtility {
    /**
     * @static
     * @param {Object} route
     * @returns {boolean}
     * 
     * @memberOf RestfulRoutePreparationUtility
     */
    static isRestfulRoute(route) {
        return "controllerClass" in route;
    }

    /**
     * @static
     * @param {RestfulRoute} route
     * @returns {RestfulRoute[]}
     * 
     * @memberOf RestfulRoutePreparationUtility
     */
    static convertRestfulRoute(route) {
        return RestfulRouteFactory.createRoutes(route);
    }
}