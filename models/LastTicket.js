const { Schema, model } = require( 'mongoose' );

const LastTicketSchema = new Schema( {
    ticketId: {
        type: String,
        required: true
    },
    dayDate: {
        type: Number,
        required: [ true, 'El día del mes es obligatorio' ]
    },
    lastTicket: {
        type: Number,
        required: [ true, 'El ticket es obligatorio' ]
    },
    state: {
        type: Boolean,
        required: [ true, 'El estado del ticket es obligatorio' ],
        default: true
    },
    client: {
        type: Number,
        required: [ true, 'La identificación del cliente es obligatoria' ]
    }
}, {
    collection: 'ultimoTicket'
} );

module.exports = model( 'LastTicket', LastTicketSchema );
