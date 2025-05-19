# NSOBANURIRA — Complaint Platform

## 📝 Overview

Many Rwandans struggle to report issues due to:

- Slow and ignored channels
- Lack of tech skills
- Ghosting by leaders

**NSOBANURIRA** makes it easy:

- Citizens post complaints — **no login**
- Others comment & support
- Complaints are auto-routed to the right department
- Government admins reply & resolve through a dashboard

---

## ✨ Features

- No login required
- Social-style platform
- Complaints auto-routed to relevant departments
- Admin dashboard to manage & respond
- Track complaint resolution
- Real-time comment/chat

---

## 🔗 Live Demo

- **Citizen App**: https://nsobanurira-platform.vercel.app/
- **Admin App**: https://nsobanurira-admin.vercel.app/
- **Video Link**: https://shorturl.at/8O29D
---

## 🛠️ Tech Stack

- **Frontend (Citizen)**: Next.js, TypeScript, MUI
- **Frontend (Admin)**: React, MUI
- **Backend**: Node.js
- **Database**: MySQL
- **Db used during deployment**: Railway

---

## 🚀 Setup Instructions

```bash
# 1. Clone the repo
git clone https://github.com/Iriza-peace/risa-hackthon.git

# 2. Backend setup
cd backend
npm install
# Create a .env file from .env.example
npm run dev

# 3. Citizen frontend setup
cd client
npm install
# Create a .env file from .env.example
npm run dev

# 4. Admin frontend setup
cd admin
npm install
# Create a .env file from .env.example
npm start

Admins can log in using mock data from:
https://675bebe29ce247eb1937dee8.mockapi.io/support/api/users

## SQL Mock Data
#  MODULES & CATEGORIES
```

INSERT INTO modules (module_name) VALUES
('RIB'), ('MINEDUC'), ('MINFRA'), ('MINEMA'), ('WASAC');

INSERT INTO categories (category_title, module_id) VALUES
('Abatekamutwe', 1), ('Umutekano', 1), ('Amategeko', 1),
('Ibibazo by’amashuri', 2), ('Abarimu', 2), ('Ibikoresho', 2),
('Imihanda', 3), ('Amatara', 3), ('Ibikorwaremezo', 3),
('Ibiza', 4), ('Ibikoresho', 4), ('Inzu zangiritse', 4),
('Amazi make', 5), ('Kubura amazi', 5), ('Amadeni y’amazi', 5);

```