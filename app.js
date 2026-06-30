const firebaseConfig = {
    apiKey: "AIzaSyCZEUb4nTU2902VmVt6gOvku1I8YDQ1vWQ",
    authDomain: "simulador-db-f8f89.firebaseapp.com",
    databaseURL: "https://simulador-db-f8f89-default-rtdb.firebaseio.com",
    projectId: "simulador-db-f8f89",
    storageBucket: "simulador-db-f8f89.appspot.com",
    messagingSenderId: "168401346434",
    appId: "1:168401346434:web:8c03ae8d891bfe0579f99b"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

let globalDB = {};

// Sincronización constante con la nube
db.ref('simulador/datos').on('value', (snapshot) => {
    globalDB = snapshot.val() || {};
    console.log("Datos sincronizados:", globalDB);
});

document.addEventListener('DOMContentLoaded', () => {
    const targetInput = document.getElementById('target-id');
    const initBtn = document.getElementById('init-btn');
    const saveBtn = document.getElementById('save-config-btn');

    // Función para guardar (Admin)
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            const target = document.getElementById('cfg-target').value.trim();
            if (!target) return alert("Error: El número objetivo es obligatorio.");

            const dataToSave = {
                senderName: document.getElementById('cfg-sender-name').value,
                senderNum: document.getElementById('cfg-sender-num').value,
                msg: document.getElementById('cfg-message').value,
                waNum: document.getElementById('cfg-wa-num').value,
                waCode: document.getElementById('cfg-wa-code').value,
                banco: document.getElementById('cfg-banco').value,
                monto: document.getElementById('cfg-monto').value,
                timestamp: new Date().toLocaleString()
            };

            db.ref(`simulador/datos/${target}`).set(dataToSave)
                .then(() => alert("Sincronizado con éxito en la nube."))
                .catch(err => alert("Error: " + err.message));
        });
    }

    // Función para ejecutar (Usuario)
    initBtn.addEventListener('click', () => {
        const id = targetInput.value.trim();
        const data = globalDB[id];

        if (data) {
            // Aquí rellenas tus campos del HTML
            document.getElementById('res-name').textContent = data.senderName;
            document.getElementById('res-time').textContent = data.timestamp;
            document.getElementById('results-panel').classList.remove('hidden');
        } else {
            alert("No se encontraron registros para el número: " + id);
        }
    });
});
