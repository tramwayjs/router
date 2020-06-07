import {AbstractMethodError} from '../errors';

export default class Policy {
    /**
     * @memberOf AuthenticationStrategy
     */
    async check(request) {
        throw new AbstractMethodError();
    }
}