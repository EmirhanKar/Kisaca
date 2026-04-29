<p align="center">
  <a style="text-decoration:none; display: block; width: 100%; background-color: #FFF;" href="#">
    <img style="width: 30%; padding: 16px;" alt="Django Recipe Banner" src="kisaca_logo.png" />
  </a>
</p>

## Genel Bakış



🚀 Kısaca - Backend API

Kısaca, kullanıcıların uzun URL'lerini kısaltmalarına, 
yönetmelerine ve tıklama istatistiklerini takip etmelerine olanak tanıyan, 
yüksek performanslı bir URL kısaltma servisidir. 
Bu depo, projenin tüm backend iş mantığını ve veritabanı yönetimini barındırır.

🛠 Kullanılan Teknolojiler

Framework: FastAPI (Asenkron ve hızlı Python web framework'ü)

Veritabanı & ORM: PostgreSQL + SQLModel (Pydantic ve SQLAlchemy'nin en iyi yanlarını birleştirir)

Migration: Alembic (Veritabanı şeması yönetimi için)

Güvenlik: JWT (JSON Web Token) tabanlı asenkron kimlik doğrulama.

🏗 Proje Yapısı ve Veritabanı Şeması

Proje, ilişkisel bir veritabanı yapısı üzerine kurulmuştur. Temel tablolar şunlardır:

User: Kullanıcı bilgilerini ve kimlik doğrulama verilerini saklar.

Shortlinks: Orijinal URL'leri, kısaltılmış hallerini ve sahiplik (user_id) ilişkisini yönetir.

Shortlink Clicks: Kısaltılmış linklerin ne zaman tıklandığını takip eder.

🚀 Kurulum ve Çalıştırma

1. Gereksinimler
2. 
Python 3.12+

PostgreSQL

2. Ortam Değişkenlerini Ayarla
   
Proje kök dizininde bir .env dosyası oluşturun ve aşağıdaki değerleri kendi yerel ayarlarınıza göre güncelleyin:

Kod snippet'i

DB_URL="postgresql+asyncpg://postgres:1234@localhost:5432/kisaca"
APP_NAME="Kısaca"
JWT_SECRET_KEY="G44GO... (Kendi gizli anahtarınız)"
JWT_ALGORITHM="HS256"
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30

3. Veritabanı Migration İşlemleri
   
Veritabanı tablolarını oluşturmak veya güncellemek için Alembic kullanıyoruz:

Bash
# En son migration sürümüne yükselt
alembic upgrade head
📜 Temel Alembic Komutları
Veritabanı şemasında bir değişiklik yaptığınızda şu adımları izleyin:

Modeli Güncelle: src/models.py dosyasında gerekli değişiklikleri yapın.

Migration Oluştur:

Bash
alembic revision --autogenerate -m "değişiklik açıklaması"
Uygula:

Bash
alembic upgrade head
🛣 API Uç Noktaları (Endpoints)
Proje ayağa kalktığında, interaktif API dokümantasyonuna şu adresten ulaşabilirsiniz:

Swagger UI: http://localhost:8000/docs

Redoc: http://localhost:8000/redoc

👥 Katkıda Bulunanlar
Bu proje ekip çalışması ile geliştirilmektedir. Katkı sağlamak için:

Projeyi fork'layın.

Yeni bir feature branch açın (git checkout -b feature/yeniOzellik).

Değişikliklerinizi commit edin (git commit -m 'Yeni özellik eklendi').

Branch'inizi push'layın (git push origin feature/yeniOzellik).

Bir Pull Request başlatın.

📝 Notlar
JWT Güvenliği: Üretim (production) ortamına geçerken JWT_SECRET_KEY değerini mutlaka daha karmaşık ve güvenli bir anahtarla değiştirin.

Asenkron Yapı: Proje asyncpg sürücüsü ile tamamen asenkron çalışacak şekilde tasarlanmıştır.


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
