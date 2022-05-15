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
enum Enumeration {
    /**
     * The `CONNECT` method establishes a tunnel to the server identified by the
     * target resource.
     */
    CONNECT = "CONNECT",

    /**
     * The `DELETE` method deletes the specified resource.
     */
    DELETE = "DELETE",

    /**
     * The `GET` method requests a representation of the specified resource.
     * Requests using GET should only retrieve data.
     */
    GET = "GET",

    /**
     * The `HEAD` method asks for a response identical to that of a GET request,
     * but without the response body.
     */
    HEAD = "HEAD",

    /**
     * The `OPTIONS` method is used to describe the communication options for the
     * target resource.
     */
    OPTIONS = "OPTIONS",

    /**
     * The PATCH method is used to apply partial modifications to a resource.
     */
    PATCH = "PATCH",

    /**
     * The `POST` method is used to submit an entity to the specified resource,
     * often causing a change in state or side effects on the server.
     */
    POST = "POST",

    /**
     * The `PUT` method replaces all current representations of the target
     * resource with the request payload.
     */
    PUT = "PUT",

    /**
     * The `TRACE` method performs a message loop-back test along the path to the
     * target resource.
     */
    TRACE = "TRACE",

    "*/*" = "ANY"
}

export const Method = {
    method: Enumeration,
    keys: Object.keys(Enumeration),
    filter: (input: string) => Method.keys.filter((pattern) => pattern.includes(input)),
    type: (input: string) => {
        const instance = Method.keys.filter(
            (method) => {
                return input.includes(method)
            } );

        return ( instance.length === 1 )
            ? (instance[0] !== "*/*")
                ? instance[0] : "ANY"
            : (instance && instance.length !== 0)
                ? instance
                : null;
    }
};

export type Methods = keyof typeof Enumeration;

export default Method;