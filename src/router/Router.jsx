import { Route, Routes, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import Marketplace from '../pages/Marketplace';
import Upload from '../pages/Upload';
import Wallet from '../pages/Wallet';
import MainApp from '../pages/MainApp';
import NotFound from '../pages/NotFound';
import ExpandedVideoCard from '../components/card/ExpandedVideoCard';
import Profile from '../pages/Profile';
import NFT from '../pages/NFT';

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<MainApp />}>
        <Route index element={<Home />} />
        <Route path="/home" element={<Navigate replace to="/" />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/video/:id" element={<ExpandedVideoCard />} />
        <Route path="/nft/:id" element={<NFT />} />
      </Route>
      <Route path="*" element={<NotFound />} />
      <Route path="/_error" element={<NotFound />} />
    </Routes>
  );
};

export default Router;
