import { ARN, Identifier, Lambda, Hook } from ".";
export var Composition;
(function (Composition) {
    Composition.Data = async () => {
        const resources = await Lambda.Functions();
        const configurations = (resources) ? resources : [];
        const invokers = [];
        for await (const resource of configurations) {
            const { FunctionName: name } = resource;
            const target = Lambda.Invokers(name);
            // @ts-ignore
            invokers.push(target);
        }
        const data = await Promise.all(invokers)
            .then((container) => {
            return container.filter((instance) => instance)
                .flat();
        });
        const partials = data.map((awaitable) => {
            const { resource, invoker: endpoint } = awaitable;
            const Resource = Reflect.construct(String, [resource]);
            Resource.valid = ARN.validate(resource);
            Object.assign(Resource, {
                ...ARN.normalize(Reflect.construct(String, [resource])), ...{
                    trigger: Identifier(endpoint)
                }
            });
            return { lambda: Resource };
        });
        return partials.map(($) => {
            // return {
            //     lambda: $.lambda,
            //     trigger: $.lambda.trigger
            // }
            // return {
            //     [$.lambda]: {
            //         valid: $.lambda.valid,
            //         service: $.lambda.service,
            //         region: $.lambda.region,
            //         account: $.lambda.account,
            //         type: $.lambda.resource.includes("function") ? "function" : null,
            //         name: $.lambda.resource.replace("function" + ":", "")
            //     }
            // }
            // return {
            //     trigger: {
            //          id: $.lambda.trigger.id,
            //          region: $.lambda.trigger.region,
            //          account: $.lambda.trigger.account,
            //          service: $.lambda.trigger.service,
            //          resource: $.lambda.trigger.resource,
            //          path: $.lambda.trigger.path,
            //          method: $.lambda.trigger.method
            //      }
            // }
            return {
                [$.lambda]: {
                    valid: $.lambda.valid,
                    service: $.lambda.service,
                    region: $.lambda.region,
                    account: $.lambda.account,
                    type: $.lambda.resource.includes("function") ? "function" : null,
                    name: $.lambda.resource.replace("function" + ":", ""),
                    trigger: {
                        id: $.lambda.trigger.id,
                        region: $.lambda.trigger.region,
                        account: $.lambda.trigger.account,
                        service: $.lambda.trigger.service,
                        resource: $.lambda.trigger.resource,
                        path: $.lambda.trigger.path,
                        method: $.lambda.trigger.method
                    }
                }
            };
        });
    };
    Composition.Endpoints = async () => {
        const resources = await Lambda.Functions();
        const configurations = (resources) ? resources : [];
        const invokers = [];
        for await (const resource of configurations) {
            const { FunctionName: name } = resource;
            const target = Lambda.Invokers(name);
            // @ts-ignore
            invokers.push(target);
        }
        const data = await Promise.all(invokers)
            .then((container) => {
            return container.filter((instance) => instance)
                .flat();
        });
        const partials = data.map((awaitable) => {
            const { resource, invoker: endpoint } = awaitable;
            const Resource = Reflect.construct(String, [resource]);
            Resource.valid = ARN.validate(resource);
            Object.assign(Resource, {
                ...ARN.normalize(Reflect.construct(String, [resource])), ...{
                    trigger: Identifier(endpoint)
                }
            });
            return { lambda: Resource };
        });
        const Mapping = partials.map(($) => {
            return {
                valid: $.lambda.valid,
                service: $.lambda.service,
                region: $.lambda.region,
                account: $.lambda.account,
                type: $.lambda.resource.includes("function") ? "function" : null,
                name: $.lambda.resource.replace("function" + ":", ""),
                "api-trigger": $.lambda.trigger.id,
                "api-region": $.lambda.trigger.region,
                "api-account": $.lambda.trigger.account,
                "api-service": $.lambda.trigger.service,
                "api-resource": $.lambda.trigger.resource,
                "api-path": $.lambda.trigger.path,
                "api-method": $.lambda.trigger.method
            };
        });
        Hook.table(Mapping, "table.endpoints.log");
    };
})(Composition || (Composition = {}));
export default Composition;
