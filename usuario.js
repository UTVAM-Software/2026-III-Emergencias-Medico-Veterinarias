import { supabase } from './supabase-config.js';

document.addEventListener('DOMContentLoaded', () => {
    cargarDoctores();
    
    const formUsuario = document.getElementById('form-usuario');
    if (formUsuario) {
        formUsuario.addEventListener('submit', registrarDoctor);
    }
});

async function cargarDoctores() {
    try {
        const { data, error } = await supabase.from('personal_medico').select('*');
        if (error) throw error;

        const tbody = document.querySelector('#tabla-usuarios tbody');
        tbody.innerHTML = '';

        if (data && data.length > 0) {
            data.forEach(doc => {
                tbody.innerHTML += `
                    <tr>
                        <td>${doc.id}</td>
                        <td>${doc.nombre}</td>
                        <td>${doc.especialidad}</td>
                        <td>
                            <button class="btn-eliminar" onclick="eliminarDoctor('${doc.id}')">Eliminar</button>
                        </td>
                    </tr>
                `;
            });
        } else {
            tbody.innerHTML = `<tr><td colspan="4" style="text-align: center;">No hay doctores registrados.</td></tr>`;
        }
    } catch (error) {
        console.error('Error al cargar doctores:', error.message);
    }
}

async function registrarDoctor(e) {
    e.preventDefault();
    
    const id = document.getElementById('id').value.trim();
    const nombre = document.getElementById('nombre').value.trim();
    const especialidad = document.getElementById('especialidad').value.trim();

    try {
        const { error } = await supabase
            .from('personal_medico')
            .insert([{ id, nombre, especialidad }]);

        if (error) throw error;

        alert('¡Doctor registrado con éxito!');
        document.getElementById('form-usuario').reset();
        cargarDoctores();
    } catch (error) {
        console.error('Error al registrar:', error.message);
        alert('Error al registrar doctor (es posible que el Código/ID ya exista).');
    }
}

window.eliminarDoctor = async function(id) {
    if (confirm(`¿Estás seguro de eliminar al doctor con código ${id}?`)) {
        try {
            const { error } = await supabase
                .from('personal_medico')
                .delete()
                .eq('id', id);

            if (error) throw error;

            alert('Doctor eliminado correctamente');
            cargarDoctores();
        } catch (error) {
            console.error('Error al eliminar:', error.message);
            alert('No se pudo eliminar el registro.');
        }
    }
};