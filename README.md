# Evenity - Comprehensive Event Management System

**Evenity** is a powerful and user-friendly event management system designed to streamline the organization and management of events. With a robust backend built on **Laravel** and a sleek frontend using **Next.js**, Evenity provides an intuitive experience for both event organizers and participants.

---

## 🌟 Features

- **User Roles:** Assign admin privileges easily by updating the database.
- **Event Reviews:** Users can review events they registered for after the registration period ends.
- **Responsive Design:** A seamless experience across devices.
- **Easy Event Management:** Seamless event management.

---

## 🚀 Getting Started

Follow the steps below to set up and run the application on your local environment.

### Prerequisites

- **PHP** (>= 8.1)
- **Composer** (latest version)
- **Node.js** (>= 16)
- **MySQL** (or compatible database)
- **Git** (for cloning repositories)

### Installation

#### **1. Backend (Laravel)**

1. **Clone Repository and Enter Directory**
   ```bash
   git clone https://github.com/reddishowo/event-management-web
   cd evenity-backend
   ```

2. **Install Dependencies**
   ```bash
   composer install
   ```

3. **Set Environment Variables**
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your database credentials:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=evenity
   DB_USERNAME=<USERNAME_DB>
   DB_PASSWORD=<PASSWORD_DB>
   ```

4. **Generate Application Key**
   ```bash
   php artisan key:generate
   ```

5. **Run Migrations and Seed Database**
   ```bash
   php artisan migrate --seed 
   ```

    or without --seed

   ```bash
   php artisan migrate 
   ```

6. **Run the Development Server**
   ```bash
   php artisan serve
   ```
   The backend will be available at `http://localhost:8000`.

---

#### **2. Frontend (Next.js)**

1. **Enter Directory**
   ```bash
   cd evenity-frontend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Run the Development Server**
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:3000`.

---

## ⚠️ Notes

- **Admin Privileges:**
  To make a user an admin, update the `is_admin` field in the `users` table to `1` using your database management tool.

- **Event Reviews:**
  Users can review an event only if they have registered and the registration period has ended. This will display the `EventReview` component on the event page.

- **Known Bugs:**
  1. Login with incorrect credentials briefly shows an error and redirects to the home page.
  2. Occasionally, a second user registered for the same event cannot leave a review.

---

## 📖 License

This project is licensed under the MIT License. See the LICENSE file for details.

---

## 🙌 Contributing

We welcome contributions! If you want to improve Evenity, please fork the repository and submit a pull request.

---


Enjoy using **Evenity** to simplify your event management process! 🎉
