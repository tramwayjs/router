Tramway is a simple router for the tramway framework. It includes:

1. A dynamic routing system that separates routes from routing logic and is adaptable
2. Restful routes to save time building APIs
3. Authentication policies that allow for multiple strategies to be used and interchanged without needing the logic throughout the code.
and so much more.
4. Swappable router strategies that keep your app consistent no matter which solution you use, server or server-less.
5. Includes `http-status-codes` to have status code enums.

# Installation:
1. `npm install tramway-core-router`

# Example project
https://gitlab.com/tramwayjs/tramway-example

# Documentation

## Recommended Folder Structure
- controllers
- errors
- policies
- routes

## Routes
Routes are where you store the routes that the `Router` will take.

A typical routes file in the routes folder would import Controllers and directly assign their actions to a route. The resulting JSON would be consumed and converted by the router into a standard, secure or restful route.

Here's a sample routes file. The order of routes matters and is preserved by the router at all times.

**Note: The definition for controllerClass has been removed and the controller attributes only takes an instance now. The Controller action now has an attribute that takes the string name**

```
import MainController from "../controllers/MainController";
import SecuredController from "../controllers/SecuredController";
import StandardAuthenticationPolicy from "../policies/StandardAuthenticationPolicy";
import TestRestController from '../controllers/TestRestController';
let standardAuthenticationStrategy = new StandardAuthenticationPolicy();
const routesValues = [
    {
        "methods": ["get"],
        "controller": new MainController(),
        "action": "index"
    },
    {
        "path": "/model",
        "controller": new TestRestController(),
        "arguments": ["id"],
        "restful": true
    },
    {
        "path": "/hello",
        "arguments": ["name"],
        "methods": ["get"],
        "controller": new MainController(),
        "action": "sayHello"
    },
    {
        "path": "/secure",
        "methods": ["get"],
        "controller": new SecuredController(),
        "action": "index",
        "policy": standardAuthenticationStrategy
    },
    {
        "arguments": ["name"],
        "methods": ["get"],
        "controller": new MainController(),
        "action": "sayHello"
    },
    {
        "arguments": ["name"],
        "methods": ["post", "put"],
        "controller": new MainController(),
        "action": "postTest"
    }
];
export default routesValues;
```

### Route specs
| Attribute | Expected Values | Default Values | Notes |
| --- | --- | --- | --- |
| path | Unparameterized path string | "/" | If no path is specified, the router will default to root. |
| controller | `Controller` | undefined | If no Controller is specified, the app will break |
| action | `string` | undefined | The name of the Controller method dedicated to handling the route. If not a restful route and no action is specified, the app will break |
| restful | `boolean` | undefined | If the controller is a restful controller - note that action attribute will be ignored |
| methods | ["get", "post", "put", "delete", "all"] | ["get"] | Indicates which http methods get assigned the controller. Restful routes will ignore this setting as it is automatically bound by implenentation |
| arguments | string[] | "" | An optional ordered array of arguments to add to the path. ["id", "name"] equates to "/:id/:name"
| policy | `AuthenticationStrategy` | undefined | Ignored if unpresent, applies a policy or authentication strategy before allowing the router to proceed to the controller when a request is made to the  |

### Integrating with Dependency Injection

To leverage dependency injection, just use the string name of the Controller service instead of the Controller instance itself. The same can be said for the policy.

```
let standardAuthenticationStrategy = new StandardAuthenticationPolicy();
const routesValues = [
    {
        "methods": ["get"],
        "controller": "controllers.main",
        "action": "index"
    },
    {
        "path": "/model",
        "controller": "controllers.test_rest",
        "arguments": ["id"],
        "restful": true
    },
    {
        "path": "/hello",
        "arguments": ["name"],
        "methods": ["get"],
        "controller": "controllers.main",
        "action": "sayHello"
    },
    {
        "path": "/secure",
        "methods": ["get"],
        "controller": "controllers.secured",
        "action": "index",
        "policy": "policy.standard_authentication"
    },
    {
        "arguments": ["name"],
        "methods": ["get"],
        "controller": "controllers.main",
        "action": "sayHello"
    },
    {
        "arguments": ["name"],
        "methods": ["post", "put"],
        "controller": "controllers.main",
        "action": "postTest"
    }
];
export default routesValues;
```

## Router
The Router will be called in your main server file where you create your Express server and get the routes file. This is typically at the root of your project. Once you have a router, initializing it will set up the routes and assign them to the app and return the app to be started via listen.

Here's an example usage among parts of an express server file:

```
import express from 'express';
import {Router, strategies} from 'tramway-core-router';
import routes from './routes/routes.js';

const PORT = 8080;

let app = express();
let {ExpressServerStrategy} = strategies;
let router = new Router(routes, new ExpressServerStrategy(app));
app = router.initialize();
```

