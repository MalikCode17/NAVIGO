// assets/js/checkout-car.js

function handleCheckout(event) {
    event.preventDefault();
    
    const driverName = document.getElementById('driver-name');
    const simNumber = document.getElementById('id-number');
    const rentalType = document.getElementById('rental-type'); // lepas_kunci or dengan_sopir
    
    // Validasi input kosong
    if (!driverName || !driverName.value.trim() || !simNumber || !simNumber.value.trim()) {
        alert("Mohon lengkapi Data Pengemudi.");
        return;
    }

    let bookings = JSON.parse(localStorage.getItem('navigo_bookings')) || [];
    
    // Tidak ada validasi double booking untuk mobil, karena boleh sewa banyak mobil
    
    const newBooking = {
        bookingId: 'CAR-' + Date.now(),
        name: driverName.value.trim(),
        idNumber: simNumber.value.trim(),
        rentalType: rentalType.value,
        itemId: window.currentItemId,
        status: 'pending', 
        type: 'car',
        date: new Date().toISOString()
    };

    bookings.push(newBooking);
    localStorage.setItem('navigo_bookings', JSON.stringify(bookings));

    window.location.href = 'payment-car.html';
}
