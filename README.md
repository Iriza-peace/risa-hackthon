# IPPIS Support and Ticket Management System 
## Description
The IPPIS Support and Ticket Management System is a comprehensive solution designed to streamline support requests and ticket handling within the Integrated Payroll and Personnel Information System (IPPIS). This system facilitates efficient communication, tracking, and resolution of user issues, ensuring timely assistance and enhanced user satisfaction. It comprises two primary components:

* Support System: Provides a centralized platform for users to submit support queries and receive assistance.

* Ticket Management System: Tracks and manages submitted tickets, enabling administrators and support staff to monitor progress and resolve issues systematically.

## Getting Started

### [Figma Design Link](https://www.figma.com/design/367POtmT2TsJ0HpirjviBn/SUPPORT?m=auto&t=CrnksYIkd4S7DFRS-6)


### Dependencies
* Operating System: Windows 10, macOS, or Linux

* Node.js (version 18.x or above)

* npm package manager

* A modern web browser (e.g., Chrome, Firefox)

* Database: MySQl database

Other libraries as specified in package.json

### Installing
* Clone Repository
 ```
git clone https://github.com/furahaderick/mifotra-support-portal.git
 ```
* Navigate to project Directory
 ```
cd mifotra-support-portal
 ```
* Install Dependencies
 ```
npm install
 ```
### Executing program
* Running backend
```
npm run server
```
* Running frontend-admin
```
npm start
```
* Running frontend self-support portal
```
npm run docs
```
NB: Refer to the system package.json

### Frontend (Admin) Features

* Authentication powered by IPPIS API
* Analytics dashboard
* Tickets' management (view tickets, transfer tickets and resolve tickets)
* Articles' management (view articles, edit articles, unpublish articles)

### Frontend (Users self-service) Features

* Submit Tickets(send tickets to MIFOTRA support department)
* Knowledge-base & FAQs for IPPIS modules and related categories

### Backend Features

* Login with JWT, for members of the support team
* Articles management
* Tickets management
* Module categories' management

### Uncompleted features
* #### Transfer tickets
  * Logic for transfering chats by department or support team member (frontend client)
  * Backend logic for storing ticket status and properties
* #### Chat integration
  * Support team's chat interface
  * Self-support user chat via chat widget (chatbot)
  * Chats and messages' backend management

## Authors and Support Contact

Contributors
- [Furaha Yves Derick Dukundane](mailto:yvesderricks@gmail.com)
- [Iriza Peace Mary Amizero](mailto:irizapeace@gmail.com)

## License

This project is licensed under the license of the Ministry of Public Service and Labor, MIFOTRA.
