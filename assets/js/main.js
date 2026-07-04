// assets/js/main.js


const PRODUCT_CATALOG = {
    // Pesawat
    'flight-lion': { title: 'Lion Air (CGK - DPS)', subtitle: 'Ekonomi • Min, 19 Mei 2024', price: 829000, img: 'airline/logo-lion.jpg', type: 'flight', priceDetails: [{name:'Tiket Dewasa (1x)', price: 729000}, {name:'Pajak & Biaya Maskapai', price: 100000}, {name:'Biaya Layanan', price: 0}], route: ['11:25', 'CGK (Jakarta)', '14:20', 'DPS (Bali)'] },
    'flight-batik': { title: 'Batik Air (CGK - DPS)', subtitle: 'Ekonomi • Min, 19 Mei 2024', price: 845000, img: 'airline/logo-batik.jpg', type: 'flight', priceDetails: [{name:'Tiket Dewasa (1x)', price: 720000}, {name:'Pajak & Biaya Maskapai', price: 125000}, {name:'Biaya Layanan', price: 0}], route: ['08:20', 'CGK (Jakarta)', '11:10', 'DPS (Bali)'] },
    'flight-citilink': { title: 'Citilink (CGK - DPS)', subtitle: 'Ekonomi • Min, 19 Mei 2024', price: 879000, img: 'airline/logo-citilink.jpg', type: 'flight', priceDetails: [{name:'Tiket Dewasa (1x)', price: 779000}, {name:'Pajak & Biaya Maskapai', price: 100000}, {name:'Biaya Layanan', price: 0}], route: ['16:30', 'CGK (Jakarta)', '19:15', 'DPS (Bali)'] },
    
    // Hotel
    'hotel-ayana': { title: 'AYANA Resort Bali', subtitle: 'Bintang 5 • Jimbaran, Bali', price: 3850000, img: 'banner/hotel-1.jpg', type: 'hotel', priceDetails: [{name:'1 Kamar x 2 Malam', price: 3500000}, {name:'Pajak & Biaya Pelayanan', price: 350000}], roomType: 'Deluxe Ocean View' },
    'hotel-kayon': { title: 'The Kayon Jungle Resort', subtitle: 'Bintang 5 • Ubud, Bali', price: 4200000, img: 'banner/hotel-2.png', type: 'hotel', priceDetails: [{name:'1 Kamar x 1 Malam', price: 3800000}, {name:'Pajak & Biaya Pelayanan', price: 400000}], roomType: 'Suite Room' },

    // Kereta Api
    'train-argo-eks': { title: 'Argo Parahyangan', subtitle: 'Eksekutif (A) • Rab, 22 Mei 2024', price: 250000, img: 'logo/logo-kai.jpg', type: 'train', priceDetails: [{name:'Tiket Dewasa (1x)', price: 250000}, {name:'Biaya Layanan', price: 0}], route: ['06:30', 'GMR (Gambir)', '09:15', 'BDG (Bandung)'] },
    'train-argo-eko': { title: 'Argo Parahyangan', subtitle: 'Ekonomi (C) • Rab, 22 Mei 2024', price: 150000, img: 'logo/logo-kai.jpg', type: 'train', priceDetails: [{name:'Tiket Dewasa (1x)', price: 150000}, {name:'Biaya Layanan', price: 0}], route: ['06:30', 'GMR (Gambir)', '09:15', 'BDG (Bandung)'] },
    'train-turangga': { title: 'Turangga', subtitle: 'Eksekutif (AA) • Rab, 22 Mei 2024', price: 280000, img: 'logo/logo-kai.jpg', type: 'train', priceDetails: [{name:'Tiket Dewasa (1x)', price: 280000}, {name:'Biaya Layanan', price: 0}], route: ['10:15', 'GMR (Gambir)', '13:00', 'BDG (Bandung)'] },

    // Mobil
    'car-avanza': { title: 'Toyota Avanza atau sejenis', subtitle: 'MPV • Tahun 2020-2023', price: 300000, img: 'banner/car-1.png', type: 'car', priceDetails: [{name:'Sewa 1 Hari', price: 300000}, {name:'Biaya Admin', price: 0}], route: ['Ambil', 'Bandara Ngurah Rai', 'Kembali', 'Bandara Ngurah Rai'] },
    'car-innova': { title: 'Toyota Innova Reborn', subtitle: 'MPV • Tahun 2022-2023', price: 450000, img: 'banner/car-2.png', type: 'car', priceDetails: [{name:'Sewa 1 Hari', price: 450000}, {name:'Biaya Admin', price: 0}], route: ['Ambil', 'Bandara Ngurah Rai', 'Kembali', 'Bandara Ngurah Rai'] },

    // Event
    'event-dufan': { title: 'Dunia Fantasi (Dufan) Ancol', subtitle: 'Taman Hiburan', price: 285000, img: 'banner/event-1.png', type: 'event', priceDetails: [{name:'Tiket Masuk (1x)', price: 256500}, {name:'Pajak Daerah', price: 28500}], route: ['Open', '10:00', 'Close', '18:00'] },
    'event-gwk': { title: 'Garuda Wisnu Kencana (GWK)', subtitle: 'Atraksi Wisata', price: 115000, img: 'banner/event-2.png', type: 'event', priceDetails: [{name:'Tiket Masuk (1x)', price: 103500}, {name:'Pajak Daerah', price: 11500}], route: ['Open', '08:00', 'Close', '20:00'] }
};

