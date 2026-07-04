/* assets/js/storage.js */

// 2. Auth Check Logic
function checkAuth() {
    // Halaman yang dikecualikan dari perlindungan login
    const path = window.location.pathname;
    if (path.includes('login.html') || path.includes('register.html')) {
        return; 
    }

    // Jika belum login, tendang ke login.html
    const isLoggedIn = localStorage.getItem('navigo_logged_in');
    if (isLoggedIn !== 'true') {
        // Cek depth file untuk mengarahkan path dengan benar
        if (path.includes('/pages/')) {
            window.location.href = 'login.html';
        } else {
            window.location.href = 'pages/login.html';
        }
    }
}

// 3. Logout Logic
function logout() {
    localStorage.removeItem('navigo_logged_in');
    const path = window.location.pathname;
    if (path.includes('/pages/')) {
        window.location.href = 'login.html';
    } else {
        window.location.href = 'pages/login.html';
    }
}
window.logout = logout;

// 6. Auth Interceptors & Sync
function setupAuthSync() {
    const path = window.location.pathname;

    // --- A. REGISTER PAGE ---
    if (path.includes('register.html')) {
        const regForm = document.querySelector('form');
        if (regForm) {
            regForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const fName = document.getElementById('first-name').value;
                const lName = document.getElementById('last-name').value;
                const email = document.getElementById('email').value;
                const phone = document.getElementById('phone').value;
                
                const profileData = {
                    firstName: fName,
                    lastName: lName,
                    email: email,
                    phone: phone
                };
                localStorage.setItem('navigo_user_profile', JSON.stringify(profileData));
                localStorage.setItem('navigo_logged_in', 'true');
                window.location.href = '../index.html';
            });
        }
    }

    // --- B. LOGIN PAGE ---
    if (path.includes('login.html')) {
        const loginForm = document.querySelector('form');
        if (loginForm) {
            loginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const email = document.getElementById('email').value;
                
                // Cek apakah ada profil
                let profileData = JSON.parse(localStorage.getItem('navigo_user_profile'));
                if (!profileData) {
                    // Buat profil dummy jika belum ada
                    profileData = {
                        firstName: "User",
                        lastName: "Baru",
                        email: email,
                        phone: "081234567890"
                    };
                    localStorage.setItem('navigo_user_profile', JSON.stringify(profileData));
                }
                
                localStorage.setItem('navigo_logged_in', 'true');
                window.location.href = '../index.html';
            });
        }
    }

    // --- C. PROFILE PAGE ---
    if (path.includes('profile.html') || path.includes('cards.html')) {
        let profileData = JSON.parse(localStorage.getItem('navigo_user_profile'));
        if (profileData) {
            const elFirst = document.getElementById('profile-first-name');
            const elLast = document.getElementById('profile-last-name');
            const elEmail = document.getElementById('profile-email');
            const elPhone = document.getElementById('profile-phone');
            
            if(elFirst) elFirst.value = profileData.firstName;
            if(elLast) elLast.value = profileData.lastName;
            if(elEmail) elEmail.value = profileData.email;
            if(elPhone) elPhone.value = profileData.phone;

            
            // Update avatar
            const avatar = document.querySelector('.avatar-preview');
            if (avatar) {
                if (profileData.avatar) {
                    avatar.innerHTML = `<img src="${profileData.avatar}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;" />`;
                } else if (profileData.firstName) {
                    avatar.textContent = profileData.firstName.charAt(0) + (profileData.lastName ? profileData.lastName.charAt(0) : '');
                }
            }

            // Update card holder name if exists
            const cardHolder = document.getElementById('card-holder-name');
            if (cardHolder && profileData.firstName) {
                cardHolder.textContent = (profileData.firstName + ' ' + (profileData.lastName || '')).toUpperCase();
            }

        }

        const uploadPhoto = document.getElementById('upload-photo');
        if (uploadPhoto) {
            uploadPhoto.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (!file) return;
                
                if (file.size > 2 * 1024 * 1024) {
                    alert("Ukuran file maksimal 2MB!");
                    return;
                }
                
                const reader = new FileReader();
                reader.onload = function(event) {
                    const base64Str = event.target.result;
                    let pData = JSON.parse(localStorage.getItem('navigo_user_profile')) || {};
                    pData.avatar = base64Str;
                    localStorage.setItem('navigo_user_profile', JSON.stringify(pData));
                    
                    const avatarPrev = document.querySelector('.avatar-preview');
                    if (avatarPrev) {
                        avatarPrev.innerHTML = `<img src="${base64Str}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;" />`;
                    }
                    alert("Foto profil berhasil diperbarui!");
                    window.location.reload();
                };
                reader.readAsDataURL(file);
            });
        }

        const btnSave = document.getElementById('btn-save-profile');
        if (btnSave) {
            btnSave.addEventListener('click', function() {
                const elFirst = document.getElementById('profile-first-name');
                const elLast = document.getElementById('profile-last-name');
                const elEmail = document.getElementById('profile-email');
                const elPhone = document.getElementById('profile-phone');
                
                let oldProfile = JSON.parse(localStorage.getItem('navigo_user_profile')) || {};
                
                let newProfile = {
                    firstName: elFirst ? elFirst.value : '',
                    lastName: elLast ? elLast.value : '',
                    email: elEmail ? elEmail.value : '',
                    phone: elPhone ? elPhone.value : '',
                    avatar: oldProfile.avatar || null
                };
                
                localStorage.setItem('navigo_user_profile', JSON.stringify(newProfile));
                alert('Data berhasil disimpan!');
                window.location.reload();
            });
        }
    }

    // --- D. CHECKOUT AUTOFILL ---
    if (path.includes('checkout')) {
        let profileData = JSON.parse(localStorage.getItem('navigo_user_profile'));
        if (profileData) {
            const contactName = document.getElementById('contact-name');
            const contactEmail = document.getElementById('contact-email');
            const contactPhone = document.getElementById('contact-phone');
            
            if (contactName) contactName.value = profileData.firstName + ' ' + profileData.lastName;
            if (contactEmail) contactEmail.value = profileData.email;
            if (contactPhone) contactPhone.value = profileData.phone;
        }

        // Fitur "Sama dengan pemesan"
        const checkboxSame = document.getElementById('same-as-contact');
        if (checkboxSame) {
            checkboxSame.addEventListener('change', function() {
                const passName = document.getElementById('passenger-name') || document.getElementById('guest-name');
                const contactName = document.getElementById('contact-name');
                
                if (this.checked && passName && contactName) {
                    passName.value = contactName.value;
                } else if (!this.checked && passName) {
                    passName.value = '';
                }
            });
        }
    }
}
// 7. Initialize Auth Logic
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    setupAuthSync();
});
