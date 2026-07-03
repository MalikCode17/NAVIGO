// assets/js/search.js

document.addEventListener('DOMContentLoaded', () => {
    // Fungsi Swap (Tukar) Lokasi
    const swapBtn = document.getElementById('swap-location');
    
    if (swapBtn) {
        swapBtn.addEventListener('click', () => {
            // Karena kita ubah div statis menjadi input native
            const locations = document.querySelectorAll('.location-group .field-item');
            
            if (locations.length >= 2) {
                const fromInput = locations[0].querySelector('input');
                const toInput = locations[1].querySelector('input');
                
                if (fromInput && toInput) {
                    const tempVal = fromInput.value;
                    fromInput.value = toInput.value;
                    toInput.value = tempVal;
                    
                    // Efek animasi putar (rotate) pada tombol
                    swapBtn.style.transform = swapBtn.style.transform === 'rotate(180deg)' ? 'rotate(0deg)' : 'rotate(180deg)';
                    swapBtn.style.transition = 'transform 0.3s ease';
                }
            }
        });
    }

    // Fungsi Animasi Loading Pencarian
    const searchForm = document.getElementById('flight-search-form') || document.querySelector('.search-box form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Mencegah reload halaman
            
            const submitBtn = this.querySelector('button[type="submit"]');
            if (!submitBtn) return;
            
            const originalText = submitBtn.innerHTML;
            
            // Tampilkan animasi loading
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Mencari...';
            submitBtn.style.opacity = '0.8';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                // Kembalikan teks asli
                submitBtn.innerHTML = originalText;
                submitBtn.style.opacity = '1';
                submitBtn.disabled = false;
                
                // Cari container list (id berakhiran -list)
                const listSection = document.querySelector('[id$="-list"]');
                if (listSection) {
                    listSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 800);
        });
    }
});
