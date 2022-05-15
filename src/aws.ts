import FS from "fs";

import * as AWS from "@aws-sdk/client-lambda";

export module Lambda {
    import Invoker = Lambda.Policy.Invoker;
    export const Function = async function ( lambda: string ) {
        const constructor = new (
            class extends Object {
                client: Function.Client;
                command: Function.Command;
                handler: Function.Configuration;

                private readonly file: string = lambda;
                private readonly region: string = "us-east-2";

                constructor( name: string = lambda ) {
                    super( null );

                    this.file = name;

                    this.client = this.instance();
                    this.command = this.arguments();
                    this.handler = this.hydrate();
                }

                private instance = () => new AWS.LambdaClient( { region: this.region } );
                private arguments = () => new AWS.GetFunctionCommand( { FunctionName: lambda } );
                private hydrate = ( data?: Function.Configuration ) => Object.create( ( data ) ? data : null );

                private async log() {
                    const data = this!.handler;

                    const content = JSON.stringify( data, null, 4 );

                    void await new Promise( ( resolve ) => {
                        FS.writeFile( this.file, content, resolve );
                    } );

                    return this;
                }

                public async interface(): Promise<this> {
                    const command = this.arguments();
                    const response = await this.client.send( command );
                    const data = ( response ) ? response.Configuration : {};

                    this.hydrate( data );

                    void await this.log();

                    return this;
                }
            }
        )();

        const { handler } = await constructor.interface();

        return ( handler ) ? handler : null;
    };

    export const Functions = async function ( ) {
        const constructor = new (
            class extends Object {
                client: Functions.Client;
                command: Functions.Command;
                handler: Functions.Paginator;

                private max: number = 50;
                private file: string = "lambda-data.json";
                private region: string = "us-east-2";

                constructor() {
                    super( null );

                    this.client = this.instance();
                    this.command = this.arguments();
                    this.handler = this.paginator();
                }

                private async wait( duration: number ): Promise<void> {
                    console.debug( "[Debug]", "Waiter Activated", "(" + duration + ")" );

                    void new Promise( ( resolve ) => {
                        setTimeout( resolve, duration );
                    } );
                };

                private instance = () => new AWS.LambdaClient( { region: this.region } );
                private arguments = ( input?: Functions.Input ) => new AWS.ListFunctionsCommand( { ...input, ...{ MaxItems: this.max } } );
                private paginator = () => Object.create( { data: [], token: undefined, response: undefined } );

                private async paginate( state: { page: number; errors: Array<Error | string> } ) {
                    const lambda = async () => {
                        console.debug( "[Debug]", "Lambda Paginator", "(" + state.page + ")" );

                        const command = this.arguments( { Marker: this.handler.token } );
                        const response = await this.client.send( command );
                        const data = Array.from( response.Functions! );

                        this.handler.data.push( ...data );

                        state.page = ( data ) ? state.page + 1 : state.page;

                        const { NextMarker: token } = response;

                        this.handler.response = ( response ) ? response : this.handler.response;

                        this.handler.token = ( token ) ? token : undefined;
                    };

                    const evaluate = async () => {
                        try {
                            await lambda();
                        } catch ( error ) {
                            state.errors.push( JSON.stringify( error, null, 4 ) );

                            const total = state.errors.length;

                            switch ( true ) {
                                case ( total === 1 ): {
                                    await this.wait( 250 );

                                    break;
                                }

                                case ( total === 2 ): {
                                    await this.wait( 500 );

                                    break;
                                }

                                case ( total === 3 ): {
                                    await this.wait( 1000 );

                                    break;
                                }

                                case ( total === 4 ): {
                                    await this.wait( 2000 );

                                    break;
                                }

                                case ( total === 5 ): {
                                    await this.wait( 5000 );

                                    break;
                                }

                                case ( total < 10 ): {
                                    await this.wait( 15000 );

                                    break;
                                }

                                default: {
                                    console.error( "[Fatal]", state.errors );

                                    throw error;
                                }
                            }
                        }
                    };

                    do {
                        await evaluate();
                    } while ( this.handler.token );

                    console.debug( "[Debug]", "Lambda Paginator", "(" + state.page + ")" );
                }

                private async log() {
                    const data = this.handler.data;
                    const content = JSON.stringify( data, null, 4 );

                    void await new Promise( ( resolve ) => {
                        FS.writeFile( this.file, content, resolve );
                    } );

                    return this;
                }

                public async interface(): Promise<this> {
                    const state = { page: 0, errors: new Array( 0 ) };

                    const command = this.arguments( { Marker: this.handler.token } );
                    const response = await this.client.send( command );
                    const data = Array.from( response.Functions! );

                    this.handler.data.push( ...data );

                    state.page = ( data ) ? state.page + 1 : state.page;

                    const { NextMarker: token } = response;

                    this.handler.response = ( response ) ? response : this.handler.response;

                    this.handler.token = ( token ) ? token : undefined;

                    await this.paginate( state );

                    return this.log();
                }
            } )();

        const { handler } = await constructor.interface();

        return ( handler && handler.data ) ? handler.data.flat() : null;
    };

