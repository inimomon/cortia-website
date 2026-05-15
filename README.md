# Cortia

Platform monitoring dan analisis risiko pengadaan berbasis AI menggunakan React dan Express.js.

---

## Instalasi

Clone repository:

```bash
git clone https://github.com/inimomon/cortia-website.git
```

---

# Frontend Setup

Masuk ke folder frontend:

```bash
cd FE
```

Install dependency:

```bash
npm install
```

Jalankan frontend:

```bash
npm run dev
```

Frontend berjalan di:

```bash
http://localhost:5173
```

---

# Backend Setup

Masuk ke folder backend:

```bash
cd BE
```

Install dependency:

```bash
npm install
```

Jalankan backend:

```bash
npm run dev
```

Backend berjalan di:

```bash
http://localhost:8005
```

---

## Environment Variable

Buat file `.env` pada folder backend:

```env
PORT=YOUR_PORT
DB_NAME=YOUR_DB_NAME
DB_PASS=""
DB_USERNAME="root"
HOST="localhost"
DB_PORT=YOUR_DB_PORT
JWT_SECRET=YOUR_JWT_SECRET
FASTAPI_INPUT_TEXT_URL=http://127.0.0.1:8000/cortia/api/v1/predict_input_text
FASTAPI_PREDICT_FILE_URL=http://127.0.0.1:8000/cortia/api/v1/predict_file
```

Buat file `.env` pada folder frontend:

```env
VITE_BE_LINK=http://localhost:8005/api/v1
```

---
