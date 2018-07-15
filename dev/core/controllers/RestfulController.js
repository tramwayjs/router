import Controller from "../Controller";

/**
 * @export
 * @class RestfulController
 * @extends {Controller}
 */
export default class RestfulController extends Controller {
    constructor(service) {
        super();
        this.service = service;
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
            return res.sendStatus(500);
        }

        if (!item) {
            return res.sendStatus(404);
        }

        return res.json(item);
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
            return res.sendStatus(500);
        }

        if (!items) {
            return res.sendStatus(400);
        }

        return res.json(items);
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
            return res.status(400).json(e);
        }

        return res.sendStatus(201);
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
            return res.status(400).json(e);
        }

        return res.sendStatus(204);
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
            return res.status(400).json(e);
        }

        return res.sendStatus(204);
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
            return res.sendStatus(500);
        }

        return res.sendStatus(204);
    }
}