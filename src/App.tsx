import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Book, Movie, MediaType } from './types';
import { Navbar } from './components/Navbar';
import { HomeDashboard } from './components/HomeDashboard';
import { BooksCatalogue } from './components/BooksCatalogue';
import { MoviesCatalogue } from './components/MoviesCatalogue';
import { DiscoverRecommendations } from './components/DiscoverRecommendations';
import { AiDiscoveryAssistant } from './components/AiDiscoveryAssistant';
import { CompareTitles } from './components/CompareTitles';
import { WishlistPage } from './components/WishlistPage';
import { HistoryPage } from './components/HistoryPage';
import { AdminDashboard } from './components/AdminDashboard';
import { JavaSourceCodeViewer } from './components/JavaSourceCodeViewer';
import { BookDetailModal } from './components/BookDetailModal';
import { MovieDetailModal } from './components/MovieDetailModal';
import { UserProfileModal } from './components/UserProfileModal';
import { AuthModal } from './components/AuthModal';
import { ToastContainer } from './components/Toast';
import { Footer } from './components/Footer';

function MainApp() {
  const { recordView } = useApp();

  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const handleSelectItem = (item: Book | Movie, type: MediaType) => {
    recordView(type, item.id);
    if (type === 'book') {
      setSelectedBook(item as Book);
      setSelectedMovie(null);
    } else {
      setSelectedMovie(item as Movie);
      setSelectedBook(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors">
      
      {/* Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSelectItem={handleSelectItem}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenProfile={() => setProfileModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {activeTab === 'home' && (
          <HomeDashboard
            onSelectItem={handleSelectItem}
            onNavigateTab={setActiveTab}
            onOpenProfile={() => setProfileModalOpen(true)}
          />
        )}

        {activeTab === 'books' && (
          <BooksCatalogue
            onSelectBook={(b) => handleSelectItem(b, 'book')}
          />
        )}

        {activeTab === 'movies' && (
          <MoviesCatalogue
            onSelectMovie={(m) => handleSelectItem(m, 'movie')}
          />
        )}

        {activeTab === 'discover' && (
          <DiscoverRecommendations
            onSelectItem={handleSelectItem}
            onOpenProfile={() => setProfileModalOpen(true)}
          />
        )}

        {activeTab === 'assistant' && (
          <AiDiscoveryAssistant
            onSelectItem={handleSelectItem}
          />
        )}

        {activeTab === 'compare' && (
          <CompareTitles />
        )}

        {activeTab === 'wishlist' && (
          <WishlistPage
            onSelectItem={handleSelectItem}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'history' && (
          <HistoryPage
            onSelectItem={handleSelectItem}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'admin' && (
          <AdminDashboard />
        )}

        {activeTab === 'java-export' && (
          <JavaSourceCodeViewer />
        )}
      </main>

      {/* Modals & Overlays */}
      {selectedBook && (
        <BookDetailModal
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
          onSelectBook={(b) => handleSelectItem(b, 'book')}
        />
      )}

      {selectedMovie && (
        <MovieDetailModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
          onSelectMovie={(m) => handleSelectItem(m, 'movie')}
        />
      )}

      {profileModalOpen && (
        <UserProfileModal
          onClose={() => setProfileModalOpen(false)}
        />
      )}

      {authModalOpen && (
        <AuthModal
          onClose={() => setAuthModalOpen(false)}
        />
      )}

      {/* Toast Notification Container */}
      <ToastContainer />

      {/* Footer */}
      <Footer onNavigateTab={setActiveTab} />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
