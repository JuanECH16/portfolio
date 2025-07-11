document.addEventListener("DOMContentLoaded", () => {
    // Inicializar tooltips
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

    // Detecta el modo preferido del navegador
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const body = document.body;
    const modeButton = document.querySelector('button[data-action="mode"]');

    // Aplica el modo oscuro o claro según la preferencia del usuario y actualiza el botón
    if (prefersDark) {
        body.classList.add('dark-mode');
        if (modeButton) {
            modeButton.innerHTML = '<i class="bi bi-sun-fill"></i> Modo Claro';
        }
    } else {
        body.classList.remove('dark-mode');
        if (modeButton) {
            modeButton.innerHTML = '<i class="bi bi-moon-stars-fill"></i> Modo Oscuro';
        }
    }

    // Inicializa el observador de intersección para animar los elementos al hacer scroll
    // Selecciona todos los elementos con la clase 'scroll-item'
    const scrollItems = document.querySelectorAll('.scroll-item');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.3 // Umbral de visibilidad del 30%
    });

    // Observa cada elemento con la clase 'scroll-item' y lo agrega al observador
    scrollItems.forEach(item => observer.observe(item));

    // Maneja los eventos de clic en los botones
    document.body.addEventListener("click", (event) => {
        const clickedButton = event.target.closest('button');

        if (clickedButton) {
            const action = clickedButton.dataset.action;

            if (action === 'mail') {
                openModal('notificationModal');
            }
            if (action === 'mode') {
                // Cambia el modo oscuro/claro
                body.classList.toggle("dark-mode");

                if (prefersDark) {
                    clickedButton.innerHTML = '<i class="bi bi-sun-fill"></i> Modo Claro';
                } else {
                    clickedButton.innerHTML = '<i class="bi bi-moon-stars-fill"></i> Modo Oscuro';
                }
            }
            if (action === 'emailInput') {
                const emailInput = document.getElementById('emailInput');
                if (emailInput) {
                    // Usa la Clipboard API moderna
                    navigator.clipboard.writeText(emailInput.value).then(() => {
                        const tooltip = bootstrap.Tooltip.getInstance(clickedButton);
                        if (tooltip) {
                            tooltip.setContent({ '.tooltip-inner': 'Correo copiado al portapapeles' });
                            tooltip.show();
                        }
                    }).catch(err => {
                        console.error('Error al copiar al portapapeles:', err);
                        // Fallback para navegadores antiguos
                        emailInput.select();
                        try {
                            document.execCommand('copy');
                            const tooltip = bootstrap.Tooltip.getInstance(clickedButton);
                            if (tooltip) {
                                tooltip.setContent({ '.tooltip-inner': 'Correo copiado al portapapeles' });
                                tooltip.show();
                            }
                        } catch (fallbackErr) {
                            console.error('Error en el fallback:', fallbackErr);
                        }
                    });
                } else {
                    console.error("No se encontró el input de correo electrónico.");
                }
            }
        }
    })

    document.getElementById('contactForm').addEventListener('submit', (event) => {
        event.preventDefault();

        const form = event.target;
        if (form.checkValidity()) {
            
            // Aquí puedes manejar el envío del formulario, por ejemplo, enviarlo a un servidor
            console.log("Formulario enviado correctamente.");
            
            // Mostrar un mensaje de éxito o redirigir al usuario
            const successMessage = document.createElement('div');
            successMessage.className = 'alert alert-success mt-3';
            successMessage.textContent = 'Formulario enviado correctamente. ¡Gracias por tu mensaje!';
            form.appendChild(successMessage);

            setTimeout(() => {
                successMessage.style.transition = 'opacity 0.5s ease';
                successMessage.style.opacity = '0'; // Desvanecer el mensaje
                setTimeout(() => {
                    successMessage.remove(); // Elimina el mensaje después de desvanecerlo
                }, 500);
            }, 3000);

            form.classList.remove('was-validated');
            form.reset();
        } else {
            form.classList.add('was-validated');
        }
    });
});

// Función para abrir el modal
function openModal(modalID) {
    if (!modalID) {
        console.error("ID del modal no proporcionado.");
        return;
    }

    // Obtener el elemento del modal por su ID
    const modalElement = document.getElementById(modalID);
    const modal = new bootstrap.Modal(modalElement);
    if (modal) {
        modal.show();
    }
}

// Función para cerrar el modal y devolver el foco al botón "Buscar"
function closeModal() {
    // Busca modal abierto
    const modalElement = document.querySelector('.modal.show');
    if (!modalElement) {
        console.error("No se encontró un modal abierto.");
        return;
    }
    const modal = bootstrap.Modal.getInstance(modalElement);
    const triggerElement = document.getElementById('search'); // Elemento que recibe el foco

    if (modal) {
        // Escuchar el evento 'hidden.bs.modal' que se dispara DESPUÉS de que el modal se ha ocultado
        modalElement.addEventListener('hidden.bs.modal', () => {
            if (triggerElement) {
                triggerElement.focus(); // Devolver el foco al botón "Buscar"
            }
        }, { once: true }); // { once: true } asegura que el listener se ejecute solo una vez

        modal.hide();
    } else if (triggerElement) {
        // Si no se pudo obtener la instancia del modal, al menos intentar devolver el foco
        triggerElement.focus();
    }
}