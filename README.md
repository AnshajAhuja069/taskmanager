# 📌 **Task Management App**

## 📜 **Table of Contents**
- [📖 Introduction](#-introduction)
- [🛠 Installation and Setup](#-installation-and-setup)
- [🚀 Features](#-features)
- [⚡ Challenges and Solutions](#-challenges-and-solutions)
- [💻 Technical Requirements](#-technical-requirements)
- [📜 Markdown Syntax Guide](#-markdown-syntax-guide)

---

## 📖 **Introduction**
This project is a **task management application** built using **React with TypeScript**, **Firebase** for authentication and data storage, and **React Query** for efficient data fetching and state management. The application provides a user-friendly interface with powerful **task organization features, batch actions, activity logs, and responsive design**.

---

## 🛠 **Installation and Setup**
### **📌 Prerequisites:**
- **Node.js** (v16+ recommended)
- **Firebase account**
- **Firebase project set up** with Authentication and Firestore Database enabled

### **📌 Steps to Run the Project:**
1. **Clone the repository:**

2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Set up Firebase configuration:**
   - Create a **`.env`** file in the root directory.
4. **Start the development server:**
   ```sh
   npm run dev
   ```
5. **Open the app in your browser at:** `http://localhost:3000`

---

## 🚀 **Features**

### ✅ **1. User Authentication**
- 🔐 **Firebase Authentication** with Google Sign-In.
- 👤 **Profile management** (view and update user profile information).

### ✅ **2. Task Management**
- 📌 **Create, edit, and delete tasks**.
- 📂 **Categorize tasks** (work, personal, etc.).
- 🏷️ **Tagging for better organization**.
- 📅 **Set due dates for tasks**.
- 🔄 **Drag-and-drop functionality** to reorder tasks.
- 📊 **Sort tasks by due date** (ascending/descending).

### ✅ **3. Batch Actions**
- 📌 **Select multiple tasks** to delete or mark as complete.

### ✅ **4. Task History and Activity Log**
- 📝 **Track changes** made to tasks (creation, edits, deletions).
- 🔍 **Display an activity log** for each task.

### ✅ **5. File Attachments**
- 📎 **Attach files/documents** to tasks.
- 📤 **File upload feature** in task creation/editing form.
- 🖼️ **View attached files** in task details.

### ✅ **6. Filter Options**
- 🔍 **Filter tasks** by tags, category, and date range.
- 🔎 **Search tasks** by title.

### ✅ **7. Board/List View**
- 📋 **Toggle between Kanban-style board view and traditional list view**.

### ✅ **8. Responsive Design**
- 📱 **Mobile-first approach** ensuring responsiveness across different screen sizes.

---

## ⚡ **Challenges and Solutions**

### 🔹 **1. Authentication Integration**
💡 **Challenge:** Implementing Firebase authentication with Google Sign-In and ensuring seamless user session management.  
✅ **Solution:** Used Firebase Authentication SDK with React Context API to manage authentication state efficiently.

### 🔹 **2. Task Drag-and-Drop Functionality**
💡 **Challenge:** Implementing smooth drag-and-drop task reordering.  
✅ **Solution:** Used the `react-beautiful-dnd` library to allow intuitive task movement.

### 🔹 **3. Efficient State Management**
💡 **Challenge:** Managing state efficiently with real-time updates and minimizing unnecessary re-renders.  
✅ **Solution:** Utilized React Query for optimized data fetching, caching, and automatic updates.

### 🔹 **4. File Upload Handling**
💡 **Challenge:** Allowing users to attach files to tasks while ensuring secure storage and retrieval.  
✅ **Solution:** Used Firebase Storage for secure file uploads and provided real-time file previews.

### 🔹 **5. Responsive UI Design**
💡 **Challenge:** Ensuring a seamless user experience across all devices.  
✅ **Solution:** Used CSS Grid, Flexbox, and media queries with a mobile-first design approach.

---

## 💻 **Technical Requirements**
- **🟢 Frontend:** React with TypeScript
- **🟢 Authentication & Database:** Firebase Authentication, Firestore Database
- **🟢 State Management:** React Query
- **🟢 Styling:** CSS Modules / Styled Components / Tailwind CSS
- **🟢 Drag and Drop:** `react-beautiful-dnd`
- **🟢 File Storage:** Firebase Storage
- **🟢 Deployment:** Vercel / Firebase Hosting (Optional)

---

