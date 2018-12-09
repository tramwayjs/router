import { HttpStatus } from '../index';
import {AbstractMethodError} from './errors';

/**
 * @class Controller
 */
export default class Controller {
    /**
     * Creates an instance of Controller.
     * @param {Router} router
     * @memberOf Controller
     */
    constructor(router) {
        this.router = router;
    }

    /**
     * @param {Object} res
     * @param {Object} req
     * @param {function(Error, Object)} next
     * 
     * @memberOf Controller
     */
    async index(res, req, next) {
        throw new AbstractMethodError();
    }

    /**
     * @returns {Router}
     * 
     * @memberOf Controller
     */
    getRouter() {
        return this.router;
    }

    /**
     * @param {object} res
     * @param {string} path
     * @param {number} status
     * @returns
     * 
     * @memberOf Controller
     */
    redirect(res, path, status) {
        status = status || HttpStatus.MOVED_PERMANENTLY;
        return res.redirect(status, path);
    }

    getRoute(name) {
        return this.router.getRoute(name);
    }

    getRouteByAction(action) {
        return this.router.getRouteByAction(this.constructor.name, action);
    }
}