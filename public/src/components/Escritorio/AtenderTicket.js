import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Typography, Button } from 'antd';
import { cyan } from '@ant-design/colors';
import { DoubleRightOutlined } from '@ant-design/icons';
import { SocketContext } from '../../context/SocketContext';
import popUp from '../../helpers/popup';

const { Text } = Typography;

const AtenderTicket = ( { sesion, message, setMessage, ticket, setTicket, showTicket, setShowTicket } ) => {
    const { socket } = useContext( SocketContext );

    const nextTicket = () => {
        socket.emit( 'atenderTicket', { desk: sesion.desk, agent: sesion.user }, ( res ) => {
            if( res.err ) return popUp( 'error', '#820014', 'Error...', res.err );
    
            if( typeof res.ticket === 'string' ) {
                popUp( 'info', '#00474f', 'Info...', res.ticket );
                socket.emit( 'ticketAtendido', { ticket: res.ticket } );
                setMessage( () => res.ticket );
                setShowTicket( () => false );
                return;
            }
            
            const { ticket } = res;
            socket.emit( 'ticketAtendido', { agent: `${ sesion.user } está atendiendo el ticket número: `, ticket: ticket.ticket } );
            setMessage( () => `${ sesion.user } está atendiendo el ticket número: ` );
            setTicket( () => ticket.ticket );
            setShowTicket( () => true );
        } );
    };

    return (
        <>
            <Row>
                <Col span={ 24 } align="center">
                    <Text>{ message }</Text>
                    { showTicket && <Text style={ { color: cyan[ 8 ], fontSize: '30px' } }>{ ticket }</Text> }
                </Col>
            </Row>

            <Row>
                <Col span={ 24 } align="center">
                    <Button shape="round" onClick={ nextTicket } size="large" style={ { backgroundColor: cyan[ 8 ], border: `solid 2px ${ cyan[ 8 ] }`, color: '#fff' } }>Next <DoubleRightOutlined /></Button>
                </Col>
            </Row>
        </>
    );
};

AtenderTicket.propTypes = {
    sesion: PropTypes.object.isRequired,
    message: PropTypes.string.isRequired,
    setMessage: PropTypes.func.isRequired,
    ticket: PropTypes.number.isRequired,
    setTicket: PropTypes.func.isRequired,
    showTicket: PropTypes.bool.isRequired,
    setShowTicket: PropTypes.func.isRequired
};

export default AtenderTicket;
