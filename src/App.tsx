import { useState } from 'react';
import './App.css';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Portfolio } from './pages/Portfolio';
import { Administracao } from './pages/Administracao';
import { Projetos } from './pages/Projetos';
import { EntidadesEquipe } from './pages/EntidadesEquipe';
import { Financeiro } from './pages/Financeiro';
import { Relatorios } from './pages/Relatorios';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'portfolio':
        return <Portfolio />;
      case 'admin':
        return <Administracao />;
      case 'projetos':
        return <Projetos />;
      case 'entidades':
      case 'equipe':
        return <EntidadesEquipe />;
      case 'financeiro':
        return <Financeiro />;
      case 'cronograma':
      case 'krs':
      case 'relatorios':
        return <Relatorios />;
      case 'checklist':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Checklist de Encerramento</h2>
            <p className="text-muted-foreground">Em desenvolvimento...</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </Layout>
  );
}

export default App;
