import { Lambda } from ".";

export const Resources = async () => {
    const configurations = await Lambda.Functions();

    return (configurations) ? configurations : null;
};

export default Resources;
