import React from 'react';
import PropTypes from 'prop-types'
import { Row, Col, Typography } from 'antd';

const { Text } = Typography;

const UltimoTicket = ( { lastTicket } ) => {
    return (
        <Row style={ { height: '55vh' } } align="middle">
            <Col span={ 24 } align="center">
                <Text style={ { fontSize: 90 } }>Ticket { lastTicket }</Text>
            </Col>
        </Row>
    );
};

UltimoTicket.propTypes = {
    lastTicket: PropTypes.number.isRequired
};

export default UltimoTicket;
