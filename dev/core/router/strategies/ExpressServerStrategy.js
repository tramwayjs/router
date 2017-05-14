import RouterStrategy from '../RouterStrategy';
import Router from '../../Router';
import Security from '../../Security';

export default class ExpressServerStrategy extends RouterStrategy {

    /**
     * @param {any} app Server app
     * 
     * @memberOf ExpressServerStrategy
     */
    constructor(app){
        super();
        this.app = app;
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
     * @memberOf ExpressServerStrategy
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
    prepareArguments(params){
        if ("string" === typeof params) {
            return params;
        }

        let argString = ":";
        argString += params.join("/:");
        return argString;
    }
}