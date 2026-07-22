// ===== STATE GLOBAL =====
let bookingState = {
    center: null,
    specialist: null,
    price: null,
    date: null,
    time: null,
    name: null,
    email: null,
    phone: null,
    notes: null
};

let currentMonth = new Date();
let reservedTimes = JSON.parse(localStorage.getItem('reservedTimes')) || {};

// ===== INICIALIZACIÓN =====
document.addEventListener('DOMContentLoaded', () => {
    initializeCalendar();
    attachEventListeners();
    renderCalendar();
});

// ===== GESTIÓN DE CENTRO Y ESPECIALISTA =====
function attachEventListeners() {
    // Centro y Especialista
    document.getElementById('center').addEventListener('change', validateStep1);
    document.getElementById('specialist').addEventListener('change', validateStep1);

    // Navegación Paso 1
    document.getElementById('btn-next-1').addEventListener('click', () => goToStep(2));

    // Calendario
    document.getElementById('prev-month').addEventListener('click', () => changeMonth(-1));
    document.getElementById('next-month').addEventListener('click', () => changeMonth(1));

    // Navegación Paso 2
    document.getElementById('btn-back-2').addEventListener('click', () => goToStep(1));
    document.getElementById('btn-next-2').addEventListener('click', () => goToStep(3));

    // Navegación Paso 3
    document.getElementById('btn-back-3').addEventListener('click', () => goToStep(2));
    document.getElementById('btn-confirm').addEventListener('click', confirmBooking);
    document.getElementById('btn-whatsapp-confirm').addEventListener('click', confirmViaWhatsApp);

    // Formulario
    document.getElementById('name').addEventListener('input', updateBookingState);
    document.getElementById('email').addEventListener('input', updateBookingState);
    document.getElementById('phone').addEventListener('input', updateBookingState);
    document.getElementById('notes').addEventListener('input', updateBookingState);
}

function validateStep1() {
    const center = document.getElementById('center').value;
    const specialist = document.getElementById('specialist').value;

    if (center && specialist) {
        bookingState.center = center;
        bookingState.specialist = specialist;

        // Obtener precio del specialist
        const specialistOption = document.getElementById('specialist').selectedOptions[0];
        bookingState.price = parseFloat(specialistOption.dataset.price) || 80;

        updateSummary();
        document.getElementById('btn-next-1').disabled = false;
    } else {
        document.getElementById('btn-next-1').disabled = true;
    }
}

function updateBooking() {
    validateStep1();
}

// ===== CALENDARIO =====
function initializeCalendar() {
    renderCalendar();
    updateMonthYear();
}

function renderCalendar() {
    const calendar = document.getElementById('calendar');
    calendar.innerHTML = '';

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    // Encabezados de días
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    days.forEach(day => {
        const dayLabel = document.createElement('div');
        dayLabel.className = 'day-label';
        dayLabel.textContent = day;
        calendar.appendChild(dayLabel);
    });

    // Primer día del mes
    const firstDay = new Date(year, month, 1).getDay();

    // Días del mes anterior
    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = firstDay - 1; i >= 0; i--) {
        const dateDiv = document.createElement('div');
        dateDiv.className = 'date other-month';
        dateDiv.textContent = prevMonthDays - i;
        calendar.appendChild(dateDiv);
    }

    // Días del mes actual
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
        const dateDiv = document.createElement('div');
        dateDiv.className = 'date';
        dateDiv.textContent = day;

        const dateStr = formatDate(new Date(year, month, day));
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const currentDate = new Date(year, month, day);

        if (currentDate < today) {
            dateDiv.classList.add('disabled');
        } else {
            dateDiv.addEventListener('click', () => selectDate(dateStr, dateDiv));
        }

        calendar.appendChild(dateDiv);
    }

    // Días del próximo mes
    const totalCells = calendar.children.length - 7;
    const remainingCells = 42 - totalCells;
    for (let day = 1; day <= remainingCells; day++) {
        const dateDiv = document.createElement('div');
        dateDiv.className = 'date other-month';
        dateDiv.textContent = day;
        calendar.appendChild(dateDiv);
    }
}

