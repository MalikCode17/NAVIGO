/* assets/js/flight.js */

// File ini dikhususkan untuk menampung logika spesifik halaman pencarian tiket pesawat (index.html)
document.addEventListener('DOMContentLoaded', () => {
    
    // Logika sorting (Urutkan Berdasarkan Harga, Waktu Berangkat, dll)
    const sortSelect = document.querySelector('.flight-sort select');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            const val = this.value;
            const container = document.querySelector('.flight-results');
            const cards = Array.from(container.querySelectorAll('article.flight-card'));
            
            if (val === 'Termurah') {
                cards.sort((a, b) => {
                    let priceA = parseFloat(a.querySelector('.price').getAttribute('data-original-price') || 0);
                    let priceB = parseFloat(b.querySelector('.price').getAttribute('data-original-price') || 0);
                    return priceA - priceB;
                });
            } else if (val === 'Terawal') {
                cards.sort((a, b) => {
                    let timeA = a.querySelector('.departure time').textContent.replace(':', '');
                    let timeB = b.querySelector('.departure time').textContent.replace(':', '');
                    return parseInt(timeA) - parseInt(timeB);
                });
            } else if (val === 'Terakhir') {
                cards.sort((a, b) => {
                    let timeA = a.querySelector('.departure time').textContent.replace(':', '');
                    let timeB = b.querySelector('.departure time').textContent.replace(':', '');
                    return parseInt(timeB) - parseInt(timeA);
                });
            }
            
            // Re-append to DOM in sorted order
            cards.forEach(card => container.appendChild(card));
        });
    }

});
