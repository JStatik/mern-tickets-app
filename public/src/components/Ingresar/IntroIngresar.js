import React, { useContext } from 'react';
import { Typography, Tag } from 'antd';
import { SocketContext } from '../../context/SocketContext';

const { Title, Text } = Typography;

const IntroIngresar = () => {
    const { online } = useContext( SocketContext );

    return (
        <>
            <Title level={ 4 }>Ingresar { online ? <Tag color="green">Online</Tag> : <Tag color="red">Offline</Tag> }</Title>
            <Text type="secondary">Escritorio y usuario.</Text>
        </>
    )
};

export default IntroIngresar;
