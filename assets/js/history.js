// assets/js/history.js

document.addEventListener('DOMContentLoaded', function() {
    renderHistory();
});

function renderHistory() {
    const historyContainer = document.querySelector('.history-main');
    if (!historyContainer) return;

    // Clear existing cards (except header and tabs)
    const cards = historyContainer.querySelectorAll('.history-card, .history-empty');
    cards.forEach(card => card.remove());

    let bookings = JSON.parse(localStorage.getItem('navigo_bookings')) || [];

    if (bookings.length === 0) {
        historyContainer.insertAdjacentHTML('beforeend', `
            <div class="history-empty">
                <h3>Belum ada riwayat pesanan</h3>
                <p>Yuk, mulai cari tiket dan rencanakan perjalanan Anda sekarang!</p>
                <a href="../index.html" class="btn-history">Cari Tiket</a>
            </div>
        `);
        return;
    }

    // Sort by newest first
    bookings.reverse().forEach((b, index) => {
        const originalIndex = bookings.length - 1 - index; // because we reversed it
        
        let statusHtml = '';
        let actionHtml = '';
        let iconHtml = '';
        let titleHtml = '';
        let detailHtml = '';
        let priceHtml = '';
        let btnTicketHtml = '';
        let btnPayHtml = '';
        
        if (b.type === 'hotel') {
            iconHtml = '<i class="fa-solid fa-bed"></i>';
            titleHtml = 'AYANA Resort Bali';
            detailHtml = `Deluxe Ocean View (1 Kamar, 2 Malam)<br>15 Mei - 17 Mei 2024<br>Tamu: ${b.name}`;
            priceHtml = 'IDR 3.850.000';
            btnTicketHtml = `<a href="voucher-hotel.html" class="btn-history btn-history-outline">Lihat E-Voucher</a>`;
            btnPayHtml = `<a href="payment-hotel.html" class="btn-history" style="margin-bottom:8px;">Lanjutkan Pembayaran</a>`;
        } else if (b.type === 'train') {
            iconHtml = '<i class="fa-solid fa-train"></i>';
            titleHtml = 'Argo Bromo Anggrek (GMR - SMC)';
            detailHtml = `Eksekutif (AA)<br>22 Mei 2024, 08:20 WIB<br>Penumpang: ${b.name}`;
            priceHtml = 'IDR 250.000';
            btnTicketHtml = `<a href="ticket-train.html" class="btn-history btn-history-outline">Lihat Boarding Pass</a>`;
            btnPayHtml = `<a href="payment-train.html" class="btn-history" style="margin-bottom:8px;">Lanjutkan Pembayaran</a>`;
        } else if (b.type === 'car') {
            iconHtml = '<i class="fa-solid fa-car"></i>';
            titleHtml = 'Toyota Avanza (Bali)';
            let typeStr = b.rentalType === 'lepas_kunci' ? 'Lepas Kunci' : 'Dengan Sopir';
            detailHtml = `MPV • 24 Mei 2024<br>Sewa 1 Hari (${typeStr})<br>Pengemudi: ${b.name}`;
            priceHtml = 'IDR 300.000';
            btnTicketHtml = `<a href="voucher-car.html" class="btn-history btn-history-outline">Lihat E-Voucher</a>`;
            btnPayHtml = `<a href="payment-car.html" class="btn-history" style="margin-bottom:8px;">Lanjutkan Pembayaran</a>`;
        } else if (b.type === 'event') {
            iconHtml = '<i class="fa-solid fa-ticket-simple"></i>';
            titleHtml = 'Dunia Fantasi (Dufan)';
            detailHtml = `Taman Hiburan • 26 Mei 2024<br>Masuk: 10:00 WIB<br>Atas Nama: ${b.name} (${b.ticketCount} Tiket)`;
            priceHtml = 'IDR 313.500';
            btnTicketHtml = `<a href="voucher-event.html" class="btn-history btn-history-outline">Lihat E-Ticket</a>`;
            btnPayHtml = `<a href="payment-event.html" class="btn-history" style="margin-bottom:8px;">Lanjutkan Pembayaran</a>`;
        } else {
            iconHtml = '<i class="fa-solid fa-plane"></i>';
            titleHtml = 'Penerbangan ke Bali (DPS)';
            detailHtml = `Batik Air (CGK - DPS) • Ekonomi<br>19 Mei 2024, 08:20 WIB<br>Penumpang: ${b.name}`;
            priceHtml = 'IDR 1.375.000';
            btnTicketHtml = `<a href="ticket.html" class="btn-history btn-history-outline">Lihat E-Ticket</a>`;
            btnPayHtml = `<a href="payment.html" class="btn-history" style="margin-bottom:8px;">Lanjutkan Pembayaran</a>`;
        }

        
        // --- Dynamic Catalog Overlay ---
        if (b.itemId && typeof PRODUCT_CATALOG !== 'undefined' && PRODUCT_CATALOG[b.itemId]) {
            const item = PRODUCT_CATALOG[b.itemId];
            if (item.type === 'flight') {
                titleHtml = item.title;
                detailHtml = `${item.subtitle}<br>Penumpang: ${b.name}`;
                priceHtml = 'IDR ' + item.price.toLocaleString('id-ID');
            } else if (item.type === 'hotel') {
                titleHtml = item.title;
                detailHtml = `${item.roomType}<br>${item.subtitle}<br>Tamu: ${b.name}`;
                priceHtml = 'IDR ' + item.price.toLocaleString('id-ID');
            } else if (item.type === 'train') {
                titleHtml = item.title;
                detailHtml = `${item.subtitle}<br>Penumpang: ${b.name}`;
                priceHtml = 'IDR ' + item.price.toLocaleString('id-ID');
            } else if (item.type === 'car') {
                titleHtml = item.title;
                let typeStr = b.rentalType === 'lepas_kunci' ? 'Lepas Kunci' : 'Dengan Sopir';
                detailHtml = `${item.subtitle}<br>Sewa (${typeStr})<br>Pengemudi: ${b.name}`;
                priceHtml = 'IDR ' + item.price.toLocaleString('id-ID');
            } else if (item.type === 'event') {
                titleHtml = item.title;
                detailHtml = `${item.subtitle}<br>Atas Nama: ${b.name} (${b.ticketCount || 1} Tiket)`;
                priceHtml = 'IDR ' + item.price.toLocaleString('id-ID');
            }
        }
        // -------------------------

        if (b.status === 'success') {
            let statusText = 'E-Ticket Terbit';
            if (b.type === 'hotel') statusText = 'Voucher Terbit';
            if (b.type === 'train') statusText = 'Boarding Pass Terbit';
            if (b.type === 'car') statusText = 'Voucher Rental Terbit';
            if (b.type === 'event') statusText = 'E-Ticket Acara Terbit';
            statusHtml = `<div class="history-status status-success"><i class="fa-solid fa-check"></i> ${statusText}</div>`;
            actionHtml = btnTicketHtml;
        } else if (b.status === 'pending') {
            statusHtml = `<div class="history-status status-pending"><i class="fa-regular fa-clock"></i> Menunggu Pembayaran</div>`;
            actionHtml = `
                ${btnPayHtml}
                <button onclick="cancelBooking(${originalIndex})" class="btn-history btn-history-outline" style="border-color:var(--danger-red); color:var(--danger-red);">Batalkan</button>
            `;
        } else if (b.status === 'cancelled') {
            statusHtml = `<div class="history-status" style="background-color:#FEE2E2; color:#DC2626;"><i class="fa-solid fa-xmark"></i> Dibatalkan</div>`;
            let rebookUrl = '../index.html';
            if(b.type === 'hotel') rebookUrl = 'hotel.html';
            if(b.type === 'train') rebookUrl = 'kereta.html';
            if(b.type === 'car') rebookUrl = 'mobil.html';
            if(b.type === 'event') rebookUrl = 'entertainment.html';
            
            actionHtml = `
                <button onclick="deleteHistory(${originalIndex})" class="btn-history btn-history-outline" style="border-color:var(--text-gray); color:var(--text-gray);">Hapus Catatan</button>
                <a href="${rebookUrl}" class="btn-history" style="margin-top:8px;">Pesan Ulang</a>
            `;
        }

        const dateStr = new Date(b.date).toLocaleString('id-ID', {
            day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
        }) + ' WIB';

        const cardHtml = `
            <article class="history-card">
                <div class="history-card-header">
                    <div class="history-date">Pesanan: ${b.bookingId} <span>(${dateStr})</span></div>
                    ${statusHtml}
                </div>
                
                <div class="history-card-body">
                    <div class="history-icon-box">
                        ${iconHtml}
                    </div>
                    <div class="history-details">
                        <h4>${titleHtml}</h4>
                        <p>${detailHtml}</p>
                    </div>
                    <div class="history-price-action">
                        <p>Total Harga</p>
                        <h3 style="color: var(--text-dark);">${priceHtml}</h3>
                        <div style="display:flex; flex-direction:column;">
                            ${actionHtml}
                        </div>
                    </div>
                </div>
            </article>
        `;

        historyContainer.insertAdjacentHTML('beforeend', cardHtml);
    });
}

window.cancelBooking = function(index) {
    if(confirm("Yakin ingin membatalkan pesanan ini?")) {
        let bookings = JSON.parse(localStorage.getItem('navigo_bookings')) || [];
        bookings[index].status = 'cancelled';
        localStorage.setItem('navigo_bookings', JSON.stringify(bookings));
        
        if (window.addNotification) {
            window.addNotification("Pesanan Dibatalkan", "Pesanan " + bookings[index].bookingId + " telah dibatalkan.", "cancel");
        }
        
        renderHistory();
    }
};

window.deleteHistory = function(index) {
    if(confirm("Hapus catatan pesanan ini dari riwayat?")) {
        let bookings = JSON.parse(localStorage.getItem('navigo_bookings')) || [];
        bookings.splice(index, 1);
        localStorage.setItem('navigo_bookings', JSON.stringify(bookings));
        renderHistory();
    }
};
