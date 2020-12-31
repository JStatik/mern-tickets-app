const colors = require( 'colors' );
const { TicketControl } = require( '../classes/ticketControl' );

const ticketControl = new TicketControl();

class Sockets {
    constructor( io ) {
        this.io = io;
        this.eventsSockets();
    }

    eventsSockets = () => {
        this.io.on( 'connection', async( client ) => {
            console.log( colors.yellow( 'Dispositivo conectado' ) );
        
            client.on( 'disconnect', () => {
                console.log( colors.red( 'Dispositivo desconectado' ) );
            } );



            client.on( 'crearTicket', async( data, callback ) => {
                if( !callback ) return;
        
                if( !data.client )
                    return callback( { err: 'El número de cliente es obligatorio.' } );

                if( isNaN( data.client ) || data.client.trim().length > 8 || data.client.trim().length < 7 ) 
                    return callback( { err: 'El número de cliente es inválido, intente nuevamente.' } );
        
                const ticketDB = await ticketControl.verificarExisteCliente( data.client );
        
                if( ticketDB.ticket )
                    return callback( { info: `Ya posee el ticket Nº ${ ticketDB.ticket }, en breve será atendido.` } );
        
                if( !ticketDB.ticket ) {
                    await ticketControl.generarTicket( data.client );
                    const { lastTicket } = await ticketControl.obtenerUltimoTicket();
        
                    client.broadcast.emit( 'ticketAtendidoInfo', await ticketControl.obtenerUltimoTicketAtendido() );       
                    return callback( { ticket: lastTicket } );
                }
            } );

            client.on( 'obtenerUltimoTicket', async() => {
                client.emit( 'ultimoTicket', await ticketControl.obtenerUltimoTicket() );
            } );
        
            client.on( 'ultimoTicket', ( data ) => {
                client.broadcast.emit( 'ultimoTicket', data );
            } );
        
            client.emit( 'ultimoTicket', await ticketControl.obtenerUltimoTicket() );



            client.on( 'login', async( data, callback ) => {
                if( !callback ) return;
        
                if( !data.desk || !data.agent ) 
                    return callback( { err: 'El escritorio y agente son obligatorios.' } );

                if( isNaN( data.desk ) || data.desk.trim().length > 1 || data.agent.trim().length < 2 ) 
                    return callback( { err: 'Los datos ingresados son incorrectos.' } );

                if( data.desk <= 0 || data.desk >= 5 )
                    return callback( { err: 'Los escritorios disponibles son: 1, 2, 3 y 4.' } );
        
                const deskDB = await ticketControl.verificarExisteEscritorio( data.desk );
        
                if( deskDB.desk ) {
                    return callback( { info: `El escritorio Nº ${ deskDB.desk } se encuentra en uso por ${ deskDB.agent }.` } );
                } else {
                    await ticketControl.reservarEscritorio( data.desk, data.agent );  
                    return callback( { ok: 'Escritorio disponible.' } );
                }
            } );

            client.on( 'logout', async( { desk } ) => {
                await ticketControl.eliminarReservaEscritorio( desk );  
            } );



            client.on( 'atenderTicket', async( data, callback ) => {
                if( !callback ) return;
        
                if( !data.desk || !data.agent )
                    return callback( { err: 'El escritorio y agente son obligatorios.' } );
        
                const ticketAtendido = await ticketControl.atenderTickets( data.desk, data.agent );
        
                if( typeof ticketAtendido.ticket !== 'string' )
                    client.broadcast.emit( 'ticketsAtendidos', await ticketControl.obtenerUltimosTicketsAtentidos() );
        
                return callback( ticketAtendido );
            } );

            client.on( 'obtenerTicketAtendido', async() => {
                client.emit( 'ticketAtendidoInfo', await ticketControl.obtenerUltimoTicketAtendido() );
            } );
        
            client.on( 'ticketAtendido', ( data ) => {
                client.broadcast.emit( 'ticketAtendidoInfo', data );
            } );
        
            client.emit( 'ticketAtendidoInfo', await ticketControl.obtenerUltimoTicketAtendido() );



            client.on( 'obtenerTicketsAtendidos', async( data, callback ) => {
                if( !callback ) return;

                return callback( await ticketControl.obtenerUltimosTicketsAtentidos() );
            } );

            client.emit( 'ticketsAtendidos', await ticketControl.obtenerUltimosTicketsAtentidos() );
        } );
    }
}

module.exports = Sockets;
