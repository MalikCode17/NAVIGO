// assets/js/checkout-event.js

function handleCheckout(event) {
    event.preventDefault();
    
    const visitorName = document.getElementById('passenger-name'); // still using passenger-name ID in HTML, but labeled as Pengunjung
    const idNumber = document.getElementById('id-number');
    const ticketCount = document.getElementById('ticket-count'); 
    
    if (!visitorName || !visitorName.value.trim() || !idNumber || !idNumber.value.trim()) {
        alert("Mohon lengkapi Data Pengunjung.");
        return;
    }

    let bookings = JSON.parse(localStorage.getItem('navigo_bookings')) || [];
    
    const newBooking = {
        bookingId: 'EVT-' + Date.now(),
        name: visitorName.value.trim(),
        idNumber: idNumber.value.trim(),
        ticketCount: ticketCount.value,
        itemId: window.currentItemId,
        status: 'pending', 
        type: 'event',
        date: new Date().toISOString()
    };

    bookings.push(newBooking);
    localStorage.setItem('navigo_bookings', JSON.stringify(bookings));

    window.location.href = 'payment-event.html';
}
