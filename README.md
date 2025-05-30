
# 🇸🇪 Swedish For All - Frontend
En fullständig webbapplikation byggd för att hjälpa persisktalande användare att lära sig svenska – med stöd för ordförråd, quiz, tester, videolektioner, forum, och meddelanden. Appen är uppdelad i användar-, admin- och gästdelar.

---

## 📂 Projektstruktur

```bash
├── public/                     # Statisk publikt innehåll -  bilder
├── src/
│   ├── api/                    # Axios-inställningar och API-anrop
│   ├── components/             # Återanvändbara komponenter
│   ├── pages/                  # Sidkomponenter (user/admin/guest)
│   ├── routes/                 # Skyddade routes
│   ├── types.ts                # Globala TypeScript-typer
│   └── App.tsx / main.tsx      # Entry points
```

---

## 🚀 Funktioner

### 👤 Gäst
- Utforska ordförråd per CEFR-nivå (A1–C1)
- Se ordlistor per bokstav och detaljer per ord

### 🧑‍🎓 Användare (student)
- Visa och favoritmarkera ord
- Genomföra ordförrådsquiz med resultat och felanalys
- Genomföra tester ( max 20 frågor, 70% rätt krävs för godkänt)
- Se testresultat och progression
- Titta på videolektioner per nivå, kategori och sektion
- Spara favoritvideor
- Använda forum (skriva frågor och svar)
- Skicka privata meddelanden till admin
- Få notifikationer och globala meddelanden

### 🛠 Admin
- Hantera ordförråd (CRUD)
- Hantera kategorier och sektioner
- Skapa tester och frågor (med feedbacktext)
- Ladda upp videolektioner
- Se och svara på foruminlägg
- Se och svara på privata meddelanden
- Skicka globala meddelanden
- Se statistik i admin dashboard

---

## 🧰 Tekniker

- **Frontend:** React + TypeScript + Vite
- **Routing:** React Router
- **Stil:** Tailwind CSS + Material Tailwind
- **API-hantering:** Axios
- **Animering:** Framer Motion
- **Notifiering:** React Toastify
- **Autentisering:** JWT via backend
- **Videohantering:** Lokalt

---

## 📦 Installation

```bash
# Klona projektet
git clone https://github.com/ditt-namn/swedish-app-frontend.git
cd swedish-app-frontend

# Installera beroenden
npm install

# Starta utvecklingsservern
npm run dev
```

Backend måste vara igång på exempelvis `http://localhost:5050`.

---


## ✅ TODO (för framtida förbättringar)

- [ ] Bättre akritektur 
- [ ] Flerspråklighet
- [ ] Betalningsfunktion

---

## 📄 Licens

Detta projekt är privat och inte open source.

---

## ✍️ Utvecklat av

Melika Zolfagharian  
Swedish language tutor & webbutvecklare  
Mittuniversitetet – Fullstackprojekt 2025
