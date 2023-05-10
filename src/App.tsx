import { useAccount } from 'wagmi';
import { Sidebar } from './components/common/sidebar';
import { Connect } from './components/common/connect/Connect.tsx';
import { Route, Routes } from 'react-router-dom';
import Home from './components/pages/home/Home.tsx';

function App() {
  const { isConnected } = useAccount();

  return (
    <>
      {isConnected ? (
        <Sidebar>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </Sidebar>
      ) : (
        <Connect />
      )}
    </>
  );
}

export default App;
