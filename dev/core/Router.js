import Security from './Security';
import Route from './entities/Route';
import RoutePreparationUtility from './router/RoutePreparationUtility';

/**
 * @class Router
 */
export default class Router {
    /**
     * Creates an instance of Router.
     * @param {any} app Server app
     * @param {[Object]} routes
     * 
     * @memberOf Router
     */
    constructor(app, routes){
        this.app = app;
        this.routes = routes;
    }

    /**
     * @returns app
     * 
     * @memberOf Router
     */
    initialize(){
        let routes = RoutePreparationUtility.convertToUniformRoutes(this.routes);
        routes.forEach(this.prepareRoute.bind(this));
        return this.app;
    }

    /**
     * @param {Route} route
     * 
     * @memberOf Router
     */
    prepareRoute(route){
        route.getMethods().forEach(function(method){
            let path = this.preparePath(route);
            if (route.getPolicy()) {
                this.useMethod(method, path, new Security(route.getPolicy()), route.getController());
            } else {
                this.useMethod(method, path, route.getController());
            }
        }.bind(this));
    }

    /**
     * @param {string} method
     * @param {string} path
     * @param {function(Error, Object)} cb
     * @returns
     * 
     * @memberOf Router
     */
    useMethod(method, path, cb){
        let params = [];

        for (var key in arguments) {
            if(key < 1) {
                continue;
            }
            params.push(arguments[key]);
        }

        switch(method.toLowerCase()){
            case 'get': return this.app.get.apply(this.app, params);
            case 'post': return this.app.post.apply(this.app, params);
            case 'put': return this.app.put.apply(this.app, params);
            case 'delete': return this.app.delete.apply(this.app, params);
            case 'all': return this.app.all.apply(this.app, params);
            default: return this.app.get.apply(this.app, params);
        }
    }

    /**
     * @param {Route} route
     * @returns {string}
     * 
     * @memberOf Router
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
     * @memberOf Router
     */
    prepareArguments(params){
        if ("string" === typeof params) {
            return params;
        }

        let argString = ":";
        argString += params.join("/:");
        return argString;
    }

    /**
     * @static
     * @params Variable number of strings
     * @returns {string} path
     * @memberOf Router
     */
    static buildPath(){
        let parts = Object.keys(arguments).map(key => arguments[key]).map(function(part){
            return part.replace(/^\/+|\/+$/gm,'');
        });
        return parts.join('/');
    }

    /**
     * @static
     * @param {Object} params
     * @returns {string} query string
     * 
     * @memberOf Router
     */
    static buildQuery(params){
        return Object.keys(params).map(key => `${key}=${params[key]}`).join("&");
    }
}

