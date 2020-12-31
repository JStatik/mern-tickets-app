import { useContext, useEffect } from 'react';
import { UIContext } from '../context/UIContext';

const useHideMenu = ( hide ) => {
    const { showMenuHeader, hideMenuHeader } = useContext( UIContext );

    useEffect( () => {
        if( !hide ) {
            showMenuHeader();
        } else {
            hideMenuHeader();
        }
    }, [ hide, showMenuHeader, hideMenuHeader ] );
};

export default useHideMenu;
