import { supabase } from './supabase-config.js';

document.addEventListener('DOMContentLoaded', () => {
    cargarUsuarios();
    
    const formUsuario = document.getElementById('form-usuario');
    if (formUsuario) {
        formUsuario.addEventListener('submit', registrarUsuario);
    }
});

async function cargarUsuarios() {
    try {
        const { data, error } = await supabase.from('personal_medico').select('*');
        if (error) throw error;

        const tbody = document.querySelector('#tabla-usuarios tbody');
        if (!tbody) return;
        tbody.innerHTML = '';

        if (data && data.length > 0) {
            data.forEach(user => {
                tbody.innerHTML += `
                    <tr>
                        <td>${user.id}</td>
                        <td>${user.nombre}</td>
                        <td>${user.especialidad || 'N/A'}</td>
                        <td>
                            <button class="btn-eliminar" onclick="eliminarUsuario('${user.id}')">Eliminar</button>
                        </td>
                    </tr>
                `;
            });
        } else {
            tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: #718096;">No hay registros de usuarios.</td></tr>`;
        }
    } catch (error) {
        console.error('Error al cargar usuarios:', error.message);
    }
}

async function registrarUsuario(e) {
    e.preventDefault();
    
    const id = document.getElementById('id').value.trim();
    const nombre = document.getElementById('nombre').value.trim();
    const especialidad = document.getElementById('especialidad')?.value.trim() || '';

    try {
        const { error } = await supabase
            .from('personal_medico')
            .insert([{ id, nombre, especialidad }]);

        if (error) throw error;

        alert('¡Usuario registrado con éxito!');
        document.getElementById('form-usuario').reset();
        cargarUsuarios();
    } catch (error) {
        console.error('Error al registrar:', error.message);
        alert('Error al registrar usuario: ' + error.message);
    }
}

window.eliminarUsuario = async function(id) {
    if (confirm(`¿Estás seguro de eliminar el registro con ID ${id}?`)) {
        try {
            const { error } = await supabase
                .from('personal_medico')
                .delete()
                .eq('id', id);

            if (error) throw error;

            alert('Usuario eliminado correctamente');
            cargarUsuarios();
        } catch (error) {
            console.error('Error al eliminar:', error.message);
            alert('No se pudo eliminar el registro.');
        }
    }
};