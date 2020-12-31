import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Typography, List, Tag, Divider } from 'antd';

const { Text } = Typography;

const HistorialTickets = ( { tickets } ) => {
    return (
        <Col xs={ 0 } sm={ 0 } md={ 12 } lg={ 12 } xl={ 12 }>
            <Divider>Historial de tickets</Divider>

            <List
                align="center"
                dataSource={ tickets.slice( 4 ) }
                renderItem={
                    ( ticket ) => (
                        <List.Item>
                            <List.Item.Meta
                                title={ `Ticket ${ ticket.ticket }` }
                                description={
                                    <Row>
                                        <Col span={ 12 }>
                                            <Text type="secondary">Agente: </Text>
                                            <Tag color="geekblue">{ ticket.agent }</Tag>
                                        </Col>

                                        <Col span={ 12 }>
                                            <Text type="secondary">Escritorio: </Text>
                                            <Tag color="blue">{ ticket.desk }</Tag>
                                        </Col>
                                    </Row>          
                                }
                            />
                        </List.Item>
                    )
                }
            />
        </Col>
    );
};

HistorialTickets.propTypes = {
    tickets: PropTypes.array.isRequired
};

export default HistorialTickets;
