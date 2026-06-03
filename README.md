# VWings24x7 Teacher Application

A modern, responsive web application for teachers of the VWings24x7 platform. This application provides teachers with tools to manage their courses, view schedules, interact with students, and track their salaries and payouts.

## 🚀 Key Features

*   **Dashboard:** Overview of classes, students, and key metrics.
*   **Course Management:** View and manage assigned courses and curriculum.
*   **Student Interaction:** Communicate with students in enrolled classes.
*   **Salary & Payouts:** Track earnings, view salary slips, and manage payout methods.
*   **Global Search:** Quickly find courses, students, or administrative items.
*   **Responsive Design:** Fully responsive interface optimized for desktop, tablet, and mobile viewing.

## 🛠️ Technology Stack

*   **Frontend Framework:** React 19
*   **Build Tool:** Vite
*   **Routing:** React Router v7
*   **Styling:** Custom CSS (with a comprehensive Design System)
*   **Icons:** Lucide React
*   **Animations:** Framer Motion

## ⚙️ Local Development Setup

Follow these steps to set up the project locally:

### Prerequisites

*   Node.js (v18 or higher recommended)
*   npm (Node Package Manager)

### Installation

1.  **Clone the repository:**
    (Assuming you have access to the source code)
    ```bash
    git clone <repository-url>
    cd VWings24x7-Teacher-App
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Variables:**
    Create a `.env` file in the root directory and configure the necessary environment variables (e.g., API Base URL).
    ```env
    VITE_API_BASE_URL=http://localhost:8000
    ```

4.  **Start the development server:**
    ```bash
    npm run dev
    ```

5.  **Access the application:**
    Open your browser and navigate to the URL provided in the terminal (usually `http://localhost:5173`).

## 📁 Project Structure

*   `src/components/`: Reusable UI components (e.g., GlobalSearch, Navigation).
*   `src/screens/`: Main application pages and views.
*   `src/theme.js`: Centralized theme configuration and styling constants.
*   `src/App.jsx`: Main application component and routing configuration.
*   `src/main.jsx`: Application entry point.

## 📜 Available Scripts

*   `npm run dev`: Starts the Vite development server.
*   `npm run build`: Builds the app for production to the `dist` folder.
*   `npm run lint`: Runs ESLint to check for code quality and style issues.
*   `npm run preview`: Locally previews the production build.
