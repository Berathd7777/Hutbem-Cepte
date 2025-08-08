document.addEventListener('DOMContentLoaded', () => {
    const diyanetUrl = 'https://dinhizmetleri.diyanet.gov.tr/kategoriler/yayinlarimiz/hutbeler/t%C3%BCrk%C3%A7e';
    
    // Tarayıcı güvenlik kısıtlamalarını (CORS) aşmak için bir aracı servis kullanıyoruz.
    // allorigins.win bu iş için popüler ve ücretsiz bir alternatiftir.
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(diyanetUrl)}`;

    const container = document.getElementById('hutbe-container');
    const loader = document.getElementById('loader');
    const errorMessage = document.getElementById('error-message');

    async function fetchHutbeler() {
        try {
            const response = await fetch(proxyUrl);
            if (!response.ok) {
                throw new Error(`Veri çekilemedi. Sunucu durumu: ${response.status}`);
            }

            const htmlText = await response.text();

            // Gelen HTML metnini ayrıştırmak için DOMParser kullanıyoruz.
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlText, 'text/html');

            // Diyanet sitesindeki hutbe linklerini içeren elementleri seçiyoruz.
            // Sayfa yapısı değişirse bu seçici güncellenmelidir.
            const links = doc.querySelectorAll('.list-group .list-group-item a');

            if (links.length === 0) {
                throw new Error("Hutbe listesi bulunamadı. Sitenin yapısı değişmiş olabilir.");
            }

            // Önceki içeriği temizle
            container.innerHTML = ''; 

            links.forEach(link => {
                const hutbeBasligi = link.textContent.trim();
                // Linkin tam yolunu oluştur
                const hutbeUrl = new URL(link.getAttribute('href'), diyanetUrl).href;

                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    <i class="material-icons">description</i>
                    <a href="${hutbeUrl}" target="_blank" rel="noopener noreferrer">${hutbeBasligi}</a>
                `;
                container.appendChild(listItem);
            });

        } catch (error) {
            console.error('Hata:', error);
            errorMessage.textContent = `Bir sorun oluştu: ${error.message}. Lütfen daha sonra tekrar deneyin.`;
            errorMessage.style.display = 'block';
        } finally {
            // İşlem bitince yükleniyor animasyonunu gizle
            loader.style.display = 'none';
        }
    }

    fetchHutbeler();
});