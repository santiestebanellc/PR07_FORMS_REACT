import React, { useState, useEffect } from 'react';
import '../styles/forms.css';

interface Campo {
  id: string;
  tipo: 'text' | 'textarea' | 'select' | 'check';
  pregunta: string;
  restricciones?: { min: number; max: number };
  validacion?: {
    formato?: 'email';
    dominio?: string;
    min_edad?: number;
    max_seleccionados?: number;
  };
  opciones?: string[];
}

interface Formulario {
  id: string;
  titulo: string;
  campos: Campo[];
}

interface FormulariosProps {
  onComplete: (data: { [key: string]: any }) => void;
  formData: { [key: string]: any };
}

const Formularios: React.FC<FormulariosProps> = ({ onComplete, formData }) => {
  const [currentFormIndex, setCurrentFormIndex] = useState(0);
  const [formDataLocal, setFormDataLocal] = useState<{ [key: string]: any }>(formData || {});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [cuestionario, setCuestionario] = useState<Formulario[]>([]);

  // Cargar el JSON con los formularios
  useEffect(() => {
    fetch('/cuestionario.json')
      .then(response => response.json())
      .then(data => setCuestionario(data.formularios))
      .catch(error => console.error('Error cargando el cuestionario:', error));
  }, []);

  // Manejar cambios en los inputs
  const handleChange = (formId: string, fieldId: string, value: string | string[]) => {
    setFormDataLocal(prev => ({
      ...prev,
      [formId]: {
        ...(prev[formId] || {}),
        [fieldId]: value,
      },
    }));
    setErrors(prev => ({
      ...prev,
      [fieldId]: '',
    }));
  };

  // Validar un campo específico
  const validateField = (form: Formulario, fieldId: string, value: string | string[]): string => {
    const campo = form.campos.find(c => c.id === fieldId);
    if (!campo) return '';

    let error = '';
    if (campo.restricciones) {
      const length = Array.isArray(value) ? value.join('').length : (value as string).length;
      if (length < campo.restricciones.min) error = `Debe tener al menos ${campo.restricciones.min} caracteres`;
      else if (length > campo.restricciones.max) error = `No puede tener más de ${campo.restricciones.max} caracteres`;
    }

    if (campo.validacion?.formato === 'email') {
      if (!/\S+@\S+\.\S+/.test(value as string)) error = 'El email no es válido';
      else if (campo.validacion.dominio && !(value as string).endsWith(`@${campo.validacion.dominio}`))
        error = `El email debe pertenecer al dominio ${campo.validacion.dominio}`;
    }

    if (fieldId === 'age' && typeof value === 'string') {
      const age = parseInt(value);
      if (isNaN(age) || age < (campo.validacion?.min_edad || 0))
        error = `La edad debe ser mayor a ${campo.validacion?.min_edad || 0}`;
    }

    return error;
  };

  // Validar formulario completo
  const validateForm = (form: Formulario): boolean => {
    let newErrors: { [key: string]: string } = {};
    form.campos.forEach(campo => {
      const value = formDataLocal[form.id]?.[campo.id] || '';
      const error = validateField(form, campo.id, value as string);
      if (error) newErrors[campo.id] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar el envío del formulario actual
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentForm = cuestionario[currentFormIndex];
    if (validateForm(currentForm)) {
      if (currentFormIndex < cuestionario.length - 1) {
        setCurrentFormIndex(prev => prev + 1);
        setErrors({}); // Reinicia errores para el siguiente formulario
      } else {
        onComplete(formDataLocal); // Enviar todos los datos al completar
      }
    }
  };

  // Renderizar campos dinámicamente
  const renderCampo = (form: Formulario, campo: Campo) => {
    switch (campo.tipo) {
      case 'text':
        return (
          <div key={campo.id}>
            <label>{campo.pregunta}</label>
            <input
              type="text"
              name={campo.id}
              value={formDataLocal[form.id]?.[campo.id] || ''}
              onChange={(e) => handleChange(form.id, campo.id, e.target.value)}
              placeholder={`Ingrese ${campo.pregunta.toLowerCase()}`}
            />
            {errors[campo.id] && <span className="error">{errors[campo.id]}</span>}
          </div>
        );
      default:
        return null; // Agrega más casos para 'textarea', 'select', 'check' si los necesitas
    }
  };

  if (cuestionario.length === 0) return <div>Cargando...</div>;

  const currentForm = cuestionario[currentFormIndex];

  return (
    <div className="page-container">
      <h2>{currentForm.titulo}</h2>
      <form onSubmit={handleSubmit}>
        {currentForm.campos.map(campo => renderCampo(currentForm, campo))}
        <button type="submit">
          {currentFormIndex < cuestionario.length - 1 ? 'Siguiente Formulario' : 'Finalizar y Ver Resumen'}
        </button>
      </form>
      {currentFormIndex > 0 && (
        <button className="back-button" onClick={() => setCurrentFormIndex(prev => prev - 1)}>
          Anterior
        </button>
      )}
    </div>
  );
};

export default Formularios;