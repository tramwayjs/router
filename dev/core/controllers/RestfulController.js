import {Controller, Model} from 'tramway-core';

/**
 * @export
 * @class RestfulController
 * @extends {Controller}
 */
export default class RestfulController extends Controller {
    /**
     * @static
     * @param {Model} model
     * @param {Object} req
     * @param {Object} res
     * 
     * @memberOf RestfulController
     */
    static get(model, req, res) {
        model.get(function(err, item){
            if (err) {
                return res.sendStatus(404);
            }
            return res.json(item);
        });
    }

    /**
     * @static
     * @param {Model} model
     * @param {Object} req
     * @param {Object} res
     * 
     * @memberOf RestfulController
     */
    static getAll(model, req, res) {
        let response = function(err, items){
            if (err) {
                return res.sendStatus(400);
            }
            return res.json(items);
        };

        if (Object.keys(req.query).length > 0) {
            return model.find(req.query, response);
        }
        
        return model.getAll(response);
    }

    /**
     * @static
     * @param {Model} model
     * @param {Object} req
     * @param {Object} res
     * 
     * @memberOf RestfulController
     */
    static create(model, req, res) {
        model.create(function(err, item){
            if (err) {
                return res.sendStatus(400);
            }
            return res.json(item);
        });
    }
    
    /**
     * @static
     * @param {Model} model
     * @param {Object} req
     * @param {Object} res
     * 
     * @memberOf RestfulController
     */
    static update(model, req, res) {
        model.update(function(err, item){
            if (err) {
                return res.sendStatus(404);
            }
            return res.json(item);
        });
    }

    /**
     * @static
     * @param {Model} model
     * @param {Object} req
     * @param {Object} res
     * 
     * @memberOf RestfulController
     */
    static delete(model, req, res) {
        model.delete(function(err, item){
            if (err) {
                return res.sendStatus(400);
            }
            return res.json(item);
        });
    }
}