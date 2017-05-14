import {errors} from "tramway-core";
let {AbstractMethodError} = errors;

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