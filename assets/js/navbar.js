/* assets/js/navbar.js */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Inisiasi state mata uang (default: IDR)
    let currentCurrency = localStorage.getItem('navigo_currency') || 'IDR';
    
    const currencyBtn = document.querySelector('.currency-btn button');
    const currencyItems = document.querySelectorAll('#currency-dropdown .dropdown-item');

    // Terapkan preferensi bahasa & harga saat load pertama
    applyCurrencyAndLanguage(currentCurrency);

    // 2. Event Listener pada Dropdown Currency
    if (currencyItems) {
        currencyItems.forEach(item => {
            item.addEventListener('click', () => {
                const selectedText = item.textContent; // "IDR - Indonesian Rupiah" atau "USD - US Dollar"
                let newCurrency = selectedText.startsWith('USD') ? 'USD' : 'IDR';
                
                // Simpan ke local storage
                localStorage.setItem('navigo_currency', newCurrency);
                
                // Update UI
                applyCurrencyAndLanguage(newCurrency);
            });
        });
    }

    // 3. Fungsi Eksekusi Penerjemahan (Bahasa & Harga)
    function applyCurrencyAndLanguage(currencyCode) {
        // Update label tombol navbar
        if (currencyBtn) {
            currencyBtn.innerHTML = `${currencyCode} <i class="fa-solid fa-chevron-down"></i>`;
        }

        // Tentukan kode bahasa (USD -> English, IDR -> Indonesia)
        const langCode = currencyCode === 'USD' ? 'en' : 'id';
        const dict = dictionary[langCode];

        // --- TRANSLASI TEKS NAVBAR & UMUM ---
        try {
            // Navbar Links
            const navLinks = document.querySelectorAll('.nav-menu li a');
            if(navLinks.length >= 4) {
                navLinks[0].innerHTML = dict.nav_flight;
                navLinks[1].innerHTML = dict.nav_hotel;
                navLinks[2].innerHTML = dict.nav_train;
                navLinks[3].innerHTML = dict.nav_car;
            }

            const topLinks = document.querySelectorAll('.nav-right .nav-link');
            if(topLinks.length >= 2) {
                topLinks[0].textContent = dict.nav_help;
                topLinks[1].textContent = dict.nav_order;
            }

            // Text on Flight Page
            const btnSearch = document.querySelector('.btn-search');
            if(btnSearch) btnSearch.textContent = dict.search_btn;

            const sortLabel = document.querySelector('.flight-sort label');
            if(sortLabel) sortLabel.textContent = dict.sort_label;

            const buttons = document.querySelectorAll('.btn-select');
            buttons.forEach(btn => btn.textContent = dict.btn_select);
        } catch(e) {
            console.log("Beberapa elemen tidak ditemukan di halaman ini, aman diabaikan.");
        }

        // --- KONVERSI HARGA (PRICE SWITCHER) ---
        // Cari semua elemen yang mengandung harga
        const priceElements = document.querySelectorAll('.price-value, .price, .total-price');
        
        priceElements.forEach(el => {
            // Ambil angka mentahnya dulu menggunakan helper di utilities.js
            // Agar aman, kita simpan 'original-price' di data attribute jika belum ada
            let originalPrice = el.getAttribute('data-original-price');
            
            if (!originalPrice) {
                originalPrice = parsePriceToNumber(el.textContent);
                el.setAttribute('data-original-price', originalPrice);
            } else {
                originalPrice = parseInt(originalPrice);
            }

            // Jika gagal parse, abaikan
            if(isNaN(originalPrice) || originalPrice === 0) return;

            // Render sesuai format mata uang terpilih
            if (currencyCode === 'USD') {
                el.textContent = formatUSD(originalPrice);
            } else {
                el.textContent = formatIDR(originalPrice);
            }
        });
        
        // Terjemahkan text "/pax" atau " /malam"
        const unitElements = document.querySelectorAll('.price-unit');
        unitElements.forEach(el => {
            el.textContent = dict.price_per_pax; // Untuk purwarupa kita anggap semua /pax
        });
    }

    // Update navbar avatar
    let profileData = JSON.parse(localStorage.getItem('navigo_user_profile'));
    if (profileData) {
        const navAvatars = document.querySelectorAll('.avatar');
        navAvatars.forEach(navAvatar => {
            if (profileData.avatar) {
                navAvatar.innerHTML = `<img src="${profileData.avatar}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;" />`;
            } else if (profileData.firstName) {
                navAvatar.textContent = profileData.firstName.charAt(0) + (profileData.lastName ? profileData.lastName.charAt(0) : '');
            }
        });
    }
});
