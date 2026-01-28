
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Start from './pages/Start';
import VideoSelect from './pages/VideoSelect';
import RouteSelect from './pages/RouteSelect';
import Quiz from './pages/Quiz';
import Results from './pages/Results';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import { UserSession, QuizResult, RouteType } from './types';
import { initializeDefaultData, getStats, saveStats } from './storage';

const App: React.FC = () => {
  const [session, setSession] = useState<UserSession | null>(null);
  const [currentResult, setCurrentResult] = useState<QuizResult | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    initializeDefaultData();
    
    if (!sessionStorage.getItem('summa_visited')) {
      const stats = getStats();
      stats.visits++;
      saveStats(stats);
      sessionStorage.setItem('summa_visited', 'true');
    }

    let keyCount = 0;
    let timer: any;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '9') {
        keyCount++;
        clearTimeout(timer);
        timer = setTimeout(() => { keyCount = 0; }, 5000);
        if (keyCount >= 7) {
          window.location.hash = '/admin-login';
          keyCount = 0;
        }
      } else {
        keyCount = 0;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleStart = (name: string, className: string) => {
    setSession({ name, class: className, startTime: Date.now() });
  };

  const handleVideoSelect = (videoId: number) => {
    if (session) setSession({ ...session, selectedVideo: videoId });
  };

  const handleRouteSelect = (route: RouteType) => {
    if (session) {
      setSession({ ...session, selectedRoute: route });
      const stats = getStats();
      stats.routesChosen[route]++;
      saveStats(stats);
    }
  };

  const handleQuizFinish = (result: QuizResult) => {
    setCurrentResult(result);
    const stats = getStats();
    stats.formsFinished++;
    saveStats(stats);
  };

  return (
    <HashRouter>
      <div className="min-h-screen font-sans selection:bg-summaYellow selection:text-summaIndigo">
        <Routes>
          <Route path="/" element={<Start onStart={handleStart} />} />
          
          <Route path="/video-select" element={
            session ? <VideoSelect onSelect={handleVideoSelect} /> : <Navigate to="/" />
          } />

          <Route path="/route-select" element={
            session?.selectedVideo ? <RouteSelect onSelect={handleRouteSelect} /> : <Navigate to="/" />
          } />
          
          <Route path="/quiz" element={
            session?.selectedRoute ? <Quiz session={session} onFinish={handleQuizFinish} /> : <Navigate to="/" />
          } />
          
          <Route path="/results" element={
            currentResult ? <Results result={currentResult} /> : <Navigate to="/" />
          } />

          <Route path="/admin-login" element={<AdminLogin onLogin={() => setIsAdmin(true)} />} />
          
          <Route path="/admin" element={
            isAdmin || sessionStorage.getItem('admin_session') === 'active' ? <AdminDashboard /> : <Navigate to="/admin-login" />
          } />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </HashRouter>
  );
};

export default App;
