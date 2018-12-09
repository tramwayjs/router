export default class ResponseFormatter {
    /**
     * 
     * @param {Entity} entity 
     */
    formatEntity(entity) {
        return entity;
    }

    /**
     * 
     * @param {Collection} collection 
     */
    formatCollection(collection) {
        return collection;
    }

    /**
     * 
     * @param {Response} response 
     * @param {Object} content 
     * @param {Object} options 
     */
    send(response, content, options) {
        return response.json(content);
    }
}