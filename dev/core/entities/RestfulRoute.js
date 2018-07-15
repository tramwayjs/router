import Route from './Route';
import RestfulController from '../controllers/RestfulController';

/**
 * @export
 * @class RestfulRoute
 * @extends {Route}
 */
export default class RestfulRoute extends Route {
    /**
     * Creates an instance of Route.
     * 
     * @param {Object} route
     * 
     * @memberOf Route
     */
    constructor(route) {
        super(route);
    }

    isRestful() {
        return this.controller instanceof RestfulController;
    }
}