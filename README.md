 
# 🎓 MentorLagbe — Client

A modern tuition and tutor-finding platform that connects students with qualified tutors. MentorLagbe makes it easier for students to find suitable tutors and for tutors to discover teaching opportunities.

## 🌐 Project Overview

MentorLagbe is a web-based platform designed to simplify the tuition search and application process. Students can explore available tuition opportunities, apply for suitable positions, and manage their applications. Tutors can post tuition listings, manage their posts, and review student applications.

## ✨ Key Features

- **User Authentication:** Secure registration and login with Better Auth.
- **Role-Based Dashboards:** Separate dashboards for Students, Tutors, and Admins.
- **Browse Tuitions:** Explore approved tuition listings.
- **Search & Discover:** Find tuition opportunities based on relevant information.
- **Tuition Details:** View detailed information about individual tuition posts.
- **Student Applications:** Apply for tuition opportunities and track application status.
- **Saved Tuitions:** Save interesting tuition listings for later.
- **Tutor Dashboard:** Post, edit, delete, and manage tuition listings.
- **Applicant Management:** Review applicants and update application statuses.
- **Admin Dashboard:** Manage users, tuition posts, and payments.
- **Subscription Plans:** Student and Tutor subscription options with Stripe.
- **Payment Pages:** Dedicated payment success and cancellation pages.
- **Responsive Design:** Optimized for desktop, tablet, and mobile devices.

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| Next.js 16 | React framework |
| React 19 | UI development |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Better Auth | Authentication |
| Stripe | Subscription payments |
| Lucide React | Icons |

## 📁 Project Structure

```text
mentorlagbe-client/
├── public/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── dashboard/
│   │   │   ├── admin/
│   │   │   ├── student/
│   │   │   └── tutor/
│   │   ├── payment/
│   │   ├── pricing/
│   │   └── tuitions/
│   ├── components/
│   └── lib/
├── .env.local
├── package.json
└── README.md
```

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone YOUR_CLIENT_REPOSITORY_URL
```

### 2. Navigate to the Project

```bash
cd mentorlagbe-client
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Replace the URL with your deployed backend URL when deploying.

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔗 Related Links

- **Live Website:** Add your deployed client URL here.
- **Backend Repository:** Add your server GitHub repository URL here.

## 👩‍💻 Developer

**Halima Chowdhury Mahima**

Full Stack Web Developer

- GitHub: [halima-chowdhury-mahima](https://github.com/halima-chowdhury-mahima)

---

<p align="center">
  Built with ❤️ for MentorLagbe
</p>
