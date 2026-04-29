<p align="center">
  <a style="text-decoration:none; display: block; width: 100%; background-color: #FFF;" href="#">
    <img style="width: 30%; padding: 16px;" alt="Django Recipe Banner" src="kisaca_logo.png" />
  </a>
</p>

<p align="center">
  <b>FastAPI'yi sıfırdan öğrenmek isteyenler için tasarlanmış,</b>  
  gerçek bir proje üzerinden <b>uygulamalı web geliştirme eğitimi.</b>
</p>


## Genel Bakış

Bu repository, **FastAPI ile Gerçek Bir Uygulama Geliştirme”** eğitimine ait kaynak kodları içerir.  
Eğitimde sıfırdan bir **Link Kısaltma Servisi** geliştirerek FastAPI’nin temel yapı taşlarını, mantığını ve proje mimarisini adım adım öğreneceksin.  

Kısa, yüzeysel konular yerine; gerçek senaryolara dayalı, neden-sonuç ilişkisini anlatan,  
**detaylı ve öğretici derslerden** oluşur. 

## Eğitim Hedefleri

Bu projeyi tamamladığında:

- FastAPI’nin çekirdek yapı taşlarını (router, Depends, request/response modelleri) profesyonel seviyede kullanabileceksin.
- Clean Architecture prensiplerine uygun katmanlı bir proje yapısı kurabilecek, business logic’i framework’ten bağımsız hale getirebileceksin.
- SQLModel ile tip güvenli, Pydantic uyumlu veritabanı modelleri oluşturabileceksin.
- Alembic kullanarak migration süreçlerini yönetebilecek, veritabanı şemasını güvenle güncelleyebileceksin.
- JWT tabanlı kimlik doğrulama sistemiyle login, register ve erişim kontrolü mekanizmalarını kurabileceksin.
- Global Exception Handling ile tutarlı hata yanıtları dönen, üretim ortamına hazır bir API geliştirebileceksin.
- Repository pattern sayesinde veritabanı işlemlerini soyutlayarak test edilebilir hale getirebileceksin.
- Environment tabanlı yapılandırma ile development ve production ortamlarını güvenli şekilde ayırabileceksin.
- Asenkron SQL sorguları (asyncpg) ile yüksek performanslı veritabanı etkileşimleri kurabileceksin.
- Gerçek dünyada kullanılabilir bir Shortlink (URL kısaltma) servisini baştan sona kendi mimarinle inşa edebileceksin.

## Klasörler
- <strong>kisaca:</strong> Next.js ile geliştirilmiş frontend modülüdür.

- <strong>project:</strong> FastAPI ile geliştirilmiş backend modülüdür.


## Kurulum Adımları

### Front-end
```bash
# 1️⃣ Gerekli kütüphaneleri yükle
yarn install

# 2️⃣ Geliştirme sunucusunu çalıştır
yarn dev
```


### Back-end
```bash
# 1️⃣ Sanal ortam oluştur
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate

# 2️⃣ Kütüphaneleri yükle
pip install -r requirements.txt

# 3️⃣ Veritabanı migrasyonlarını uygula
alembic upgrade head

# 4️⃣ Geliştirme sunucusunu çalıştır
fastapi dev
```