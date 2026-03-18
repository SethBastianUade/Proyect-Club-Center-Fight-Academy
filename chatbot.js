// ===== CHATBOT FUNCTIONALITY - CLUB CENTER FIGHT ACADEMY =====
// Sistema híbrido: Chatbot para consultas generales + WhatsApp directo para casos urgentes

// Configuración del chatbot
const CHATBOT_CONFIG = {
    chatbotNumber: '5491139536882',
    receptionNumber: '5491139536882', // Cambiado al mismo número del asistente virtual
    defaultMessage: 'Hola%20quiero%20consultar%20sobre%20las%20clases',
    heroMessage: 'Hola%20quiero%20información%20sobre%20las%20disciplinas%20y%20horarios',
    testimonialsMessage: 'Hola%20quiero%20saber%20más%20sobre%20las%20clases%20y%20precios',
    footerMessage: 'Hola%20quiero%20información%20general%20sobre%20Club%20Center',
    urgentMessage: 'Hola%20necesito%20ayuda%20urgente%20o%20contacto%20directo%20con%20un%20instructor'
};

// Función principal para abrir el chatbot
function openChatbot(message = CHATBOT_CONFIG.defaultMessage) {
    const url = `https://wa.me/${CHATBOT_CONFIG.chatbotNumber}?text=${message}`;
    window.open(url, '_blank');
}

// Función para abrir WhatsApp de recepción (casos urgentes)
function openReception(message = CHATBOT_CONFIG.urgentMessage) {
    const url = `https://wa.me/${CHATBOT_CONFIG.receptionNumber}?text=${message}`;
    window.open(url, '_blank');
}

// Función para inicializar el chatbot en la página
function initChatbot() {
    // Botón flotante del chatbot
    const chatbotBtn = document.getElementById('chatbot-btn');
    if (chatbotBtn) {
        chatbotBtn.addEventListener('click', () => openChatbot());
        
        // Agregar efecto de hover mejorado
        chatbotBtn.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
        });
        
        chatbotBtn.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
        
        // Agregar funcionalidad de teclado para accesibilidad
        chatbotBtn.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openChatbot();
            }
        });
    }
    
    // Botones de llamada a la acción del chatbot
    const chatbotButtons = document.querySelectorAll('.btn-chatbot');
    chatbotButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            console.log('Chatbot CTA button clicked');
            
            // Opcional: agregar analytics aquí
            if (typeof gtag !== 'undefined') {
                gtag('event', 'chatbot_click', {
                    'event_category': 'engagement',
                    'event_label': this.textContent.trim()
                });
            }
        });
    });
    
    // Botones de WhatsApp de recepción (casos urgentes)
    const receptionButtons = document.querySelectorAll('.btn-reception');
    receptionButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            console.log('Reception WhatsApp button clicked');
            
            if (typeof gtag !== 'undefined') {
                gtag('event', 'reception_click', {
                    'event_category': 'engagement',
                    'event_label': this.textContent.trim()
                });
            }
        });
    });
}

// Función para mostrar notificación informativa sobre los dos canales
function showChannelInfo() {
    // Solo mostrar si no se ha mostrado antes en esta sesión
    if (!sessionStorage.getItem('channelInfoShown')) {
        setTimeout(() => {
            const notification = document.createElement('div');
            notification.className = 'channel-info-notification';
            notification.innerHTML = `
                <div class="channel-info-content">
                    <div class="channel-info-header">
                        <i class="fas fa-info-circle"></i>
                        <span><strong>¿Cómo podemos ayudarte?</strong></span>
                        <button class="channel-info-close">&times;</button>
                    </div>
                    <div class="channel-info-body">
                        <div class="channel-option">
                            <i class="fas fa-robot"></i>
                            <span><strong>Chatbot:</strong> Consultas generales, horarios, precios</span>
                        </div>
                        <div class="channel-option">
                            <i class="fas fa-user"></i>
                            <span><strong>WhatsApp directo:</strong> Casos urgentes y contacto personal</span>
                        </div>
                    </div>
                </div>
            `;
            
            // Agregar estilos inline para la notificación
            notification.style.cssText = `
                position: fixed;
                bottom: 100px;
                right: 20px;
                background: white;
                color: #333;
                padding: 20px;
                border-radius: 12px;
                box-shadow: 0 8px 24px rgba(0,0,0,0.15);
                z-index: 999;
                max-width: 320px;
                animation: slideInRight 0.5s ease;
                border: 2px solid #007bff;
            `;
            
            notification.querySelector('.channel-info-header').style.cssText = `
                display: flex;
                align-items: center;
                gap: 10px;
                font-size: 16px;
                margin-bottom: 15px;
                color: #007bff;
            `;
            
            notification.querySelector('.channel-info-close').style.cssText = `
                background: none;
                border: none;
                color: #666;
                font-size: 20px;
                cursor: pointer;
                margin-left: auto;
            `;
            
            notification.querySelector('.channel-info-body').style.cssText = `
                display: flex;
                flex-direction: column;
                gap: 12px;
            `;
            
            notification.querySelectorAll('.channel-option').forEach(option => {
                option.style.cssText = `
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-size: 14px;
                    line-height: 1.4;
                `;
            });
            
            document.body.appendChild(notification);
            
            // Evento para cerrar la notificación
            notification.querySelector('.channel-info-close').addEventListener('click', () => {
                notification.remove();
            });
            
            // Auto-cerrar después de 15 segundos
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 15000);
            
            sessionStorage.setItem('channelInfoShown', 'true');
        }, 3000); // Mostrar después de 3 segundos
    }
}

// Función para agregar estilos CSS dinámicamente
function addChatbotStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        .channel-info-notification {
            transition: all 0.3s ease;
        }
        
        .channel-info-notification:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 32px rgba(0,0,0,0.2);
        }
        
        @media (max-width: 768px) {
            .channel-info-notification {
                bottom: 80px;
                right: 15px;
                left: 15px;
                max-width: none;
            }
        }
    `;
    document.head.appendChild(style);
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    initChatbot();
    addChatbotStyles();
    
    // Mostrar información sobre canales (opcional)
    // showChannelInfo();
});

// Exportar funciones para uso global
window.Chatbot = {
    open: openChatbot,
    openReception: openReception,
    init: initChatbot,
    showChannelInfo: showChannelInfo
}; 