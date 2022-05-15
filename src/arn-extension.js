import { ARN } from ".";
import { Method } from ".";
/***
 * Complex String - `Endpoint`
 * ---
 *
 * Note that runtime memory can be unexpectedly
 * higher compared to that of a normal `String` type
 * -- but only very marginally.
 *
 * <br\>
 *
 * Problems with memory will only occur if circumstances
 * require exact String allotted amount(s); the Endpoint
 * type takes `string` + `String` when non-normative methods
 * are called. The additional namespace'd String is quickly
 * followed by garbage collection.
 *
 * <br\>
 *
 * I haven't thoroughly tested the `Endpoint` callable enough
 * to empirically confirm these invokers - nor will I perform
 * any tests outside of code-coverage + e2e.
 *
 * <br\>
 *
 * Use a different programming language if such memory-related
 * allocation is of concern.
 *
 * <br\>
 *
 * All non-normative operations on `Endpoint`s will perform a
 * full string copy. Copies via `String()` are performed to
 * prevent mutation to the underlying `string` (`input`) value.
 *
 * @param {string} input
 *
 * @param settings
 * @param policy
 * @example
 * /// Simple Example
 * const arn = "arn:aws:execute-api:us-east-1:account-id:gateway-id/asterisk/GET/api/v1/endpoint/asterisk"
 * const endpoint = Endpoint(arn);
 *
 * console.log(endpoint.prefix());
 *  >>> "arn"
 *
 * console.log(endpoint.partition());
 *  >>> "aws"
 *
 * console.log(endpoint.service());
 *  >>> "execute-api"
 *
 * console.log(endpoint.region());
 *  >>> "us-east-1"
 *
 * console.log(endpoint.account());
 *  >>> "account-id"
 *
 * console.log(endpoint.resource());
 *  >>> "gateway-id/asterisk/GET/api/v1/endpoint/asterisk"
 *
 * @example
 * /// Heavily Abstract Example
 * void ( async () => {
 *     const output = await Main();
 *
 *     const collection = output.map((configuration) => {
 *         return new Endpoints(configuration.endpoints.map((string) => {
 *             return Endpoint( string );
 *         }));
 *     });
 *
 *     const resources: string[] = collection.filter(($) => $)
 *         .map((endpoints: Endpoints) => endpoints
 *             .filter(($) => $).map((arn: ARN) => arn.value()
 *             )
 *         ).flat();
 *
 *     console.log(resources);
 * } )();
 *
 * @constructor
 */
