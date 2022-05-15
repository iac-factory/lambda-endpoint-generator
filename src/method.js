/**
 * HTTP request methods.
 *
 * HTTP defines a set of request methods to indicate the desired action to be
 * performed for a given resource. Although they can also be nouns, these
 * request methods are sometimes referred as HTTP verbs. Each of them implements
 * a different semantic, but some common features are shared by a group of them:
 * e.g. a request method can be safe, idempotent, or cacheable.
 *
 * @public
 */
var Enumeration;
(function (Enumeration) {
    /**
     * The `CONNECT` method establishes a tunnel to the server identified by the
     * target resource.
     */
    Enumeration["CONNECT"] = "CONNECT";
    /**
     * The `DELETE` method deletes the specified resource.
     */
    Enumeration["DELETE"] = "DELETE";
    /**
     * The `GET` method requests a representation of the specified resource.
     * Requests using GET should only retrieve data.
     */
    Enumeration["GET"] = "GET";
    /**
     * The `HEAD` method asks for a response identical to that of a GET request,
     * but without the response body.
     */
    Enumeration["HEAD"] = "HEAD";
    /**
     * The `OPTIONS` method is used to describe the communication options for the
     * target resource.
     */
    Enumeration["OPTIONS"] = "OPTIONS";
    /**
     * The PATCH method is used to apply partial modifications to a resource.
     */
    Enumeration["PATCH"] = "PATCH";
    /**
     * The `POST` method is used to submit an entity to the specified resource,
     * often causing a change in state or side effects on the server.
     */
    Enumeration["POST"] = "POST";
    /**
     * The `PUT` method replaces all current representations of the target
     * resource with the request payload.
     */
    Enumeration["PUT"] = "PUT";
    /**
     * The `TRACE` method performs a message loop-back test along the path to the
     * target resource.
     */
    Enumeration["TRACE"] = "TRACE";
    Enumeration["*/*"] = "ANY";
})(Enumeration || (Enumeration = {}));
export const Method = {
    method: Enumeration,
    keys: Object.keys(Enumeration),
    filter: (input) => Method.keys.filter((pattern) => pattern.includes(input)),
    type: (input) => {
        const instance = Method.keys.filter((method) => {
            return input.includes(method);
        });
        return (instance.length === 1)
            ? (instance[0] !== "*/*")
                ? instance[0] : "ANY"
            : (instance && instance.length !== 0)
                ? instance
                : null;
    }
};
export default Method;
