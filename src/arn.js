export var ARN;
(function (ARN) {
    let partitioner;
    (function (partitioner) {
        partitioner["aws"] = "aws";
        partitioner["aws-cn"] = "aws-cn";
        partitioner["aws-us-gov"] = "aws-us-gov";
    })(partitioner = ARN.partitioner || (ARN.partitioner = {}));
    ARN.partial = (input) => {
        switch (input) {
            case ("aws"):
                return partitioner.aws;
            case ("aws-cn"):
                return partitioner["aws-cn"];
            case ("aws-us-gov"):
                return partitioner["aws-us-gov"];
            default:
                return partitioner.aws;
        }
    };
    /**
     * Build an ARN with service, partition, region, accountId, and resources strings
     */
    ARN.build = (identifier) => {
        const { partition = "aws", service, region, account, resource } = identifier;
        if ([service, region, account, resource].some((segment) => typeof segment !== "string")) {
            throw new Error("Input ARN - Invalid Object");
        }
        return ["arn", partition, service, region, account, resource].join(":");
    };
    /**
     * Validate whether a string is an ARN.
     */
    ARN.validate = (string) => {
        return (typeof string === "string")
            && (string.indexOf("arn" + ":") === 0)
            && (string.split(":").length >= 6);
    };
    /***
     * Parse an ARN string into structure with arn, partition, service, region, account and resource values
     *
     * @param {string} arn
     *
     */
    ARN.identifier = (input) => {
        const segments = (input) ? input.split(":") : null;
        if (!segments || segments.length < 5 || segments[0] !== "arn")
            return null;
        const [arn, partition, service, region, account, ...resource] = segments;
        return { arn, partition, service, region, account, resource: resource.join(":") };
    };
    /***
     * Parse an ARN string into structure with partition, service, region, account and resource values
     *
     * @param {string} arn
     *
     */
    ARN.parse = (arn) => {
        const segments = arn.split(":");
        if (segments.length < 6 || segments[0] !== "arn")
            throw new Error("Malformed ARN");
        const [_, partition, service, region, account, ...resource] = segments;
        const resolver = Reflect.construct(String, [ARN.partial(partition)]);
        return { partition: resolver, service, region, account, resource: resource.join(":") };
    };
    /***
     * Parse an ARN string into structure without partition, but with service, region, account and resource values
     *
     * @param {string} arn
     *
     */
    ARN.normalize = (arn) => {
        const segments = arn.split(":");
        const [_, partition, service, region, account, ...resource] = segments;
        return { service, region, account, resource: resource.join(":") };
    };
})(ARN || (ARN = {}));
export default { ARN };
