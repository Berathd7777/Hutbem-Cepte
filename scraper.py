# scraper.py
import requests
from bs4 import BeautifulSoup
import json
import os

url = "https://dinhizmetleri.diyanet.gov.tr/kategoriler/yayinlarimiz/hutbeler/t%C3%BCrk%C3%A7e"

try:
    # Bazı siteler, bir tarayıcıdan gelinmediğini anladığında içeriği engeller.
    # Kendimizi bir tarayıcı gibi tanıtmak için headers bilgisi ekliyoruz.
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    response = requests.get(url, headers=headers, timeout=30)
    response.raise_for_status()

    soup = BeautifulSoup(response.content, "html.parser")
    
    # Hedef seçici, Diyanet'in sitesindeki listeyi bulur.
    hutbe_listesi_ul = soup.find("ul", class_="list-group")
    
    if not hutbe_listesi_ul:
        raise ValueError("Hutbe listesi (ul.list-group) sayfada bulunamadı. Sayfa yapısı değişmiş olabilir.")

    hutbeler = []
    # listedeki her bir hutbe linkini bulma
    for li in hutbe_listesi_ul.find_all("li", class_="list-group-item"):
        link = li.find("a")
        if link and link.has_attr('href'):
            hutbe_basligi = link.get_text(strip=True)
            # Linkin tam URL olduğundan emin ol
            hutbe_linki = requests.compat.urljoin(url, link['href'])
            
            hutbeler.append({
                "baslik": hutbe_basligi,
                "url": hutbe_linki
            })
    
    if not hutbeler:
        raise ValueError("Hiç hutbe linki bulunamadı.")

    # Veriyi JSON dosyasına yazdırma
    # Dosyanın projenin ana dizinine kaydedildiğinden emin ol
    filepath = os.path.join(os.path.dirname(__file__), '..', 'hutbeler.json')
    with open('hutbeler.json', 'w', encoding='utf-8') as f:
        json.dump(hutbeler, f, ensure_ascii=False, indent=4)
        
    print(f"Başarılı! {len(hutbeler)} adet hutbe 'hutbeler.json' dosyasına kaydedildi.")

except Exception as e:
    print(f"Hata oluştu: {e}")
    # Hata durumunda programın başarısız olduğunu belirtmek önemlidir.
    exit(1)
