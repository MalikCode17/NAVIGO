// assets/js/checkout-hotel.js

function handleCheckout(event) {
    event.preventDefault();
    
    const passengerName = document.getElementById('passenger-name');
    const idNumber = document.getElementById('id-number');
    const specialRequest = document.getElementById('special-request') ? document.getElementById('special-request').value : '';
    
    // Validasi input kosong
    if (!passengerName || !passengerName.value.trim() || !idNumber || !idNumber.value.trim()) {
        alert("Mohon lengkapi Data Tamu terlebih dahulu.");
        return;
    }

    const nameVal = passengerName.value.trim().toLowerCase();
    const idVal = idNumber.value.trim();

    // Cek di localStorage apakah sudah ada pesanan aktif dengan nama/identitas ini untuk hotel
    let bookings = JSON.parse(localStorage.getItem('navigo_bookings')) || [];
    
    const isDuplicate = bookings.some(b => {
        // Cek double booking dengan orang yang persis sama
        return b.status !== 'cancelled' && 
               b.type === 'hotel' && 
               b.name.toLowerCase() === nameVal && 
               b.idNumber === idVal;
    });

    if (isDuplicate) {
        alert("Maaf, tamu atas nama '" + passengerName.value + "' dengan nomor identitas tersebut sudah terdaftar pada pemesanan hotel ini. Silakan gunakan identitas tamu lain.");
        return;
    }

    // Jika aman, buat pesanan dengan status 'pending'
    const newBooking = {
        bookingId: 'HTL-' + Date.now(),
        name: passengerName.value,
        idNumber: idVal,
        specialRequest: specialRequest,
        itemId: window.currentItemId,
        status: 'pending', // pending, success, cancelled
        type: 'hotel',
        date: new Date().toISOString()
    };

    bookings.push(newBooking);
    localStorage.setItem('navigo_bookings', JSON.stringify(bookings));

    // Lanjut ke payment
    window.location.href = 'payment-hotel.html';
}
