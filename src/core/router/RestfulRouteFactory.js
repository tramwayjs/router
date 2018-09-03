import Route from '../entities/Route';
import RestfulRoute from '../entities/RestfulRoute';
import RestfulController from '../controllers/RestfulController';

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
        return [
            (new Route(route)).setMethods(['get']).setAction("getOne"),
            (new Route(route)).setMethods(['get']).setAction("get").setArguments(""),
            (new Route(route)).setMethods(['post']).setAction("create").setArguments(""),
            (new Route(route)).setMethods(['patch']).setAction("update"),
            (new Route(route)).setMethods(['put']).setAction("replace"),
            (new Route(route)).setMethods(['delete']).setAction("delete"),
        ];
    }
    
}