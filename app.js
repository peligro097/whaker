const firebaseConfig = {
    apiKey: "AIzaSyCZEUb4nTU2902VmVt6gOvku1I8YDQ1vWQ",
    authDomain: "simulador-db-f8f89.firebaseapp.com",
    databaseURL: "https://simulador-db-f8f89-default-rtdb.firebaseio.com",
    projectId: "simulador-db-f8f89",
    storageBucket: "simulador-db-f8f89.appspot.com",
    messagingSenderId: "168401346434",
    appId: "1:168401346434:web:8c03ae8d891bfe0579f99b"
};

// Inicializar
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Prueba de conexión
db.ref('simulador/datos').once('value')
    .then((snapshot) => {
        console.log("CONEXIÓN EXITOSA:", snapshot.val());
        alert("¡Conexión a Firebase OK! Datos encontrados: " + JSON.stringify(snapshot.val()));
    })
    .catch((error) => {
        console.error("ERROR DE CONEXIÓN:", error);
        alert("ERROR CRÍTICO: " + error.message);
    });
