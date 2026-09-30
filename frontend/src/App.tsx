import React, { useState, useEffect } from 'react';
import { AppTab, SystemStatus } from './types';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ConfigModal } from './components/common/ConfigModal';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { TutorPage } from './pages/TutorPage';
import { QuizPage } from './pages/QuizPage';
import { SummarizerPage } from './pages/SummarizerPage';
import { LearningPathPage } from './pages/LearningPathPage';
import { RecommendationsPage } from './pages/RecommendationsPage';
import { AboutPage } from './pages/AboutPage';
import { fetchSystemStatus } from './api/status';

export function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('home');
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

  useEffect(() => {
    // Load backend status
    fetchSystemStatus()
      .then(s => setStatus(s))
      .catch(() => {
        // Fallback status if backend not yet running during initial render
        setStatus({
          service: 'EduGenie API',
          version: '1.0.0',
          gemini_model: 'gemini-2.5-flash',
          gemini_configured: false,
          mode: 'curated_demo'
        });
      });
  }, []);

  const handleTabChange = (tab: AppTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderActivePage = () => {
    switch (activeTab) {
      case 'home':
        return <LandingPage onNavigate={handleTabChange} />;
      case 'dashboard':
        return <DashboardPage onNavigate={handleTabChange} />;
      case 'tutor':
        return <TutorPage />;
      case 'quiz':
        return <QuizPage />;
      case 'summarizer':
        return <SummarizerPage />;
      case 'learning-path':
        return <LearningPathPage />;
      case 'recommendations':
        return <RecommendationsPage />;
      case 'about':
        return <AboutPage onNavigate={handleTabChange} />;
      default:
        return <LandingPage onNavigate={handleTabChange} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        status={status}
        onOpenConfig={() => setIsConfigModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {renderActivePage()}
      </main>

      {/* Footer */}
      <Footer onTabChange={handleTabChange} />

      {/* Configuration & Architecture Modal */}
      <ConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        status={status}
      />
    </div>
  );
}

export default App;
