import { Resources } from ".";

export const Main = async () => {
    const resources = await Resources();

    return (resources) ? resources.flat() : resources;
};

export default Main;
