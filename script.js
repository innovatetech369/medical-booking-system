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
    attachEventListeners();
    initializeCalendar();
});

// ===== NAVBAR FUNCTIONS =====
function showAboutUs() {
    // Hide booking wrapper and show about us
    document.querySelector('.booking-wrapper').style.display = 'none';
    document.querySelector('.doctors-section').style.display = 'none';
    document.querySelector('.booking-summary').style.display = 'none';
    document.getElementById('about-us-section').style.display = 'block';

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function backToBooking() {
    // Show booking wrapper and hide about us
    document.querySelector('.booking-wrapper').style.display = 'block';
    document.querySelector('.doctors-section').style.display = 'block';
    document.querySelector('.booking-summary').style.display = 'block';
    document.getElementById('about-us-section').style.display = 'none';

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showMyBookings() {
    // Get bookings from localStorage
    const reservations = JSON.parse(localStorage.getItem('reservations')) || [];

    if (reservations.length === 0) {
        alert('You have no appointments scheduled yet.');
        return;
    }

    // Create bookings list
    let bookingsList = '📅 MY APPOINTMENTS\n\n';
    reservations.forEach((res, index) => {
        bookingsList += `${index + 1}. ${res.specialist || res.service}\n`;
        bookingsList += `   Date: ${res.date}\n`;
        bookingsList += `   Time: ${res.time}\n`;
        bookingsList += `   Code: ${res.id}\n`;
        bookingsList += `   Status: ${res.status}\n\n`;
    });

    alert(bookingsList);
}

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

    // Formulario
    document.getElementById('name').addEventListener('input', updateBookingState);
    document.getElementById('email').addEventListener('input', updateBookingState);
    document.getElementById('phone').addEventListener('input', updateBookingState);
    document.getElementById('notes').addEventListener('input', updateBookingState);
}

function validateStep1() {
    const centerElement = document.getElementById('center');
    const specialistElement = document.getElementById('specialist');
    const button = document.getElementById('btn-next-1');

    const center = centerElement.value;
    const specialist = specialistElement.value;

    if (center && specialist) {
        bookingState.center = center;
        bookingState.specialist = specialist;

        // Get specialist price
        const selectedOption = specialistElement.options[specialistElement.selectedIndex];
        bookingState.price = parseFloat(selectedOption.dataset.price) || 80;

        button.disabled = false;
    } else {
        button.disabled = true;
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
    // Los elementos del resumen fueron reemplazados por horarios
    // Solo actualizar si existen para no causar errores
    const summaryService = document.getElementById('summary-service');
    const summaryPrice = document.getElementById('summary-price');
    const summaryDate = document.getElementById('summary-date');
    const summaryTime = document.getElementById('summary-time');
    const summaryTotal = document.getElementById('summary-total');

    if (summaryService) summaryService.textContent = bookingState.specialist || '-';
    if (summaryPrice) summaryPrice.textContent = bookingState.price ? `$${bookingState.price}` : '$0';
    if (summaryDate) summaryDate.textContent = bookingState.date || '-';
    if (summaryTime) summaryTime.textContent = bookingState.time || '-';
    if (summaryTotal) summaryTotal.textContent = bookingState.price ? `$${bookingState.price}` : '$0';
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
        alert('Please select a date and time');
        return false;
    }
    return true;
}

// ===== CONFIRMACIÓN =====
function confirmBooking() {
    console.log('confirmBooking called, bookingState:', bookingState);

    // Validate
    if (!bookingState.name || !bookingState.email || !bookingState.phone) {
        console.log('Missing fields - name:', bookingState.name, 'email:', bookingState.email, 'phone:', bookingState.phone);
        alert('Please complete all required fields');
        return;
    }

    if (!document.getElementById('terms').checked) {
        console.log('Terms not checked');
        alert('You must accept the terms and conditions');
        return;
    }

    console.log('Validation passed, creating reservation...');

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

    // Enviar email con EmailJS
    sendConfirmationEmail(reservation);

    // Mostrar confirmación
    showConfirmation(reservation);
}

// ===== ENVIAR EMAIL CON EMAILJS =====
function sendConfirmationEmail(reservation) {
    const templateParams = {
        name: reservation.name,
        center: reservation.center,
        specialist: reservation.specialist,
        date: formatDateDisplay(reservation.date),
        time: reservation.time,
        price: reservation.price,
        confirmationCode: reservation.id,
        email: reservation.email
    };

    console.log('Sending email with parameters:', templateParams);

    emailjs.send('service_vyagmxd', 'template_6zkb959', templateParams)
        .then(function(response) {
            console.log('✅ Email sent successfully:', response);
            alert('✅ Confirmation email sent to ' + reservation.email);
        }, function(error) {
            console.log('❌ Error sending email:', error);
            alert('⚠️ Appointment confirmed but there was an error sending the email. You can check it later.');
        });
}

function generateConfirmationCode() {
    return 'RES-' + Date.now().toString(36).toUpperCase();
}

function showConfirmation(reservation) {
    console.log('showConfirmation called with:', reservation);
    document.getElementById('conf-service').textContent = reservation.specialist || '-';
    document.getElementById('conf-date').textContent = formatDateDisplay(reservation.date);
    document.getElementById('conf-time').textContent = reservation.time;
    document.getElementById('conf-name').textContent = reservation.name;
    document.getElementById('conf-email').textContent = reservation.email;
    document.getElementById('conf-email-display').textContent = reservation.email;
    document.getElementById('conf-code').textContent = reservation.id;

    goToStep(4);
    console.log('✅ Confirmation page displayed');

    // Simulate email sending
    console.log('📧 Email sent to:', reservation.email);
    console.log('Booking details:', reservation);
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

// ===== CONFIRM VIA WHATSAPP =====
function confirmViaWhatsApp() {
    // Validate fields
    if (!bookingState.name || !bookingState.email || !bookingState.phone) {
        alert('Please complete all required fields');
        return;
    }

    // Build message
    const message = `Hello, I would like to confirm my medical appointment:\n\n` +
        `👤 Name: ${bookingState.name}\n` +
        `🏥 Center: ${bookingState.center}\n` +
        `👨‍⚕️ Specialist: ${bookingState.specialist}\n` +
        `📅 Date: ${formatDateDisplay(bookingState.date)}\n` +
        `⏰ Time: ${bookingState.time}\n` +
        `💰 Price: $${bookingState.price}\n` +
        `📧 Email: ${bookingState.email}\n` +
        `📱 Phone: ${bookingState.phone}\n` +
        (bookingState.notes ? `📝 Notes: ${bookingState.notes}\n` : '') +
        `\nPlease confirm my appointment.`;

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

    // Enviar email con EmailJS
    sendConfirmationEmail(reservation);

    // Redirigir a WhatsApp
    window.open(whatsappURL, '_blank');

    // Mostrar confirmación
    setTimeout(() => showConfirmation(reservation), 500);
}
