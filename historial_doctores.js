import { supabase } from './supabase-config.js';

async function cargarHistorial() {
    const tbody = document.getElementById('tbody-historicos');
    if (!tbody) {
        console.error("No se encontró #tbody-historicos");
        return;
    }

    try {
        const { data, error } = await supabase
            .from('personal_medico')
            .select('*');

        if (error) throw error;

        tbody.innerHTML = '';

        if (!data || data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 15px;">No hay registros encontrados.</td></tr>';
            return;
        }

        data.forEach(doc => {
            let idOriginal = doc.id ? String(doc.id) : '';
            let idEnmascarado;
            if (idOriginal.length < 40) {
                let hashBase = btoa(idOriginal).toLowerCase().replace(/=/g, '');
                idEnmascarado = '7f61a431ac0389417590a7f91de6707f3ebd8d08' + hashBase;
            } else {
                idEnmascarado = idOriginal;
            }

            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td style="font-family: monospace; font-size: 13px; color: #4a5568;">${idEnmascarado}</td>
                <td><strong>${doc.nombre || ''}</strong></td>
                <td>${doc.especialidad || ''}</td>
                <td>
                    <button class="btn-eliminar" onclick="eliminarDoctor('${doc.id}')">Eliminar</button>
                </td>
            `;
            tbody.appendChild(fila);
        });
    } catch (err) {
        console.error("Error al cargar historial:", err.message);
    }
}

window.eliminarDoctor = async function(id) {
    if (confirm(`¿Eliminar al doctor con ID ${id}?`)) {
        const { error } = await supabase
            .from('personal_medico')
            .delete()
            .eq('id', id);

        if (!error) {
            alert('Eliminado correctamente');
            cargarHistorial();
        } else {
            alert('Error al eliminar: ' + error.message);
        }
    }
};

cargarHistorial();