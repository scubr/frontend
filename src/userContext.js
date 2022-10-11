import React from 'react';

const userContext = React.createContext({
    currentUserData: {},
    setCurrentUserData: (currentUserData) => { },
});

export { userContext };