Here's an example usage with dependency injection (the entire router configuration would just be a services configuration file):

```
import {Router, strategies} from 'tramway-core-router';
import {DependencyResolver} from 'tramway-core-dependency-injector';

const {ExpressServerStrategy} = strategies;

export default {
    "router": {
        "class": Router,
        "constructor": [
            {"type": "parameter", "key": "routes"},
            {"type": "service", "key": "express-router-strategy"},
            DependencyResolver,
        ],
    },
    "express-router-strategy": {
        "class": ExpressServerStrategy,
        "constructor": [
            {"type": "parameter", "key": "app"}, //the express app would also be containerized
        ]
    }
}

```

The router also exposes some static methods which can be used across your app without making another instance.

| Function | Usage | Notes |
| --- | --- | --- |
| ```buildPath(...string): string``` | ```"a/b/c" === Router.buildPath("a", "b", "c")``` | Returns a clean path given any number of strings. |
| ```buildQuery(params: Object): string``` | ```"a=1&b=2&c=true" === Router.buildQuery({"a": 1, "b": 2, "c": true})``` | Returns a query string for any associative object |

### Strategies
The biggest addition is strategies which helps keep your apps consistent across clients and servers and also aid in keeping your app framework agnostic by adapting a consistent format across multiple router types which can be plug and play.

All strategies must extend the `RouterStrategy` class and implement the `prepareRoute` function (and optionally override the `prepareRoutes` function).

```
import {RouterStrategy} from 'tramway-core-router';

export default MyRouterStrategy extends RouterStrategy {
    // Takes a Route or RestfulRoute entity found in {entities}.
    prepareRoute(route) {
        //adapt route to your app's routing
    }
}
```

#### ExpressServerStrategy
The strategy that comes with this package is the `ExpressServerStrategy` which binds the pre-configured routes to the initialized Express app at application start. If you wanted to use React Router on the client side, strategies aid in adapting such that only a piece of the router needs to be replaced.

It takes the following arguments in the constructor:

| Argument | Default | Description |
| --- | --- | --- |
| app | | The instantiated Express app |
| security | `Security` | The Security middleware to apply to routes and handle authentication with. It has a method, `generateMiddleware` which will return an Express RouteHandler ```function(req, res, next)```. By default, the `ExpressServerStrategy` uses the default `Security` class but this parameter allows it to be overidden in cases where authentication is handled by a third party. |

**Note, any previous implementations of an overidden Security parameter will need to move the logic to the `generateMiddleware` function and pass a valid Security object.**

## Controllers
Controllers link to actions from the routing and act to direct the flow of the application.

To create a controller, import the class and implement a derived class with static functions for each route.
```
import {Controller} from 'tramway-core-router'; 
```
*Sample Controller action signature:*
```
async index(req, res) {}
```
`req` and `res` represent the respective objects passed by your router. With Express the request and response objects are passed by default.

The Controller class also contains some helper functions that can be used by any child Controller - including RestfulController.

| Function | Usage |
| --- | --- |
| ```getRouter(): Router``` | Returns the Router class for extendability |
| ```redirect(res: Object, path: string, status: number)``` | Calls the main redirect function in Express. Will default to a 301 status code. |

### Status codes
It's common to return different status codes with the response at the controller-level. Bundled with the `tramway-core-router` library is the `node-http-status` library by @prettymuchbryce which provides enums for different status codes.

To access the enum:

```
import {HttpStatus} from 'tramway-core-router';

//for 200
HttpStatus.OK;
```

Full table of supported Enums:

