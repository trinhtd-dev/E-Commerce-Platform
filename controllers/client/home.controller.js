const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");

const addNewPrice = require("../../helpers/addNewPrice");
const buildCategoryTree = require("../../helpers/buildCategoryTree");

// Index
module.exports.index = async (req, res) => {
  try {
    // Fetch all active categories
    const categories = await ProductCategory.find({
      deleted: false,
      status: "active",
    }).sort({ position: "asc" });

    // Build category tree
    const categoryTree = buildCategoryTree(categories);

    // Fetch featured products
    const products = await Product.find({
      deleted: false,
      status: "active",
      featured: "1",
    }).sort({ position: "asc" });

    // Render view with both category tree and products
    res.render("client/pages/home/index", {
      pageTitle: "Home Page",
      categories: categoryTree,
      products: products ? addNewPrice.items(products) : [],
    });
  } catch (error) {
    console.error("Error in home controller:", error);
    res.status(500).render("client/pages/home/index", {
      pageTitle: "Home Page",
      categories: [],
      products: [],
    });
  }
};

// FAQ Page
module.exports.faq = async (req, res) => {
  try {
    const faqItems = [
      {
        question: "How do I create an account?",
        answer:
          "To create an account, click on the 'Sign Up' button in the top right corner of the screen. Fill in your details in the registration form and click 'Create Account'.",
      },
      {
        question: "How can I track my order?",
        answer:
          "You can track your order by logging into your account and going to the 'Order History' section. Click on the specific order you want to track, and you'll see the current status of your shipment.",
      },
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept various payment methods including credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers. All payments are processed securely through our payment gateway.",
      },
      {
        question: "What is your return policy?",
        answer:
          "We offer a 30-day return policy for most products. Items must be returned in their original condition and packaging. Please check the specific product page for any exceptions to this policy.",
      },
      {
        question: "How long does shipping take?",
        answer:
          "Shipping times vary depending on your location and the selected shipping method. Standard shipping typically takes 3-7 business days within the country and 7-14 days for international orders.",
      },
      {
        question: "Do you ship internationally?",
        answer:
          "Yes, we ship to most countries worldwide. Shipping costs and delivery times vary by location. You can see the shipping options available to your country during checkout.",
      },
      {
        question: "How do I change or cancel my order?",
        answer:
          "You can change or cancel your order within 1 hour of placing it by contacting our customer service team. After this time, we may have already begun processing your order, and cancellation might not be possible.",
      },
      {
        question: "Are there any discounts for bulk orders?",
        answer:
          "Yes, we offer discounts for bulk orders. Please contact our sales team at sales@example.com with details of your requirements, and we'll provide you with a custom quote.",
      },
    ];

    res.render("client/pages/home/faq", {
      title: "Frequently Asked Questions",
      faqItems: faqItems,
    });
  } catch (error) {
    console.error("Error in FAQ controller:", error);
    res.status(500).render("client/pages/error/500", {
      message: "Internal Server Error",
    });
  }
};

// Contact Page
module.exports.contact = async (req, res) => {
  try {
    const contactInfo = {
      address: "PTIT",
      phone: "+84 354647124",
      email: "tranductrinh2k4@gmail.com",
      workingHours: "24/7",
      socialMedia: {
        facebook: "https://facebook.com/example",
        twitter: "https://twitter.com/example",
        instagram: "https://instagram.com/example",
        linkedin: "https://linkedin.com/company/example",
      },
    };

    res.render("client/pages/home/contact", {
      title: "Contact Us",
      contactInfo: contactInfo,
    });
  } catch (error) {
    console.error("Error in Contact controller:", error);
    res.status(500).render("client/pages/error/500", {
      message: "Internal Server Error",
    });
  }
};

// About Page
module.exports.about = async (req, res) => {
  try {
    const aboutInfo = {
      companyName: "Project Management System",
      founded: "2022",
      mission:
        "To provide high-quality products and exceptional service to our customers while maintaining sustainable business practices.",
      vision:
        "To become the leading provider of innovative solutions in our industry, setting standards for quality and customer satisfaction.",
      team: [
        {
          name: "Tran Duc Trinh",
          position: "CEO & Founder",
          bio: "John brings over 15 years of industry experience and a passion for innovative solutions.",
          image:
            "https://res.cloudinary.com/djluoax2m/image/upload/v1723567426/wcgarne2xhtfyq8m7ycg.jpg",
        },
        {
          name: "Tran Duc Trinh",
          position: "Chief Operations Officer",
          bio: "Jane has a background in logistics and supply chain management with expertise in optimizing business processes.",
          image:
            "https://res.cloudinary.com/djluoax2m/image/upload/v1723567426/wcgarne2xhtfyq8m7ycg.jpg",
        },
        {
          name: "Tran Duc Trinh",
          position: "Head of Product Development",
          bio: "Michael leads our product team with his creative vision and technical knowledge.",
          image:
            "https://res.cloudinary.com/djluoax2m/image/upload/v1723567426/wcgarne2xhtfyq8m7ycg.jpg",
        },
        {
          name: "Tran Duc Trinh",
          position: "Customer Relations Manager",
          bio: "Emily ensures our customers always receive the best possible service and support.",
          image:
            "https://res.cloudinary.com/djluoax2m/image/upload/v1723567426/wcgarne2xhtfyq8m7ycg.jpg",
        },
      ],
      milestones: [
        { year: "2022", event: "Company founded" },
        { year: "2023", event: "Company developed" },
        { year: "2024", event: "Company expanded" },
        { year: "2025", event: "Company became the best" },
      ],
    };

    res.render("client/pages/home/about", {
      title: "About Us",
      aboutInfo: aboutInfo,
    });
  } catch (error) {
    console.error("Error in About controller:", error);
    res.status(500).render("client/pages/error/500", {
      message: "Internal Server Error",
    });
  }
};
