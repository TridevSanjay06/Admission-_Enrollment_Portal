# Admission Enrollment Portal

A modern web-based admission management system for **Alpha Model's International School** with automated email notifications, database storage, and an intelligent AI-powered chatbot assistant. 

---

## 🚀 Features

### ✅ Core Features

* Online admission & enrollment form
* Real-time form validation
* Automated email confirmations
* SQLite database integration
* AI-powered chatbot assistant
* Fully responsive UI for mobile & desktop
* Secure backend with rate limiting & validation

---

## 📧 Email Notification System

The platform automatically sends beautifully formatted email confirmations after a successful application submission.

### Includes:

* Applicant information summary
* Unique reference number
* Admission process details
* School contact information
* Responsive HTML email templates

Powered using:

* **Nodemailer**
* **Gmail SMTP**

---

## 🤖 AI Chatbot Assistant

An interactive chatbot integrated into the platform to answer common admission-related queries instantly.

### Supported Topics

* Admission process
* Fee structure
* School facilities
* Contact information
* Curriculum details
* Location & directions
* Admission timelines

### Features

* Instant responses
* Keyword-based intelligent matching
* Quick action buttons
* Mobile-friendly chat interface

---

# 🛠️ Tech Stack

| Technology         | Usage           |
| ------------------ | --------------- |
| Node.js            | Backend Runtime |
| Express.js         | Web Framework   |
| SQLite3            | Database        |
| Nodemailer         | Email Service   |
| HTML/CSS/JS        | Frontend        |
| Helmet             | Security        |
| Express Rate Limit | API Protection  |

---

# 📂 Project Structure

```bash
AMS-Project/
│
├── server.js
├── package.json
├── env.example
├── ams.db
│
├── routes/
│   ├── enroll.js
│   └── chatbot.js
│
├── services/
│   ├── database.js
│   └── email.js
│
├── static/
│   ├── css/
│   │   └── chatbot.css
│   └── js/
│       └── chatbot.js
│
├── Styles/
├── Images/
│
├── main.html
├── enroll.html
└── login.html
```

---

# ⚙️ Installation & Setup

## 1️⃣ Clone Repository

```bash
git clone <repository-url>
cd AMS-Project
```

---

## 2️⃣ Install Dependencies

```bash
npm install
```

---

## 3️⃣ Configure Environment Variables

Create a `.env` file in the root directory.

```env
# Server
PORT=3000
NODE_ENV=development

# Gmail SMTP
GMAIL_USER=your_email@gmail.com
GMAIL_PASSWORD=your_app_password

# School Information
SCHOOL_NAME="Alpha Model's International School"
SCHOOL_EMAIL=admissions@alphamodels.in
SCHOOL_PHONE=9949128732
```

---

# ▶️ Running the Application

## Development Mode

```bash
npm run dev
```

## Production Mode

```bash
npm start
```

---

# 🌐 Application Routes

| Route          | Description           |
| -------------- | --------------------- |
| `/`            | Homepage              |
| `/enroll`      | Enrollment Form       |
| `/api/enroll`  | Submit Admission Form |
| `/api/chatbot` | Chatbot API           |
| `/api/health`  | Health Check          |

---

# 🗄️ Database

The application uses **SQLite** for lightweight and efficient data storage.

## Applicant Table Fields

```text
id
reference_number
parent_name
email
phone
city
grade
message
status
created_at
updated_at
```

### Features

* Automatic table creation
* Secure parameterized queries
* Applicant tracking
* Statistics & reporting support

---

# 🔒 Security Features

* Input validation
* XSS protection
* Secure HTTP headers via Helmet
* API rate limiting
* SQL injection protection
* Sanitized form handling

---

# 📊 Monitoring & Logging

The server provides detailed logs for:

* Database connection status
* Email delivery status
* Form submissions
* Error tracking

### Health Endpoint

```bash
GET /api/health
``

---

## Production Environment

```env
NODE_ENV=production
PORT=3000
```

---

# 🧠 Chatbot Customization

You can edit chatbot responses from:

```bash
routes/chatbot.js
```

Add:

* New FAQs
* Custom intents
* Dynamic responses
* Advanced AI integrations

---

# 🔧 Troubleshooting

## Email Issues

* Verify Gmail credentials
* Enable 2FA
* Use Gmail App Password

## Database Errors

* Check SQLite permissions
* Ensure write access to project directory

## Chatbot Issues

* Verify frontend JS loading
* Check API endpoint configuration

---

# 📈 Future Enhancements

* Admin Dashboard
* Advanced AI/NLP chatbot
* File uploads for documents
* Payment integration
* SMS notifications
* Multi-language support
* Analytics dashboard

---

# 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push updates
5. Create a pull request

---

# 📄 License

Licensed under the **MIT License**.

---

# 📞 Support

### Alpha Model's International School

* 📧 [admissions@alphamodels.in](mailto:admissions@alphamodels.in)
* 📞 9949128732
* 📍 Plot no: 395, Road no: 06, Raghavendra Colony, Beeramguda, Telangana 502032

---

## ❤️ Built for Smarter School Admissions

Designed to simplify and modernize the student enrollment experience.
