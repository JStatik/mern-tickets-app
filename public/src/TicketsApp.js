import React from 'react';
import { SocketProvider } from './context/SocketContext';
import { UIProvider } from './context/UIContext';
import RouterApp from './router/RouterApp';

const TicketsApp = () => {
    return (
        <SocketProvider>
            <UIProvider>
                <RouterApp />
            </UIProvider>
        </SocketProvider>
    );
};

export default TicketsApp;
