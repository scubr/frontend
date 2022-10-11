import { Route, Routes } from 'react-router-dom';
import RegistrationPage from './../pages/onboarding/RegistrationPage';
import LandingPage from './../pages/onboarding/LandingPage';
import NotFound from '../pages/NotFound';

const AuthRouter = ({ setToken }) => {
    return (
        <Routes>
            <Route path="/" element={<LandingPage setToken={setToken} />} />
            <Route
                path="/registration"
                element={<RegistrationPage setToken={setToken} />}
            />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AuthRouter;