import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Divider } from 'antd';
import useHideMenu from '../hooks/useHideMenu';
import IntroIngresar from '../components/Ingresar/IntroIngresar';
import FormUsuario from '../components/Ingresar/FormUsuario';

const Ingresar = () => {
    useHideMenu( false );   
    const [ sesion ] = useState( JSON.parse( localStorage.getItem( 'sesion' ) ) );

    if( sesion?.desk && sesion?.user ) return <Redirect to="/desk" />

    return (
        <>
            <IntroIngresar />

            <Divider />

            <FormUsuario />
        </>
    );
};

export default Ingresar;
