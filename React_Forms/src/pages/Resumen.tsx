import React from 'react';
import '../styles/forms.css';

interface ResumenProps {
  formData: { [key: string]: any };
  onBack: () => void;
}

const Resumen: React.FC<ResumenProps> = ({ formData, onBack }) => {
  return (
    <div className="page-container">
      <h1>Resumen de Tus Respuestas</h1>
      {Object.entries(formData).map(([formId, data]) => (
        <div key={formId} className="summary-section">
          <h2>{formId.charAt(0).toUpperCase() + formId.slice(1)}</h2>
          <ul>
            {Object.entries(data).map(([field, value]) => (
              <li key={field}>
                <strong>{field.replace(/_/g, ' ').charAt(0).toUpperCase() + field.slice(1).replace(/_/g, ' ')}:</strong> {JSON.stringify(value)}
              </li>
            ))}
          </ul>
        </div>
      ))}
      <button className="back-button" onClick={onBack}>
        Volver a Bienvenida
      </button>
    </div>
  );
};

export default Resumen;