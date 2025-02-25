import React from 'react';
import '../styles/forms.css';

interface BienvenidaProps {
  onStart: () => void;
}

const Bienvenida: React.FC<BienvenidaProps> = ({ onStart }) => {
  return (
    <div className="page-container">
      <h1>Página de Bienvenida</h1>
      <p>
        Esta aplicación te permite completar una serie de cuestionarios para recopilar información personal, evaluaciones 
        académicas, preferencias en tecnología y preferencias en cine. Sigue las instrucciones a continuación para realizar 
        los formularios:
      </p>
      <ul>
        <li>Completa cada formulario consecutivamente.</li>
        <li>Revisa los errores antes de avanzar al siguiente formulario.</li>
        <li>Al finalizar, verás un resumen con toda tu información.</li>
      </ul>
      <button className="start-button" onClick={onStart}>
        Comenzar Formularios
      </button>
    </div>
  );
};

export default Bienvenida;