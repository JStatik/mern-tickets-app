import React, { createContext, useState } from 'react';

const UIContext = createContext();

const UIProvider = ( { children } ) => {
    const [ hide, setHide ] = useState( false );

    const showMenuHeader = () => {
        setHide( false );
    };

    const hideMenuHeader = () => {
        setHide( true );
    };

    return (
        <UIContext.Provider value={ { hide, showMenuHeader, hideMenuHeader } }>
            { children }
        </UIContext.Provider>
    );
};

export {
    UIContext,
    UIProvider
};