document.addEventListener('DOMContentLoaded', function() {
    renderNotifications();
});

// 1. Dropdown Logic
function toggleDropdown(id) {
    document.querySelectorAll('.dropdown-menu').forEach(menu => {
        if(menu.id !== id) menu.classList.remove('show');
    });
    const el = document.getElementById(id);
    if(el) {
        el.classList.toggle('show');
    }
}

// Menutup dropdown jika klik di luar area
document.addEventListener('click', function(e) {
    if (!e.target.closest('.dropdown')) {
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
            menu.classList.remove('show');
        });
    }
});

// Tambahkan toggleDropdown ke window object agar bisa dipanggil inline dari HTML
window.toggleDropdown = toggleDropdown;


// 4. Dynamic Notifications
function renderNotifications() {
    const notifListEl = document.querySelector('#notif-dropdown .notif-list');
    const badgeEl = document.querySelector('.badge');
    if(!notifListEl) return;

    let notifs = JSON.parse(localStorage.getItem('navigo_notifs')) || [];
    
    // Generate default notifs if empty for demo purposes
    if (notifs.length === 0) {
        notifs = [
            { id: 1, title: "Promo Eksklusif", desc: "Dapatkan diskon 20% untuk hotel di Jakarta.", time: "2 jam yang lalu", type: "promo", read: false }
        ];
        localStorage.setItem('navigo_notifs', JSON.stringify(notifs));
    }

    let html = '';
    let unreadCount = 0;

    // Urutkan dari yang terbaru (reverse array)
    const reversedNotifs = [...notifs].reverse();

    reversedNotifs.forEach(n => {
        if (!n.read) unreadCount++;
        let iconHtml = '';
        let colorClass = '';
        
        if (n.type === 'success') {
            iconHtml = '<i class="fa-solid fa-check"></i>';
        } else if (n.type === 'cancel') {
            iconHtml = '<i class="fa-solid fa-xmark"></i>';
            colorClass = 'style="background-color: #FEE2E2; color: #DC2626;"';
        } else {
            iconHtml = '<i class="fa-solid fa-ticket"></i>';
            colorClass = 'style="background-color: #FFF3E0; color: #F59E0B;"';
        }

        html += `
            <div class="notif-item ${!n.read ? 'unread' : ''}">
                <div class="notif-icon" ${colorClass}>${iconHtml}</div>
                <div class="notif-content">
                    <h4>${n.title}</h4>
                    <p>${n.desc}</p>
                    <span class="notif-time">${n.time}</span>
                </div>
            </div>
        `;
    });

    if (reversedNotifs.length === 0) {
        html = '<div style="padding:16px; text-align:center; color:#9CA3AF; font-size:13px;">Belum ada notifikasi</div>';
    }

    notifListEl.innerHTML = html;
    
    if (badgeEl) {
        if (unreadCount > 0) {
            badgeEl.textContent = unreadCount;
            badgeEl.style.display = 'block';
        } else {
            badgeEl.style.display = 'none';
        }
    }
}

