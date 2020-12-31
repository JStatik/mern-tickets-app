const { Schema, model } = require( 'mongoose' );

const DeskSchema = new Schema( {
    desk: {
        type: Number,
        required: [ true, 'El escritorio de atencion es obligatorio' ]
    },
    agent: {
        type: String,
        required: [ true, 'El agente de atencion es obligatorio' ]
    }
}, {
    collection: 'escritoriosEnUso'
} );

module.exports = model( 'Desk', DeskSchema );
