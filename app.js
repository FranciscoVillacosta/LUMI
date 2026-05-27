import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// Credenciales oficiales de tu app yassin-lerma
const firebaseConfig = {
  apiKey: "AIzaSyCqm-ifnDLIYLlZBafR-wIO87CqTIh9zd0",
  authDomain: "yassin-lerma.firebaseapp.com",
  databaseURL: "https://yassin-lerma-default-rtdb.firebaseio.com",
  projectId: "yassin-lerma",
  storageBucket: "yassin-lerma.firebasestorage.app",
  messagingSenderId: "854070019092",
  appId: "1:854070019092:web:11585b434dd224ff519301",
  measurementId: "G-K38ZF10HD8"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const loginForm = document.getElementById('login-form');
const emailInput = document.getElementById('login-email');
const passwordInput = document.getElementById('login-password');
const errorAlert = document.getElementById('login-error');

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorAlert.classList.add('d-none');

        const correoIngresado = emailInput.value.trim();
        const passwordIngresado = passwordInput.value.trim();
        const dbRef = ref(db);

        try {
            const snapshot = await get(child(dbRef, 'usuarios'));

            if (snapshot.exists()) {
                const usuarios = snapshot.val();
                let usuarioValido = null;

                for (let id in usuarios) {
                    if (usuarios[id].correo === correoIngresado && usuarios[id].password === passwordIngresado) {
                        usuarioValido = usuarios[id];
                        break;
                    }
                }

                if (usuarioValido) {
                    // --- COMPONENTE MANDATORIO: CREACIÓN DE SESSION ---
                    sessionStorage.setItem("session_active", "true");
                    sessionStorage.setItem("user_name", usuarioValido.nombre || usuarioValido.correo);
                    
                    // Redirige al panel privado
                    window.location.href = "historial.html";
                } else {
                    errorAlert.innerText = "Usuario o contraseña incorrectos.";
                    errorAlert.classList.remove('d-none');
                }
            } else {
                errorAlert.innerText = "No hay usuarios en la Base de Datos.";
                errorAlert.classList.remove('d-none');
            }
        } catch (error) {
            console.error(error);
            errorAlert.innerText = "Error al conectar con la base de datos.";
            errorAlert.classList.remove('d-none');
        }
    });
}
