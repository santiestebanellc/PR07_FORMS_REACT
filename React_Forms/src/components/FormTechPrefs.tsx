/* Formulario de información personal */
import React, { useState, useEffect } from 'react';
import '../../styles/forms.css';

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

interface FormData {
  [key: string]: string | number | string[];
}

const FormPersonal: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [cuestionario, setCuestionario] = useState<Formulario[]>([]);

  // Cargar el JSON
  useEffect(() => {
    fetch('/cuestionario.json')
      .then(response => response.json())
      .then(data => setCuestionario(data.formularios))
      .catch(error => console.error('Error cargando el cuestionario:', error));
  }, []);

  // Manejar cambios en los inputs
  const handleChange = (id: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [id]: value }));
    setErrors(prev => ({ ...prev, [id]: '' }));
  };

  // Validar un campo
  const validateField = (id: string, value: string | string[]): string => {
    const campo = cuestionario.find(f => f.id === 'personal')?.campos.find(c => c.id === id);
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

    if (id === 'age' && typeof value === 'string') {
      const age = parseInt(value);
      if (isNaN(age) || age < (campo.validacion?.min_edad || 0))
        error = `La edad debe ser mayor a ${campo.validacion?.min_edad || 0}`;
    }

    return error;
  };

  // Manejar el envío
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let newErrors: { [key: string]: string } = {};
    const personalForm = cuestionario.find(f => f.id === 'personal');
    if (personalForm) {
      personalForm.campos.forEach(campo => {
        const value = formData[campo.id];
        const error = validateField(campo.id, value as string);
        if (error) newErrors[campo.id] = error;
      });
    }

    if (Object.keys(newErrors).length === 0) {
      console.log('Datos del formulario:', formData);
      const jsonData = JSON.stringify({ personal: formData }, null, 2);
      console.log('JSON generado:', jsonData);
      alert('Formulario enviado con éxito y guardado en JSON!');
    } else {
      setErrors(newErrors);
    }
  };

  // Renderizar campos
  const renderCampo = (campo: Campo) => {
    switch (campo.tipo) {
      case 'text':
        return (
          <div key={campo.id}>
            <label>{campo.pregunta}</label>
            <input
              type="text"
              name={campo.id}
              value={formData[campo.id] || ''}
              onChange={(e) => handleChange(campo.id, e.target.value)}
              placeholder={`Ingrese ${campo.pregunta.toLowerCase()}`}
            />
            {errors[campo.id] && <span className="error">{errors[campo.id]}</span>}
          </div>
        );
      default:
        return null;
    }
  };

  if (cuestionario.length === 0) return <div>Cargando...</div>;

  const personalForm = cuestionario.find(f => f.id === 'personal');

  return (
    <div className="form-container">
      <h2>{personalForm?.titulo || 'Información Personal'}</h2>
      <form onSubmit={handleSubmit}>
        {personalForm?.campos.map(campo => renderCampo(campo))}
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
};

export default FormPersonal;