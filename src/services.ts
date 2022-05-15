import FS from "fs";
import Path from "path";
import Services from "./services.json";

const copy = (directory: string, file: string) => {
    FS.mkdirSync(directory, { recursive: true, mode: 0o755});
    FS.copyFileSync(Path.join(__dirname, file), Path.join(directory, file));
};

void ( () => {
    const directory = Path.join(__dirname, "services")

    copy(directory, "services.json");

    const mapping = Services.map( (service, index) => {
        const fqdn = service.split( "." );
        const subdomain = String( fqdn[ 0 ] );
        const base = subdomain.split( "-", 1 )[0];
        const partials = subdomain.split( "-" );

        const domain = service;

        const properties = JSON.stringify({
            [ service ]: {
                base, fqdn, subdomain, partials, domain
            }
        }, null, 4);

        const $ = {};

        Reflect.set($, "json", properties);

        return Symbol(properties);
    } );

    const serialization = mapping.map((symbol) => JSON.parse(symbol.description!));

    FS.writeFileSync(Path.join(directory, "structures.json"), JSON.stringify(serialization, null, 4));

    const reflection = Reflect.construct(Object, [{}]);

    for (const index in serialization) {
        const object = serialization[index];

        Object.keys(object).forEach((property) => {
            reflection[property] = object[property];
        });
    }

    FS.writeFileSync(Path.join(directory, "global.json"), JSON.stringify(reflection, null, 4));
} )();