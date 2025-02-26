/*Página para el formulario de información personal*/

import React from 'react';
import FormPersonal from '../components/FormTechPrefs';
import '../styles/forms.css';

const PersonalForm: React.FC = () => {
  return (
    <div className="page-container">
      <h1>Formulario de Información Personal</h1>
      <FormPersonal />
      <div className="navigation">
        <button onClick={() => alert('Navegar a otro formulario aquí')}>
          Ir a Evaluación Académica
        </button>
        <button onClick={() => alert('Navegar a Preferencias en Tecnología')}>
          Ir a Preferencias en Tecnología
        </button>
      </div>
    </div>
  );
};

export default PersonalForm;