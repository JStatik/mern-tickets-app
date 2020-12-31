import React, { useContext, useEffect, useState } from 'react';
import { Divider } from 'antd';
import useHideMenu from '../hooks/useHideMenu';
import { SocketContext } from '../context/SocketContext';
import UltimoTicket from '../components/CrearTicket/UltimoTicket';
import FormCliente from '../components/CrearTicket/FormCliente';

const CrearTicket = () => {
    useHideMenu( true );

    const { socket } = useContext( SocketContext );
    const [ lastTicket, setLastTicket ] = useState( 0 );

    useEffect( () => {
        socket.emit( 'obtenerUltimoTicket', null );

        return () => {
            socket.off( 'obtenerUltimoTicket' );
            socket.off( 'ultimoTicket' );
        };
    }, [ socket ] );

    socket.on( 'ultimoTicket', ( { lastTicket } ) => {
        setLastTicket( lastTicket );
    } );

    return (
        <>
            <UltimoTicket lastTicket={ lastTicket } />

            <Divider />

            <FormCliente setLastTicket={ setLastTicket } />
        </>
    );
};

export default CrearTicket;
