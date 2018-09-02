import RouterStrategy from '../RouterStrategy';
import Router from '../../Router';
import Security from '../../Security';

export default class ExpressServerStrategy extends RouterStrategy {

    /**
     * @param {any} app Server app
     * @param {Security} security
     * 
     * @memberOf ExpressServerStrategy
     */
    constructor(app, security){
        super();
        this.app = app;
        this.security = security || new Security();
    }

    /**
     * @param {[]} routes
     * @return Express app
     */
    prepareRoutes(routes) {
        super.prepareRoutes(routes);
        return this.app;
    }

    /**
     * @param {Route} route
     * 
     * @memberOf ExpressServerStrategy
     */
    prepareRoute(route){
        route.getMethods().forEach(method => {
            let path = this.preparePath(route);
            const controllerMiddleware = this.prepareControllerMiddleware(route.getController(), route.getAction());
            const policy = route.getPolicy();

            if (policy) {
                const securityMiddleware = this.security.generateMiddleware(route.getPolicy());
                return this.useMethod(method, path, securityMiddleware, controllerMiddleware);
            }

            return this.useMethod(method, path, controllerMiddleware);
        });
    }

    /**
     * @param {string} method
     * @param {string} path
     * @param {[function(req, res, next)]} middleware
     * @returns
     * 
     * @memberOf ExpressServerStrategy
     */
    useMethod(method, path, ...middleware) {
        return this.app.route(path)[method.toLowerCase()](...middleware);
    }

    /**
     * @param {Route} route
     * @returns {string}
     * 
     * @memberOf ExpressServerStrategy
     */
    preparePath(route) {
        let path = route.getPath();
        let params = this.prepareArguments(route.getArguments());

        if (path) {
            return Router.buildPath("/", path, params);
        } 
        return Router.buildPath("/", params);
        
    }

    /**
     * @param {string[] | string} params
     * @returns {string}
     * 
     * @memberOf ExpressServerStrategy
     */
    prepareArguments(params = []){
        if ("string" === typeof params) {
            return params;
        }

        if (!Array.isArray(params)) {
            params = Object.values(params);
        }

        let argString = ":";
        argString += params.join("/:");
        return argString;
    }

    prepareControllerMiddleware(controller, action) {
        return controller[action].bind(controller);
    }
}