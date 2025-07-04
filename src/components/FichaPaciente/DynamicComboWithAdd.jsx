import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './ficha.css';

const DynamicComboWithAdd = ({ 
    options = [], 
    value = '',
    onSelect, 
    onCreate, 
    placeholder = "Seleccione una opción", 
    labelField = "name",
    showForm,
    setShowForm,
    formComponent: FormComponent,
    fetchOptions
}) => {
    const [searchTerm, setSearchTerm] = useState('');

    // Filtrado seguro de opciones
    const filteredOptions = options.filter(option => {
        if (!option || !option[labelField]) return false;
        return String(option[labelField]).toLowerCase().includes(searchTerm.toLowerCase());
    });

    const handleSelectChange = (e) => {
        const selectedValue = e.target.value;

        if (selectedValue === 'other') {
            setShowForm(true);
        } else {
            if (onSelect) onSelect(selectedValue);
        }
    };

    const handleCreateNew = async (newData) => {
        try {
            if (!onCreate) {
                console.error('La función onCreate no está definida');
                return;
            }

            const createdItem = await onCreate(newData);

            if (fetchOptions) {
                await fetchOptions();
            }

            if (createdItem?.id) {
                if (onSelect) onSelect(createdItem.id);
            }

            setShowForm(false);
        } catch (error) {
            console.error('Error al crear nuevo ítem:', error);
        }
    };

    const generateSafeKey = (option, index) => {
        if (option?.id) return option.id;
        if (option?.[labelField]) return `${option[labelField]}-${index}`;
        return `option-${index}-${Math.random().toString(36).substr(2, 5)}`;
    };

    return (
        <div className="combo-container">
            <select 
                value={value || ''} 
                onChange={handleSelectChange}
                className="combo-select"
                aria-label={placeholder}
            >
                <option value="">{placeholder}</option>
                {filteredOptions.map((option, index) => (
                    <option 
                        key={generateSafeKey(option, index)}
                        value={option?.id || ''}
                    >
                        {option?.[labelField] || 'Opción sin nombre'}
                    </option>
                ))}
                <option value="other">Otro...</option>
            </select>

            {showForm && FormComponent && (
                <div className="combo-form">
                    <FormComponent onSubmit={handleCreateNew} />
                    <button 
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="cancel-button"
                    >
                        Cancelar
                    </button>
                </div>
            )}
        </div>
    );
};

DynamicComboWithAdd.propTypes = {
    options: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
            name: PropTypes.string,
        })
    ),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onSelect: PropTypes.func.isRequired,
    onCreate: PropTypes.func,
    placeholder: PropTypes.string,
    labelField: PropTypes.string,
    showForm: PropTypes.bool.isRequired,
    setShowForm: PropTypes.func.isRequired,
    formComponent: PropTypes.elementType.isRequired,
    fetchOptions: PropTypes.func,
};

export default DynamicComboWithAdd;
