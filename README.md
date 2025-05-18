
# NSOBANURIRA — Complaint Platform

## Description  
Most local rwandans face challenges when trying to complain about problems because:  
- It is time-consuming  
- Leaders often ignore or ghost them  
- Lack of technical skills to navigate complex systems   

**NSOBANURIRA** offers a simple, engaging, social media–style platform where:  
- Citizens can post complaints **no logging required**  
- Other citizens can comment, support, and share experiences  
- Complaints are routed to the **government departments**  

An **admin dashboard** allows different departments to:  
- Track and resolve complaints efficiently  
- Chat with citizens directly through complaint comments. 

This platform makes complaint filing quick, accessible, and transparent, ensuring citizens are heard and problems get solved faster.

---

## Features  
- No login required for citizens to post complaints  
- Social media-like interface for easy engagement  
- Auto-routing of complaints to relevant government departments  
- Admin dashboard for complaint management and resolution  
- Real-time comment/chat functionality between citizens and admins  


---

## Tech Stack  
- Frontend(Complainter): React / Next js / Typescript / Material UI
- Frontend(admin): React / Material UI
- Backend: Node.js 
- Database: MYSQL  

---

## How to Run
1. Clone Repository
2. Install dependencies  
3. Run backend server 
-  cd backend
- npm install
- Reference .env.example to make .env file
- npm run dev
4. Run frontend application (client) 
- cd client
- npm install
- Copy paste from .env.example to make .env file
- npm run dev
5. Run frontend admin application
- cd admin 
- npm install
- Copy paste from .env.example to make .env file
- npm start
- Go to .env and copy and paste the mock api for agents in browser
- Take email and a password from one of employee
- Use Details to log in into add Dashboard


## Major Features to Explore
### Client(Complainter)
- Post a new Complaint
- Engage on other complaints 
- See your submissions with national ID that you sent during new complaint
- See comments on your complaint from government department or other citizens 

### Government admin
- Log in with mock api
- See all tickets(complaints)
- See analytics like chats(comments) vs tickets 
- Preview Complaints
- Mark them as solved 
- Comment(chat) to the tickets


