import { useAccount } from 'wagmi';
import { Sidebar } from './components/common/sidebar';
import { Connect } from './components/pages/connect/Connect.tsx';
import { Route, Routes } from 'react-router-dom';
import Home from './components/pages/home/Home.tsx';
import ErrorBoundary from './utils/ErrorBoundary.tsx';
import { GlobalErrorBoundaryFallback } from './components/GlobalErrorBoundaryFallback.tsx';

function App() {
  const { isConnected } = useAccount();

  return (
    <ErrorBoundary fallback={GlobalErrorBoundaryFallback}>
      {isConnected ? (
        <Sidebar>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </Sidebar>
      ) : (
        <Connect />
      )}
    </ErrorBoundary>
  );
}

export default App;
