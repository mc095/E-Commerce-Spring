
# JewelleryMart

## Your Online Destination for Exquisite Jewelry

**JewelleryMart** is a comprehensive e-commerce application designed to showcase and sell beautiful jewelry. It's built with a robust **Spring Boot** backend and a dynamic **ReactJS** frontend, offering a seamless and secure experience for both customers and administrators.

---

## Features

### For Customers:

* **Extensive Product Catalog:** Browse a diverse collection of jewelry, easily navigable by categories.
* **Detailed Product Views:** Get comprehensive information, high-quality images, and pricing for each piece.
* **Intuitive Shopping Cart:** Effortlessly add items, adjust quantities, and manage your selections.
* **Secure & Smooth Checkout:** A guided process for secure order placement.
* **User Account Management:** Register, log in, and personalize your profile.
* **Order Tracking:** Keep an eye on the status of your past and current orders.
* **Coupon Application:** Enjoy discounts by applying coupons at checkout.
* **Direct Contact:** A simple way to reach out for support or inquiries.

### For Administrators:

* **Dashboard Overview:** A centralized view of sales, orders, and user activity.
* **Product Management:** Full control to add, edit, or remove jewelry products.
* **Order Fulfillment:** Efficiently view and manage all customer orders.
* **User Administration:** Manage user accounts and permissions.
* **Coupon Control:** Create, modify, and deactivate promotional coupons.
* **Cart Monitoring:** Oversee active shopping carts.

---

## Technologies Used

### Backend (Spring Boot)

* **Spring Boot**: Rapid application development framework.
* **Spring Security**: Handles authentication and authorization.
* **Spring Data JPA**: Simplifies data access and persistence with relational databases.
* **Maven**: Dependency management and build automation.
* **Database**: (e.g., MySQL, PostgreSQL, H2) - *Please specify the database you are using here.*

### Frontend (ReactJS)

* **ReactJS**: JavaScript library for building user interfaces.
* **Vite**: A fast, modern build tool for frontend development.
* **Tailwind CSS**: A utility-first CSS framework for quickly building custom designs.
* **React Router DOM**: For client-side routing.
* **Axios**: Promise-based HTTP client for making API requests.
* **ESLint**: For maintaining code quality and consistency.

---

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.



https://excalidraw.com/#json=lq59ZBAmcw1TmIV13AqOS,rwsqV-A8kB9kPPBTrtihyg

### Prerequisites

* **Java Development Kit (JDK)**: Version 17 or higher.
* **Node.js**: LTS version recommended.
* **npm** : Package managers for Node.js (npm comes with Node.js).
* MongoDB
* Maven

### Installation

1.  **Clone the repository:**
    ```bash
    git clone 
    cd JewelleryMart
    ```

2.  **Backend Setup:**
    * Navigate to the root directory of the Spring Boot application:
        ```bash
        cd JewelleryMart
        ```
    * Install the dependencies :
        ```bash
        mvn clean install
        ```
   
    * **Run the Spring Boot application:**
        ```bash
        mvn spring-boot:run
        ```
        The backend will typically start on `http://localhost:8080`.

3.  **Frontend Setup:**
    * Navigate to the `client` directory:
        ```bash
        cd client
        ```
    * **Install dependencies:**
        ```bash
        npm install
        # or yarn install
        ```
    * **Start the React development server:**
        ```bash
        npm run dev
        # or yarn dev
        ```
        The frontend will usually run on `http://localhost:5173` 

---

## Project Structure

````

jewelleryMart
├─ .mvn
│  └─ wrapper
│     └─ maven-wrapper.properties
├─ client
│  ├─ eslint.config.js
│  ├─ index.html
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ public
│  │  ├─ frame.png
│  │  └─ vite.svg
│  ├─ README.md
│  ├─ src
│  │  ├─ App.jsx
│  │  ├─ assets
│  │  │  └─ react.svg
│  │  ├─ components
│  │  │  └─ AdminLayout.jsx
│  │  ├─ hooks
│  │  │  └─ useCheckoutGuard.js
│  │  ├─ index.css
│  │  ├─ main.jsx
│  │  ├─ pages
│  │  │  ├─ Account.jsx
│  │  │  ├─ admin
│  │  │  │  ├─ AdminDashboard.jsx
│  │  │  │  ├─ CartsAdmin.jsx
│  │  │  │  ├─ CouponsAdmin.jsx
│  │  │  │  ├─ Dashboard.jsx
│  │  │  │  ├─ OrdersAdmin.jsx
│  │  │  │  ├─ ProductsAdmin.jsx
│  │  │  │  └─ UsersAdmin.jsx
│  │  │  ├─ Cart.jsx
│  │  │  ├─ Category.jsx
│  │  │  ├─ Checkout.jsx
│  │  │  ├─ Collections.jsx
│  │  │  ├─ Contact.jsx
│  │  │  ├─ Delivery.jsx
│  │  │  ├─ ForgetPassword.jsx
│  │  │  ├─ Home.jsx
│  │  │  ├─ Login.jsx
│  │  │  ├─ Payment.jsx
│  │  │  ├─ Product.jsx
│  │  │  ├─ Signup.jsx
│  │  │  └─ Success.jsx
│  │  └─ utils
│  │     └─ storage.js
│  ├─ tailwind.config.js
│  └─ vite.config.js
├─ mvnw
├─ mvnw.cmd
├─ pom.xml
├─ README.md
└─ src
   └─ main
      ├─ java
      │  └─ com
      │     └─ ecommerce
      │        └─ jewelleryMart
      │           ├─ config
      │           │  └─ SecurityConfig.java
      │           ├─ controller
      │           │  ├─ AuthController.java
      │           │  ├─ CartController.java
      │           │  ├─ CheckoutController.java
      │           │  ├─ CouponController.java
      │           │  ├─ OrderController.java
      │           │  ├─ ProductController.java
      │           │  └─ UserController.java
      │           ├─ JewelleryMartApplication.java
      │           ├─ model
      │           │  ├─ Cart.java
      │           │  ├─ Coupon.java
      │           │  ├─ Order.java
      │           │  ├─ Product.java
      │           │  └─ User.java
      │           └─ repository
      │              ├─ CartRepository.java
      │              ├─ CouponRepository.java
      │              ├─ OrderRepository.java
      │              ├─ ProductRepository.java
      │              └─ UserRepository.java
      └─ resources
         ├─ application.properties
         └─ templates
    
