import {RestfulRoute} from '../entities';
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
        return "restful" in route;
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