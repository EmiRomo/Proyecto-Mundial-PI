// Variables globales
let mindarGame = null;
let equipoActual = null;
let chart = null;

// Datos de ejemplo (debes completar con tus 20 equipos)
const equiposData = {
    "equipos": [
        {
            "id": "argentina",
            "nombre": "Argentina",
            "targetIndex": 0,  // Primera bandera en el .mind
            "contenidos": {
                "video": "assets/videos/argentina.mp4",
                "trivia": "aña",
                "estadisticas": "añe",
                "modelo3D": "assets/modelos/argentina.glb"
            }
        },
        {
            "id": "brasil",
            "nombre": "Brasil",
            "targetIndex": 1,  // Segunda bandera en el .mind
            "contenidos": {
                "video": "assets/videos/brasil.mp4",
                "trivia": "aña",
                "estadisticas": "añe",
                "modelo3D": "assets/modelos/brasil.glb"
            }
        },
        // ... continúa hasta el targetIndex 19
        // {
        //     "id": "usa",
        //     "nombre": "Estados Unidos", 
        //     "targetIndex": 19,  // Vigésima bandera en el .mind
        //     "contenidos": {...}
        // }
    ]
};

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    // Botones principales
    document.getElementById('btn-iniciar-ra').addEventListener('click', iniciarExperienciaRA);
    document.getElementById('btn-volver').addEventListener('click', volverAlInicio);
    
    // Botones de acciones
    document.getElementById('btn-video').addEventListener('click', mostrarVideo);
    document.getElementById('btn-trivia').addEventListener('click', mostrarTrivia);
    document.getElementById('btn-stats').addEventListener('click', mostrarEstadisticas);
    document.getElementById('btn-anim').addEventListener('click', mostrarAnimacion);
});

// Función para iniciar la experiencia RA
async function iniciarExperienciaRA() {
    try {
        // Ocultar info y mostrar loader
        document.getElementById('info-mundial').classList.add('oculto');
        document.getElementById('seccion-ra').classList.remove('oculto');
        document.getElementById('carga-container').style.display = 'flex';
        
        // Inicializar MindAR con TODOS los targets
        mindarGame = new MindAR.Engine({
            container: document.getElementById('contenedor-escena'),
            imageTargetSrc: 'assets/targets/targets.mind',  // ← 1 archivo con 20 targets
            maxTrack: 2,
            uiScanning: false,
            uiLoading: false
        });
        
        // Mostrar progreso de carga
        mindarGame.onLoadProgress = (progress) => {
            const porcentaje = Math.round(progress * 100);
            document.getElementById('barra-progreso').value = porcentaje;
            document.getElementById('porcentaje-carga').textContent = `${porcentaje}%`;
        };
        
        // Cuando se detecta un target
        mindarGame.onTargetFound = (target) => {
            const targetIndex = target.targetIndex;
            equipoActual = equiposData.equipos.find(equipo => equipo.targetIndex === targetIndex);
            
            if (equipoActual) {
                console.log("✅ Bandera detectada:", equipoActual.nombre);
                document.getElementById('texto-equipo').innerHTML = 
                    `<p><strong>${equipoActual.nombre}</strong> detectado</p>`;
                
                // Mostrar contenido automáticamente
                mostrarEstadisticas();
                mostrarModelo3D();
            }
        };
        
        // Cuando se pierde un target
        mindarGame.onTargetLost = () => {
            document.getElementById('texto-equipo').innerHTML = 
                "<p>Enfoca una bandera para comenzar</p>";
            equipoActual = null;
        };
        
        // Iniciar MindAR
        await mindarGame.start();
        document.getElementById('carga-container').style.display = 'none';
        
    } catch (error) {
        console.error("Error al iniciar AR:", error);
        alert("Error al iniciar la cámara. Asegúrate de dar los permisos necesarios.");
    }
}

// Funciones de contenido (mostrarEstadisticas, mostrarVideo, etc.)

function mostrarEstadisticas() {
    if (!equipoActual) return;
    
    const stats = equipoActual.contenidos.estadisticas;
    const statsContainer = document.getElementById('datos-estadisticas');
    statsContainer.innerHTML = '';
    
    for (const [key, value] of Object.entries(stats)) {
        const statElement = document.createElement('div');
        statElement.className = 'dato-stat';
        statElement.innerHTML = `<strong>${key}:</strong> ${value}`;
        statsContainer.appendChild(statElement);
    }
    
    // Configurar gráfica
    if (chart) chart.destroy();
    const ctx = document.getElementById('histograma-stats').getContext('2d');
    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(stats),
            datasets: [{
                label: equipoActual.nombre,
                data: Object.values(stats),
                backgroundColor: ['#ff6b6b', '#4ecdc4', '#ffd166']
            }]
        }
    });
}

function mostrarModelo3D() {
    if (!equipoActual) return;
    
    const modeloContainer = document.getElementById('contenedor-modelo');
    modeloContainer.innerHTML = `
        <h4>${equipoActual.nombre}</h4>
        <p>Modelo 3D cargado: ${equipoActual.contenidos.modelo3D}</p>
        <small>El modelo se mostraría aquí</small>
    `;
}

function mostrarVideo() {
    if (!equipoActual) return;
    
    const videoElement = document.getElementById('video-equipo');
    videoElement.src = equipoActual.contenidos.video;
    videoElement.load();
    videoElement.play();
    
    // Mostrar contenedor de video
    document.getElementById('video-container').classList.remove('oculto');
}

function mostrarTrivia() {
    if (!equipoActual) return;
    
    const trivia = equipoActual.contenidos.trivia;
    document.getElementById('texto-pregunta').textContent = trivia.pregunta;
    
    const opcionesContainer = document.getElementById('opciones-trivia');
    opcionesContainer.innerHTML = '';
    
    trivia.opciones.forEach((opcion, index) => {
        const button = document.createElement('button');
        button.className = 'opcion-trivia';
        button.textContent = opcion;
        button.onclick = () => verificarRespuesta(index, trivia.respuestaCorrecta);
        opcionesContainer.appendChild(button);
    });
    
    document.getElementById('trivia-container').classList.remove('oculto');
}

function verificarRespuesta(respuestaIndex, respuestaCorrecta) {
    const opciones = document.querySelectorAll('.opcion-trivia');
    opciones.forEach((opcion, index) => {
        if (index === respuestaCorrecta) {
            opcion.style.background = '#4caf50';
        } else if (index === respuestaIndex && index !== respuestaCorrecta) {
            opcion.style.background = '#f44336';
        }
        opcion.disabled = true;
    });
}

function mostrarAnimacion() {
    if (!equipoActual) return;
    // Lógica para animación
    console.log("Mostrando animación para:", equipoActual.nombre);
}


function volverAlInicio() {
    if (mindarGame) {
        mindarGame.stop();
        mindarGame = null;
    }
    document.getElementById('seccion-ra').classList.add('oculto');
    document.getElementById('info-mundial').classList.remove('oculto');
}

function ocultarVideo() {
    document.getElementById('video-container').classList.add('oculto');
    const video = document.getElementById('video-equipo');
    video.pause();
    video.currentTime = 0;
}

function ocultarTrivia() {
    document.getElementById('trivia-container').classList.add('oculto');
}