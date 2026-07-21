// ===== INICIALIZACIÓN =====
let reservations = JSON.parse(localStorage.getItem('reservations')) || [];
let filteredReservations = [...reservations];

document.addEventListener('DOMContentLoaded', () => {
    renderTable();
    updateStats();
});

// ===== RENDERIZAR TABLA =====
function renderTable() {
    const tableBody = document.getElementById('table-body');
    const emptyState = document.getElementById('empty-state');

    if (filteredReservations.length === 0) {
        tableBody.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }

    emptyState.style.display = 'none';
    tableBody.innerHTML = '';

    // Ordenar por fecha (más recientes primero)
    const sorted = [...filteredReservations].sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
    });

    sorted.forEach(reservation => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${reservation.id}</strong></td>
            <td>${reservation.name}</td>
            <td>${reservation.service}</td>
            <td>${formatDateDisplay(reservation.date)}</td>
            <td>${reservation.time}</td>
            <td>$${reservation.price.toFixed(2)}</td>
            <td>
                <span class="status-badge status-${reservation.status}">
                    ${getStatusLabel(reservation.status)}
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn-small btn-view" onclick="viewDetails('${reservation.id}')">Ver</button>
                    ${reservation.status === 'confirmed' ? `
                        <button class="btn-small btn-complete" onclick="completeReservation('${reservation.id}')">✓ Completar</button>
                        <button class="btn-small btn-cancel" onclick="cancelReservation('${reservation.id}')">✗ Cancelar</button>
                    ` : ''}
                    <button class="btn-small btn-cancel" onclick="deleteReservation('${reservation.id}')">🗑️ Eliminar</button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function getStatusLabel(status) {
    const labels = {
        'confirmed': '⏳ Confirmada',
        'completed': '✓ Completada',
        'cancelled': '✗ Cancelada'
    };
    return labels[status] || status;
}

function formatDateDisplay(dateStr) {
    const date = new Date(dateStr + 'T00:00:00');
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
}

// ===== ESTADÍSTICAS =====
function updateStats() {
    const total = reservations.length;
    const confirmed = reservations.filter(r => r.status === 'confirmed').length;
    const completed = reservations.filter(r => r.status === 'completed').length;
    const revenue = reservations.reduce((sum, r) => sum + (r.price || 0), 0);

    document.getElementById('total-reservations').textContent = total;
    document.getElementById('pending-reservations').textContent = confirmed;
    document.getElementById('completed-reservations').textContent = completed;
    document.getElementById('total-revenue').textContent = `$${revenue.toFixed(2)}`;
}

// ===== FILTROS =====
function filterReservations() {
    const statusFilter = document.getElementById('filter-status').value;
    const serviceFilter = document.getElementById('filter-service').value;

    filteredReservations = reservations.filter(r => {
        const matchStatus = !statusFilter || r.status === statusFilter;
        const matchService = !serviceFilter || r.service === serviceFilter;
        return matchStatus && matchService;
    });

    renderTable();
}

// ===== ACCIONES =====
function viewDetails(id) {
    const reservation = reservations.find(r => r.id === id);
    if (!reservation) return;

    document.getElementById('modal-code').textContent = reservation.id;
    document.getElementById('modal-name').textContent = reservation.name;
    document.getElementById('modal-email').textContent = reservation.email;
    document.getElementById('modal-phone').textContent = reservation.phone;
    document.getElementById('modal-service').textContent = reservation.service;
    document.getElementById('modal-datetime').textContent =
        `${formatDateDisplay(reservation.date)} a las ${reservation.time}`;
    document.getElementById('modal-price').textContent = `$${reservation.price.toFixed(2)}`;
    document.getElementById('modal-notes').textContent = reservation.notes || 'Sin notas';
    document.getElementById('modal-created').textContent =
        new Date(reservation.createdAt).toLocaleString('es-ES');

    document.getElementById('detail-modal').classList.add('active');
}

function closeModal() {
    document.getElementById('detail-modal').classList.remove('active');
}

function completeReservation(id) {
    const reservation = reservations.find(r => r.id === id);
    if (reservation) {
        reservation.status = 'completed';
        localStorage.setItem('reservations', JSON.stringify(reservations));
        filterReservations();
        updateStats();
        alert('✓ Reserva marcada como completada');
    }
}

function cancelReservation(id) {
    if (!confirm('¿Seguro que deseas cancelar esta reserva?')) return;

    const reservation = reservations.find(r => r.id === id);
    if (reservation) {
        reservation.status = 'cancelled';

        // Liberar el horario
        const reserved = JSON.parse(localStorage.getItem('reservedTimes')) || {};
        if (reserved[reservation.date]) {
            reserved[reservation.date] = reserved[reservation.date].filter(t => t !== reservation.time);
            localStorage.setItem('reservedTimes', JSON.stringify(reserved));
        }

        localStorage.setItem('reservations', JSON.stringify(reservations));
        filterReservations();
        updateStats();
        alert('✗ Reserva cancelada');
    }
}

function deleteReservation(id) {
    if (!confirm('¿Estás seguro? Esta acción no se puede deshacer.')) return;

    const index = reservations.findIndex(r => r.id === id);
    if (index > -1) {
        const reservation = reservations[index];

        // Liberar el horario
        const reserved = JSON.parse(localStorage.getItem('reservedTimes')) || {};
        if (reserved[reservation.date]) {
            reserved[reservation.date] = reserved[reservation.date].filter(t => t !== reservation.time);
            localStorage.setItem('reservedTimes', JSON.stringify(reserved));
        }

        reservations.splice(index, 1);
        localStorage.setItem('reservations', JSON.stringify(reservations));
        filterReservations();
        updateStats();
        alert('🗑️ Reserva eliminada');
    }
}

// ===== EXPORTAR CSV =====
function exportReservations() {
    if (filteredReservations.length === 0) {
        alert('No hay reservas para exportar');
        return;
    }

    let csv = 'Código,Cliente,Email,Teléfono,Servicio,Fecha,Hora,Precio,Estado,Notas\n';

    filteredReservations.forEach(r => {
        const notes = (r.notes || '').replace(/,/g, ';').replace(/"/g, '""');
        csv += `${r.id},"${r.name}","${r.email}","${r.phone}","${r.service}",${r.date},${r.time},$${r.price},${r.status},"${notes}"\n`;
    });

    // Descargar
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reservas-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    alert('✓ Archivo descargado: reservas-' + new Date().toISOString().split('T')[0] + '.csv');
}

// Cerrar modal al hacer click afuera
document.addEventListener('click', (e) => {
    const modal = document.getElementById('detail-modal');
    if (e.target === modal) {
        closeModal();
    }
});
