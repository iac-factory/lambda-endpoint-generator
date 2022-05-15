import FS from "fs";
import * as AWS from "@aws-sdk/client-lambda";
export var Lambda;
(function (Lambda) {
    Lambda.Function = async function (lambda) {
        const constructor = new (class extends Object {
            constructor(name = lambda) {
                super(null);
                this.file = lambda;
                this.region = "us-east-2";
                this.instance = () => new AWS.LambdaClient({ region: this.region });
                this.arguments = () => new AWS.GetFunctionCommand({ FunctionName: lambda });
                this.hydrate = (data) => Object.create((data) ? data : null);
                this.file = name;
                this.client = this.instance();
                this.command = this.arguments();
                this.handler = this.hydrate();
            }
            async log() {
                const data = this.handler;
                const content = JSON.stringify(data, null, 4);
                void await new Promise((resolve) => {
                    FS.writeFile(this.file, content, resolve);
                });
                return this;
            }
            async interface() {
                const command = this.arguments();
                const response = await this.client.send(command);
                const data = (response) ? response.Configuration : {};
                this.hydrate(data);
                void await this.log();
                return this;
            }
        })();
        const { handler } = await constructor.interface();
        return (handler) ? handler : null;
    };
    Lambda.Functions = async function () {
        const constructor = new (class extends Object {
            constructor() {
                super(null);
                this.max = 50;
                this.file = "lambda-data.json";
                this.region = "us-east-2";
                this.instance = () => new AWS.LambdaClient({ region: this.region });
                this.arguments = (input) => new AWS.ListFunctionsCommand({ ...input, ...{ MaxItems: this.max } });
                this.paginator = () => Object.create({ data: [], token: undefined, response: undefined });
                this.client = this.instance();
                this.command = this.arguments();
                this.handler = this.paginator();
            }
            async wait(duration) {
                console.debug("[Debug]", "Waiter Activated", "(" + duration + ")");
                void new Promise((resolve) => {
                    setTimeout(resolve, duration);
                });
            }
            ;
            async paginate(state) {
                const lambda = async () => {
                    console.debug("[Debug]", "Lambda Paginator", "(" + state.page + ")");
                    const command = this.arguments({ Marker: this.handler.token });
                    const response = await this.client.send(command);
                    const data = Array.from(response.Functions);
                    this.handler.data.push(...data);
                    state.page = (data) ? state.page + 1 : state.page;
                    const { NextMarker: token } = response;
                    this.handler.response = (response) ? response : this.handler.response;
                    this.handler.token = (token) ? token : undefined;
                };
                const evaluate = async () => {
                    try {
                        await lambda();
                    }
                    catch (error) {
                        state.errors.push(JSON.stringify(error, null, 4));
                        const total = state.errors.length;
                        switch (true) {
                            case (total === 1): {
                                await this.wait(250);
                                break;
                            }
                            case (total === 2): {
                                await this.wait(500);
                                break;
                            }
                            case (total === 3): {
                                await this.wait(1000);
                                break;
                            }
                            case (total === 4): {
                                await this.wait(2000);
                                break;
                            }
                            case (total === 5): {
                                await this.wait(5000);
                                break;
                            }
                            case (total < 10): {
                                await this.wait(15000);
                                break;
                            }
                            default: {
                                console.error("[Fatal]", state.errors);
                                throw error;
                            }
                        }
                    }
                };
                do {
                    await evaluate();
                } while (this.handler.token);
                console.debug("[Debug]", "Lambda Paginator", "(" + state.page + ")");
            }
            async log() {
                const data = this.handler.data;
                const content = JSON.stringify(data, null, 4);
                void await new Promise((resolve) => {
                    FS.writeFile(this.file, content, resolve);
                });
                return this;
            }
            async interface() {
                const state = { page: 0, errors: new Array(0) };
                const command = this.arguments({ Marker: this.handler.token });
                const response = await this.client.send(command);
                const data = Array.from(response.Functions);
                this.handler.data.push(...data);
                state.page = (data) ? state.page + 1 : state.page;
                const { NextMarker: token } = response;
                this.handler.response = (response) ? response : this.handler.response;
                this.handler.token = (token) ? token : undefined;
                await this.paginate(state);
                return this.log();
            }
        })();
        const { handler } = await constructor.interface();
        return (handler && handler.data) ? handler.data.flat() : null;
    };
    Lambda.Policy = async (name) => {
        const client = new AWS.LambdaClient({ region: "us-east-2" });
        const command = (name) ? new AWS.GetPolicyCommand({ FunctionName: name }) : null;
        const response = (command) ? await client.send(command).catch((error) => null)
            : null;
        const policy = (response) ? response["Policy"] : null;
        const serial = (response && policy) ? JSON.parse(policy) : null;
        return (serial) ? serial : null;
    };
    Lambda.Statements = async (name) => {
        const policy = await Lambda.Policy(name);
        const statements = (policy) ? policy["Statement"] : null;
        return (statements) ? statements : null;
    };
    Lambda.Invokers = async (name) => {
        const statements = await Lambda.Statements(name);
        const invokers = (statements) ? statements.map((statement) => {
            const resource = statement["Resource"];
            const service = statement["Principal"]["Service"];
            const condition = statement["Condition"];
            const arn = (condition && condition["ArnLike"]) ? condition["ArnLike"] : null;
            const source = (arn) ? arn["AWS:SourceArn"] : null;
            return { resource, service, invoker: source };
        }) : null;
        return (invokers) ? invokers : null;
    };
    class Handler {
    }
    Lambda.Handler = Handler;
})(Lambda || (Lambda = {}));
export default Lambda;
