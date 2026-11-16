import { supabase } from './supabase-config.js';

document.addEventListener('DOMContentLoaded', () => {
    cargarHistorialUrgencias();
    configurarFiltrosMultiples();
});

async function cargarHistorialUrgencias() {
    const tbody = document.getElementById('cuerpoHistorial');
    if (!tbody) return;

    try {
        const { data, error } = await supabase
            .from('bitacoras_atencion')
            .select(`
                *,
                personal_medico ( nombre, especialidad ),
                pacientes ( 
                    id, 
                    nombre, 
                    especie, 
                    clientes ( nombre_completo, telefono )
                )
            `);

        if (error) throw error;

        tbody.innerHTML = '';

        if (!data || data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px; color: #718096;">No hay registros de atención médica.</td></tr>';
            return;
        }

        data.forEach(item => {
            const fila = document.createElement('tr');
            const medicoNombre = item.personal_medico?.nombre || 'Médico no asignado';
            const medicoId = item.medico_id || 'S/N';
            const mascotaNombre = item.pacientes?.nombre || 'Desconocido';
            const mascotaEspecie = item.pacientes?.especie || 'N/A';
            const mascotaId = item.pacientes?.id || item.paciente_id || 'S/N';
            const propietarioNombre = item.pacientes?.clientes?.nombre_completo || 'Sin propietario';
            const propietarioTelefono = item.pacientes?.clientes?.telefono || 'Sin teléfono';
            const motivoConsulta = item.motivo_consultas || item.motivo_consulta || item.motivo || '';
            const fechaHora = item.fecha_registro ? new Date(item.fecha_registro).toLocaleString() : 'N/A';

            fila.setAttribute('data-id-mascota', String(mascotaId).toLowerCase());
            fila.setAttribute('data-medico', String(medicoNombre).toLowerCase());
            fila.setAttribute('data-propietario', String(propietarioNombre).toLowerCase());
            fila.setAttribute('data-mascota', String(mascotaNombre).toLowerCase());
            fila.setAttribute('data-motivo', String(motivoConsulta).toLowerCase());
            fila.setAttribute('data-telefono', String(propietarioTelefono).toLowerCase());

            fila.innerHTML = `
                <td>${fechaHora}</td>
                <td>
                    <strong>${medicoNombre}</strong><br>
                    <span style="font-family: monospace; font-size: 11px; color: #4a5568;" title="${medicoId}">
                        ${medicoId.substring(0, 15)}...
                    </span>
                </td>
                <td><strong>${propietarioNombre}</strong><br><small style="color: #718096;">(${propietarioTelefono})</small></td>
                <td>
                    <strong>${mascotaNombre}</strong><br>
                    <small style="color: #718096;">(${mascotaEspecie})</small><br>
                    <span style="font-family: monospace; font-size: 11px; color: #004080; background: #e2e8f0; padding: 2px 6px; border-radius: 4px; display: inline-block; margin-top: 3px;">
                        ID: ${mascotaId}
                    </span>
                </td>
                <td>${motivoConsulta}</td>
                <td>
                    <div style="font-size: 13px;">
                        Temp: ${item.temperatura || item.temp || '--'}°C<br>
                        FC: ${item.fc || '--'} lpm<br>
                        FR: ${item.fr || '--'} rpm
                    </div>
                </td>
                <td>
                    <strong>Fármacos:</strong> ${item.farmacos || 'N/A'}<br>
                    <strong>Notas:</strong> ${item.notas || 'N/A'}
                </td>
            `;
            tbody.appendChild(fila);
        });
    } catch (error) {
        console.error('Error al cargar historial:', error.message);
        tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; padding: 20px; color: red;">Error al cargar datos: ${error.message}</td></tr>`;
    }
}

function configurarFiltrosMultiples() {
    const inputBusqueda = document.getElementById('buscarPaciente');
    if (!inputBusqueda) return;

    inputBusqueda.addEventListener('input', (e) => {
        const termino = e.target.value.toLowerCase().trim();
        const filas = document.querySelectorAll('#cuerpoHistorial tr');

        filas.forEach(fila => {
            if (fila.cells.length === 1) return;

            const idMascota = fila.getAttribute('data-id-mascota') || '';
            const medico = fila.getAttribute('data-medico') || '';
            const propietario = fila.getAttribute('data-propietario') || '';
            const mascota = fila.getAttribute('data-mascota') || '';
            const motivo = fila.getAttribute('data-motivo') || '';
            const telefono = fila.getAttribute('data-telefono') || '';

            const coincide = idMascota.includes(termino) ||
                             mascota.includes(termino) || 
                             propietario.includes(termino) || 
                             medico.includes(termino) || 
                             motivo.includes(termino) ||
                             telefono.includes(termino);

            fila.style.display = coincide ? '' : 'none';
        });
    });
}