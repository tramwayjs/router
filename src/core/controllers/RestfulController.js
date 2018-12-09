import Controller from "../Controller";
import ResponseFormatter from '../ResponseFormatter';
import { HttpStatus } from "../../index";

/**
 * @export
 * @class RestfulController
 * @extends {Controller}
 */
export default class RestfulController extends Controller {
    constructor(router, service, formatter) {
        super(router);
        this.service = service;
        this.formatter = formatter || new ResponseFormatter();
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
            return res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
        }

        if (!item) {
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
            return res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
        }

        if (!items) {
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
        try {
            await this.service.create(body)
        } catch (e) {
            return res.status(HttpStatus.BAD_REQUEST).json(e);
        }

        return res.sendStatus(HttpStatus.CREATED);
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
        let [route = {}] = this.getRouteByAction(action);
        return route.links;
    }
}