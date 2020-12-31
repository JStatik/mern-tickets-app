const colors = require( 'colors' );
const uniqid = require( 'uniqid' );
const Desk = require( '../models/Desk' );
const LastTicket = require( '../models/LastTicket' );
const TicketsAtendido = require( '../models/TicketsAtendido' );
const TicketsPendiente = require( '../models/TicketsPendiente' );

class TicketControl {
    constructor() {
        this.lastTicket = 0;
        this.dayDate = new Date().getDate();

        LastTicket.findById( process.env.LAST_TICKET_ID, async( err, lastTicketDB ) => {
            if( err ) {
                console.log( colors.magenta( err ) );
                return;
            }

            if( lastTicketDB.dayDate === this.dayDate ) {
                this.lastTicket = lastTicketDB.lastTicket;
            } else {
                await this.reiniciarTicketsDB();
                console.log( colors.white( 'Se ha reseteado el sistema' ) );
            }
        } );
    }



    reiniciarTicketsDB = async() => {
        this.lastTicket = 0;

        const newLastTicket = {
            client: 0,
            ticketId: uniqid(),
            dayDate: this.dayDate,
            lastTicket: this.lastTicket
        };

        await this.eliminarEscritoriosEnUso();
        await this.eliminarTicketsAtendidos();
        await this.eliminarTicketsPendientes();
        await this.actualizarUltimoTicket( newLastTicket );
    };

    eliminarEscritoriosEnUso = async() => {
        try {
            await Desk.deleteMany( { desk: { $gte: 0 } } );
        } catch( err ) {
            console.log( colors.magenta( err ) );
            return;
        }
    };

    eliminarTicketsAtendidos = async() => {
        try {
            await TicketsAtendido.deleteMany( { dayDate: { $gte: 0 } } );
        } catch( err ) {
            console.log( colors.magenta( err ) );
            return;
        }
    };

    eliminarTicketsPendientes = async() => {
        try {
            await TicketsPendiente.deleteMany( { dayDate: { $gte: 0 } } );
        } catch( err ) {
            console.log( colors.magenta( err ) );
            return;
        }
    };

    actualizarUltimoTicket = async( newLastTicket ) => {
        try {
            await LastTicket.findByIdAndUpdate( process.env.LAST_TICKET_ID, newLastTicket, { new: true } );
        } catch( err ) {
            console.log( colors.magenta( err ) );
            return;
        }
    };



    verificarExisteCliente = async( client ) => {
        try {
            const ticketPendiente = await TicketsPendiente.findOne( { client: client } );
            if( !ticketPendiente ) return { ticket: false };

            return { ticket: ticketPendiente.ticket };
        } catch( err ) {
            console.log( colors.magenta( err ) );
            return;
        }
    };

    generarTicket = async( client ) => {
        this.lastTicket += 1;
        const ticketId = uniqid();

        const newTicket = {
            client: client,
            ticketId: ticketId,
            dayDate: this.dayDate,
            ticket: this.lastTicket                     
        };

        const newLastTicket = {
            client: client,
            ticketId: ticketId,
            lastTicket: this.lastTicket
        };

        await this.crearTicketPendiente( newTicket );
        await this.actualizarUltimoTicket( newLastTicket );
        console.log( colors.white( 'Nuevo ticket creado' ) );
    };

    crearTicketPendiente = async( newTicket ) => {
        try {
            const ticketPendiente = new TicketsPendiente( newTicket );
            await ticketPendiente.save();
        } catch( err ) {
            console.log( colors.magenta( err ) );
            return;
        }
    };

    obtenerUltimoTicket = async() => {
        try {
            const { lastTicket } = await LastTicket.findById( process.env.LAST_TICKET_ID );
            return { lastTicket: lastTicket };
        } catch( err ) {
            console.log( colors.magenta( err ) );
            return;
        }
    };



    verificarExisteEscritorio = async( desk ) => {
        try {
            const escritorioEnUso = await Desk.findOne( { desk: desk } );
            if( !escritorioEnUso ) return { desk: false };
               
            return {
                desk: escritorioEnUso.desk,
                agent: escritorioEnUso.agent
            };
        } catch( err ) {
            console.log( colors.magenta( err ) );
            return;
        }
    };

    reservarEscritorio = async( desk, agent ) => {
        try {
            const escritorioEnUso = {
                desk: desk,
                agent: agent
            };
    
            const escritorio = new Desk( escritorioEnUso );
            await escritorio.save();
        } catch( err ) {
            console.log( colors.magenta( err ) );
            return;
        }
    };

    eliminarReservaEscritorio = async( desk ) => {
        try {
            await Desk.findOneAndDelete( { desk: desk } );
        } catch( err ) {
            console.log( colors.magenta( err ) );
            return;
        }
    };



    atenderTickets = async( desk, agent ) => {
        try {
            const { ticket } = await this.obtenerTicketPendiente();
            if( ticket === 'Todos los tickets han sido atendidos.' ) return { ticket: ticket };

            const ticketAtendido = {
                ticketId: ticket.ticketId,
                dayDate: ticket.dayDate,
                ticket: ticket.ticket,
                client: ticket.client,
                state: false,
                desk: desk,
                agent: agent
            };

            await this.crearTicketAtendido( ticketAtendido );
            await this.eliminarTicketPendiente( ticket.client );
            console.log( colors.white( 'Ticket atendido' ) );

            return { ticket: ticketAtendido };
        } catch( err ) {
            console.log( colors.magenta( err ) );
            return;
        }
    };

    obtenerTicketPendiente = async() => {
        try {
            const tickets = await TicketsPendiente.find().sort( { ticket: 'asc' } ).limit( 1 ).exec();
            if( tickets.length === 0 ) return { ticket: 'Todos los tickets han sido atendidos.' };

            return { ticket: tickets[ 0 ] };
        } catch( err ) {
            console.log( colors.magenta( err ) );
            return;
        }
    };

    crearTicketAtendido = async( ticket ) => {
        try {
            const ticketAtendido = new TicketsAtendido( ticket );
            await ticketAtendido.save();
        } catch( err ) {
            console.log( colors.magenta( err ) );
            return;
        }
    };

    eliminarTicketPendiente = async( client ) => {
        try {
            await TicketsPendiente.findOneAndDelete( { client: client } );
        } catch( err ) {
            console.log( colors.magenta( err ) );
            return;
        }
    };

    obtenerUltimoTicketAtendido = async() => {
        try {
            const ticketPendiente = await this.obtenerTicketPendiente();

            if( typeof ticketPendiente.ticket === 'string' ) return { ticket: 'Todos los tickets han sido atendidos.' };
           
            if( typeof ticketPendiente.ticket === 'object' ) return { ticket: 'Hay tickets pendientes de atención.' };

            const tickets = await TicketsAtendido.find().sort( { ticket: 'desc' } ).limit( 1 ).exec();

            if( tickets.length === 0 ) return { ticket: 'Todos los tickets han sido atendidos.' };
        } catch( err ) {
            console.log( colors.magenta( err ) );
            return;
        }
    };



    obtenerUltimosTicketsAtentidos = async() => {
        try {
            const ticketsAtendidos = await TicketsAtendido.find().sort( { ticket: 'desc' } ).limit( 14 ).exec();
            if( ticketsAtendidos.length === 0 ) return { tickets: 'En breve, comenzaremos a antender.' };

            return { tickets: ticketsAtendidos };
        } catch( err ) {
            console.log( colors.magenta( err ) );
            return;
        }
    };
};

module.exports = {
    TicketControl
};
