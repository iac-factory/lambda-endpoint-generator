require = require( "esm" )( module );
module.exports = require( "./main" );

( async () => {
    const { Inspect } = require("./src");
    const { Composition } = require("./src");

    const $ = await Composition.Data();

    await Composition.Endpoints();

    console.log(Inspect($));
} )();
