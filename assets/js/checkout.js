// assets/js/checkout.js

function handleCheckout(event) {
    event.preventDefault();
    
    const passengerName = document.getElementById('passenger-name');
    const idNumber = document.getElementById('id-number');
    
    // Validasi input kosong
    if (!passengerName || !passengerName.value.trim() || !idNumber || !idNumber.value.trim()) {
        alert("Mohon lengkapi Data Penumpang terlebih dahulu.");
        return;
    }

    const nameVal = passengerName.value.trim().toLowerCase();
    const idVal = idNumber.value.trim();

    // Cek di localStorage apakah sudah ada pesanan aktif dengan nama/identitas ini
    let bookings = JSON.parse(localStorage.getItem('navigo_bookings')) || [];
    
    const isDuplicate = bookings.some(b => {
        return b.status !== 'cancelled' && 
               b.name.toLowerCase() === nameVal && 
               b.idNumber === idVal;
    });

    if (isDuplicate) {
        alert("Maaf, penumpang atas nama '" + passengerName.value + "' dengan nomor identitas tersebut sudah terdaftar pada armada/kursi ini. Silakan gunakan identitas lain atau batalkan pesanan sebelumnya.");
        return;
    }

    // Jika aman, buat pesanan dengan status 'pending'
    const newBooking = {
        bookingId: 'BKG-' + Date.now(),
        name: passengerName.value,
        idNumber: idVal,
        itemId: window.currentItemId,
        status: 'pending', // pending, success, cancelled
        type: 'flight', // pesawat/kereta
        date: new Date().toISOString()
    };

    bookings.push(newBooking);
    localStorage.setItem('navigo_bookings', JSON.stringify(bookings));

    // Lanjut ke payment
    window.location.href = 'payment.html';
}