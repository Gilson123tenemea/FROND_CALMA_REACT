import React, { useState, useEffect } from 'react';
import './alergiaalimentaria.css';

const API_URL = 'http://localhost:8090/api/alergias_alimentarias';

const AlergiaAlimentaria = () => {
    const [alergias, setAlergias] = useState([]);
    const [alergiaAlimentaria, setAlergiaAlimentaria] = useState('');
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchAlergias();
    }, []);

    const fetchAlergias = async () => {
        const response = await fetch(API_URL);
        const data = await response.json();
        setAlergias(data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const method = editingId ? 'PUT' : 'POST';
        const url = editingId ? `${API_URL}/${editingId}` : API_URL;

        await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                alergiaAlimentaria 
            }),
        });

        setAlergiaAlimentaria('');
        setEditingId(null);
        fetchAlergias();
    };

    const handleEdit = (alergia) => {
        setAlergiaAlimentaria(alergia.alergiaAlimentaria);
        setEditingId(alergia.id_alergias_alimentarias);
    };

    const handleDelete = async (id) => {
        await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
        });
        fetchAlergias();
    };

    return (
        <div className="container">
            <h2>Alergias Alimentarias</h2>
            <form onSubmit={handleSubmit} className="form">
                <input
                    type="text"
                    placeholder="Nombre de la alergia"
                    value={alergiaAlimentaria}
                    onChange={(e) => setAlergiaAlimentaria(e.target.value)}
                    required
                />
                <button type="submit">{editingId ? 'Actualizar' : 'Agregar'}</button>
            </form>

            <ul className="alergias-list">
                {alergias.map((alergia) => (
                    <li key={alergia.id_alergias_alimentarias} className="alergia-item">
                        {alergia.alergiaAlimentaria}
                        <div>
                            <button onClick={() => handleEdit(alergia)}>Editar</button>
                            <button onClick={() => handleDelete(alergia.id_alergias_alimentarias)}>Eliminar</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AlergiaAlimentaria;
