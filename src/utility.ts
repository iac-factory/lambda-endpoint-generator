import Utility from "util";

export const Inspect = (object: object, depth?: number) => {
    return Utility.inspect( object, {
        colors: true,
        compact: false,
        depth: depth ?? 3
    } );
};

export default Inspect;