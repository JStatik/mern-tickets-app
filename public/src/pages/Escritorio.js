import React, { useContext, useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Divider } from 'antd';
import useHideMenu from '../hooks/useHideMenu';
import { SocketContext } from '../context/SocketContext';
import PanelAgente from '../components/Escritorio/PanelAgente';
import AtenderTicket from '../components/Escritorio/AtenderTicket';

const Escritorio = () => {
    useHideMenu( false );

    const { socket } = useContext( SocketContext );
    const [ ticket, setTicket ] = useState( 0 );
    const [ message, setMessage ] = useState( '' );
    const [ showTicket, setShowTicket ] = useState( false );
    const [ sesion ] = useState( JSON.parse( localStorage.getItem( 'sesion' ) ) );

    useEffect( () => {
        socket.emit( 'obtenerTicketAtendido', null );

        return () => {
            socket.off( 'obtenerTicketAtendido' );
            socket.off( 'ticketAtendidoInfo' );
        };
    }, [ socket ] );

    if( !sesion?.desk && !sesion?.user ) return <Redirect to="/" />

    socket.on( 'ticketAtendidoInfo', ( data ) => {
        if( typeof data.ticket === 'string' ) {
            setMessage( data.ticket );  
            setShowTicket( false );
            return;
        }
    
        setMessage( data.agent );
        setTicket( data.ticket );
        setShowTicket( true );
    } );

    return (
        <>
            <PanelAgente sesion={ sesion } />

            <Divider />

            <AtenderTicket
                sesion={ sesion }
                message={ message }
                setMessage={ setMessage }
                ticket={ ticket }
                setTicket={ setTicket }
                showTicket={ showTicket }
                setShowTicket={ setShowTicket }
            />
        </>
    );
};

export default Escritorio;
