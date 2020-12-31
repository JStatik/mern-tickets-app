const { Schema, model } = require( 'mongoose' );

const TicketsAtendidoSchema = new Schema( {
    ticketId: {
        type: String,
        required: true
    },
    dayDate: {
        type: Number,
        required: [ true, 'El día del mes es obligatorio' ]
    },
    ticket: {
        type: Number,
        required: [ true, 'El ticket es obligatorio' ]
    },
    state: {
        type: Boolean,
        required: [ true, 'El estado del ticket es obligatorio' ],
        default: false
    },
    client: {
        type: Number,
        required: [ true, 'La identificación del cliente es obligatoria' ]
    },
    desk: {
        type: Number,
        required: [ true, 'El escritorio de atencion es obligatorio' ]
    },
    agent: {
        type: String,
        required: [ true, 'El agente de atencion es obligatorio' ]
    }
}, {
    collection: 'ticketsAtendidos'
} );

module.exports = model( 'TicketsAtendido', TicketsAtendidoSchema );
