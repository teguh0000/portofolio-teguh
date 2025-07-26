// Fungsi untuk menampilkan jam digital
function showTime() {
    const date = new Date(); // Membuat objek Date baru (waktu saat ini)
    let h = date.getHours(); // Mendapatkan jam (0-23)
    let m = date.getMinutes(); // Mendapatkan menit (0-59)
    let s = date.getSeconds(); // Mendapatkan detik (0-59)

    // Tambahkan nol di depan jika angka kurang dari 10
    h = (h < 10) ? "0" + h : h;
    m = (m < 10) ? "0" + m : m;
    s = (s < 10) ? "0" + s : s;

    // Format waktu menjadi HH:MM:SS
    const time = h + ":" + m + ":" + s;

    // Menampilkan waktu di elemen HTML dengan id "digital-clock"
    document.getElementById("digital-clock").innerText = time;
    document.getElementById("digital-clock").textContent = time;

    // Memperbarui jam setiap 1000 milidetik (1 detik)
    setTimeout(showTime, 1000);
}

// Panggil fungsi showTime saat halaman dimuat
showTime();