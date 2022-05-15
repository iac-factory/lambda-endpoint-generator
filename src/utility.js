import Utility from "util";
export const Inspect = (object, depth) => {
    return Utility.inspect(object, {
        colors: true,
        compact: false,
        depth: depth !== null && depth !== void 0 ? depth : 3
    });
};
export default Inspect;
