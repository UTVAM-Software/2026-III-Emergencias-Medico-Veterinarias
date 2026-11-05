<<<<<<< HEAD
<<<<<<< HEAD
import { supabase } from './supabase-config.js';

let listaBitacoras = [];

document.addEventListener('DOMContentLoaded', () => {
    cargarHistorial();

    const inputBuscar = document.getElementById('buscarPaciente');
    if (inputBuscar) {
        inputBuscar.addEventListener('input', (e) => {
            filtrarHistorial(e.target.value);
        });
    }
});

async function cargarHistorial() {
    try {
        const { data, error } = await supabase
            .from('bitacoras_atencion')
            .select(`
                *,
                personal_medico (nombre),
                pacientes (
                    nombre,
                    especie,
                    raza,
                    clientes (nombre_completo, telefono)
                )
            `)
            .order('id', { ascending: false });

        if (error) throw error;

        listaBitacoras = data || [];
        mostrarEnTabla(listaBitacoras);

    } catch (error) {
        console.error('Error al cargar el historial:', error.message);
        const tbody = document.getElementById('cuerpoHistorial');
        if (tbody) {
            tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: red;">Error al cargar los datos: ${error.message}</td></tr>`;
        }
    }
}

function mostrarEnTabla(datos) {
    const tbody = document.getElementById('cuerpoHistorial');
    if (!tbody) return;

    if (datos.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 20px;">No hay registros en la bitácora.</td></tr>`;
        return;
    }

    tbody.innerHTML = datos.map(b => {
        const fechaFormateada = b.fecha_registro ? new Date(b.fecha_registro).toLocaleString() : 'N/A';

        const medicoNombre = b.personal_medico?.nombre || 'Dr. en Turno';
        const propNombre = b.pacientes?.clientes?.nombre_completo || 'Desconocido';
        const propTel = b.pacientes?.clientes?.telefono ? `(${b.pacientes.clientes.telefono})` : '';
        const mascNombre = b.pacientes?.nombre || 'Sin nombre';
        const mascEspecie = b.pacientes?.especie || 'N/A';

        return `
            <tr>
                <td>${fechaFormateada}</td>
                <td><strong>${medicoNombre}</strong></td>
                <td>${propNombre} <br><small class="text-muted">${propTel}</small></td>
                <td><strong>${mascNombre}</strong> <br><small>(${mascEspecie})</small></td>
                <td>${b.motivo_consulta || 'N/A'}</td>
                <td>
                    Temp: ${b.temperatura || 'N/A'}<br>
                    FC: ${b.frecuencia_cardiaca || 'N/A'}<br>
                    FR: ${b.frecuencia_respiratoria || 'N/A'}
                </td>
                <td>
                    <strong>Fármacos:</strong> ${b.farmacos || 'N/A'}<br>
                    <strong>Notas:</strong> ${b.notas || 'N/A'}
                </td>
            </tr>
        `;
    }).join('');
}

function filtrarHistorial(textoBusqueda) {
    const texto = textoBusqueda.toLowerCase();
    const filtrados = listaBitacoras.filter(b => {
        const mascota = (b.pacientes?.nombre || '').toLowerCase();
        const propietario = (b.pacientes?.clientes?.nombre_completo || '').toLowerCase();
        return mascota.includes(texto) || propietario.includes(texto);
    });
    mostrarEnTabla(filtrados);
=======
=======
>>>>>>> 8182de1faf38fb6f92bc1dd230cbe43774bff1d7
import { supabase } from './supabase-config.js';

let listaBitacoras = [];

document.addEventListener('DOMContentLoaded', () => {
    cargarHistorial();

    const inputBuscar = document.getElementById('buscarPaciente');
    if (inputBuscar) {
        inputBuscar.addEventListener('input', (e) => {
            filtrarHistorial(e.target.value);
        });
    }
});

async function cargarHistorial() {
    try {
        const { data, error } = await supabase
            .from('bitacoras_atencion')
            .select(`
                *,
                personal_medico (nombre),
                pacientes (
                    nombre,
                    especie,
                    raza,
                    clientes (nombre_completo, telefono)
                )
            `)
            .order('id', { ascending: false });

        if (error) throw error;

        listaBitacoras = data || [];
        mostrarEnTabla(listaBitacoras);

    } catch (error) {
        console.error('Error al cargar el historial:', error.message);
        const tbody = document.getElementById('cuerpoHistorial');
        if (tbody) {
            tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: red;">Error al cargar los datos: ${error.message}</td></tr>`;
        }
    }
}

function mostrarEnTabla(datos) {
    const tbody = document.getElementById('cuerpoHistorial');
    if (!tbody) return;

    if (datos.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 20px;">No hay registros en la bitácora.</td></tr>`;
        return;
    }

    tbody.innerHTML = datos.map(b => {
        const fechaFormateada = b.fecha_registro ? new Date(b.fecha_registro).toLocaleString() : 'N/A';

        const medicoNombre = b.personal_medico?.nombre || 'Dr. en Turno';
        const propNombre = b.pacientes?.clientes?.nombre_completo || 'Desconocido';
        const propTel = b.pacientes?.clientes?.telefono ? `(${b.pacientes.clientes.telefono})` : '';
        const mascNombre = b.pacientes?.nombre || 'Sin nombre';
        const mascEspecie = b.pacientes?.especie || 'N/A';

        return `
            <tr>
                <td>${fechaFormateada}</td>
                <td><strong>${medicoNombre}</strong></td>
                <td>${propNombre} <br><small class="text-muted">${propTel}</small></td>
                <td><strong>${mascNombre}</strong> <br><small>(${mascEspecie})</small></td>
                <td>${b.motivo_consulta || 'N/A'}</td>
                <td>
                    Temp: ${b.temperatura || 'N/A'}<br>
                    FC: ${b.frecuencia_cardiaca || 'N/A'}<br>
                    FR: ${b.frecuencia_respiratoria || 'N/A'}
                </td>
                <td>
                    <strong>Fármacos:</strong> ${b.farmacos || 'N/A'}<br>
                    <strong>Notas:</strong> ${b.notas || 'N/A'}
                </td>
            </tr>
        `;
    }).join('');
}

function filtrarHistorial(textoBusqueda) {
    const texto = textoBusqueda.toLowerCase();
    const filtrados = listaBitacoras.filter(b => {
        const mascota = (b.pacientes?.nombre || '').toLowerCase();
        const propietario = (b.pacientes?.clientes?.nombre_completo || '').toLowerCase();
        return mascota.includes(texto) || propietario.includes(texto);
    });
    mostrarEnTabla(filtrados);
<<<<<<< HEAD
>>>>>>> 8182de1faf38fb6f92bc1dd230cbe43774bff1d7
=======
>>>>>>> 8182de1faf38fb6f92bc1dd230cbe43774bff1d7
}