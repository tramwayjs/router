const assert = require('assert');
const utils = require('tramway-core-testsuite');
const lib = require('../index.js');
var describeCoreClass = utils.describeCoreClass;
var describeFunction = utils.describeFunction;

describe("Simple acceptance tests to ensure library returns what's promised.", function(){
    describe("Should return a proper 'Router' class", describeCoreClass(
        lib.Router, 
        "Router", 
        ["buildPath", "buildQuery"],
        ["initialize"],
        function(testClass, testInstance, classFunctions, instanceFunctions) {
            describe("The 'buildPath' function should have the same signature", describeFunction(
                testClass["buildPath"], 
                []
            ));
            describe("The 'buildQuery' function should have the same signature", describeFunction(
                testClass["buildQuery"], 
                ["params"]
            ));
            describe("The 'initialize' function should have the same signature", describeFunction(
                testInstance["initialize"], 
                []
            ));
        }
    ));

    describe("Should return a proper 'Controller' class", describeCoreClass(
        lib.Controller,
        "Controller", 
        ["index"],
        ["getRouter", "redirect"],
        function(testClass, testInstance, classFunctions, instanceFunctions) {
            describe("The 'index' function should have the same signature", describeFunction(
                testClass["index"], 
                ["res", "req", "next"]
            ));
            describe("The 'getRouter' function should have the same signature", describeFunction(
                testInstance["getRouter"],
                []
            ));
            describe("The 'redirect' function should have the same signature", describeFunction(
                testInstance["redirect"],
                ["res", "path", "status"]
            ));
        }
    ));

    describe("Should return a proper 'RouterStrategy' class", describeCoreClass(
        lib.RouterStrategy,
        "RouterStrategy", 
        [],
        ["prepareRoutes", "prepareRoute"],
        function(testClass, testInstance, classFunctions, instanceFunctions) {
            describe("The 'prepareRoutes' function should have the same signature", describeFunction(
                testInstance["prepareRoutes"], 
                ["routes"]
            ));
            describe("The 'prepareRoute' function should have the same signature", describeFunction(
                testInstance["prepareRoute"], 
                ["route"]
            ));
        }
    ));

    describe("Should return a proper 'Authentication' class", describeCoreClass(
        lib.Authentication,
        "Authentication", 
        [],
        ["login", "logout", "check", "getStrategy"],
        function(testClass, testInstance, classFunctions, instanceFunctions) {
            instanceFunctions.forEach(function(func){
                var args = func === "getStrategy" ? [] : ["cb"];
                describe("The '" + func + "' function should have the same signature", describeFunction(
                    testInstance[func], 
                    args
                ));
            });
        }
    ));

    describe("Should return an object for controllers.", function(){
        it("Should return an object for controllers.", function(){
            assert.strictEqual(typeof lib.controllers, "object");
        });

        it("There should the same number of controllers types as the previous version", function(){
            assert.strictEqual(Object.keys(lib.controllers).length, 1);
        });

        describe("Should return a consistent 'RestfulController' class.", describeCoreClass(
            lib.controllers.RestfulController, 
            "RestfulController", 
            ['get', 'getAll', 'create', 'update', 'delete'],
            [],
            function(testClass, testInstance, classFunctions, instanceFunctions) {
                classFunctions.forEach(function(func){
                    describe("The '" + func + "' function should have the same signature", describeFunction(
                        testClass[func], 
                        ["model", "req", "res"]
                    ));
                });
            }
        ));
    });
    describe("Should return an object for policies.", function(){
        it("Should return an object for policies.", function(){
            assert.strictEqual(typeof lib.policies, "object");
        });

        it("There should the same number of policies types as the previous version", function(){
            assert.strictEqual(Object.keys(lib.policies).length, 1);
        });

        describe("Should return a proper 'AuthenticationStrategy' class", describeCoreClass(
            lib.policies.AuthenticationStrategy, 
            "AuthenticationStrategy", 
            [],
            ["login", "logout", "check", "getRedirectRoute"],
            function(testClass, testInstance, classFunctions, instanceFunctions) {
                instanceFunctions.forEach(function(func){
                    var args = func === "getRedirectRoute" ? [] : ["cb"];
                    describe("The '" + func + "' function should have the same signature", describeFunction(
                        testInstance[func], 
                        args
                    ));
                });
            }
        ));
    });
    describe("Should return an object for strategies.", function(){
        it("Should return an object for strategies.", function(){
            assert.strictEqual(typeof lib.strategies, "object");
        });

        it("There should the same number of strategies types as the previous version", function(){
            assert.strictEqual(Object.keys(lib.strategies).length, 1);
        });

        describe("Should return a proper 'ExpressServerStrategy' class", describeCoreClass(
            lib.strategies.ExpressServerStrategy, 
            "ExpressServerStrategy", 
            [],
            ["prepareRoutes", "prepareRoute", "useMethod", "preparePath", "prepareArguments"],
            function(testClass, testInstance, classFunctions, instanceFunctions) {
                describe("The 'prepareRoutes' function should have the same signature", describeFunction(
                    testInstance["prepareRoutes"], 
                    ["routes"]
                ));
                describe("The 'prepareRoute' function should have the same signature", describeFunction(
                    testInstance["prepareRoute"], 
                    ["route"]
                ));
                describe("The 'useMethod' function should have the same signature", describeFunction(
                    testInstance["useMethod"], 
                    ["method", "path", "cb"]
                ));
                describe("The 'preparePath' function should have the same signature", describeFunction(
                    testInstance["preparePath"], 
                    ["route"]
                ));
                describe("The 'prepareArguments' function should have the same signature", describeFunction(
                    testInstance["prepareArguments"], 
                    ["params"]
                ));
            }
        ));
    });
});