window.addNotification = function(title, desc, type) {
    let notifs = JSON.parse(localStorage.getItem('navigo_notifs')) || [];
    notifs.push({
        id: Date.now(),
        title: title,
        desc: desc,
        time: "Baru saja",
        type: type,
        read: false
    });
    localStorage.setItem('navigo_notifs', JSON.stringify(notifs));
    renderNotifications();
};

window.markAllRead = function() {
    let notifs = JSON.parse(localStorage.getItem('navigo_notifs')) || [];
    notifs = notifs.map(n => { n.read = true; return n; });
    localStorage.setItem('navigo_notifs', JSON.stringify(notifs));
    renderNotifications();
};


// 5. Dynamic Ticket/Voucher Rendering
function renderDynamicTicket() {
    const isTicketPage = window.location.pathname.includes('ticket') || window.location.pathname.includes('voucher');
    if (!isTicketPage) return;

    let bookings = JSON.parse(localStorage.getItem('navigo_bookings')) || [];
    // Ambil pesanan sukses terakhir
    const latestBooking = bookings.reverse().find(b => b.status === 'success');
    if (!latestBooking || !latestBooking.itemId) return;

    const item = PRODUCT_CATALOG[latestBooking.itemId];
    if (!item) return;

    // Update Nama Penumpang
    const passengerEls = document.querySelectorAll('.passenger-name-box p, .guest-details p');
    if (passengerEls.length > 0) {
        passengerEls[0].textContent = latestBooking.name.toUpperCase();
    }
    
    // Update KTP / Tipe
    if (passengerEls.length > 1) {
        passengerEls[1].textContent = latestBooking.idNumber || '-';
    }

    // Update Harga / Order ID
    const bookingCode = document.querySelector('.booking-code h3');
    if (bookingCode) bookingCode.textContent = latestBooking.bookingId;

    // Spesifik berdasarkan Tipe
    if (item.type === 'flight' || item.type === 'train') {
        const brandText = document.querySelector('.airline-brand-ticket p');
        const brandImg = document.querySelector('.airline-brand-ticket img');
        if (brandText) brandText.textContent = item.title;
        if (brandImg) brandImg.src = '../assets/img/' + item.img;
        
        const cities = document.querySelectorAll('.ticket-city h2');
        if (cities.length >= 2 && item.route) {
            cities[0].textContent = item.route[1].split(' ')[0]; // GMR
            cities[1].textContent = item.route[3].split(' ')[0]; // SMC
            
            const cityDesc = document.querySelectorAll('.ticket-city p');
            if (cityDesc.length >= 2) {
                cityDesc[0].innerHTML = item.route[1] + '<br>Keberangkatan';
                cityDesc[1].innerHTML = item.route[3] + '<br>Kedatangan';
            }
        }
    } else if (item.type === 'event') {
        const titleEl = document.querySelector('.airline-brand-ticket p');
        if (titleEl) titleEl.textContent = item.title;
        const brandImg = document.querySelector('.airline-brand-ticket img');
        if (brandImg) brandImg.src = '../assets/img/' + item.img;
    } else if (item.type === 'hotel' || item.type === 'car') {
        const titleEl = document.querySelector('.voucher-hotel-details h2');
        if (titleEl) titleEl.textContent = item.title;
        
        const imgEl = document.querySelector('.voucher-hotel-img img');
        if (imgEl) imgEl.src = '../assets/img/' + item.img;
    }
}

// Call on load
document.addEventListener('DOMContentLoaded', function() {
    renderDynamicTicket();
});




