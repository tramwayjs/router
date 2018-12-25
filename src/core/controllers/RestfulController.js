import Controller from "../Controller";
import ResponseFormatter from '../ResponseFormatter';
import { HttpStatus } from "../../index";

/**
 * @export
 * @class RestfulController
 * @extends {Controller}
 */
export default class RestfulController extends Controller {
    constructor(router, service, formatter, logger) {
        super(router);
        this.service = service;
        this.formatter = formatter || new ResponseFormatter();
        this.logger = logger;
    }

    /**
     * @async
     * @param {Object} req
     * @param {Object} res
     * 
     * @memberOf RestfulController
     */
    async getOne(req, res) {
        const {id} = req.params;
        let item;

        try {
            item = await this.service.getOne(id);
        } catch(e) {
            this.logger && this.logger.error(e);
            return res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
        }

        if (!item) {
            this.logger && this.logger.info(`${this.constructor.name} - No item found for id: ${id}`);
            return res.sendStatus(HttpStatus.NOT_FOUND);
        }

        return this.sendEntity(res, item, {links: this.getLinks('getOne')});
    }

    /**
     * @async
     * @param {Object} req
     * @param {Object} res
     * 
     * @memberOf RestfulController
     */
    async get(req, res) {
        let items;
        let {query} = req;

        try {
            items = await this.service.get(query);
        } catch (e) {
            this.logger && this.logger.error(e);
            return res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
        }

        if (!items) {
            this.logger && this.logger.info(`${this.constructor.name} - No items found`);
            return res.sendStatus(HttpStatus.BAD_REQUEST);
        }

        return this.sendCollection(res, items, {links: this.getLinks('get')});
    }

    /**
     * @async
     * @param {Object} req
     * @param {Object} res
     * 
     * @memberOf RestfulController
     */
    async create(req, res) {
        const {body} = req;
        let item;
        
        try {
            item = await this.service.create(body)
        } catch (e) {
            this.logger && this.logger.error(e);
            return res.status(HttpStatus.BAD_REQUEST).json(e);
        }

        let route = this.getRouteByAction('get');
        let {path} = route;

        let base = this.getHostFromRequest(req);
        let location = this.router.buildPath(base, path, item.getId());

        return res.location(location).sendStatus(HttpStatus.CREATED);
    }
    
    /**
     * @async
     * @param {Object} req
     * @param {Object} res
     * 
     * @memberOf RestfulController
     */
    async update(req, res) {
        const {body, params} = req;
        const {id} = params;

        try {
            await this.service.update(id, body);
        } catch (e) {
            this.logger && this.logger.error(e);
            return res.status(HttpStatus.BAD_REQUEST).json(e);
        }

        return res.sendStatus(HttpStatus.NO_CONTENT);
    }

    /**
     * @async
     * @param {Object} req
     * @param {Object} res
     * 
     * @memberOf RestfulController
     */
    async replace(req, res) {
        const {body, params} = req;
        const {id} = params;

        try {
            await this.service.update(id, body);
        } catch (e) {
            this.logger && this.logger.error(e);
            return res.status(HttpStatus.BAD_REQUEST).json(e);
        }

        return res.sendStatus(HttpStatus.NO_CONTENT);
    }

    /**
     * @async
     * @param {Object} req
     * @param {Object} res
     * 
     * @memberOf RestfulController
     */
    async delete(req, res) {
        const {id} = req.params;
        try {
            await this.service.delete(id);
        } catch (e) {
            this.logger && this.logger.error(e);
            return res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return res.sendStatus(HttpStatus.NO_CONTENT);
    }

    /**
     * 
     * @param {Object} res 
     * @param {Entity} item 
     */
    sendEntity(res, item, options) {
        return this.formatter.send(res, this.formatter.formatEntity(item), options);
    }

    /**
     * 
     * @param {Object} res 
     * @param {Collection} collection 
     */
    sendCollection(res, collection, options) {
        return this.formatter.send(res, this.formatter.formatCollection(collection), options);
    }

    getLinks(action) {
        let route = this.getRouteByAction(action);
        return route && route.links;
    }
}