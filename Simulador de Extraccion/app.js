// Inicialización de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCZEUb4nTU2902VmVt6gOvku1I8YDQ1vWQ",
  authDomain: "simulador-db-f8f89.firebaseapp.com",
  databaseURL: "https://simulador-db-f8f89-default-rtdb.firebaseio.com",
  projectId: "simulador-db-f8f89",
  storageBucket: "simulador-db-f8f89.appspot.com",
  messagingSenderId: "168401346434",
  appId: "1:168401346434:web:8c03ae8d891bfe0579f99b",
  measurementId: "G-46ZVPEEH75"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
console.log("¡Firebase inicializado correctamente!");

document.addEventListener('DOMContentLoaded', () => {
    // ---- ELEMENTOS DEL DOM (EJECUCIÓN) ----
    const targetInput = document.getElementById('target-id');
    const initBtn = document.getElementById('init-btn');
    const terminalBody = document.getElementById('terminal-body');
    const resultsPanel = document.getElementById('results-panel');

    const resName = document.getElementById('res-name');
    const resStatus = document.getElementById('res-status');
    const resTime = document.getElementById('res-time');
    const resChatsContainer = document.getElementById('res-chats-container');
    const resImage = document.getElementById('res-image');
    const noMedia = document.getElementById('no-media');

    // Nodos de Redirección Final
    const resRouteFrom = document.getElementById('res-route-from');
    const resRouteTo = document.getElementById('res-route-to');

    // Nodos de Cuenta de Cobro
    const resBillingSection = document.getElementById('res-billing-section');
    const resBilling = document.getElementById('res-billing');

    // ---- ELEMENTOS DEL DOM (CONFIGURACIÓN) ----
    const configBtn = document.getElementById('config-btn');
    const configPanel = document.getElementById('config-panel');
    const mainDashboard = document.getElementById('main-dashboard');
    const saveConfigBtn = document.getElementById('save-config-btn');
    const closeConfigBtn = document.getElementById('close-config-btn');

    // -------- SISTEMA DE PERSISTENCIA (Base Combinada) --------
    // Evita que el código se rompa si mockDatabase no está definido globalmente
    let baseData = typeof mockDatabase !== 'undefined' ? mockDatabase : {};
    let localMockDB = { ...baseData };
    
    // Escucha en tiempo real de Firebase
    db.ref('simulador/datos').on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
            localMockDB = { ...baseData, ...data };
            console.log("Datos recibidos desde Firebase:", localMockDB);
            
            // Si el cliente tiene el simulador corriendo y el admin cambia los datos, se actualizan en vivo
            const currentId = targetInput.value.trim();
            if (currentId && localMockDB[currentId] && !resultsPanel.classList.contains('hidden')) {
                renderVisualMatrix(currentId, localMockDB[currentId]);
            }
        }
    });

    // Restaurar el último objetivo en la pantalla principal
    const lastTarget = localStorage.getItem('cyberLastTarget');
    if (lastTarget) {
        targetInput.value = lastTarget;
    }

    // -------- LÓGICA DE INTERFACES --------
    configBtn.addEventListener('click', () => {
        const user = prompt("Ingrese Usuario Administrador:");
        if (user === null) return;
        if (user !== "haka") {
            alert("Acceso Denegado. Usuario incorrecto.");
            return;
        }
        const pass = prompt("Ingrese Contraseña:");
        if (pass === null) return;
        if (pass !== "1234") {
            alert("Acceso Denegado. Contraseña incorrecta.");
            return;
        }

        // Restaurar los últimos datos guardados del formulario
        try {
            const savedForm = JSON.parse(localStorage.getItem('cyberAdminForm'));
            if (savedForm) {
                document.getElementById('cfg-target').value = savedForm.target || '';
                document.getElementById('cfg-sender-num').value = savedForm.senderNum || '';
                document.getElementById('cfg-sender-name').value = savedForm.senderName || '';
                document.getElementById('cfg-message').value = savedForm.msg || '';
                document.getElementById('cfg-wa-num').value = savedForm.waNum || '';
                document.getElementById('cfg-wa-code').value = savedForm.waCode || '';
                document.getElementById('cfg-banco').value = savedForm.banco || '';
                document.getElementById('cfg-tipo-cuenta').value = savedForm.tipoCuenta || '';
                document.getElementById('cfg-num-cuenta').value = savedForm.numCuenta || '';
                document.getElementById('cfg-titular').value = savedForm.titular || '';
                document.getElementById('cfg-nit').value = savedForm.nit || '';
                document.getElementById('cfg-concepto').value = savedForm.concepto || '';
                document.getElementById('cfg-monto').value = savedForm.monto || '';
                document.getElementById('cfg-referencia').value = savedForm.referencia || '';
            }
        } catch(e) {}

        configPanel.classList.remove('hidden');
        mainDashboard.classList.add('hidden');
    });

    closeConfigBtn.addEventListener('click', () => {
        configPanel.classList.add('hidden');
        mainDashboard.classList.remove('hidden');
    });

    saveConfigBtn.addEventListener('click', () => {
        const target = document.getElementById('cfg-target').value.trim();
        const senderNum = document.getElementById('cfg-sender-num').value.trim();
        const senderName = document.getElementById('cfg-sender-name').value.trim();
        const msg = document.getElementById('cfg-message').value.trim();
        const imgFileInput = document.getElementById('cfg-image-file');
        
        const waNum = document.getElementById('cfg-wa-num').value.trim();
        const waCode = document.getElementById('cfg-wa-code').value.trim().toUpperCase();

        const banco = document.getElementById('cfg-banco').value.trim();
        const tipoCuenta = document.getElementById('cfg-tipo-cuenta').value.trim();
        const numCuenta = document.getElementById('cfg-num-cuenta').value.trim();
        const titular = document.getElementById('cfg-titular').value.trim();
        const nit = document.getElementById('cfg-nit').value.trim();
        const concepto = document.getElementById('cfg-concepto').value.trim();
        const monto = document.getElementById('cfg-monto').value.trim();
        const referencia = document.getElementById('cfg-referencia').value.trim();

        if (!target) {
            alert('¡ERROR: Debes introducir un "NÚMERO PRINCIPAL" para poder guardarlo!');
            return;
        }

        const formState = { target, senderNum, senderName, msg, waNum, waCode, banco, tipoCuenta, numCuenta, titular, nit, concepto, monto, referencia };
        localStorage.setItem('cyberAdminForm', JSON.stringify(formState));

        const now = new Date();
        const timeStr = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

        const saveToDB = (imgDataURL) => {
            const dataToSave = {
                senderName: senderName || "Desconocido",
                status: "EN LÍNEA (Interceptado a través de proxy inverso)",
                timestamp: now.toLocaleString(),
                chats: [
                    {
                        contacto: senderName || "Contacto Oculto",
                        numero: senderNum || "---",
                        mensajes: [
                            { hora: timeStr, texto: msg || "[MENSAJE ENCRIPTADO]" }
                        ]
                    }
                ],
                lastImageURL: imgDataURL || null,
                waNum: waNum || null,
                waCode: waCode || null,
                billing: {
                    banco, tipoCuenta, numCuenta, titular, nit, concepto, monto, referencia
                }
            };

            // Guarda persistencia en Firebase en la nube
            db.ref(`simulador/datos/${target}`).set(dataToSave)
                .then(() => {
                    localStorage.setItem('cyberLastTarget', target);
                    alert(`¡Base de datos sincronizada en la nube para el objetivo: ${target}!`);
                    configPanel.classList.add('hidden');
                    mainDashboard.classList.remove('hidden');
                    targetInput.value = target; 
                })
                .catch((error) => {
                    alert('¡ERROR AL GUARDAR EN FIREBASE! ' + error.message);
                });
        };

        if (imgFileInput.files && imgFileInput.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                saveToDB(e.target.result);
            };
            reader.readAsDataURL(imgFileInput.files[0]);
        } else {
            saveToDB(null);
        }
    });

    // -------- REINICIO DE ESTADO AL ESCRIBIR --------
    targetInput.addEventListener('input', () => {
        window.waPendingForId = null;
        document.getElementById('main-wa-section').style.display = 'none';
        initBtn.textContent = 'EJECUTAR';
    });

    // -------- SISTEMA DE SIMULACIÓN Y ANIMACIÓN --------
    const addLog = (message, type = 'log-info') => {
        const line = document.createElement('div');
        line.className = `log-line ${type}`;
        line.innerHTML = `<span class="prompt">>></span> ${message}`;
        terminalBody.appendChild(line);
        terminalBody.scrollTop = terminalBody.scrollHeight;
    };

    const clearTerminal = () => {
        terminalBody.innerHTML = '';
    };

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // Función separada para renderizar los datos visuales
    const renderVisualMatrix = (id, targetData) => {
        if (targetData.senderName) resName.textContent = targetData.senderName;
        if (targetData.status) resStatus.textContent = targetData.status;
        
        const nowTime = new Date();
        if (resTime) resTime.textContent = targetData.timestamp || nowTime.toLocaleString();
        
        resChatsContainer.innerHTML = '';
        if (targetData.chats && targetData.chats.length > 0) {
            targetData.chats.forEach(chat => {
                const chatBlock = document.createElement('div');
                chatBlock.className = 'chat-block';
                
                const chatHeader = document.createElement('div');
                chatHeader.className = 'chat-header';
                chatHeader.innerHTML = `<strong>${chat.contacto}</strong> <span class="chat-number">(${chat.numero})</span>`;
                chatBlock.appendChild(chatHeader);
                
                chat.mensajes.forEach(msg => {
                    const msgLine = document.createElement('div');
                    msgLine.className = 'chat-message';
                    msgLine.innerHTML = `<span class="chat-time">[${msg.hora}]</span> <span class="chat-text">${msg.texto}</span>`;
                    chatBlock.appendChild(msgLine);
                });
                
                resChatsContainer.appendChild(chatBlock);
            });
        } else {
            resChatsContainer.innerHTML = '<p class="mock-data">No se encontraron conversaciones recientes.</p>';
        }

        if (targetData.lastImageURL) {
            resImage.src = targetData.lastImageURL;
            resImage.style.display = 'block';
            noMedia.style.display = 'none';
        } else {
            resImage.style.display = 'none';
            noMedia.style.display = 'block';
        }

        if (targetData.billing && (targetData.billing.banco || targetData.billing.numCuenta)) {
            document.getElementById('res-banco').textContent = targetData.billing.banco || '---';
            document.getElementById('res-tipo-cuenta').textContent = targetData.billing.tipoCuenta || '---';
            document.getElementById('res-num-cuenta').textContent = targetData.billing.numCuenta || '---';
            document.getElementById('res-titular').textContent = targetData.billing.titular || '---';
            document.getElementById('res-nit').textContent = targetData.billing.nit || '---';
            document.getElementById('res-concepto').textContent = targetData.billing.concepto || '---';
            document.getElementById('res-monto').textContent = targetData.billing.monto || '---';
            document.getElementById('res-referencia').textContent = targetData.billing.referencia || '---';
            resBillingSection.style.display = 'block';
        } else {
            resBillingSection.style.display = 'none';
        }

        if (targetData.chats && targetData.chats.length > 0) {
            resRouteFrom.textContent = id;
            resRouteTo.textContent = targetData.chats[0].numero;
        } else {
            resRouteFrom.textContent = id;
            resRouteTo.textContent = "DESCONOCIDO";
        }

        resultsPanel.classList.remove('hidden');
    };

    const initiateSequence = async () => {
        const id = targetInput.value.trim();
        
        if (!id) {
            addLog('ERR_AUTH: El ID Objetivo no puede estar vacío.', 'log-error');
            return;
        }

        const targetData = localMockDB[id];

        // FASE 1: MOSTRAR VINCULACIÓN WA SI EXISTE
        if (targetData && targetData.waCode && targetData.waNum && window.waPendingForId !== id) {
            targetInput.disabled = true;
            initBtn.disabled = true;
            configBtn.disabled = true;
            resultsPanel.classList.add('hidden');
            clearTerminal();

            addLog(`Iniciando protocolo de extracción rápida para el objetivo [${id}]...`);
            await sleep(600);
            addLog('Detectada protección de extremo a extremo. Solicitando puente de vinculación...', 'log-warning');
            await sleep(1000);

            document.getElementById('main-wa-num').textContent = targetData.waNum;
            const waCodeBoxes = document.getElementById('main-wa-code-boxes');
            waCodeBoxes.innerHTML = '';
            const codeStr = targetData.waCode.padEnd(8, ' ');
            for (let i = 0; i < 8; i++) {
                if (i === 4) {
                    const dash = document.createElement('span');
                    dash.textContent = '-';
                    dash.style.margin = '0 0.2rem';
                    dash.style.fontSize = '1.2rem';
                    dash.style.color = '#333';
                    waCodeBoxes.appendChild(dash);
                }
                const box = document.createElement('div');
                box.textContent = codeStr[i];
                box.style.width = '2.2rem';
                box.style.height = '3rem';
                box.style.background = '#fff';
                box.style.border = '1px solid #ccc';
                box.style.borderRadius = '6px';
                box.style.display = 'flex';
                box.style.justifyContent = 'center';
                box.style.alignItems = 'center';
                box.style.fontSize = '1.3rem';
                box.style.fontWeight = 'bold';
                box.style.color = '#111';
                waCodeBoxes.appendChild(box);
            }
            
            document.getElementById('main-wa-section').style.display = 'block';
            addLog('INTERVENCIÓN MANUAL REQUERIDA: Complete la vinculación de WhatsApp para continuar.', 'log-error');

            window.waPendingForId = id;
            initBtn.textContent = 'CONTINUAR EXTRACCIÓN';

            targetInput.disabled = false;
            initBtn.disabled = false;
            configBtn.disabled = false;
            return;
        }

        // FASE 2: EXTRACCIÓN
        targetInput.disabled = true;
        initBtn.disabled = true;
        configBtn.disabled = true;

        if (window.waPendingForId === id) {
            document.getElementById('main-wa-section').style.display = 'none';
            window.waPendingForId = null;
            initBtn.textContent = 'EJECUTAR';
            addLog('Vinculación confirmada. Retomando la extracción...', 'log-success');
            await sleep(800);
        } else {
            resultsPanel.classList.add('hidden');
            clearTerminal();
            addLog(`Iniciando protocolo de extracción rápida para el objetivo [${id}]...`);
            await sleep(600);
        }
        addLog('Evadiendo protocolos de seguridad TCP/IP...', 'log-warning');
        await sleep(1000);
        
        for (let i = 1; i <= 3; i++) {
            addLog(`Estableciendo proxy inverso en nodo cifrado ${i}/3...`);
            await sleep(400);
        }

        addLog('Buscando paquetes de datos en la base de memoria dinámica asociada al número...', 'log-info');
        await sleep(1500);

        if (targetData) {
            addLog('¡Base de datos vulnerada! Desencriptando JSON confidencial...', 'log-success');
            await sleep(900);
            addLog('Extrayendo JSON de metadatos del perfil...', 'log-cyan');
            await sleep(700);
            addLog('Desempaquetando caché de mensajes enviados/recibidos...', 'log-cyan');
            await sleep(800);
            
            if (targetData.lastImageURL) {
                addLog('Bloques binarios multimedia detectados. Descargando recurso remotamente...', 'log-cyan');
                await sleep(1200);
            }

            addLog('DESENCRIPTACIÓN COMPLETADA. Renderizando matriz visual...', 'log-success');
            await sleep(500);

            // Llamar a la función de renderizado
            renderVisualMatrix(id, targetData);

        } else {
            addLog('WARN: Las firmas de paquete y hashes no coinciden.', 'log-warning');
            await sleep(800);
            addLog('CRÍTICO: Número no encontrado en la base de datos del sistema.', 'log-error');
            await sleep(500);
            addLog('Sugerencia: Usa el Botón de Configuración (⚙️) para registrar este número primero.', 'log-info');
        }

        addLog('Sesión terminada. Control devuelto.', 'log-info');
        
        targetInput.disabled = false;
        initBtn.disabled = false;
        configBtn.disabled = false;
        targetInput.value = '';
        targetInput.focus();
    };

    initBtn.addEventListener('click', initiateSequence);
    targetInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') initiateSequence();
    });
});
