import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import AreeCompetenza from './pages/AreeCompetenza';
import Team from './pages/Team';
import DirittopenPage from './pages/DirittopenPage';
import Compliance231Page from './pages/Compliance231Page';
import DirittoCivilePage from './pages/DirittoCivilePage';
import DirittoCommercialePage from './pages/DirittoCommercialePage';
import DirittoNavigazionePage from './pages/DirittoNavigazionePage';
import NewsPage from './pages/NewsPage';
import LoStudio from './pages/LoStudio';
import Contatti from './pages/Contatti';

function App() {
  return (
    <Router>
      <div className="app-container">
        <ScrollToTop />
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/aree-competenza" element={<AreeCompetenza />} />
            <Route path="/team" element={<Team />} />
            <Route path="/diritto-penale" element={<DirittopenPage />} />
            <Route path="/compliance-231" element={<Compliance231Page />} />
            <Route path="/diritto-civile" element={<DirittoCivilePage />} />
            <Route path="/diritto-commerciale" element={<DirittoCommercialePage />} />
            <Route path="/diritto-della-navigazione" element={<DirittoNavigazionePage />} />
            <Route path="/lo-studio" element={<LoStudio />} />
            <Route path="/contatti" element={<Contatti />} />
            <Route path="/news/:id" element={<NewsPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
