// assets/js/payment-train.js

document.addEventListener('DOMContentLoaded', function() {

    // --- Dynamic Render Payment ---
    let bookings = JSON.parse(localStorage.getItem('navigo_bookings')) || [];
    // kita belum tau type-nya apa, jadi cari pending terakhir bebas aja atau sesuai file ini.
    // Tapi karena ada spesifik type di script aslinya, kita cari aja pending terakhir.
    const pendingBooking = bookings.reverse().find(b => b.status === 'pending');
    if (pendingBooking && pendingBooking.itemId && typeof PRODUCT_CATALOG !== 'undefined' && PRODUCT_CATALOG[pendingBooking.itemId]) {
        const item = PRODUCT_CATALOG[pendingBooking.itemId];
        const priceEl = document.querySelector('.total-price');
        if (priceEl) priceEl.textContent = 'IDR ' + item.price.toLocaleString('id-ID');
        
        // kalau ada order ID element, kita ganti juga text-nya
        const orderIdEl = document.querySelector('.order-id span');
        if (orderIdEl) orderIdEl.textContent = pendingBooking.bookingId;
    }
    // bookings reverse tadi merubah array in-place, kita kembalikan atau biarkan aja karena gak di-save.
    bookings.reverse(); 
    // -------------------------

    // 1. Logika Accordion untuk Metode Pembayaran
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const parentItem = this.parentElement;
            
            // Tutup semua accordion yang lain
            document.querySelectorAll('.accordion-item').forEach(item => {
                if (item !== parentItem) {
                    item.classList.remove('active');
                }
            });
            
            // Buka/Tutup accordion yang diklik
            parentItem.classList.toggle('active');
        });
    });

    // Pilih otomatis radio button saat row diklik
    const radioLabels = document.querySelectorAll('.radio-label');
    radioLabels.forEach(label => {
        label.addEventListener('click', function() {
            radioLabels.forEach(l => l.style.borderColor = 'var(--border-color)');
            this.style.borderColor = 'var(--primary-blue)';
        });
    });

    // 2. Logika Hitung Mundur (Countdown Timer)
    const timeDisplay = document.getElementById('countdown-timer');
    let totalSeconds = 59 * 60 + 59; // 59 menit 59 detik

    const timer = setInterval(() => {
        if (totalSeconds <= 0) {
            clearInterval(timer);
            timeDisplay.textContent = "00:00:00";
            alert("Waktu pembayaran telah habis. Silakan buat pesanan baru.");
            window.location.href = "../index.html"; 
            return;
        }
        
        totalSeconds--;
        
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        const formattedHours = hours.toString().padStart(2, '0');
        const formattedMinutes = minutes.toString().padStart(2, '0');
        const formattedSeconds = seconds.toString().padStart(2, '0');
        
        if (timeDisplay) timeDisplay.textContent = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    }, 1000);

    // 3. Tombol Bayar
    const btnPay = document.getElementById('btn-pay-now');
    if(btnPay) {
        btnPay.addEventListener('click', function() {
            this.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Memproses...';
            this.style.backgroundColor = '#BDBDBD';
            
            setTimeout(() => {
                // Update order status
                let bookings = JSON.parse(localStorage.getItem('navigo_bookings')) || [];
                // Temukan booking kereta yang masih pending dari orang ini (yang terakhir)
                const pendingIndex = bookings.findLastIndex(b => b.status === 'pending' && b.type === 'train');
                if (pendingIndex !== -1) {
                    bookings[pendingIndex].status = 'success';
                    localStorage.setItem('navigo_bookings', JSON.stringify(bookings));
                }
                
                if (window.addNotification) {
                    window.addNotification("Pembayaran Kereta Berhasil", "Tiket kereta Anda telah dikonfirmasi.", "success");
                }

                window.location.href = 'ticket-train.html';
            }, 2000);
        });
    }

    // 4. Tombol Batalkan
    const btnCancel = document.getElementById('btn-cancel-order');
    if (btnCancel) {
        btnCancel.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm("Yakin ingin membatalkan pesanan kereta ini? Kursi Anda akan kembali tersedia.")) {
                let bookings = JSON.parse(localStorage.getItem('navigo_bookings')) || [];
                const pendingIndex = bookings.findLastIndex(b => b.status === 'pending' && b.type === 'train');
                
                if (pendingIndex !== -1) {
                    bookings[pendingIndex].status = 'cancelled';
                    localStorage.setItem('navigo_bookings', JSON.stringify(bookings));
                }
                
                if (window.addNotification) {
                    window.addNotification("Pesanan Kereta Dibatalkan", "Pesanan tiket kereta telah dibatalkan.", "cancel");
                }

                alert("Pesanan dibatalkan. Mengalihkan ke riwayat pesanan.");
                window.location.href = 'history.html';
            }
        });
    }
});