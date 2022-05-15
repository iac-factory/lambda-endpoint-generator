import FS from "fs";
import Path from "path";
import TTY from "tty";
import { Escape } from ".";
export var Hook;
(function (Hook) {
    const stdin = process.stdin;
    const stdout = process.stdout;
    const stderr = process.stderr;
    const initialize = function (reflection) {
        if (reflection.hook || reflection.unhook) {
            throw new Error("Hook has already been established");
        }
        reflection.hook = function (method, callable, awaitable) {
            var self = this, pointer;
            // Validation that Method Exists
            if (!(Object.prototype.toString.call(self[method]) === "[object Function]")) {
                throw new Error("Invalid method: " + method);
            }
            // Avoid Hooking a Hook
            if (self.unhook.methods[method]) {
                throw new Error("Method already hooked: " + method);
            }
            // Reference Default Method
            pointer = (self.unhook.methods[method] = self[method]);
            self[method] = function () {
                const args = Array.prototype.slice.call(arguments);
                // The hook should take the same number of arguments
                // as the original method; therefore, the referential function
                // is fill with undefined & optional args otherwise not provided
                // in the call
                while (args.length < pointer.length)
                    args.push(undefined);
                // Last argument is always the original method call
                args.push(function () {
                    const args = arguments;
                    if (awaitable) {
                        process.nextTick(function () {
                            pointer.apply(self, args);
                        });
                    }
                    else {
                        pointer.apply(self, args);
                    }
                });
                callable.apply(self, args);
            };
        };
        reflection.unhook = function (method) {
            const self = this, ref = self.unhook.methods[method];
            if (ref) {
                self[method] = self.unhook.methods[method];
                delete self.unhook.methods[method];
            }
            else {
                throw new Error("Method not hooked: " + method);
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
    const flush = async function () {
        return new Promise((resolve) => {
            FS.fdatasync(stdout.fd, (error) => {
                if (error)
                    throw error;
                resolve();
            });
        });
    };
    Hook.table = (data, file = "Standard-Output.log", columns) => {
        const event = "write";
        stdout.hook(event, function (string, encoding, fd, write) {
            const buffer = string.replace(Escape(), "").replaceAll("'", "\"");
            FS.writeFileSync(Path.join(process.cwd(), file), buffer);
        });
        console.table(data, columns);
        stdout.unhook(event);
    };
    void (async () => {
        initialize(stdout);
        initialize(stderr);
        initialize(stdin);
        (TTY.isatty(stdin.fd)) && console.clear();
        await flush();
    })();
})(Hook || (Hook = {}));
export default Hook;
