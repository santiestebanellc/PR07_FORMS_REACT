import React, { useState } from 'react';
import Bienvenida from './pages/Home';
import Formularios from './pages/Formularios';
import Resumen from './pages/Resumen';
import './styles/forms.css'; // Importa los estilos

const App: React.FC = () => {
  // Estado para controlar la página actual
  const [paginaActual, setPaginaActual] = useState('bienvenida');
  // Estado para almacenar los datos de todos los formularios
  const [formData, setFormData] = useState<{ [key: string]: any }>({});

  // Renderiza la página según el estado
  const renderPagina = () => {
    switch (paginaActual) {
      case 'bienvenida':
        return <Bienvenida onStart={() => setPaginaActual('formularios')} />;
      case 'formularios':
        return <Formularios onComplete={(data) => {
          setFormData(prev => ({ ...prev, ...data }));
          setPaginaActual('resumen');
        }} formData={formData} />;
      case 'resumen':
        return <Resumen formData={formData} onBack={() => setPaginaActual('bienvenida')} />;
      default:
        return <Bienvenida onStart={() => setPaginaActual('formularios')} />;
    }
  };

  return (
    <div className="app">
      {renderPagina()}
    </div>
  );
};

export default App;