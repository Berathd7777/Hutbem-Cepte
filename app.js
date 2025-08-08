// app.js (Yeni ve Basit Hali)
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('hutbe-container');
    const loader = document.getElementById('loader');
    const errorMessage = document.getElementById('error-message');

    // Artık proxy yerine direkt kendi depomuzdaki json dosyasını çekiyoruz.
    fetch('hutbeler.json')
        .then(response => {
            if (!response.ok) {
                // Eğer hutbeler.json dosyası yoksa veya bozuksa bu hata oluşur.
                throw new Error(`Veri dosyası yüklenemedi. Durum: ${response.status}`);
            }
            return response.json();
        })
        .then(hutbeler => {
            if (hutbeler.length === 0) {
                throw new Error("Hutbe listesi boş. Henüz veri çekilmemiş olabilir.");
            }

            container.innerHTML = ''; // Temizle

            hutbeler.forEach(hutbe => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    <i class="material-icons">description</i>
                    <a href="${hutbe.url}" target="_blank" rel="noopener noreferrer">${hutbe.baslik}</a>
                `;
                container.appendChild(listItem);
            });
        })
        .catch(error => {
            console.error('Hata:', error);
            errorMessage.textContent = `Bir sorun oluştu: ${error.message}. Lütfen deponun doğru kurulduğundan emin olun.`;
            errorMessage.style.display = 'block';
        })
        .finally(() => {
            loader.style.display = 'none';
        });
});
