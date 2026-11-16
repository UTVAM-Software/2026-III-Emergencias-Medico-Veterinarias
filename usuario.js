<<<<<<< HEAD
<<<<<<< HEAD
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
=======
=======
>>>>>>> 8182de1faf38fb6f92bc1dd230cbe43774bff1d7
import { supabase } from './supabase-config.js';

document.addEventListener('DOMContentLoaded', () => {
    cargarDoctores();
    
    const formUsuario = document.getElementById('form-usuario');
    if (formUsuario) {
        formUsuario.addEventListener('submit', registrarDoctor);
    }
});

function generarIdSeguro(idOriginal) {
    let idStr = String(idOriginal);
    if (idStr.length < 40) {
        let hashBase = btoa(idStr).toLowerCase().replace(/=/g, '');
        return '7f61a431ac0389417590a7f91de6707f3ebd8d08' + hashBase;
    }
    return idStr;
}

async function cargarDoctores() {
    try {
        const { data, error } = await supabase.from('personal_medico').select('*');
        if (error) throw error;

        const tbody = document.querySelector('#tabla-usuarios tbody');
        if (!tbody) return;
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
    
    const idInput = document.getElementById('id').value.trim();
    const nombre = document.getElementById('nombre').value.trim();
    const especialidad = document.getElementById('especialidad').value.trim();

    const id = generarIdSeguro(idInput);

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
<<<<<<< HEAD
>>>>>>> 8182de1faf38fb6f92bc1dd230cbe43774bff1d7
=======
>>>>>>> 8182de1faf38fb6f92bc1dd230cbe43774bff1d7
};