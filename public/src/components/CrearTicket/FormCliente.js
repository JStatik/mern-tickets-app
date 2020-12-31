import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Typography, Form, Input, Button } from 'antd';
import { cyan } from '@ant-design/colors';
import { IdcardOutlined, FileDoneOutlined } from '@ant-design/icons';
import { SocketContext } from '../../context/SocketContext';
import popUp from '../../helpers/popup';

const { Paragraph } = Typography;

const FormCliente = ( { setLastTicket } ) => {
    const [ clientForm ] = Form.useForm();
    const { socket } = useContext( SocketContext );
    const [ disabled, setDisabled ] = useState( false );

    const onSubmit = ( { dni } ) => {
        clientForm.resetFields();
        setDisabled( true );

        if( isNaN( dni ) || dni.trim().length > 8 || dni.trim().length < 7 ) {
            popUp( 'error', '#820014', 'Error...', 'El número de cliente es inválido, intente nuevamente.' );
            setDisabled( false );
            return;
        }

        socket.emit( 'crearTicket', { client: dni }, ( res ) => {
            setDisabled( false );

            if( res.err ) return popUp( 'error', '#820014', 'Error...', res.err );
    
            if( res.info ) return popUp( 'info', '#00474f', 'Info...', res.info );
    
            socket.emit( 'ultimoTicket', { lastTicket: res.ticket } );
            setLastTicket( () => res.ticket );
        } );
    };

    return (
        <>
            <Row style={ { marginTop: 100 } }>
                <Col span={ 16 } offset={ 4 }>
                    <Form form={ clientForm } id="formCreateTicket" onFinish={ onSubmit } autoComplete="off">
                        <Form.Item name="dni" rules={ [ { required: true, min: 7, max: 8, whitespace: true, message: 'Ingrese un DNI válido.' } ] }>
                            <Input prefix={ <IdcardOutlined className="site-form-item-icon" /> } placeholder=" Cliente" />
                        </Form.Item>
                        <Paragraph type="secondary" align="center">Por favor, ingrese su número de DNI.</Paragraph>
                    </Form>
                </Col>
            </Row>

            <Row >
                <Col span={ 24 } align="center">
                    <Button form="formCreateTicket" htmlType="submit" disabled={ disabled } shape="round" size="large" style={ { backgroundColor: cyan[ 8 ], border: `solid 2px ${ cyan[ 8 ] }`, color: '#fff' } }>Ticket <FileDoneOutlined /></Button>
                </Col>
            </Row>            
        </>
    );
};

FormCliente.propTypes = {
    setLastTicket: PropTypes.func.isRequired
};

export default FormCliente;
