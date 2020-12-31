import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Form, Input, Button } from 'antd';
import { cyan } from '@ant-design/colors';
import { DesktopOutlined, UserOutlined, LoginOutlined } from '@ant-design/icons';
import { SocketContext } from '../../context/SocketContext';
import popUp from '../../helpers/popup';

const FormUsuario = () => {
    const { socket } = useContext( SocketContext );

    const history = useHistory();
    const [ userForm ] = Form.useForm();
    const [ disabled, setDisabled ] = useState( false );

    const onSubmit = ( { desk, user } ) => {
        userForm.resetFields();
        setDisabled( true );

        if( isNaN( desk ) || desk.trim().length > 1 || user.trim().length < 2 ) {
            popUp( 'error', '#820014', 'Error...', 'Los datos ingresados son incorrectos.' );
            setDisabled( false );
            return;
        }

        if( desk <= 0 || desk >= 5 ) {
            popUp( 'error', '#820014', 'Error...', 'Los escritorios disponibles son: 1, 2, 3 y 4.' );
            setDisabled( false );
            return;
        }

        socket.emit( 'login', { desk: desk, agent: user }, ( res ) => {
            setDisabled( false );

            if( res.err ) return popUp( 'error', '#820014', 'Error...', res.err );                   
    
            if( res.info ) return popUp( 'info', '#00474f', 'Info...', res.info );

            localStorage.setItem( 'sesion', JSON.stringify( { desk: desk, user: user } ) );
            history.replace( '/desk' );
        } );
    };

    return (
        <Form form={ userForm } onFinish={ onSubmit } autoComplete="off">
            <Form.Item name="desk" rules={ [ { required: true, min: 1, max: 1, whitespace: true, message: 'Ingrese un escritorio válido.' } ] }>
                <Input prefix={ <DesktopOutlined className="site-form-item-icon" /> } placeholder=" Escritorio" />
            </Form.Item>
            <Form.Item name="user" rules={ [ { required: true, whitespace: true, message: 'Ingrese un nombre de usuario válido.' } ] }>
                <Input prefix={ <UserOutlined className="site-form-item-icon" /> } placeholder=" Usuario" />
            </Form.Item>
            <Form.Item style={ { textAlign: 'center' } }>
                <Button htmlType="submit" disabled={ disabled } shape="round" size="large" style={ { backgroundColor: cyan[ 8 ], border: `solid 2px ${ cyan[ 8 ] }`, color: '#fff' } }>Login <LoginOutlined /></Button>
            </Form.Item>
        </Form>
    );
};

export default FormUsuario;
