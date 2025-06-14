# E-Commerce-Platform

<div id="top" align="center">
  <a href="https://trinhtd.vercel.app/">
    <img src="https://img.icons8.com/color/96/000000/shop.png" alt="Logo" width="80" height="80">
  </a>

  <h1 align="center">E-Commerce-Platform</h1>

  <p align="center">
    Comprehensive E-Commerce Solution with Node.js and Express
    <br />
    <a href="https://trinhtd.vercel.app/"><strong>View Demo »</strong></a>
    <br />
    <br />
  </p>
</div>

<div align="center">

[![Node.js][Node.js-badge]][Node-url]
[![Express][Express-badge]][Express-url]
[![MongoDB][MongoDB-badge]][MongoDB-url]
[![Pug][Pug-badge]][Pug-url]
[![Bootstrap][Bootstrap-badge]][Bootstrap-url]
[![Socket.io][Socketio-badge]][Socketio-url]

</div>

<details>
  <summary>📑 Table of Contents</summary>
  <ol>
    <li><a href="#-introduction">Introduction</a></li>
    <li><a href="#-key-features">Key Features</a></li>
    <li><a href="#-technologies-used">Technologies Used</a></li>
    <li><a href="#-system-requirements">System Requirements</a></li>
    <li><a href="#-installation-and-setup">Installation and Setup</a></li>
    <li><a href="#-project-structure">Project Structure</a></li>
    <li><a href="#-deployment">Deployment</a></li>
    <li><a href="#-future-enhancements">Future Enhancements</a></li>
    <li><a href="#-contact">Contact</a></li>
  </ol>
</details>

<a id="introduction"></a>

## 🌟 Introduction

E-Commerce-Plfatform is a comprehensive web application built with Node.js and Express that enables businesses to manage products, users, orders, and more. The system includes both an admin panel for managing the platform and a client interface for end users to browse products, place orders, and interact with each other.

<div align="center">
  <img src="./public/images/demo.png" alt="Demo Screenshot" width="80%">
</div>

<p align="right"><a href="#top">back to top</a></p>

<a id="key-features"></a>

## ✨ Key Features

<details open>
  <summary><b>💼 Admin Panel</b></summary>
  <br>
  
  - 📊 **Dashboard**: Overview of key metrics (users, products, orders, revenue)
  - 📦 **Product Management**: Create, edit, delete products with variants and attributes
  - 📁 **Category Management**: Organize products by categories
  - 👥 **User Management**: Manage user accounts and permissions
  - 🛒 **Order Management**: Track and process customer orders
  - 🔐 **Role-based Access Control**: Define user roles and permissions
  - ⚙️ **General Settings**: Configure system-wide settings
</details>

<details open>
  <summary><b>🛍️ Client Interface</b></summary>
  <br>
  
  - 🔑 **User Authentication**: Register, login, and password recovery
  - 🔍 **Product Browsing**: Browse products by category with search functionality
  - 🛒 **Shopping Cart**: Add products to cart and manage quantities
  - 💳 **Checkout Process**: Complete purchases with shipping information
  - 📜 **Order History**: View past orders and their status
  - 👤 **User Profiles**: Update personal information and addresses
  - 💬 **Real-time Chat**: Communicate with other users via chat
</details>

<p align="right"><a href="#top">back to top</a></p>

<a id="technologies-used"></a>

## 🛠️ Technologies Used

|      **Category**       | **Technologies**      |
| :---------------------: | :-------------------- |
|         Backend         | Node.js, Express      |
|        Database         | MongoDB with Mongoose |
|     Template Engine     | Pug                   |
|     Authentication      | JWT, bcrypt           |
|       File Upload       | Multer, Cloudinary    |
| Real-time Communication | Socket.io             |
|         Logging         | Winston               |
|        Frontend         | Bootstrap, JavaScript |
|       Text Editor       | TinyMCE               |

<p align="right"><a href="#top">back to top</a></p>

<a id="system-requirements"></a>

## 💻 System Requirements

- Node.js (version 18.x or higher recommended)
- MongoDB
- npm or yarn

<p align="right"><a href="#top">back to top</a></p>

<a id="installation-and-setup"></a>

## 🚀 Installation and Setup

<details>
  <summary><b>Install Dependencies</b></summary>
  
```bash
# Clone the repository
git clone [repository-url]

# Navigate to the project directory

cd project-management

# Install dependencies

npm install

```
</details>

<details>
  <summary><b>Environment Configuration</b></summary>

Create a `.env` file in the root directory with the following content:

```

PORT=3000
MONGODB_URI=mongodb://localhost:27017/project-management
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password

````
</details>

<details>
  <summary><b>Launch the Application</b></summary>

```bash
# Run the application with Node.js
npm start
````

Access the application at `http://localhost:3000`

</details>

<p align="right"><a href="#top">back to top</a></p>

<a id="project-structure"></a>

## 📂 Project Structure

```
project-management/
├── config/         # Configuration files (database, logger, etc.)
├── controllers/    # Business logic handlers
├── helpers/        # Helper functions
├── middlewares/    # Express middlewares
├── models/         # MongoDB data models
├── public/         # Static resources (CSS, JS, images)
├── routes/         # API and page routes
│   ├── admin/      # Admin panel routes
│   └── client/     # Client interface routes
├── sockets/        # Socket.io event handlers
├── uploads/        # Temporary file uploads
├── views/          # Pug templates
│   ├── admin/      # Admin panel views
│   └── client/     # Client interface views
├── validates/      # Input validation
├── .env            # Environment variables
├── .gitignore      # Files and directories to ignore when committing
├── index.js        # Application entry point
└── package.json    # Project configuration and dependencies
```

<p align="right"><a href="#top">back to top</a></p>

<a id="deployment"></a>

## 🌐 Deployment

> The application is configured for deployment on Vercel with the included `vercel.json` configuration file.
>
> **Live Demo**: [https://trinhtd.vercel.app/](https://trinhtd.vercel.app/)

<div align="center">
  <img src="./public/images/demo.png" alt="Live Demo" width="60%">
</div>

<p align="right"><a href="#top">back to top</a></p>

<a id="future-enhancements"></a>

## 🔮 Future Enhancements

- 📱 **Mobile application integration**
- 📊 **Advanced analytics and reporting**
- 💰 **Payment gateway integration**
- 🌍 **Multi-language support**
- 📧 **Email notification system**

<p align="right"><a href="#top">back to top</a></p>

<a id="contact"></a>

## 📞 Contact

If you have any questions or suggestions, please create an issue in the repository or contact the project maintainers.

<div align="center">
  <a href="https://github.com/trinhtd-dev">
    <img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub">
  </a>
  <a href="mailto:tranductrinh2k4@gmail.com">
    <img src="https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white" alt="Email">
  </a>
  <a href="https://www.linkedin.com/in/tr%E1%BA%A7n-%C4%91%E1%BB%A9c-tr%C3%ACnh-92687b283/">
    <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn">
  </a>
</div>

<p align="right"><a href="#top">back to top</a></p>

<!-- Badge definitions -->

[Node.js-badge]: https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white
[Node-url]: https://nodejs.org/
[Express-badge]: https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white
[Express-url]: https://expressjs.com/
[MongoDB-badge]: https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white
[MongoDB-url]: https://www.mongodb.com/
[Pug-badge]: https://img.shields.io/badge/Pug-A86454?style=for-the-badge&logo=pug&logoColor=white
[Pug-url]: https://pugjs.org/
[Bootstrap-badge]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com/
[Socketio-badge]: https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white
[Socketio-url]: https://socket.io/
