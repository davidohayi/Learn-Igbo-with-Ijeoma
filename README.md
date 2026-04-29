# Learn Igbo with Ijeoma

A multi-page frontend web platform for learning the Igbo language — built with vanilla HTML, CSS, and JavaScript. No frameworks, no libraries.

---

## 🌍 Overview

**Learn Igbo with Ijeoma** is a language learning platform designed to help beginners, heritage speakers, and curious learners connect with the Igbo language. The platform features a clean, branded interface with consultation booking, live form validation, and Calendly integration.

---

## 📄 Pages

| Page | Description |
|------|-------------|
| `index.html` | Landing page — hero, features, and call to action |
| `registration.html` | User sign-up page |
| `login.html` | User login page |
| `Consultation.html` | 15-minute consultation booking page |
| `thank-you.html` | Post-submission confirmation page |

---

## ✨ Features

- Responsive design — mobile and desktop friendly
- Scroll-direction navbar (hides on scroll down, shows on scroll up)
- Live form validation with real-time error feedback
- Consultation booking form powered by [Formspree](https://formspree.io)
- Calendly integration for direct slot booking
- Branded thank-you page with animated confirmation
- Consistent design system across all pages

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Primary Green | `#1A5C38` |
| Accent Gold | `#D4A017` |
| Background Cream | `#FAF6EF` |
| Text Brown | `#5C3317` |

**Fonts:** Playfair Display (headings) · Lato (body)

---

## 🛠️ Built With

- HTML5
- CSS3 (custom properties, flexbox, grid, animations)
- Vanilla JavaScript (ES6+)
- [Formspree](https://formspree.io) — form submission & email delivery
- [Calendly](https://calendly.com) — consultation scheduling

---

## 📁 Project Structure

```
igbo-website/
├── index.html
├── registration.html
├── login.html
├── Consultation.html
├── Consultation.css
├── Consultation.js
├── thank-you.html
└── LIWI.png
```

---

## 🚀 Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/learn-igbo-with-ijeoma.git
   ```
2. Open `index.html` in your browser or use a local server (e.g. VS Code Live Server)

> No build tools or dependencies required.

---

## 📬 Form Setup

The consultation form uses Formspree. To use your own endpoint:

1. Create a free account at [formspree.io](https://formspree.io)
2. Create a new form and copy your endpoint URL
3. Replace the `action` value in `Consultation.html`:
   ```html
   <form action="https://formspree.io/f/your-id" method="POST">
   ```

---

## 👨‍💻 Developer

Built by **[Ohayi David](https://github.com/ohayidev)** — Frontend Developer & Designer based in Nigeria.

- Portfolio: coming soon
- LinkedIn: [linkedin.com/in/ohayidev](https://linkedin.com/in/ohayidev)
- X: [@ohayidev](https://x.com/ohayidev)

---

## 📝 License

This project is built for a client. All rights reserved.
