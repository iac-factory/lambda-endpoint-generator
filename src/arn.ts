export module ARN {
    export enum partitioner {
        "aws" = "aws",
        "aws-cn" = "aws-cn",
        "aws-us-gov" = "aws-us-gov"
    }

    export const partial = ( input: Lowercase<string> ): ( keyof typeof partitioner ) & string => {
        switch ( input ) {
            case ( "aws" ):
                return partitioner.aws;
            case ( "aws-cn" ):
                return partitioner[ "aws-cn" ];
            case ( "aws-us-gov" ):
                return partitioner[ "aws-us-gov" ];
            default:
                return partitioner.aws;
        }
    };

    /**
     * Build an ARN with service, partition, region, accountId, and resources strings
     */
    export const build = ( identifier: Builder ): string => {
        const { partition = "aws", service, region, account, resource } = identifier;
        if ( [ service, region, account, resource ].some( ( segment ) => typeof segment! !== "string" ) ) {
            throw new Error( "Input ARN - Invalid Object" );
        }

        return ["arn", partition, service, region, account, resource].join(":");
    };

    /**
     * Validate whether a string is an ARN.
     */
    export const validate = ( string: any ): boolean => {
        return ( typeof string === "string" )
            && ( string.indexOf( "arn" + ":" ) === 0 )
            && ( string.split( ":" ).length >= 6 );
    };

    /***
     * Parse an ARN string into structure with arn, partition, service, region, account and resource values
     *
     * @param {string} arn
     *
     */
    export const identifier = ( input: string ) => {
        const segments = (input) ? input.split( ":" ) : null;

        if (!segments || segments.length < 5 || segments[ 0 ] !== "arn") return null;

        const [ arn, partition, service, region, account, ...resource ] = segments;

        return { arn, partition, service, region, account, resource: resource.join( ":" ) };
    };

    /***
     * Parse an ARN string into structure with partition, service, region, account and resource values
     *
     * @param {string} arn
     *
     */
    export const parse = ( arn: string ): Abstract => {
        const segments = arn.split( ":" );
        if ( segments.length < 6 || segments[ 0 ] !== "arn" ) throw new Error( "Malformed ARN" );

        const [ _, partition, service, region, account, ...resource ] = segments;

        const resolver: partitioner = Reflect.construct( String, [ partial( partition ) ] );

        return { partition: resolver, service, region, account, resource: resource.join( ":" ) };
    };

    /***
     * Parse an ARN string into structure without partition, but with service, region, account and resource values
     *
     * @param {string} arn
     *
     */
    export const normalize = ( arn: string ): Omit<Abstract, "partition"> => {
        const segments = arn.split( ":" );

        const [ _, partition, service, region, account, ...resource ] = segments;

        return { service, region, account, resource: resource.join( ":" ) };
    };

    export interface Abstract {
        /*** @augments Partition */
        partition: Partition & string;
        service: string;
        region: string;
        account: string;
        resource: string;
    }

    /***
     * AWS accounts are scoped to a single partition. Valid partition names include:
     * - "aws" - Public AWS partition
     * - "aws-cn" - AWS China
     * - "aws-us-gov" - AWS GovCloud
     *
     * <br/>
     *
     * However, the `enum` {@link Partitioner}, provides a utility callable to
     * correctly interface the constant.
     *
     */
    export type Partition = keyof typeof partitioner;

    export type Builder = Omit<Abstract, "partition"> & { partition?: string };
}

export default { ARN };