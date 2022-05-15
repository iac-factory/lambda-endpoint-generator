import FS from "fs";
import Path from "path";
import TTY from "tty";

import { Escape } from ".";
import { Construct } from ".";

export module Hook {
    const stdin: NodeJS.ReadStream & { fd: 0, hook?: any, unhook?: any } = process.stdin;
    const stdout: NodeJS.WriteStream & { fd: 1, hook?: any, unhook?: any } = process.stdout;
    const stderr: NodeJS.WriteStream & { fd: 2, hook?: any, unhook?: any } = process.stderr;

    const initialize = function (reflection: Construct) {
        if ( reflection.hook || reflection.unhook ) {
            throw new Error( "Hook has already been established" );
        }

        reflection.hook = function (method: Construct, callable: Pointer, awaitable?: boolean) {
            var self = this, pointer: Pointer;

            // Validation that Method Exists
            if ( !( Object.prototype.toString.call( self[ method ] ) === "[object Function]" ) ) {
                throw new Error( "Invalid method: " + method );
            }

            // Avoid Hooking a Hook
            if ( self.unhook.methods[ method ] ) {
                throw new Error( "Method already hooked: " + method );
            }

            // Reference Default Method
            pointer = ( self.unhook.methods[ method ] = self[ method ] );

            self[ method ] = function () {
                const args = Array.prototype.slice.call( arguments );

                // The hook should take the same number of arguments
                // as the original method; therefore, the referential function
                // is fill with undefined & optional args otherwise not provided
                // in the call

                while ( args.length < pointer.length ) args.push( undefined );

                // Last argument is always the original method call

                args.push( function () {
                    const args = arguments;

                    if ( awaitable ) {
                        process.nextTick( function () {
                            pointer.apply( self, args );
                        } );
                    } else {
                        pointer.apply( self, args );
                    }
                } );

                callable.apply( self, args );
            };
        };

        reflection.unhook = function (method: string) {
            const self = this,
                ref = self.unhook.methods[ method ];

            if ( ref ) {
                self[ method ] = self.unhook.methods[ method ];
                delete self.unhook.methods[ method ];
            } else {
                throw new Error( "Method not hooked: " + method );
            }
        };

        reflection.unhook.methods = {};
    };

    /***
     * Forces all currently queued I/O operations associated with the
     * file to the operating system's synchronized I/O completion state.
     *
     * Refer to the POSIX fdatasync(2) documentation for details.
     *
     * Returns undefined
     */
    const flush = async function (): Promise<void> {
        return new Promise((resolve) => {
            FS.fdatasync(stdout.fd, (error) => {
                if (error) throw error;

                resolve();
            });
        });
    };

    export const table = (data: Object, file: string = "Standard-Output.log", columns?: readonly string[]) => {
        const event = "write";

        stdout.hook( event, function (string: string, encoding: string, fd: number, write: ($: string) => void) {
            const buffer = string.replace( Escape(), "" ).replaceAll( "'", "\"" );

            FS.writeFileSync( Path.join( process.cwd(), file ), buffer );
        } );

        console.table(data, columns);

        stdout.unhook( event );
    };

    void (async () => {
        initialize( stdout );
        initialize( stderr );
        initialize( stdin );

        (TTY.isatty(stdin.fd)) && console.clear();

        await flush();
    })();

    interface Pointer {
        length: number;
        apply: Inoperable;
    }

    type Inoperable = ($: any, tuple: IArguments | any[]) => void;
    type Throwable = FS.NoParamCallback | (() => void) | void;
}

export default Hook;