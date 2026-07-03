// assets/js/checkout-train.js

document.addEventListener('DOMContentLoaded', function() {

    // --- Dynamic Rendering ---
    const urlParams = new URLSearchParams(window.location.search);
    window.currentItemId = urlParams.get('item');
    if (window.currentItemId && typeof PRODUCT_CATALOG !== 'undefined' && PRODUCT_CATALOG[window.currentItemId]) {
        const item = PRODUCT_CATALOG[window.currentItemId];
        
        // Coba ganti elemen di Ringkasan Pesanan jika ada
        const headerImg = document.querySelector('.flight-summary-header img');
        const headerText = document.querySelector('.flight-summary-header div');
        if (headerImg && item.img) headerImg.src = '../assets/img/' + item.img;
        if (headerText) headerText.innerHTML = item.title + '<br><span style="color:var(--text-gray); font-weight:400;">' + item.subtitle + '</span>';
        
        // Ganti harga total
        const totalEl = document.querySelector('.summary-total h3');
        if (totalEl) totalEl.textContent = 'IDR ' + item.price.toLocaleString('id-ID');
        
        // Ganti rute (jika ada)
        const routes = document.querySelectorAll('.route-point');
        if (routes.length >= 2 && item.route && item.route.length >= 4) {
            routes[0].querySelector('h4').textContent = item.route[0];
            routes[0].querySelector('p').textContent = item.route[1];
            routes[1].querySelector('h4').textContent = item.route[2];
            routes[1].querySelector('p').textContent = item.route[3];
        }
        
        // Ganti detail harga (jika mau repot, tapi cukup totalnya saja untuk purwarupa atau update dom summary-item)
        const summaryItems = document.querySelectorAll('.summary-item');
        if (summaryItems.length >= 2 && item.priceDetails) {
            if (summaryItems[0]) {
                summaryItems[0].querySelector('span').textContent = item.priceDetails[0].name;
                summaryItems[0].querySelector('strong').textContent = 'IDR ' + item.priceDetails[0].price.toLocaleString('id-ID');
            }
            if (summaryItems[1] && item.priceDetails[1]) {
                summaryItems[1].querySelector('span').textContent = item.priceDetails[1].name;
                summaryItems[1].querySelector('strong').textContent = 'IDR ' + item.priceDetails[1].price.toLocaleString('id-ID');
            }
        }
    }
    // -------------------------

    // Disable seats that are already taken
    const seatSelect = document.getElementById('seat-number');
    if (seatSelect) {
        let bookings = JSON.parse(localStorage.getItem('navigo_bookings')) || [];
        
        // Cari kursi yang sudah dibooking (pending atau success) di kereta ini
        const takenSeats = bookings
            .filter(b => b.type === 'train' && b.status !== 'cancelled')
            .map(b => b.seatNumber);
            
        Array.from(seatSelect.options).forEach(option => {
            if (takenSeats.includes(option.value)) {
                option.disabled = true;
                option.text += ' (Penuh)';
            }
        });
        
        // Auto-select the first available option
        for (let i = 0; i < seatSelect.options.length; i++) {
            if (!seatSelect.options[i].disabled) {
                seatSelect.selectedIndex = i;
                break;
            }
        }
    }
});

function handleCheckout(event) {
    event.preventDefault();
    
    const passengerName = document.getElementById('passenger-name');
    const idNumber = document.getElementById('id-number');
    const seatSelect = document.getElementById('seat-number');
    
    // Validasi input kosong
    if (!passengerName || !passengerName.value.trim() || !idNumber || !idNumber.value.trim() || !seatSelect || !seatSelect.value) {
        alert("Mohon lengkapi Data Penumpang dan pilih kursi.");
        return;
    }

    const nameVal = passengerName.value.trim().toLowerCase();
    const idVal = idNumber.value.trim();
    const selectedSeat = seatSelect.value;

    let bookings = JSON.parse(localStorage.getItem('navigo_bookings')) || [];
    
    // 1. Validasi Double Booking Penumpang (orang yang sama)
    const isDuplicatePassenger = bookings.some(b => {
        return b.status !== 'cancelled' && 
               b.type === 'train' && 
               b.name.toLowerCase() === nameVal && 
               b.idNumber === idVal;
    });

    if (isDuplicatePassenger) {
        alert("Maaf, penumpang atas nama '" + passengerName.value + "' sudah didaftarkan pada kereta ini.");
        return;
    }
    
    // 2. Validasi Kursi Ganda (jika kebetulan di-bypass dari dropdown)
    const isDuplicateSeat = bookings.some(b => {
        return b.status !== 'cancelled' && 
               b.type === 'train' && 
               b.seatNumber === selectedSeat;
    });

    if (isDuplicateSeat) {
        alert("Maaf, kursi " + selectedSeat + " sudah tidak tersedia.");
        return;
    }

    // Jika aman, buat pesanan dengan status 'pending'
    const newBooking = {
        bookingId: 'KAI-' + Date.now(),
        name: passengerName.value,
        idNumber: idVal,
        seatNumber: selectedSeat,
        itemId: window.currentItemId,
        status: 'pending', // pending, success, cancelled
        type: 'train',
        date: new Date().toISOString()
    };

    bookings.push(newBooking);
    localStorage.setItem('navigo_bookings', JSON.stringify(bookings));

    // Lanjut ke payment
    window.location.href = 'payment-train.html';
}