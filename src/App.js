import { useState, useEffect } from 'react';
import './App.css';
import jwtDecode from 'jwt-decode';
import { getAccountDetails } from './services/accountService';
import Router from './router/Router';


import { userContext } from './userContext';
import AuthRouter from './router/AuthRouter';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const [currentUserData, setCurrentUserData] = useState({});

  useEffect(() => {
    const getUserDate = async () => {
      if (token) {
        const userToken = jwtDecode(localStorage.getItem('token'));
        const accountId = userToken.accountId;
        const response = await getAccountDetails(accountId);
        if (response.status === 200) {
          setCurrentUserData(response.data);
        } else {
          setCurrentUserData({});
        }
      }
    };
    getUserDate();
  }, [token]);


  if (token)
    return (
      <userContext.Provider value={{ currentUserData, setCurrentUserData, setToken }}>
        <Router />
      </userContext.Provider>
    );
  else return <AuthRouter setToken={setToken} />;
}

export default App;
