// assets/js/payment.js

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
            // Hapus border aktif dari semua label
            radioLabels.forEach(l => l.style.borderColor = 'var(--border-color)');
            
            // Beri warna border aktif ke yang diklik
            this.style.borderColor = 'var(--primary-blue)';
        });
    });

    // 2. Logika Hitung Mundur (Countdown Timer)
    // Mensimulasikan batas waktu bayar (misal 59 menit 59 detik)
    const timeDisplay = document.getElementById('countdown-timer');
    let totalSeconds = 59 * 60 + 59; // 59 menit 59 detik

    const timer = setInterval(() => {
        if (totalSeconds <= 0) {
            clearInterval(timer);
            timeDisplay.textContent = "00:00:00";
            alert("Waktu pembayaran telah habis. Silakan buat pesanan baru.");
            window.location.href = "../index.html"; // Kembali ke beranda
            return;
        }
        
        totalSeconds--;
        
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        const formattedHours = hours.toString().padStart(2, '0');
        const formattedMinutes = minutes.toString().padStart(2, '0');
        const formattedSeconds = seconds.toString().padStart(2, '0');
        
        timeDisplay.textContent = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    }, 1000);

    // 3. Tombol Bayar
    const btnPay = document.getElementById('btn-pay-now');
    if(btnPay) {
        btnPay.addEventListener('click', function() {
            // Ubah text tombol menjadi loading
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Memproses...';
            this.style.backgroundColor = '#BDBDBD'; // Warna abu loading
            
            // Simulasi delay pembayaran 2 detik
            setTimeout(() => {
                // Update order status
                let bookings = JSON.parse(localStorage.getItem('navigo_bookings')) || [];
                if(bookings.length > 0) {
                    bookings[bookings.length - 1].status = 'success';
                    localStorage.setItem('navigo_bookings', JSON.stringify(bookings));
                }

                // Add success notification
                if (window.addNotification) {
                    window.addNotification("Pembayaran Berhasil", "Pesanan tiket Anda telah lunas dan e-ticket telah diterbitkan.", "success");
                }

                window.location.href = 'ticket.html'; // Pindah ke halaman E-ticket
            }, 2000);
        });
    }

    // 4. Tombol Batalkan Pesanan (if exists)
    const btnCancel = document.getElementById('btn-cancel-order');
    if (btnCancel) {
        btnCancel.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm("Yakin ingin membatalkan pesanan ini?")) {
                let bookings = JSON.parse(localStorage.getItem('navigo_bookings')) || [];
                if(bookings.length > 0) {
                    bookings[bookings.length - 1].status = 'cancelled';
                    localStorage.setItem('navigo_bookings', JSON.stringify(bookings));
                }
                
                if (window.addNotification) {
                    window.addNotification("Pesanan Dibatalkan", "Pesanan tiket telah berhasil dibatalkan. Anda bisa memesan ulang.", "cancel");
                }

                alert("Pesanan dibatalkan. Mengalihkan ke riwayat pesanan.");
                window.location.href = 'history.html';
            }
        });
    }
});
