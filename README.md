Tramway is a simple router for the tramway framework. It includes:

1. A dynamic routing system that separates routes from routing logic and is adaptable
2. Restful routes to save time building APIs
3. Authentication policies that allow for multiple strategies to be used and interchanged without needing the logic throughout the code.
and so much more.

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

```
import MainController from "../controllers/MainController";
import SecuredController from "../controllers/SecuredController";
import StandardAuthenticationPolicy from "../policies/StandardAuthenticationPolicy";
import TestRestController from '../controllers/TestRestController';
let standardAuthenticationStrategy = new StandardAuthenticationPolicy();
const routesValues = [
    {
        "methods": ["get"],
        "controller": MainController.index
    },
    {
        "path": "/model",
        "controllerClass": TestRestController,
        "arguments": ["id"]
    },
    {
        "path": "/hello",
        "arguments": ["name"],
        "methods": ["get"],
        "controller": MainController.sayHello
    },
    {
        "path": "/secure",
        "methods": ["get"],
        "controller": SecuredController.index,
        "policy": standardAuthenticationStrategy
    },
    {
        "arguments": ["name"],
        "methods": ["get"],
        "controller": MainController.sayHello
    },
    {
        "arguments": ["name"],
        "methods": ["post", "put"],
        "controller": MainController.postTest
    }
];
export default routesValues;
```

### Route specs
| Attribute | Expected Values | Default Values | Notes |
| --- | --- | --- | --- |
| path | Unparameterized path string | "/" | If no path is specified, the router will default to root. |
| controller | `Controller`'s action function | undefined | If no controllerClass is specified, the app will break |
| controllerClass | `RestfulController` | undefined | The controller that a restful route will use - note that controller attribute will be ignored |
| methods | ["get", "post", "put", "delete", "all"] | ["get"] | Indicates which http methods get assigned the controller. Restful routes will ignore this setting as it is automatically bound by implenentation |
| arguments | string[] | "" | An optional ordered array of arguments to add to the path. ["id", "name"] equates to "/:id/:name"
| policy | `AuthenticationStrategy` | undefined | Ignored if unpresent, applies a policy or authentication strategy before allowing the router to proceed to the controller when a request is made to the  |

## Router
The Router will be called in your main server file where you create your Express server and get the routes file. This is typically at the root of your project. Once you have a router, initializing it will set up the routes and assign them to the app and return the app to be started via listen.

Here's an example usage among parts of an express server file:
```
import express from 'express';
import {Router} from 'tramway-core-router';
import routes from './routes/routes.js';

const PORT = 8080;

let app = express();
let router = new Router(app, routes);
app = router.initialize();
app.listen(PORT);
```

The router also exposes some static methods which can be used across your app without making another instance.

| Function | Usage | Notes |
| --- | --- | --- |
| ```buildPath(...string): string``` | ```"a/b/c" === Router.buildPath("a", "b", "c")``` | Returns a clean path given any number of strings. |
| ```buildQuery(params: Object): string``` | ```"a=1&b=2&c=true" === Router.buildQuery({"a": 1, "b": 2, "c": true})``` | Returns a query string for any associative object |

## Controllers
Controllers link to actions from the routing and act to direct the flow of the application.

To create a controller, import the class and implement a derived class with static functions for each route.
```
import {Controller} from 'tramway-core'; 
```
*Sample Controller action signature:*
```
static index(req, res) {}
```
`req` and `res` represent the respective objects passed by your router. With Express the request and response objects are passed by default.

The Controller class also contains some helper functions that can be used by any child Controller - including RestfulController.

| Function | Usage |
| --- | --- |
| ```getRouter(): Router``` | Returns the Router class for extendability |
| ```redirect(res: Object, path: string, status: number)``` | Calls the main redirect function in Express. |

### Restful Controllers
If you're just writing a Restful API, it can rapidly become tedious and messy when you end up creating each part of the CRUD structure and register each route. 

Much of the logic behind this process can be abstracted, such that if you already have a `Connection` and a linked `Model`, all you will have to do is make a derived `RestfulController` to put it altogether.

Here's a sample `RestfulRouter` implementation.
```
import {controllers} from 'tramway-core-router';
import TestModel from '../models/TestModel';
let {RestfulController} = controllers;

export default class TestRestController extends RestfulController {
    static get(req, res) {
        let testModel = (new TestModel()).setId(req.params.id);
        return super.get(testModel, req, res);
    }
    static getAll(req, res) {
        let testModel = new TestModel();
        return super.getAll(testModel, req, res);
    }
    static create(req, res) {
        let testModel = new TestModel().updateEntity(req.body);
        return super.create(testModel, req, res);
    }
    static update(req, res) {
        let testModel = new TestModel().updateEntity(req.body).setId(req.params.id);
        return super.update(testModel, req, res);
    }
    static delete(req, res) {
        let testModel = new TestModel().setId(req.params.id);
        return super.delete(testModel, req, res);
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

| Function | Usage |
| --- | --- |
| ```constructor()``` | Sets a redirect via ```super(redirectRoute: string)``` |
| ```login(cb: function(Error, any))``` | Implements and handles login criteria for the strategy |
| ```logout(cb: function(Error, any))``` | Implements and handles logout criteria for the strategy |
| ```check(cb: function(Error, any))``` | Implements and handles the check on the current status of user with regards to the policy. |

If a policy is indicated with the route, it will call the framework's internal Security service which will return a result based on the check performed by the Authentication service using the Authentication strategy - which uses strategy pattern. It's at this point where the router will redirect with a 401 to the policy's redirect route if the strategy's check criteria fails.