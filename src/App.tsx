import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PageId, UploadedFile, PredictionResult } from '@/types';
import { useTheme } from '@/hooks/useTheme';
import { useHealth } from '@/hooks/useApi';
import { api } from '@/services/api';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Landing from '@/pages/Landing';
import UploadPage from '@/pages/UploadPage';
import Processing from '@/pages/Processing';
import Results from '@/pages/Results';
import Pipeline from '@/pages/Pipeline';
import Downloads from '@/pages/Downloads';

function App() {
  const { theme, toggleTheme } = useTheme();
  const { data: health, refetch } = useHealth();
  const [page, setPage] = useState<PageId>('landing');
  const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);

  const navigate = useCallback((next: PageId) => {
    setPage(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleStartAnalysis = useCallback(async () => {
    if (!selectedFile?.name) return;
    const result = await api.predict({ name: selectedFile.name, size: selectedFile.size });
    setPrediction(result);
  }, [selectedFile]);

  const healthStatus = useMemo(() => {
    if (!health) return 'loading' as const;
    return health.status;
  }, [health]);

  // refresh health when entering landing
  useEffect(() => {
    if (page === 'landing') refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const pageProps = {
    onNavigate: navigate,
    onFileSelected: setSelectedFile,
    selectedFile,
    onStartAnalysis: handleStartAnalysis,
    onComplete: handleStartAnalysis,
    prediction,
    fileName: selectedFile?.name,
    theme,
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Sidebar
        current={page}
        onNavigate={navigate}
        theme={theme}
        onToggleTheme={toggleTheme}
        health={healthStatus}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar current={page} onNavigate={navigate} theme={theme} onToggleTheme={toggleTheme} />
        <main className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              {page === 'landing' && <Landing onNavigate={navigate} />}
              {page === 'upload' && <UploadPage {...pageProps} />}
              {page === 'processing' && <Processing onNavigate={navigate} onComplete={handleStartAnalysis} />}
              {page === 'results' && <Results {...pageProps} />}
              {page === 'pipeline' && <Pipeline onNavigate={navigate} />}
              {page === 'downloads' && <Downloads onNavigate={navigate} prediction={prediction} fileName={selectedFile?.name} />}
            </motion.div>
          </AnimatePresence>
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;
