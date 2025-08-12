// El principal objetivo de este desafío es fortalecer tus habilidades en lógica de programación. Aquí deberás desarrollar la lógica para resolver el problema.
// Lista de amigos
let amigos = [];

// Elementos del DOM (almacenados para evitar búsquedas repetidas)
const inputAmigo = document.querySelector("#amigo");
const listaAmigos = document.querySelector("#listaAmigos");
const btnReset = document.querySelector(".button-reset");
const resultadoSorteo = document.querySelector("#resultado");

// Valida si un nombre es correcto
function validarNombre(nombre, original = "") {
    const limpio = nombre.trim();

    // Reglas de validación
    if (!limpio) return "Por favor, ingresa un nombre válido.";
    if (limpio.length < 2 || limpio.length > 30) return "El nombre debe tener entre 2 y 30 caracteres.";
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(limpio)) return "El nombre solo puede contener letras y espacios.";
    if (/(.)\1{2,}/.test(limpio)) return "El nombre no puede tener más de 2 letras repetidas consecutivas.";
    if (!/[aeiouáéíóúAEIOUÁÉÍÓÚ]/.test(limpio)) return "Ese no parece un nombre real.";

    // Verifica duplicados (ignorando mayúsculas y minúsculas)
    const existe = amigos.some(n => n.toLowerCase() === limpio.toLowerCase());
    if (existe && limpio !== original) return "Este nombre ya está en la lista.";

    return null;
}

// Muestra la lista actualizada de amigos
function mostrarAmigos() {
    listaAmigos.innerHTML = "";

    if (amigos.length === 0) {
        const li = document.createElement("li");
        li.textContent = "Aún no has agregado amigos.";
        li.classList.add("mensaje-vacio");
        listaAmigos.appendChild(li);
        btnReset.disabled = true;
        return;
    }

    amigos.forEach((nombre, index) => {
        const li = document.createElement("li");
        li.classList.add("nombre-item");

        const span = document.createElement("span");
        span.textContent = nombre;

        const btnEditar = document.createElement("button");
        btnEditar.textContent = "✏️";
        btnEditar.className = "btn-editar";
        btnEditar.setAttribute("aria-label", `Editar a ${nombre}`);
        btnEditar.onclick = () => iniciarEdicion(index, li);

        const btnEliminar = document.createElement("button");
        btnEliminar.textContent = "✖";
        btnEliminar.className = "btn-eliminar";
        btnEliminar.setAttribute("aria-label", `Eliminar a ${nombre}`);
        btnEliminar.onclick = () => {
            amigos.splice(index, 1);
            mostrarAmigos();
        };

        li.append(span, btnEditar, btnEliminar);
        listaAmigos.appendChild(li);
    });

    btnReset.disabled = false;
}

// Inicia edición del nombre en la lista
function iniciarEdicion(index, liElemento) {
    const nombreOriginal = amigos[index];
    liElemento.innerHTML = "";

    const input = document.createElement("input");
    input.type = "text";
    input.value = nombreOriginal;
    input.className = "input-editar";

    const btnGuardar = document.createElement("button");
    btnGuardar.textContent = "✅";
    btnGuardar.className = "btn-guardar";
    btnGuardar.onclick = () => {
        const nuevoNombre = input.value.trim();
        const error = validarNombre(nuevoNombre, nombreOriginal);
        if (error) return alert(error);

        amigos[index] = nuevoNombre;
        mostrarAmigos();
    };

    const btnCancelar = document.createElement("button");
    btnCancelar.textContent = "❌";
    btnCancelar.className = "btn-cancelar";
    btnCancelar.onclick = mostrarAmigos;

    liElemento.append(input, btnGuardar, btnCancelar);
}

// Agrega un nuevo amigo
function agregarAmigo() {
    const nombre = inputAmigo.value.trim();
    const error = validarNombre(nombre);
    if (error) return alert(error);

    amigos.push(nombre);
    inputAmigo.value = "";
    mostrarAmigos();
}

// Maneja el evento Enter para agregar amigo
inputAmigo.addEventListener("keydown", e => {
    if (e.key === "Enter") {
        e.preventDefault();
        agregarAmigo();
    }
});

// Reinicia la lista
function reiniciar() {
    amigos = [];
    mostrarAmigos();
    resultadoSorteo.innerHTML = "";
    inputAmigo.value = "";
}

// Ejecuta el sorteo de amigo secreto
function sortearAmigo() {
    if (amigos.length < 2) return alert("Necesitas al menos dos amigos para hacer un sorteo.");

    const mezcla = [...amigos];
    let asignaciones = new Map();
    let intentos = 0;
    const maxIntentos = 1000;

    // Genera una permutación válida sin autoasignación
    while (intentos++ < maxIntentos) {
        mezcla.sort(() => Math.random() - 0.5);
        let valido = true;
        asignaciones.clear();

        for (let i = 0; i < amigos.length; i++) {
            if (amigos[i] === mezcla[i]) {
                valido = false;
                break;
            }
            asignaciones.set(amigos[i], mezcla[i]);
        }

        if (valido) break;
    }

    if (intentos >= maxIntentos) {
        return alert("No se pudo generar una combinación válida. Intenta de nuevo.");
    }

    resultadoSorteo.innerHTML = "";
    asignaciones.forEach((asignado, original) => {
        const li = document.createElement("li");
        li.textContent = `${original} tiene de amigo secreto a ${asignado}`;
        resultadoSorteo.appendChild(li);
    });
}