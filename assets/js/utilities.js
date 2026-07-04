/* assets/js/utilities.js */

// Kamus (Dictionary) Terjemahan Sederhana
const dictionary = {
    'id': {
        'nav_flight': '<i class="fa-solid fa-plane"></i> Pesawat',
        'nav_hotel': '<i class="fa-solid fa-bed"></i> Hotel',
        'nav_train': '<i class="fa-solid fa-train"></i> Kereta Api',
        'nav_car': '<i class="fa-solid fa-car"></i> Sewa Mobil',
        'nav_help': 'Bantuan',
        'nav_order': 'Cek Order',
        'price_per_pax': '/pax',
        'sort_label': 'Urutkan:',
        'flight_count': 'Menampilkan penerbangan terbaik',
        'btn_select': 'Pilih',
        'search_btn': 'Cari Penerbangan'
    },
    'en': {
        'nav_flight': '<i class="fa-solid fa-plane"></i> Flights',
        'nav_hotel': '<i class="fa-solid fa-bed"></i> Hotels',
        'nav_train': '<i class="fa-solid fa-train"></i> Trains',
        'nav_car': '<i class="fa-solid fa-car"></i> Car Rental',
        'nav_help': 'Help',
        'nav_order': 'My Orders',
        'price_per_pax': '/pax',
        'sort_label': 'Sort by:',
        'flight_count': 'Showing best flights',
        'btn_select': 'Select',
        'search_btn': 'Search Flights'
    }
};

// Konstanta Kurs (Asumsi: 1 USD = Rp 15.000)
const EXCHANGE_RATE = 15000;

// Helper: Format Angka ke Rupiah (IDR)
function formatIDR(amount) {
    return 'Rp ' + amount.toLocaleString('id-ID');
}

// Helper: Format Angka ke USD
function formatUSD(amount) {
    // Harga dalam USD dibulatkan 2 angka di belakang koma
    const usdAmount = amount / EXCHANGE_RATE;
    return '$ ' + usdAmount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
}

// Helper: Ekstrak Angka Asli dari Teks Rupiah (Misal: "Rp 1.050.000" -> 1050000)
function parsePriceToNumber(priceText) {
    // Hanya jika ada 'Rp', 'IDR', atau '$' kita parse
    if (!priceText) return 0;
    
    // Hapus Rp, IDR, spasi, titik
    let cleanString = priceText.replace(/Rp|IDR|\$|\s|\./gi, '');
    
    // Jika format asli adalah USD (ada koma), konversi balik ke IDR
    if (priceText.includes('$')) {
        cleanString = priceText.replace(/\$|\s/g, '').replace(/,/g, '');
        return parseFloat(cleanString) * EXCHANGE_RATE;
    }
    
    return parseInt(cleanString);
}