function changeMonth(direction) {
    currentMonth.setMonth(currentMonth.getMonth() + direction);
    renderCalendar();
    updateMonthYear();
}

function updateMonthYear() {
    const options = { year: 'numeric', month: 'long' };
    document.getElementById('month-year').textContent =
        currentMonth.toLocaleDateString('es-ES', options);
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function selectDate(dateStr, element) {
    document.querySelectorAll('.calendar-grid .date').forEach(d => {
        if (!d.classList.contains('day-label') && !d.classList.contains('other-month')) {
            d.classList.remove('selected');
        }
    });

    element.classList.add('selected');
    bookingState.date = dateStr;

    renderTimeSlots(dateStr);
    updateSummary();
}

// ===== HORARIOS =====
function renderTimeSlots(dateStr) {
    const timesGrid = document.getElementById('times-grid');
    timesGrid.innerHTML = '';

    const timeSlots = generateTimeSlots();
    const reserved = reservedTimes[dateStr] || [];

    timeSlots.forEach(time => {
        const timeDiv = document.createElement('div');
        timeDiv.className = 'time-slot';
        timeDiv.textContent = time;

        if (reserved.includes(time)) {
            timeDiv.classList.add('disabled');
        } else {
            timeDiv.addEventListener('click', () => selectTime(time, timeDiv));
        }

        timesGrid.appendChild(timeDiv);
    });

    document.getElementById('btn-next-2').disabled = !bookingState.time;
}

function generateTimeSlots() {
    const slots = [];
    for (let hour = 9; hour < 18; hour++) {
        slots.push(`${String(hour).padStart(2, '0')}:00`);
        slots.push(`${String(hour).padStart(2, '0')}:30`);
    }
    return slots;
}

function selectTime(time, element) {
    document.querySelectorAll('.time-slot').forEach(t => t.classList.remove('selected'));
    element.classList.add('selected');
    bookingState.time = time;
    updateSummary();
    document.getElementById('btn-next-2').disabled = false;
}

// ===== ACTUALIZAR ESTADO =====
function updateBookingState(e) {
    const id = e.target.id;
    bookingState[id] = e.target.value;
}

function updateSummary() {
    const service = bookingState.specialist || '-';
    document.getElementById('summary-service').textContent = service;
    document.getElementById('summary-price').textContent = bookingState.price ? `$${bookingState.price}` : '$0';
    document.getElementById('summary-date').textContent = bookingState.date || '-';
    document.getElementById('summary-time').textContent = bookingState.time || '-';
    document.getElementById('summary-total').textContent = bookingState.price ? `$${bookingState.price}` : '$0';
}

// ===== NAVEGACIÓN ENTRE PASOS =====
function goToStep(step) {
    document.querySelectorAll('.booking-section').forEach(s => s.classList.remove('active'));
    document.getElementById(`step-${step}`).classList.add('active');

    if (step === 3) {
        validateStep2();
    }
}

function validateStep2() {
    if (!bookingState.date || !bookingState.time) {
        alert('Por favor selecciona fecha y hora');
        return false;
    }
    return true;
}

// ===== CONFIRMACIÓN =====
function confirmBooking() {
    // Validar
    if (!bookingState.name || !bookingState.email || !bookingState.phone) {
        alert('Por favor completa todos los campos requeridos');
        return;
    }

    if (!document.getElementById('terms').checked) {
        alert('Debes aceptar los términos y condiciones');
        return;
    }

    // Generar código de confirmación
    const confirmationCode = generateConfirmationCode();

    // Guardar reserva
    const reservation = {
        id: confirmationCode,
        center: bookingState.center,
        specialist: bookingState.specialist,
        date: bookingState.date,
        time: bookingState.time,
        name: bookingState.name,
        email: bookingState.email,
        phone: bookingState.phone,
        notes: bookingState.notes,
        price: bookingState.price,
        status: 'confirmed',
        createdAt: new Date().toISOString()
    };

    // Guardar en localStorage
    let reservations = JSON.parse(localStorage.getItem('reservations')) || [];
    reservations.push(reservation);
    localStorage.setItem('reservations', JSON.stringify(reservations));

    // Marcar hora como reservada
    if (!reservedTimes[bookingState.date]) {
        reservedTimes[bookingState.date] = [];
    }
    reservedTimes[bookingState.date].push(bookingState.time);
    localStorage.setItem('reservedTimes', JSON.stringify(reservedTimes));

    // Mostrar confirmación
    showConfirmation(reservation);
}

function generateConfirmationCode() {
    return 'RES-' + Date.now().toString(36).toUpperCase();
}

function showConfirmation(reservation) {
    document.getElementById('conf-service').textContent = reservation.specialist || '-';
    document.getElementById('conf-date').textContent = formatDateDisplay(reservation.date);
    document.getElementById('conf-time').textContent = reservation.time;
    document.getElementById('conf-name').textContent = reservation.name;
    document.getElementById('conf-email').textContent = reservation.email;
    document.getElementById('conf-email-display').textContent = reservation.email;
    document.getElementById('conf-code').textContent = reservation.id;

    goToStep(4);

    // Simular envío de email
    console.log('📧 Email enviado a:', reservation.email);
    console.log('Detalles de la reserva:', reservation);
}

function formatDateDisplay(dateStr) {
    const date = new Date(dateStr + 'T00:00:00');
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
}

// ===== SELECCIONAR ESPECIALIDAD POR DOCTOR =====
function selectDoctorSpecialty(specialty) {
    // Scroll al formulario
    document.getElementById('step-1').scrollIntoView({ behavior: 'smooth' });

    // Seleccionar la especialidad
    document.getElementById('specialist').value = specialty;

    // Validar y actualizar
    validateStep1();

    // Mostrar Step 1
    goToStep(1);
}

// ===== CONFIRMAR POR WHATSAPP =====
function confirmViaWhatsApp() {
    // Validar campos
    if (!bookingState.name || !bookingState.email || !bookingState.phone) {
        alert('Por favor completa todos los campos requeridos');
        return;
    }

    // Construir mensaje
    const message = `Hola, me gustaría confirmar mi cita médica:\n\n` +
        `👤 Nombre: ${bookingState.name}\n` +
        `🏥 Centro: ${bookingState.center}\n` +
        `👨‍⚕️ Especialista: ${bookingState.specialist}\n` +
        `📅 Fecha: ${formatDateDisplay(bookingState.date)}\n` +
        `⏰ Hora: ${bookingState.time}\n` +
        `💰 Precio: $${bookingState.price}\n` +
        `📧 Email: ${bookingState.email}\n` +
        `📱 Teléfono: ${bookingState.phone}\n` +
        (bookingState.notes ? `📝 Notas: ${bookingState.notes}\n` : '') +
        `\nPor favor confirmar mi cita.`;

    // Número de WhatsApp (reemplazar con el real)
    const phoneNumber = '56912345678'; // Formato: país (56) + número sin el 9 inicial
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    // Guardar reserva localmente también
    const confirmationCode = generateConfirmationCode();
    const reservation = {
        id: confirmationCode,
        center: bookingState.center,
        specialist: bookingState.specialist,
        date: bookingState.date,
        time: bookingState.time,
        name: bookingState.name,
        email: bookingState.email,
        phone: bookingState.phone,
        notes: bookingState.notes,
        price: bookingState.price,
        status: 'pending',
        createdAt: new Date().toISOString()
    };

    let reservations = JSON.parse(localStorage.getItem('reservations')) || [];
    reservations.push(reservation);
    localStorage.setItem('reservations', JSON.stringify(reservations));

    // Redirigir a WhatsApp
    window.open(whatsappURL, '_blank');

    // Mostrar confirmación
    setTimeout(() => showConfirmation(reservation), 500);
}