// 7. Quick Menu Modal System
function openQmModal(type) {
    const overlay = document.getElementById('qm-modal');
    const title = document.getElementById('qm-modal-title');
    const body = document.getElementById('qm-modal-body');
    
    if (!overlay || !title || !body) return;

    let contentHTML = '';

    switch(type) {
        case 'promo':
            title.textContent = 'Promo Spesial';
            contentHTML = `
                <div class="qm-promo-list">
                    <div class="qm-promo-item">
                        <div class="qm-promo-icon"><i class="fa-solid fa-ticket"></i></div>
                        <div class="qm-promo-text">
                            <h4>Diskon 20% Pengguna Baru</h4>
                            <p>Gunakan kode: NEWUSER20</p>
                        </div>
                    </div>
                    <div class="qm-promo-item">
                        <div class="qm-promo-icon"><i class="fa-solid fa-plane-up"></i></div>
                        <div class="qm-promo-text">
                            <h4>Potongan Tiket Pesawat 50rb</h4>
                            <p>Tanpa minimum transaksi.</p>
                        </div>
                    </div>
                </div>
            `;
            break;
        case 'calendar':
            title.textContent = 'Kalender Harga';
            contentHTML = `
                <div class="qm-dev-mode">
                    <i class="fa-regular fa-calendar-xmark"></i>
                    <p>Fitur kalender tren harga sedang dalam tahap pengembangan. Nantikan pembaruannya!</p>
                </div>
            `;
            break;
        case 'graph':
            title.textContent = 'Grafik Harga';
            contentHTML = `
                <div class="qm-dev-mode">
                    <i class="fa-solid fa-chart-line"></i>
                    <p>Fitur analisis grafik harga sedang dalam tahap pengembangan. Nantikan pembaruannya!</p>
                </div>
            `;
            break;
        case 'checkin':
            title.textContent = 'Check-in Online';
            contentHTML = `
                <div class="qm-form-group">
                    <label>Kode Booking (PNR)</label>
                    <input type="text" placeholder="Contoh: AB12CD">
                </div>
                <div class="qm-form-group">
                    <label>Nama Belakang</label>
                    <input type="text" placeholder="Contoh: Doe">
                </div>
                <button type="button" class="qm-btn-submit" onclick="alert('Kode booking tidak ditemukan atau belum saatnya check-in.')">Lanjut Check-in</button>
            `;
            break;
        case 'baggage':
            title.textContent = 'Informasi Bagasi';
            contentHTML = `
                <table class="qm-table">
                    <tr>
                        <th>Tipe Bagasi</th>
                        <th>Batas Maksimum</th>
                    </tr>
                    <tr>
                        <td>Bagasi Kabin</td>
                        <td>7 Kg (1 pcs)</td>
                    </tr>
                    <tr>
                        <td>Bagasi Tercatat (Pesawat)</td>
                        <td>20 Kg</td>
                    </tr>
                    <tr>
                        <td>Bagasi Kereta Api</td>
                        <td>20 Kg / 100 dm3</td>
                    </tr>
                </table>
                <p style="margin-top: 12px; font-size: 12px; color: #888;">*Kebijakan dapat berbeda tergantung maskapai/operator.</p>
            `;
            break;
        case 'refund':
            title.textContent = 'Prosedur Refund';
            contentHTML = `
                <ul class="qm-refund-steps">
                    <li>
                        <div class="step-number">1</div>
                        <div>Buka <b>Cek Order / Riwayat Pesanan</b>.</div>
                    </li>
                    <li>
                        <div class="step-number">2</div>
                        <div>Pilih pesanan tiket yang masih aktif.</div>
                    </li>
                    <li>
                        <div class="step-number">3</div>
                        <div>Klik tombol <b>Ajukan Pembatalan / Refund</b> dan isi alasannya.</div>
                    </li>
                </ul>
                <p style="margin-top: 12px; font-size: 12px; color: #888;">Dana akan dikembalikan sesuai metode pembayaran awal dalam waktu 7-14 hari kerja.</p>
            `;
            break;
    }

    body.innerHTML = contentHTML;
    overlay.classList.add('active');
}

function closeQmModal() {
    const overlay = document.getElementById('qm-modal');
    if (overlay) {
        overlay.classList.remove('active');
    }
}

// Close when clicking outside modal box
document.addEventListener('click', function(e) {
    const overlay = document.getElementById('qm-modal');
    if (overlay && overlay.classList.contains('active')) {
        // If clicked directly on the overlay background
        if (e.target === overlay) {
            closeQmModal();
        }
    }
});

window.openQmModal = openQmModal;
window.closeQmModal = closeQmModal;

