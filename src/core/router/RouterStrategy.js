import {AbstractMethodError} from '../errors';

export default class RouterStrategy {
    /**
     * @param {Route} route
     * 
     * @memberOf Router
     */
    prepareRoute(route) {
        throw new AbstractMethodError();
    }

    /**
     * @param {[]} routes
     */
    prepareRoutes(routes) {
        routes.forEach(this.prepareRoute.bind(this));
    }
}