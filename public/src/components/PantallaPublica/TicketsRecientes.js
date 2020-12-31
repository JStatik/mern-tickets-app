import React from 'react';
import PropTypes from 'prop-types';
import { Col, Typography, List, Card, Tag } from 'antd';

const { Title } = Typography;

const TicketsRecientes = ( { tickets } ) => {
    return (
        <Col xs={ 24 } sm={ 24 } md={ 12 } lg={ 12 } xl={ 12 }>
            <List
                align="center"
                dataSource={ tickets.slice( 0, 4 ) }
                renderItem={
                    ( ticket ) => (
                        <List.Item>
                            <Card
                                style={ { marginRight: 'auto', marginLeft: 'auto', marginTop: 16, width: 350 } }
                                actions={
                                    [
                                        <Tag color="geekblue">{ ticket.agent }</Tag>,
                                        <Tag color="blue">Escritorio: { ticket.desk }</Tag>
                                    ]
                                }>
                                    <Title level={ 1 }>Ticket { ticket.ticket }</Title>
                            </Card>
                        </List.Item>
                    )
                }
            />
        </Col>
    );
};

TicketsRecientes.propTypes = {
    tickets: PropTypes.array.isRequired
};

export default TicketsRecientes;
