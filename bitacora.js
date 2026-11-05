import { supabase } from './supabase-config.js';

document.addEventListener('DOMContentLoaded', () => {
    const inputFecha = document.getElementById('campo-fecha');
    const inputHora = document.getElementById('campo-hora');
    const inputMedico = document.getElementById('campo-medico');

    const ahora = new Date();
    if (inputFecha) inputFecha.value = ahora.toISOString().split('T')[0];
    if (inputHora) inputHora.value = ahora.toTimeString().split(' ')[0].substring(0, 5);

    const doctorLogueado = JSON.parse(localStorage.getItem('doctorLogueado'));
    if (doctorLogueado && inputMedico) {
        inputMedico.value = doctorLogueado.nombre;
    }

    const formulario = document.querySelector('form');
    if (formulario) {
        formulario.addEventListener('submit', guardarBitacora);
    }
});

async function guardarBitacora(e) {
    e.preventDefault();

    const doctorLogueado = JSON.parse(localStorage.getItem('doctorLogueado'));
    if (!doctorLogueado) {
        alert('Sesión no iniciada. Por favor inicie sesión.');
        window.location.href = 'index.html';
        return;
    }

    const propNombre = document.getElementById('prop-nombre').value.trim();
    const propTelefono = document.getElementById('prop-telefono').value.trim();
    const propDireccion = document.getElementById('prop-direccion').value.trim();
    const pacNombre = document.getElementById('pac-nombre').value.trim();
    const pacEspecie = document.getElementById('pac-especie').value.trim();
    const pacRaza = document.getElementById('pac-raza').value.trim();
    const pacSexo = document.getElementById('pac-sexo').value;
    const pacPesoEdad = document.getElementById('pac-pesoedad').value.trim();
    const motivoConsulta = document.getElementById('pac-motivo').value.trim();
    const temperatura = document.getElementById('const-temp').value.trim();
    const fc = document.getElementById('const-fc').value.trim();
    const fr = document.getElementById('const-fr').value.trim();
    const farmacos = document.getElementById('nota-farmacos').value.trim();
    const notas = document.getElementById('nota-avance').value.trim();

    try {
        const { data: clienteData, error: clienteError } = await supabase
            .from('clientes')
            .insert([{ nombre_completo: propNombre, telefono: propTelefono, direccion: propDireccion }])
            .select()
            .single();

        if (clienteError) throw clienteError;
        const clienteId = clienteData.id;
        const { data: pacienteData, error: pacienteError } = await supabase
            .from('pacientes')
            .insert([{
                cliente_id: clienteId,
                nombre: pacNombre,
                especie: pacEspecie,
                raza: pacRaza,
                sexo: pacSexo,
                peso_edad: pacPesoEdad
            }])
            .select()
            .single();

        if (pacienteError) throw pacienteError;
        const pacienteId = pacienteData.id;
        const { error: bitacoraError } = await supabase
            .from('bitacoras_atencion')
            .insert([{
                medico_id: doctorLogueado.id,
                paciente_id: pacienteId,
                motivo_consulta: motivoConsulta,
                temperatura: temperatura,
                frecuencia_cardiaca: fc,
                frecuencia_respiratoria: fr,
                farmacos: farmacos,
                notas: notas
            }]);

        if (bitacoraError) throw bitacoraError;

        alert('¡Bitácora registrada con éxito y tablas relacionadas actualizadas!');
        e.target.reset();
        window.location.href = 'historial.html';

    } catch (error) {
        console.error('Error al guardar:', error.message);
        alert('Error al registrar en la base de datos: ' + error.message);
    }
}