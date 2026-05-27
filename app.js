import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, get, child, push, set } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

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

// ELEMENTOS - LOGIN
const loginForm = document.getElementById('login-form');
const emailInput = document.getElementById('login-email');
const passwordInput = document.getElementById('login-password');
const loginError = document.getElementById('login-error');

// ELEMENTOS - REGISTRO
const registerForm = document.getElementById('register-form');
const regName = document.getElementById('reg-name');
const regEmail = document.getElementById('reg-email');
const regPassword = document.getElementById('reg-password');
const regMessage = document.getElementById('register-message');

// ==========================================
// 🛠️ LOGICA: REGISTRAR NUEVO USUARIO
// ==========================================
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        regMessage.classList.add('d-none');

        const nuevoUsuario = {
            nombre: regName.value.trim(),
            correo: regEmail.value.trim().toLowerCase(),
            password: regPassword.value.trim()
        };

        try {
            // Referencia al nodo 'usuarios' en tu Realtime Database
            const usuariosRef = ref(db, 'usuarios');
            
            // Creamos una nueva sub-llave automática para el usuario
            const nuevoUsuarioRef = push(usuariosRef);
            
            // Guardamos los datos en Firebase
            await set(nuevoUsuarioRef, nuevoUsuario);

            // Mostrar mensaje de éxito en pantalla
            regMessage.className = "alert alert-success p-2 small text-center";
            regMessage.innerText = "¡Usuario creado con éxito! Ya puedes iniciar sesión.";
            regMessage.classList.remove('d-none');
            
            // Limpiar el formulario de registro
            registerForm.reset();
        } catch (error) {
            console.error(error);
            regMessage.className = "alert alert-danger p-2 small text-center";
            regMessage.innerText = "Error al guardar el usuario en Firebase.";
            regMessage.classList.remove('d-none');
        }
    });
}

// ==========================================
// 🔑 LOGICA: INICIAR SESIÓN (LOGIN)
// ==========================================
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        loginError.classList.add('d-none');

        const correoIngresado = emailInput.value.trim().toLowerCase();
        const passwordIngresado = passwordInput.value.trim();
        const dbRef = ref(db);

        try {
            const snapshot = await get(child(dbRef, 'usuarios'));

            if (snapshot.exists()) {
                const usuarios = snapshot.val();
                let usuarioValido = null;

                for (let id in usuarios) {
                    if (usuarios[id] && usuarios[id].correo && usuarios[id].password) {
                        if (usuarios[id].correo.toLowerCase() == correoIngresado && String(usuarios[id].password) == passwordIngresado) {
                            usuarioValido = usuarios[id];
                            break;
                        }
                    }
                }

                if (usuarioValido) {
                    // Crear Session estándar para la entrega escolar
                    sessionStorage.setItem("session_active", "true");
                    sessionStorage.setItem("user_name", usuarioValido.nombre || usuarioValido.correo);
                    
                    // Redirigir al dashboard protegido
                    window.location.href = "historial.html";
                } else {
                    loginError.innerText = "Usuario o contraseña incorrectos.";
                    loginError.classList.remove('d-none');
                }
            } else {
                loginError.innerText = "No hay ningún usuario registrado todavía.";
                loginError.classList.remove('d-none');
            }
        } catch (error) {
            console.error(error);
            loginError.innerText = "Error de conexión con la base de datos.";
            loginError.classList.remove('d-none');
        }
    });
}
