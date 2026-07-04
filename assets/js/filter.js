/* assets/js/filter.js */

document.addEventListener('DOMContentLoaded', () => {
    // 8. Search Filter Logic
    function setupFilter() {
        const filterCheckboxes = document.querySelectorAll('.filter-airline input[type="checkbox"]');
        const flightCards = document.querySelectorAll('article.flight-card');
        const resetBtn = document.querySelector('.btn-reset');
        const flightCountText = document.querySelector('.flight-count');

        if (filterCheckboxes.length === 0 || flightCards.length === 0) return;

        function applyFilters() {
            // Cari checkbox apa saja yang dicentang
            const checkedAirlines = Array.from(filterCheckboxes)
                .filter(cb => cb.checked)
                .map(cb => cb.value);

            let visibleCount = 0;

            flightCards.forEach(card => {
                const airline = card.getAttribute('data-airline');
                
                // Tampilkan jika tidak ada yang dicentang, ATAU jika airline-nya termasuk yang dicentang
                if (checkedAirlines.length === 0 || checkedAirlines.includes(airline)) {
                    card.style.display = 'flex'; // menggunakan flex karena flight-card aslinya display:flex
                    card.style.animation = 'fadeIn 0.5s ease forwards';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });

            // Update teks jumlah penerbangan
            if (flightCountText) {
                flightCountText.textContent = `Menampilkan ${visibleCount} penerbangan terbaik`;
            }
        }

        // Attach event listeners to checkboxes
        filterCheckboxes.forEach(cb => {
            cb.addEventListener('change', applyFilters);
        });

        // Reset button logic
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                filterCheckboxes.forEach(cb => {
                    cb.checked = true; // aslinya dicentang semua
                });
                applyFilters();
            });
        }

        // Initial apply
        applyFilters();
    }

    setupFilter();
});
