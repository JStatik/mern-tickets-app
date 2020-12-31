import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { Row, Col, Typography, Button, Tag } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';
import { red } from '@ant-design/colors';
import { SocketContext } from '../../context/SocketContext';

const { Title, Text } = Typography;

const PanelAgente = ( { sesion } ) => {
    const history = useHistory();
    const { socket, online } = useContext( SocketContext );

    const handleLogout = () => {
        socket.emit( 'logout', { desk: sesion.desk } );
        localStorage.removeItem( 'sesion' );
        history.replace( '/' );
    };

    return (
        <Row>
            <Col xs={ 24 } sm={ 24 } md={ 19 } lg={ 19 } xl={ 19 }>
                <Title level={ 2 }>{ sesion.user } { online ? <Tag color="green">Online</Tag> : <Tag color="red">Offline</Tag> }</Title>
                <Text>Usted está trabajando en el escritorio: </Text>
                <Text type="success">{ sesion.desk }</Text>
            </Col>

            <Col xs={ 24 } sm={ 24 } md={ 5 } lg={ 5 } xl={ 5 } align="center" style={ { marginTop: '10px' } }>
                <Button shape="round" onClick={ handleLogout } size="large" style={ { backgroundColor: red[ 8 ], border: `solid 2px ${ red[ 8 ] }`, color: '#fff' } }>Logout <CloseCircleOutlined /></Button>
            </Col>
        </Row>
    );
};

PanelAgente.propTypes = {
    sesion: PropTypes.object.isRequired
};

export default PanelAgente;
