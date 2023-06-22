import { useAccount, useNetwork } from 'wagmi';
import { Sidebar } from './components/common/sidebar';
import { Connect } from './components/pages/connect/Connect.tsx';
import { Route, Routes } from 'react-router-dom';
import Home from './components/pages/home/Home.tsx';
import { polygonMumbai } from 'wagmi/chains';
import SwitchNetwork from './components/pages/switchNetwork/SwitchNetwork.tsx';

function App() {
  const { isConnected } = useAccount();

  const { chain } = useNetwork();

  const isWrongNetwork = chain?.id !== polygonMumbai.id;

  if (!isConnected) {
    return <Connect />;
  }

  if (isWrongNetwork) {
    return <SwitchNetwork />;
  }

  return (
    <Sidebar>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Sidebar>
  );
}

export default App;
