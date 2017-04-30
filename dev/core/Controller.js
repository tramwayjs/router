import Router from './Router';
import {errors} from 'tramway-core';
let {AbstractMethodError} = errors;

/**
 * @class Controller
 */
export default class Controller {
    /**
     * Creates an instance of Controller.
     * @param {Router} router Will default to the default router.
     * @memberOf Controller
     */
    constructor(router) {
        this.Router = router || Router;
    }

    /**
     * @static
     * @param {Object} res
     * @param {Object} req
     * @param {function(Error, Object)} next
     * 
     * @memberOf Controller
     */
    static index(res, req, next) {
        throw new AbstractMethodError();
    }

    /**
     * @returns {Router}
     * 
     * @memberOf Controller
     */
    getRouter(){
        return this.Router;
    }

    /**
     * @param {object} res
     * @param {string} path
     * @param {number} status
     * @returns
     * 
     * @memberOf Controller
     */
    redirect(res, path, status){
        return res.redirect(status, path);
    }
}