    export const Policy = async ( name?: string ) => {
        const client = new AWS.LambdaClient( { region: "us-east-2" } );
        const command = (name) ? new AWS.GetPolicyCommand( { FunctionName: name } ) : null;

        const response = (command) ? await client.send( command ).catch( ( error ) => null )
            : null;

        const policy = (response) ? response["Policy"] : null;

        const serial: Policy.Permission = ( response && policy) ? JSON.parse(policy) : null;

        return (serial) ? serial : null;
    };

    export const Statements = async ( name?: string ) => {
        const policy = await Policy(name);

        const statements = (policy) ? policy["Statement"] : null;

        return (statements) ? statements : null;
    };

    export const Invokers = async ( name?: string ): Promise<Invoker[] | null> => {
        const statements = await Statements(name);

        const invokers = ( statements ) ? statements.map((statement) => {
            const resource = statement["Resource"];
            const service = statement["Principal"]["Service"] as string;
            const condition = statement["Condition"];

            const arn = (condition && condition["ArnLike"]) ? condition["ArnLike"] : null;
            const source = (arn) ? arn["AWS:SourceArn"] : null;

            return { resource, service, invoker: source };
        }) : null;

        return (invokers) ? invokers: null;
    };

    export module Policy {
        export type Permission = {
            Version: string;
            Id: string;
            Statement?: Statement[];
        }

        export interface Statement {
            Sid: string;
            Effect: "Allow" | "Deny";
            Principal: {
                Service: /*** Service | */ string | "apigateway.amazonaws.com";
            };
            Action: "lambda:InvokeFunction" & string;
            /*** Resource ARN */
            Resource: string;
            Condition: {
                ArnLike?: {
                    "AWS:SourceArn": string;
                }
            }
        }

        export interface Invoker {
            resource: string;
            service: string;
            invoker: string | null;
        }

        export type Configuration = {
            name: AWS.FunctionConfiguration["FunctionName"];
            configuration: Function.Configuration;
        }

        export type Client = AWS.LambdaClient;
        export type Command = AWS.GetPolicyCommand;
        export type Input = AWS.GetPolicyCommandInput;
        export type Output = AWS.GetPolicyCommandOutput;
    }

    export module Functions {
        export type Client = AWS.LambdaClient;
        export type Command = AWS.ListFunctionsCommand;
        export type Input = AWS.ListFunctionsCommandInput;
        export type Output = AWS.ListFunctionsCommandOutput;

        export type Configuration = AWS.FunctionConfiguration;

        export type Paginator = Handler;
    }

    export module Function {
        export type Client = AWS.LambdaClient;
        export type Command = AWS.GetFunctionCommand;
        export type Input = AWS.GetFunctionCommandInput;
        export type Output = AWS.GetFunctionCommandOutput;

        export type Configuration = AWS.FunctionConfiguration;
    }

    export abstract class Handler {
        abstract data: AWS.FunctionConfiguration[];
        abstract token?: string;
        abstract response?: AWS.ListFunctionsCommandOutput;
    }
}

export default Lambda;