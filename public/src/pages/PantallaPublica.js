import React, { useContext, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { Row } from 'antd';
import { SocketContext } from '../context/SocketContext';
import useHideMenu from '../hooks/useHideMenu';
import popUp from '../helpers/popup';
import TicketsRecientes from '../components/PantallaPublica/TicketsRecientes';
import HistorialTickets from '../components/PantallaPublica/HistorialTickets';

const PantallaPublica = () => {
    useHideMenu( true );

    const { socket } = useContext( SocketContext );
    const [ tickets, setTickets ] = useState( [] );

    useEffect( () => {
        socket.emit( 'obtenerTicketsAtendidos', null, ( { tickets } ) => {
            if( typeof tickets === 'string' ) return popUp( 'info', '#00474f', 'Info...', tickets );
    
            Swal.close();
            setTickets( tickets );
        } );

        return () => {
            socket.off( 'obtenerTicketsAtendidos' );
            socket.off( 'ticketsAtendidos' );
        };
    }, [ socket ] );

    socket.on( 'ticketsAtendidos', ( { tickets } ) => {
        if( typeof tickets === 'string' ) return popUp( 'info', '#00474f', 'Info...', tickets );
    
        Swal.close();
        setTickets( tickets );
    
        const audio = new Audio( '../assets/audio/new-ticket.mp3' );
        audio.play();
    } );

    return (
        <Row>
            <TicketsRecientes tickets={ tickets } />

            <HistorialTickets tickets={ tickets } />
        </Row>
    );
};

export default PantallaPublica;
