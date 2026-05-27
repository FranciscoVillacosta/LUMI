import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
// Cambiamos los módulos al sistema de Firestore
import { getFirestore, collection, addDoc, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Tus credenciales oficiales
const firebaseConfig = {
  apiKey: "AIzaSyCqm-ifnDLIYLlZBafR-wIO87CqTIh9zd0",
  authDomain: "yassin-lerma.firebaseapp.com",
  projectId: "yassin-lerma",
  storageBucket: "yassin-lerma.firebasestorage.app",
  messagingSenderId: "854070019092",
  appId: "1:854070019092:web:11585b434dd224ff519301",
  measurementId: "G-K38ZF10HD8"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Inicializar Firestore

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
// 🛠️ LÓGICA: REGISTRAR EN CLOUD FIRESTORE
// ==========================================
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        regMessage.classList.add('d-none');

        try {
            // Guardar el documento directamente en la colección 'usuarios'
            await addDoc(collection(db, "usuarios"), {
                nombre: regName.value.trim(),
                correo: regEmail.value.trim().toLowerCase(),
                password: regPassword.value.trim()
            });

            regMessage.className = "alert alert-success p-2 small text-center";
            regMessage.innerText = "¡Usuario creado con éxito! Ya puedes iniciar sesión.";
            regMessage.classList.remove('d-none');
            registerForm.reset();
        } catch (error) {
            console.error(error);
            regMessage.className = "alert alert-danger p-2 small text-center";
            regMessage.innerText = "Error al guardar en Firestore.";
            regMessage.classList.remove('d-none');
        }
    });
}

// ==========================================
// 🔑 LÓGICA: INICIAR SESIÓN (LOGIN)
// ==========================================
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        loginError.classList.add('d-none');

        const correoIngresado = emailInput.value.trim().toLowerCase();
        const passwordIngresado = passwordInput.value.trim();

        try {
            // Buscamos directamente en Firestore el usuario que coincida
            const usuariosRef = collection(db, "usuarios");
            const q = query(usuariosRef, where("correo", "==", correoIngresado), where("password", "==", passwordIngresado));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                let nombreUsuario = "";
                querySnapshot.forEach((doc) => {
                    nombreUsuario = doc.data().nombre;
                });

                // Crear Session obligatoria de la escuela
                sessionStorage.setItem("session_active", "true");
                sessionStorage.setItem("user_name", nombreUsuario || correoIngresado);
                
                window.location.href = "historial.html";
            } else {
                loginError.innerText = "Usuario o contraseña incorrectos.";
                loginError.classList.remove('d-none');
            }
        } catch (error) {
            console.error(error);
            loginError.innerText = "Error de conexión con Firestore.";
            loginError.classList.remove('d-none');
        }
    });
}
