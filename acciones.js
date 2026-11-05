<<<<<<< HEAD
import { supabase } from './supabase-config.js';

async function encriptarID(idTexto) {
    const encoder = new TextEncoder();
    const data = encoder.encode(idTexto);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

document.addEventListener('DOMContentLoaded', () => {
    const enlaceRegistro = document.getElementById('enlace-mostrar-registro');
    const enlaceLogin = document.getElementById('enlace-mostrar-login');
    const formLogin = document.getElementById('form-login');
    const formRegistro = document.getElementById('form-registro');

    if (enlaceRegistro) {
        enlaceRegistro.addEventListener('click', (e) => {
            e.preventDefault();
            formLogin.classList.add('oculto');
            formRegistro.classList.remove('oculto');
        });
    }

    if (enlaceLogin) {
        enlaceLogin.addEventListener('click', (e) => {
            e.preventDefault();
            formRegistro.classList.add('oculto');
            formLogin.classList.remove('oculto');
        });
    }

    if (formRegistro) formRegistro.addEventListener('submit', registrarDoctor);
    if (formLogin) formLogin.addEventListener('submit', gestionarIngreso);

    const inputFecha = document.getElementById('fecha');
    const inputHora = document.getElementById('hora');
    const inputMedicoTurno = document.getElementById('medico-turno');

    if (inputFecha || inputHora || inputMedicoTurno) {
        const ahora = new Date();
        if (inputFecha) inputFecha.value = ahora.toISOString().split('T')[0];
        if (inputHora) inputHora.value = ahora.toTimeString().split(' ')[0].substring(0, 5);

        const doctorLogueado = JSON.parse(localStorage.getItem('doctorLogueado'));
        if (doctorLogueado && inputMedicoTurno) {
            inputMedicoTurno.value = doctorLogueado.nombre;
            inputMedicoTurno.readOnly = true; 
        }
    }

    if (document.getElementById('tabla-clientes')) cargarClientes();
    if (document.getElementById('form-cliente')) document.getElementById('form-cliente').addEventListener('submit', registrarCliente);

    if (document.getElementById('tabla-pacientes')) cargarPacientes();
    if (document.getElementById('form-paciente')) document.getElementById('form-paciente').addEventListener('submit', registrarPaciente);

    if (document.getElementById('tabla-bitacora')) cargarBitacora();
    if (document.getElementById('form-bitacora')) document.getElementById('form-bitacora').addEventListener('submit', registrarBitacora);
});

async function registrarDoctor(e) {
    e.preventDefault();
    
    const idTexto = document.getElementById('reg-id').value.trim();
    const nombre = document.getElementById('reg-nombre').value.trim();
    const especialidad = document.getElementById('reg-especialidad').value.trim();

    try {
        const id = await encriptarID(idTexto);

        const { error } = await supabase
            .from('personal_medico')
            .insert([{ id, nombre, especialidad }]);

        if (error) throw error;

        alert('¡Registro exitoso! Ya puedes ingresar con tu ID.');
        document.getElementById('form-registro').reset();
        document.getElementById('form-registro').classList.add('oculto');
        document.getElementById('form-login').classList.remove('oculto');
    } catch (error) {
        alert('Error al registrar: ' + error.message);
    }
}

async function gestionarIngreso(e) {
    e.preventDefault();

    const idTexto = document.getElementById('entrada-id').value.trim();
    const alertaError = document.getElementById('alerta-error');

    try {
        const idHash = await encriptarID(idTexto);

        const { data, error } = await supabase
            .from('personal_medico')
            .select('*')
            .eq('id', idHash)
            .single();

        if (error || !data) {
            alertaError.style.display = 'block';
            return;
        }

        localStorage.setItem('doctorLogueado', JSON.stringify(data));
        window.location.href = 'menu.html';
    } catch (error) {
        console.error('Error en el ingreso:', error.message);
        alertaError.style.display = 'block';
    }
}

async function cargarClientes() {
    const { data, error } = await supabase.from('clientes').select('*');
    if (error) { console.error(error); return; }
    const tbody = document.querySelector('#tabla-clientes tbody');
    if (!tbody) return;
    tbody.innerHTML = data.length ? data.map(c => `
        <tr>
            <td>${c.id}</td>
            <td>${c.nombre}</td>
            <td>${c.telefono}</td>
            <td>${c.direccion || 'N/A'}</td>
            <td><button class="btn-eliminar" onclick="eliminarCliente(${c.id})">Eliminar</button></td>
        </tr>`).join('') : `<tr><td colspan="5" style="text-align: center;">No hay clientes registrados.</td></tr>`;
}

async function registrarCliente(e) {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value;
    const telefono = document.getElementById('telefono').value;
    const direccion = document.getElementById('direccion').value;
    const { error } = await supabase.from('clientes').insert([{ nombre, telefono, direccion }]);
    if (error) alert('Error: ' + error.message);
    else { alert('Cliente registrado con éxito'); document.getElementById('form-cliente').reset(); cargarClientes(); }
}

window.eliminarCliente = async function(id) {
    if (confirm('¿Estás seguro de eliminar este cliente?')) {
        const { error } = await supabase.from('clientes').delete().eq('id', id);
        if (error) alert('Error al eliminar'); else cargarClientes();
    }
};

async function cargarPacientes() {
    const { data, error } = await supabase.from('pacientes').select('*');
    if (error) { console.error(error); return; }
    const tbody = document.querySelector('#tabla-pacientes tbody');
    if (!tbody) return;
    tbody.innerHTML = data.length ? data.map(p => `
        <tr>
            <td>${p.id}</td>
            <td>${p.nombre_mascota}</td>
            <td>${p.especie}</td>
            <td>${p.raza || 'N/A'}</td>
            <td>${p.edad || 'N/A'}</td>
            <td>${p.cliente_id}</td>
            <td><button class="btn-eliminar" onclick="eliminarPaciente(${p.id})">Eliminar</button></td>
        </tr>`).join('') : `<tr><td colspan="7" style="text-align: center;">No hay pacientes registrados.</td></tr>`;
}

async function registrarPaciente(e) {
    e.preventDefault();
    const nombre_mascota = document.getElementById('nombre_mascota').value;
    const especie = document.getElementById('especie').value;
    const raza = document.getElementById('raza').value;
    const edad = document.getElementById('edad').value;
    const cliente_id = document.getElementById('cliente_id').value;
    
    const { error } = await supabase.from('pacientes').insert([{ 
        nombre_mascota, 
        especie, 
        raza, 
        edad: edad ? parseInt(edad) : null, 
        cliente_id: parseInt(cliente_id) 
    }]);

    if (error) alert('Error: ' + error.message);
    else { alert('Paciente registrado con éxito'); document.getElementById('form-paciente').reset(); cargarPacientes(); }
}

window.eliminarPaciente = async function(id) {
    if (confirm('¿Estás seguro de eliminar este paciente?')) {
        const { error } = await supabase.from('pacientes').delete().eq('id', id);
        if (error) alert('Error al eliminar'); else cargarPacientes();
    }
};

async function cargarBitacora() {
    const { data, error } = await supabase.from('bitacoras_atencion').select('*');
    if (error) { console.error(error); return; }
    const tbody = document.querySelector('#tabla-bitacora tbody');
    if (!tbody) return;
    tbody.innerHTML = data.length ? data.map(b => `
        <tr>
            <td>${b.id}</td>
            <td>${b.paciente_id}</td>
            <td>${b.motivo_consulta}</td>
            <td>${b.fecha_registro}</td>
        </tr>
    `).join('') : `<tr><td colspan="4" style="text-align: center;">No hay registros en la bitácora.</td></tr>`;
}

async function registrarBitacora(e) {
    e.preventDefault();
    const paciente_id = document.getElementById('paciente_id').value;
    const motivo_consulta = document.getElementById('motivo_consulta').value;
    const doctorLogueado = JSON.parse(localStorage.getItem('doctorLogueado'));
    
    const { error } = await supabase.from('bitacoras_atencion').insert([{ 
        paciente_id: parseInt(paciente_id), 
        medico_id: doctorLogueado ? doctorLogueado.id : null,
        motivo_consulta, 
        fecha_registro: new Date().toISOString() 
    }]);

    if (error) alert('Error: ' + error.message);
    else { alert('Atención guardada en la bitácora'); document.getElementById('form-bitacora').reset(); cargarBitacora(); }
=======
import { supabase } from './supabase-config.js';

async function encriptarID(idTexto) {
    const encoder = new TextEncoder();
    const data = encoder.encode(idTexto);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

document.addEventListener('DOMContentLoaded', () => {
    const enlaceRegistro = document.getElementById('enlace-mostrar-registro');
    const enlaceLogin = document.getElementById('enlace-mostrar-login');
    const formLogin = document.getElementById('form-login');
    const formRegistro = document.getElementById('form-registro');

    if (enlaceRegistro) {
        enlaceRegistro.addEventListener('click', (e) => {
            e.preventDefault();
            formLogin.classList.add('oculto');
            formRegistro.classList.remove('oculto');
        });
    }

    if (enlaceLogin) {
        enlaceLogin.addEventListener('click', (e) => {
            e.preventDefault();
            formRegistro.classList.add('oculto');
            formLogin.classList.remove('oculto');
        });
    }

    if (formRegistro) formRegistro.addEventListener('submit', registrarDoctor);
    if (formLogin) formLogin.addEventListener('submit', gestionarIngreso);

    const inputFecha = document.getElementById('fecha');
    const inputHora = document.getElementById('hora');
    const inputMedicoTurno = document.getElementById('medico-turno');

    if (inputFecha || inputHora || inputMedicoTurno) {
        const ahora = new Date();
        if (inputFecha) inputFecha.value = ahora.toISOString().split('T')[0];
        if (inputHora) inputHora.value = ahora.toTimeString().split(' ')[0].substring(0, 5);

        const doctorLogueado = JSON.parse(localStorage.getItem('doctorLogueado'));
        if (doctorLogueado && inputMedicoTurno) {
            inputMedicoTurno.value = doctorLogueado.nombre;
            inputMedicoTurno.readOnly = true; 
        }
    }

    if (document.getElementById('tabla-clientes')) cargarClientes();
    if (document.getElementById('form-cliente')) document.getElementById('form-cliente').addEventListener('submit', registrarCliente);

    if (document.getElementById('tabla-pacientes')) cargarPacientes();
    if (document.getElementById('form-paciente')) document.getElementById('form-paciente').addEventListener('submit', registrarPaciente);

    if (document.getElementById('tabla-bitacora')) cargarBitacora();
    if (document.getElementById('form-bitacora')) document.getElementById('form-bitacora').addEventListener('submit', registrarBitacora);
});

async function registrarDoctor(e) {
    e.preventDefault();
    
    const idTexto = document.getElementById('reg-id').value.trim();
    const nombre = document.getElementById('reg-nombre').value.trim();
    const especialidad = document.getElementById('reg-especialidad').value.trim();

    try {
        const id = await encriptarID(idTexto);

        const { error } = await supabase
            .from('personal_medico')
            .insert([{ id, nombre, especialidad }]);

        if (error) throw error;

        alert('¡Registro exitoso! Ya puedes ingresar con tu ID.');
        document.getElementById('form-registro').reset();
        document.getElementById('form-registro').classList.add('oculto');
        document.getElementById('form-login').classList.remove('oculto');
    } catch (error) {
        alert('Error al registrar: ' + error.message);
    }
}

async function gestionarIngreso(e) {
    e.preventDefault();

    const idTexto = document.getElementById('entrada-id').value.trim();
    const alertaError = document.getElementById('alerta-error');

    try {
        const idHash = await encriptarID(idTexto);

        const { data, error } = await supabase
            .from('personal_medico')
            .select('*')
            .eq('id', idHash)
            .single();

        if (error || !data) {
            alertaError.style.display = 'block';
            return;
        }

        localStorage.setItem('doctorLogueado', JSON.stringify(data));
        window.location.href = 'menu.html';
    } catch (error) {
        console.error('Error en el ingreso:', error.message);
        alertaError.style.display = 'block';
    }
}

async function cargarClientes() {
    const { data, error } = await supabase.from('clientes').select('*');
    if (error) { console.error(error); return; }
    const tbody = document.querySelector('#tabla-clientes tbody');
    if (!tbody) return;
    tbody.innerHTML = data.length ? data.map(c => `
        <tr>
            <td>${c.id}</td>
            <td>${c.nombre}</td>
            <td>${c.telefono}</td>
            <td>${c.direccion || 'N/A'}</td>
            <td><button class="btn-eliminar" onclick="eliminarCliente(${c.id})">Eliminar</button></td>
        </tr>`).join('') : `<tr><td colspan="5" style="text-align: center;">No hay clientes registrados.</td></tr>`;
}

async function registrarCliente(e) {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value;
    const telefono = document.getElementById('telefono').value;
    const direccion = document.getElementById('direccion').value;
    const { error } = await supabase.from('clientes').insert([{ nombre, telefono, direccion }]);
    if (error) alert('Error: ' + error.message);
    else { alert('Cliente registrado con éxito'); document.getElementById('form-cliente').reset(); cargarClientes(); }
}

window.eliminarCliente = async function(id) {
    if (confirm('¿Estás seguro de eliminar este cliente?')) {
        const { error } = await supabase.from('clientes').delete().eq('id', id);
        if (error) alert('Error al eliminar'); else cargarClientes();
    }
};

async function cargarPacientes() {
    const { data, error } = await supabase.from('pacientes').select('*');
    if (error) { console.error(error); return; }
    const tbody = document.querySelector('#tabla-pacientes tbody');
    if (!tbody) return;
    tbody.innerHTML = data.length ? data.map(p => `
        <tr>
            <td>${p.id}</td>
            <td>${p.nombre_mascota}</td>
            <td>${p.especie}</td>
            <td>${p.raza || 'N/A'}</td>
            <td>${p.edad || 'N/A'}</td>
            <td>${p.cliente_id}</td>
            <td><button class="btn-eliminar" onclick="eliminarPaciente(${p.id})">Eliminar</button></td>
        </tr>`).join('') : `<tr><td colspan="7" style="text-align: center;">No hay pacientes registrados.</td></tr>`;
}

async function registrarPaciente(e) {
    e.preventDefault();
    const nombre_mascota = document.getElementById('nombre_mascota').value;
    const especie = document.getElementById('especie').value;
    const raza = document.getElementById('raza').value;
    const edad = document.getElementById('edad').value;
    const cliente_id = document.getElementById('cliente_id').value;
    
    const { error } = await supabase.from('pacientes').insert([{ 
        nombre_mascota, 
        especie, 
        raza, 
        edad: edad ? parseInt(edad) : null, 
        cliente_id: parseInt(cliente_id) 
    }]);

    if (error) alert('Error: ' + error.message);
    else { alert('Paciente registrado con éxito'); document.getElementById('form-paciente').reset(); cargarPacientes(); }
}

window.eliminarPaciente = async function(id) {
    if (confirm('¿Estás seguro de eliminar este paciente?')) {
        const { error } = await supabase.from('pacientes').delete().eq('id', id);
        if (error) alert('Error al eliminar'); else cargarPacientes();
    }
};

async function cargarBitacora() {
    const { data, error } = await supabase.from('bitacoras_atencion').select('*');
    if (error) { console.error(error); return; }
    const tbody = document.querySelector('#tabla-bitacora tbody');
    if (!tbody) return;
    tbody.innerHTML = data.length ? data.map(b => `
        <tr>
            <td>${b.id}</td>
            <td>${b.paciente_id}</td>
            <td>${b.motivo_consulta}</td>
            <td>${b.fecha_registro}</td>
        </tr>
    `).join('') : `<tr><td colspan="4" style="text-align: center;">No hay registros en la bitácora.</td></tr>`;
}

async function registrarBitacora(e) {
    e.preventDefault();
    const paciente_id = document.getElementById('paciente_id').value;
    const motivo_consulta = document.getElementById('motivo_consulta').value;
    const doctorLogueado = JSON.parse(localStorage.getItem('doctorLogueado'));
    
    const { error } = await supabase.from('bitacoras_atencion').insert([{ 
        paciente_id: parseInt(paciente_id), 
        medico_id: doctorLogueado ? doctorLogueado.id : null,
        motivo_consulta, 
        fecha_registro: new Date().toISOString() 
    }]);

    if (error) alert('Error: ' + error.message);
    else { alert('Atención guardada en la bitácora'); document.getElementById('form-bitacora').reset(); cargarBitacora(); }
>>>>>>> 8182de1faf38fb6f92bc1dd230cbe43774bff1d7
}