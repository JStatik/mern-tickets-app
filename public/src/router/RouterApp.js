import React, { useContext, useState } from 'react';
import { UIContext } from '../context/UIContext';
import { Layout, Menu } from 'antd';
import { cyan } from '@ant-design/colors';
import { MenuUnfoldOutlined, MenuFoldOutlined, LoginOutlined, FileDoneOutlined, ClusterOutlined } from '@ant-design/icons';
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
import Ingresar from '../pages/Ingresar';
import CrearTicket from '../pages/CrearTicket';
import Escritorio from '../pages/Escritorio';
import PantallaPublica from '../pages/PantallaPublica';

const { Header, Sider, Content } = Layout;

const RouterApp = () => {
    const { hide } = useContext( UIContext );
    const [ collapsed, setCollapsed ] = useState( false );

    const toggle = () => {
        setCollapsed( !collapsed );
    };

    return (
        <Router>
            <Layout style={ { height: '100vh' } }>
                <Sider hidden={ hide } trigger={ null } collapsible collapsed={ collapsed } breakpoint="sm" onBreakpoint={ ( broken ) => setCollapsed( broken ) } style={ { backgroundColor: cyan[ 8 ] } } className="borderRight">
                    <Menu theme="dark" mode="inline" selectable={ false } defaultSelectedKeys={ [ '1' ] } style={ { backgroundColor: cyan[ 8 ] } } className={ collapsed && 'borderRight' }>
                        <Menu.Item key="1" icon={ <LoginOutlined /> }><Link to="/">Ingresar</Link></Menu.Item>
                        <Menu.Item icon={ <FileDoneOutlined /> }><Link to="/create">Crear Ticket</Link></Menu.Item>
                        <Menu.Item icon={ <ClusterOutlined /> }><Link to="/tickets">Pantalla Pública</Link></Menu.Item>
                    </Menu>
                </Sider>
                <Layout className="site-layout">
                    <Header hidden={ hide } style={ { backgroundColor: cyan[ 8 ], color: '#fff', paddingLeft: 10 } }>
                        {
                            React.createElement( collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                                className: 'trigger',
                                onClick: toggle
                            } )
                        }
                    </Header>
                    <Content className="site-layout-background" style={ { background: '#fff', padding: 20 } }>
                        <Switch>
                            <Route exact path="/" component={ Ingresar } />
                            <Route exact path="/create" component={ CrearTicket } />
                            <Route exact path="/desk" component={ Escritorio } />
                            <Route exact path="/tickets" component={ PantallaPublica } />

                            <Redirect to="/" />
                        </Switch>
                    </Content>
                </Layout>
            </Layout>
        </Router>
    );
};

export default RouterApp;