export default function Identifier(input) {
    const reflect = Reflect.construct(String, [(input) ? input : null]);
    function parse() {
        const copy = {
            value: String(input),
            evaluation: null,
            fields: []
        };
        const regex = [
            /// [arn]:aws:secretsmanager:us-east-1:123456789012:secret:arbitrary-secret^
            new RegExp("(^(?:[^:]+:){0}([^:]+).*)", "gmisd"),
            /// arn:[aws]:secretsmanager:us-east-1:123456789012:secret:arbitrary-secret^
            new RegExp("(^(?:[^:]+:){1}([^:]+).*)", "gmisd"),
            /// arn:aws:[secretsmanager]:us-east-1:123456789012:secret:arbitrary-secret^
            new RegExp("(^(?:[^:]+:){2}([^:]+).*)", "gmisd"),
            /// arn:aws:secretsmanager:[us-east-1]:123456789012:secret:arbitrary-secret^
            new RegExp("(^(?:[^:]+:){3}([^:]+).*)", "gmisd"),
            /// arn:aws:secretsmanager:us-east-1:[123456789012]:secret:arbitrary-secret^
            new RegExp("(^(?:[^:]+:){4}([^:]+).*)", "gmisd"),
            /// arn:aws:secretsmanager:us-east-1:123456789012:[secret:arbitrary-secret]^
            new RegExp("(^(?:[^:]+:){5}([^:]+).*)", "gmisd"),
            /// Extended, Name
            new RegExp("(^(?:[^:]+:){6}([^:]+).*)", "gmisd")
        ];
        /// ARN (0)
        while ((copy.evaluation = regex[0].exec(copy.value)) !== null) {
            // Prevent Infinite Loops if := zero-width match(es)
            if (copy.evaluation.index === regex[0].lastIndex) {
                regex[0].lastIndex++;
            }
            copy.evaluation.forEach((match, index) => {
                const target = copy.evaluation[index + 1];
                (index !== 0 && target) && copy.fields.push(target);
            });
        }
        /// Partition (1)
        while ((copy.evaluation = regex[1].exec(copy.value)) !== null) {
            // Prevent Infinite Loops if := zero-width match(es)
            if (copy.evaluation.index === regex[1].lastIndex) {
                regex[1].lastIndex++;
            }
            copy.evaluation.forEach((match, index) => {
                const target = copy.evaluation[index + 1];
                (index !== 0 && target) && copy.fields.push(target);
            });
        }
        /// Service (2)
        while ((copy.evaluation = regex[2].exec(copy.value)) !== null) {
            // Prevent Infinite Loops if := zero-width match(es)
            if (copy.evaluation.index === regex[2].lastIndex) {
                regex[2].lastIndex++;
            }
            copy.evaluation.forEach((match, index) => {
                const target = copy.evaluation[index + 1];
                (index !== 0 && target) && copy.fields.push(target);
            });
        }
        /// Region (3)
        while ((copy.evaluation = regex[3].exec(copy.value)) !== null) {
            // Prevent Infinite Loops if := zero-width match(es)
            if (copy.evaluation.index === regex[3].lastIndex) {
                regex[3].lastIndex++;
            }
            copy.evaluation.forEach((match, index) => {
                const target = copy.evaluation[index + 1];
                (index !== 0 && target) && copy.fields.push(target);
            });
        }
        /// Account-ID (4)
        while ((copy.evaluation = regex[4].exec(copy.value)) !== null) {
            // Prevent Infinite Loops if := zero-width match(es)
            if (copy.evaluation.index === regex[4].lastIndex) {
                regex[4].lastIndex++;
            }
            copy.evaluation.forEach((match, index) => {
                const target = copy.evaluation[index + 1];
                (index !== 0 && target) && copy.fields.push(target);
            });
        }
        /// Resource (5)
        while ((copy.evaluation = regex[5].exec(copy.value)) !== null) {
            // Prevent Infinite Loops if := zero-width match(es)
            if (copy.evaluation.index === regex[5].lastIndex) {
                regex[5].lastIndex++;
            }
            copy.evaluation.forEach((match, index) => {
                const target = copy.evaluation[index + 1];
                (index !== 0 && target) && copy.fields.push(target);
            });
        }
        /// Name (6)
        while ((copy.evaluation = regex[6].exec(copy.value)) !== null) {
            // Prevent Infinite Loops if := zero-width match(es)
            if (copy.evaluation.index === regex[6].lastIndex) {
                regex[6].lastIndex++;
            }
            copy.evaluation.forEach((match, index) => {
                const target = copy.evaluation[index + 1];
                (index !== 0 && target) && copy.fields.push(target);
            });
        }
        return copy.fields;
    }
    function prefix() {
        const partials = parse();
        return String(partials[0]);
    }
    function partition() {
        const partials = parse();
        return String(partials[1]);
    }
    function service() {
        const partials = parse();
        return String(partials[2]);
    }
    function region() {
        const partials = parse();
        return (partials[3]) ? String(partials[3]) : null;
    }
    function account() {
        const partials = parse();
        return (partials[4]) ? String(partials[4]) : null;
    }
    function resource() {
        const partials = parse();
        return (partials[5]) ? String(partials[5]) : null;
    }
    function method() {
        return Method.type(String(input));
    }
    function id() {
        const arn = ARN.identifier(input);
        return (arn && arn.resource) ? arn.resource.split("/").at(0) : null;
    }
    function path() {
        const method = Method.type(String(input));
        const arn = ARN.identifier(input);
        const resource = (arn && arn.resource) ? arn.resource : null;
        const collection = (resource && method) ? resource.split("/") : null;
        const index = (resource && method && collection) ? collection.indexOf(method) : null;
        const copy = (resource && method && collection && index) ? collection.slice(index + 1, collection.length) : null;
        return (copy) ? ["", copy.join("/")].join("/") : null;
    }
    reflect.id = id();
    reflect.region = region();
    reflect.account = account();
    reflect.service = service();
    reflect.resource = resource();
    reflect.path = path();
    reflect.method = method();
    return reflect;
}
export { Identifier };
export var Identification;
(function (Identification) {
    class ARN extends String {
    }
    Identification.ARN = ARN;
})(Identification || (Identification = {}));