Constant                            | Code  | Status Text
------------------------------------|-------|-----------------------------------
CONTINUE                            | 100   | Continue
SWITCHING_PROTOCOLS                 | 101   | Switching Protocols
PROCESSING                          | 102   | Processing
OK                                  | 200   | OK
CREATED                             | 201   | Created
ACCEPTED                            | 202   | Accepted
NON_AUTHORITATIVE_INFORMATION       | 203   | Non Authoritative Information
NO_CONTENT                          | 204   | No Content
RESET_CONTENT                       | 205   | Reset Content
PARTIAL_CONTENT                     | 206   | Partial Content
MULTI_STATUS                        | 207   | Multi-Status
MULTIPLE_CHOICES                    | 300   | Multiple Choices
MOVED_PERMANENTLY                   | 301   | Moved Permanently
MOVED_TEMPORARILY                   | 302   | Moved Temporarily
SEE_OTHER                           | 303   | See Other
NOT_MODIFIED                        | 304   | Not Modified
USE_PROXY                           | 305   | Use Proxy
TEMPORARY_REDIRECT                  | 307   | Temporary Redirect
PERMANENT_REDIRECT                  | 308   | Permanent Redirect
BAD_REQUEST                         | 400   | Bad Request
UNAUTHORIZED                        | 401   | Unauthorized
PAYMENT_REQUIRED                    | 402   | Payment Required
FORBIDDEN                           | 403   | Forbidden
NOT_FOUND                           | 404   | Not Found
METHOD_NOT_ALLOWED                  | 405   | Method Not Allowed
NOT_ACCEPTABLE                      | 406   | Not Acceptable
PROXY_AUTHENTICATION_REQUIRED       | 407   | Proxy Authentication Required
REQUEST_TIMEOUT                     | 408   | Request Timeout
CONFLICT                            | 409   | Conflict
GONE                                | 410   | Gone
LENGTH_REQUIRED                     | 411   | Length Required
PRECONDITION_FAILED                 | 412   | Precondition Failed
REQUEST_TOO_LONG                    | 413   | Request Entity Too Large
REQUEST_URI_TOO_LONG                | 414   | Request-URI Too Long
UNSUPPORTED_MEDIA_TYPE              | 415   | Unsupported Media Type
REQUESTED_RANGE_NOT_SATISFIABLE     | 416   | Requested Range Not Satisfiable
EXPECTATION_FAILED                  | 417   | Expectation Failed
IM_A_TEAPOT                         | 418   | I'm a teapot
INSUFFICIENT_SPACE_ON_RESOURCE      | 419   | Insufficient Space on Resource
METHOD_FAILURE                      | 420   | Method Failure
UNPROCESSABLE_ENTITY                | 422   | Unprocessable Entity
LOCKED                              | 423   | Locked
FAILED_DEPENDENCY                   | 424   | Failed Dependency
PRECONDITION_REQUIRED               | 428   | Precondition Required
TOO_MANY_REQUESTS                   | 429   | Too Many Requests
REQUEST_HEADER_FIELDS_TOO_LARGE     | 431   | Request Header Fields Too Large
INTERNAL_SERVER_ERROR               | 500   | Server Error
NOT_IMPLEMENTED                     | 501   | Not Implemented
BAD_GATEWAY                         | 502   | Bad Gateway
SERVICE_UNAVAILABLE                 | 503   | Service Unavailable
GATEWAY_TIMEOUT                     | 504   | Gateway Timeout
HTTP_VERSION_NOT_SUPPORTED          | 505   | HTTP Version Not Supported
INSUFFICIENT_STORAGE                | 507   | Insufficient Storage
NETWORK_AUTHENTICATION_REQUIRED     | 511   | Network Authentication Required

### Restful Controllers
If you're just writing a Restful API, it can rapidly become tedious and messy when you end up creating each part of the CRUD structure and register each route. 

Much of the logic behind this process can be abstracted, such that if you already have a `Connection` and a linked `Model`, all you will have to do is make a derived `RestfulController` to put it altogether.

Here's a sample `RestfulController` implementation.
```
import {controllers} from 'tramway-core-router';
import {Service} from '../services';
const {RestfulController} = controllers;

export default class TestRestController extends RestfulController {
    constructor() {
        super(new Service());
    }
}
```

The RestfulController comes with pre-implemented methods.

```
import Controller from "../Controller";
import { HttpStatus } from "../../index";

export default class RestfulController extends Controller {
    constructor(service) {
        super();
        this.service = service;
    }

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

        return res.json(item);
    }

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

        return res.json(items);
    }

    async create(req, res) {
        const {body} = req;
        try {
            await this.service.create(body)
        } catch (e) {
            return res.status(HttpStatus.BAD_REQUEST).json(e);
        }

        return res.sendStatus(HttpStatus.CREATED);
    }
    
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

    async delete(req, res) {
        const {id} = req.params;
        try {
            await this.service.delete(id);
        } catch (e) {
            return res.sendStatus(HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return res.sendStatus(HttpStatus.NO_CONTENT);
    }
}
```

## Policies
Policies let you regulate routing for authentication or permissions-based reasons. This allows you to write authentication code in one place, use it in the router and not have to burden the rest of the codebase with it.

To write an authentication policy, import the class and implement the stubs. 

```
import {policies} from 'tramway-core-router';
let {AuthenticationStrategy} = policies;
```

**Note: All functions are async functions, callbacks are no longer supported.**

| Function | Usage |
| --- | --- |
| ```constructor()``` | Sets a redirect via ```super(redirectRoute: string)``` |
| ```login()``` | Implements and handles login criteria for the strategy |
| ```logout()``` | Implements and handles logout criteria for the strategy |
| ```check()``` | Implements and handles the check on the current status of user with regards to the policy. |

If a policy is indicated with the route, it will call the framework's internal Security service which will return a result based on the check performed by the Authentication service using the Authentication strategy - which uses strategy pattern. It's at this point where the router will redirect with a 401 to the policy's redirect route if the strategy's check criteria fails.