/**
 * @export
 * @class AbstractMethodError
 * @extends {Error}
 */
export default class AbstractMethodError extends Error {

    /**
     * Creates an instance of AbstractMethodError.
     *
     * @memberOf AbstractMethodError
     */
    constructor() {
        super("Please implement concrete method.");
    }
}