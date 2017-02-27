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
        this.setControllerClass(route.controllerClass);
    }

    /**
     * @returns {Model}
     * 
     * @memberOf RestfulRoute
     */
    getControllerClass() {
        return this.controllerClass;
    }

    /**
     * @param {Model} controllerClass
     * @returns {RestfulRoute}
     * 
     * @memberOf RestfulRoute
     */
    setControllerClass(controllerClass) {
        this.controllerClass = controllerClass;
        return this;
    }

    isRestful() {
        return this.controllerClass instanceof RestfulController;
    }
}