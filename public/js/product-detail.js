document.addEventListener("DOMContentLoaded", function () {
  initProductGallery();
  initVariantSelection();
});

// Initialize product gallery
function initProductGallery() {
  let galleryThumbs;
  let currentIndex = 0;

  initGalleryThumbs();
  initThumbnailsClickHandlers();
  initNavigationButtons(currentIndex);
  handleImageErrors();
  initLazyLoading();
}

// Initialize gallery thumbs
function initGalleryThumbs() {
  // Initialize Swiper for gallery thumbs
  galleryThumbs = new Swiper(".gallery-thumbs", {
    spaceBetween: 10,
    slidesPerView: 4,
    watchSlidesVisibility: true,
    watchSlidesProgress: true,
    loop: true,
    navigation: {
      nextEl: ".pd-image-nav.next",
      prevEl: ".pd-image-nav.prev",
    },
    breakpoints: {
      576: { slidesPerView: 3 },
      768: { slidesPerView: 4 },
      992: { slidesPerView: 4 },
    },
  });
}

// Handle click on thumbnail
function initThumbnailsClickHandlers() {
  document.querySelectorAll(".pd-gallery-thumb").forEach((thumb, index) => {
    thumb.addEventListener("click", function () {
      // Get the real index from Swiper's slides array
      const swiper = this.closest(".swiper-slide").swiper;
      const realIndex = swiper ? swiper.realIndex : index;
      updateMainImage(this, realIndex);
    });
  });
}

// Update main image
function updateMainImage(thumbnailElement, index) {
  // 1. Cập nhật UI để hiển thị trạng thái đang tải
  const mainImage = document.getElementById("main-product-image");
  const loadingSpinner = document.querySelector(".loading-spinner");

  // Hiển thị loading spinner
  if (loadingSpinner) {
    loadingSpinner.style.display = "block";
  }

  // 2. Preload image
  const newImg = new Image();
  newImg.onload = function () {
    // Ẩn loading khi ảnh đã tải xong
    mainImage.src = thumbnailElement.src;
    if (loadingSpinner) {
      loadingSpinner.style.display = "none";
    }

    // Thêm hiệu ứng fade-in cho ảnh mới
    mainImage.classList.add("fade-in");
    setTimeout(() => mainImage.classList.remove("fade-in"), 500);
  };
  newImg.src = thumbnailElement.src;

  // 3. Cập nhật trạng thái active cho thumbnail
  // QUAN TRỌNG: Cập nhật cả trong Swiper và trên DOM

  // Cập nhật active slide trong Swiper
  if (typeof galleryThumbs !== "undefined") {
    galleryThumbs.slideTo(index);
  }

  // Cập nhật trạng thái visual active trên các slide
  const slides = document.querySelectorAll(".gallery-thumbs .swiper-slide");
  slides.forEach((slide) => slide.classList.remove("swiper-slide-active"));

  // Tìm slide chứa thumbnail hiện tại và thêm active
  const parentSlide = thumbnailElement.closest(".swiper-slide");
  if (parentSlide) {
    parentSlide.classList.add("swiper-slide-active");
  }
  // 4. Cập nhật biến currentIndex để nút prev/next biết vị trí hiện tại
  currentIndex = index;
}

// Handle navigation buttons
function initNavigationButtons(currentIndex) {
  const prevButton = document.querySelector(".pd-image-nav.prev");
  const nextButton = document.querySelector(".pd-image-nav.next");
  const thumbnails = document.querySelectorAll(".pd-gallery-thumb");

  if (prevButton && nextButton && thumbnails.length > 0) {
    // Xử lý nút Previous
    prevButton.addEventListener("click", () => {
      // Use Swiper's real index calculation
      const swiper = document.querySelector(".gallery-thumbs").swiper;
      currentIndex = swiper.realIndex;
      currentIndex =
        (currentIndex - 1 + productData.images.length) %
        productData.images.length;

      // Use Swiper's slideTo with real index
      swiper.slideToLoop(currentIndex);
      thumbnails[currentIndex].click();
    });

    // Xử lý nút Next
    nextButton.addEventListener("click", () => {
      const swiper = document.querySelector(".gallery-thumbs").swiper;
      currentIndex = swiper.realIndex;
      currentIndex = (currentIndex + 1) % productData.images.length;

      swiper.slideToLoop(currentIndex);
      thumbnails[currentIndex].click();
    });

    // Thêm sự kiện keyboard cho phép điều hướng bằng phím mũi tên
    document.addEventListener("keydown", (e) => {
      // Chỉ xử lý khi người dùng đang focus vào gallery
      const galleryHasFocus =
        document.activeElement ===
          document.getElementById("main-product-image") ||
        document.querySelector(".pd-images").contains(document.activeElement);

      if (galleryHasFocus || document.activeElement === document.body) {
        if (e.key === "ArrowLeft") {
          prevButton.click();
          e.preventDefault();
        } else if (e.key === "ArrowRight") {
          nextButton.click();
          e.preventDefault();
        }
      }
    });
  }
}

// Handle image errors
function handleImageErrors() {
  // Xử lý lỗi khi tải ảnh thất bại
  const mainImage = document.getElementById("main-product-image");
  const thumbnails = document.querySelectorAll(".pd-gallery-thumb");

  // 1. Xử lý lỗi cho ảnh chính
  mainImage.addEventListener("error", function () {
    // Hiển thị ảnh thay thế khi không tải được ảnh chính
    this.src = "/images/placeholder-image.jpg";
    this.alt = "Image not available";

    // Ẩn loading spinner nếu có
    const loadingSpinner = document.querySelector(".loading-spinner");
    if (loadingSpinner) {
      loadingSpinner.style.display = "none";
    }
  });

  // 2. Xử lý lỗi cho các thumbnails
  thumbnails.forEach((thumb) => {
    thumb.addEventListener("error", function () {
      // Hiển thị ảnh thay thế cho thumbnails
      this.src = "/images/placeholder-thumbnail.jpg";
      this.alt = "Thumbnail not available";
    });
  });
}

// Lazy loading for thumbnails
function initLazyLoading() {
  const thumbnails = document.querySelectorAll(".pd-gallery-thumb");

  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const image = entry.target;
            const dataSrc = image.getAttribute("data-src");

            if (dataSrc) {
              image.src = dataSrc;
              image.removeAttribute("data-src");

              // Thêm class loading khi đang tải
              image.classList.add("loading");
              image.onload = () => {
                image.classList.remove("loading");
                image.classList.add("loaded");
              };
            }
            observer.unobserve(image);
          }
        });
      },
      {
        rootMargin: "200px 0px", // Tải trước 200px khi scroll
        threshold: 0.1,
      }
    );

    thumbnails.forEach((thumb) => {
      if (thumb.getAttribute("data-src")) {
        // Thêm placeholder trước khi tải
        thumb.style.backgroundColor = "#f0f0f0";
        imageObserver.observe(thumb);
      }
    });
  } else {
    // Fallback cho trình duyệt không hỗ trợ Intersection Observer
    thumbnails.forEach((thumb) => {
      const dataSrc = thumb.getAttribute("data-src");
      if (dataSrc) {
        thumb.src = dataSrc;
      }
    });
  }
}

// Initialize variant selection------------------------------------------------------
let selectedAttributes = {};
let currentVariant = defaultVariant || null;
function initVariantSelection() {
  initDefaultVariant();
  setupAttributeButtons();
  initQuantityControls();
}

// Initialize default variant
function initDefaultVariant() {
  if (currentVariant) {
    currentVariant.attributes.forEach((attr) => {
      selectedAttributes[attr.type] = attr.value;
    });
  }

  if (currentVariant) {
    Object.entries(selectedAttributes).forEach(([type, value]) => {
      const buttons = document.querySelectorAll(
        `.pd-attribute-options[data-attribute="${type}"] .pd-attribute-option`
      );
      buttons.forEach((button) => {
        const buttonValue = JSON.parse(button.dataset.value);
        if (buttonValue.value === value) {
          button.classList.add("active");
        }
      });
    });

    // Cập nhật hidden input
    const variantInput = document.getElementById("selected-variant-info");
    if (variantInput) {
      variantInput.style.display = "block";
      variantInput.innerHTML = `
        <p>${productData.title}: ${currentVariant.name}</p>
      `;
    }
    const variantStock = document.getElementById("variant-stock");
    const iconElement = document.getElementById("stock-icon");
    if (variantStock) {
      const stockQuantity = currentVariant.stock;
      variantStock.innerText = `Stock: ${stockQuantity}`;
      if (stockQuantity > 10) {
        variantStock.setAttribute("class", "text-success");
        iconElement.setAttribute("class", "fas fa-check-circle");
      } else if (stockQuantity > 0) {
        variantStock.setAttribute("class", "text-warning");
        iconElement.setAttribute("class", "fas fa-exclamation-circle");
      } else {
        variantStock.setAttribute("class", "text-danger");
        iconElement.setAttribute("class", "fas fa-times-circle");
      }
    }
  }
}

// Setup attribute buttons
function setupAttributeButtons() {
  // Lấy tất cả các nút thuộc tính
  const attributeButtons = document.querySelectorAll(".pd-attribute-option");

  // Thêm sự kiện click cho mỗi nút
  attributeButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // 1. Lấy thông tin thuộc tính từ nút được click
      const attributeContainer = this.closest(".pd-attribute-options");
      const attributeName = attributeContainer.dataset.attribute;
      const attributeValueObject = JSON.parse(this.dataset.value);
      const attributeValue = attributeValueObject.value;
      // 2. Cập nhật trạng thái active của UI
      // Xóa active cho tất cả các nút trong cùng nhóm thuộc tính
      attributeContainer
        .querySelectorAll(".pd-attribute-option")
        .forEach((btn) => {
          btn.classList.remove("active");
        });

      // Thêm active cho nút được chọn
      this.classList.add("active");

      // 3. Cập nhật trạng thái dữ liệu
      selectedAttributes[attributeName] = attributeValue;
      // 4. Tìm biến thể phù hợp với các thuộc tính đã chọn
      findMatchingVariant();

      // 5. Cập nhật UI dựa trên biến thể được tìm thấy
      updateUIForCurrentVariant();
    });
  });
}

// Find matching variant
function findMatchingVariant() {
  // 1. Lấy tất cả thuộc tính đã chọn
  const attributeCount = Object.keys(selectedAttributes).length;
  // 2. Duyệt qua tất cả biến thể để tìm biến thể khớp
  currentVariant = productData.variants.find((variant) => {
    // Biến thể phải có đúng số lượng thuộc tính
    if (variant.attributes.length !== attributeCount) return false;

    // Kiểm tra xem tất cả thuộc tính của biến thể có khớp với thuộc tính đã chọn không
    return variant.attributes.every(
      (attr) => selectedAttributes[attr.type] === attr.value
    );
  });

  // 3. Cập nhật giá trị biến thể đã chọn cho form
  if (currentVariant) {
    document.getElementById("selected-variant-id").value = currentVariant._id;
  } else {
    // Xử lý trường hợp không tìm thấy biến thể phù hợp
    document.getElementById("selected-variant-id").value = "";
  }
  return currentVariant;
}

// Update UI for current variant
function updateUIForCurrentVariant() {
  // 1. Cập nhật giá và khuyến mãi
  updatePriceDisplay();

  // 2. Cập nhật trạng thái tồn kho
  updateStockStatus();

  // 3. Cập nhật thông tin biến thể đã chọn
  updateSelectedVariantInfo();

  // 4. Cập nhật trạng thái nút mua hàng
  updateBuyButtons();
}

// Update price display
function updatePriceDisplay() {
  const originalPriceElement = document.getElementById(
    "variant-original-price"
  );
  const finalPriceElement = document.getElementById("variant-final-price");
  const discountElement = document.getElementById("variant-discount");

  if (currentVariant) {
    // Tính toán giá sau giảm giá
    const originalPrice = currentVariant.price;
    const discountPercentage = currentVariant.discountPercentage || 0;
    const finalPrice =
      originalPrice - (originalPrice * discountPercentage) / 100;

    // Cập nhật UI
    originalPriceElement.textContent = `${originalPrice}$ `;
    finalPriceElement.textContent = `${finalPrice.toFixed(2)}$ `;

    // Hiển thị hoặc ẩn phần giảm giá
    if (discountPercentage > 0) {
      discountElement.textContent = `-${discountPercentage}%`;
      discountElement.style.display = "inline-block";
      originalPriceElement.style.display = "inline-block";
    } else {
      discountElement.style.display = "none";
      originalPriceElement.style.display = "none";
    }
  } else {
    // Nếu không có biến thể phù hợp, hiển thị thông báo hết hàng hoặc không có sẵn
    originalPriceElement.style.display = "none";
    discountElement.style.display = "none";
    finalPriceElement.textContent = "Không có sẵn";
  }
}

// Update stock status
function updateStockStatus() {
  const stockElement = document.getElementById("variant-stock");
  if (currentVariant) {
    const stockQuantity = currentVariant.stock;
    const iconElement = document.getElementById("stock-icon");
    // Hiển thị trạng thái tồn kho
    if (stockQuantity > 10) {
      stockElement.setAttribute("class", "text-success");
      iconElement.setAttribute("class", "fas fa-check-circle");
      stockElement.innerHTML = `Stock: ${stockQuantity}`;
    } else if (stockQuantity > 0) {
      stockElement.setAttribute("class", "text-warning");
      iconElement.setAttribute("class", "fas fa-exclamation-circle");
      stockElement.innerHTML = `Stock: ${stockQuantity}`;
    } else {
      stockElement.setAttribute("class", "text-danger");
      iconElement.setAttribute("class", "fas fa-times-circle");
      stockElement.innerHTML = `Sold out`;
    }
  } else {
    stockElement.setAttribute("class", "text-secondary");
    stockElement.innerHTML = `<i class="fas fa-ban"></i> Không có sẵn`;
  }
}

// Update selected variant info
function updateSelectedVariantInfo() {
  const variantInfoElement = document.getElementById("selected-variant-info");

  if (currentVariant) {
    // Tạo HTML hiển thị thông tin biến thể đã chọn
    variantInfoElement.innerHTML = `
      <p>${productData.title}: ${currentVariant.name}</p>
    `;

    variantInfoElement.style.display = "block";
  } else {
    // Ẩn thông tin nếu không có biến thể phù hợp
    variantInfoElement.style.display = "none";
  }
}

// Update buy buttons
function updateBuyButtons() {
  const buyNowButton = document.querySelector(".pd-btn-buy");
  const addToCartButton = document.querySelector(".pd-btn-cart");
  const quantityInput = document.getElementById("quantity-input");
}

// Initialize quantity controls
function initQuantityControls() {
  const decreaseBtn = document.getElementById("decrease-quantity");
  const increaseBtn = document.getElementById("increase-quantity");
  const quantityInput = document.getElementById("quantity-input");

  decreaseBtn.addEventListener("click", function () {
    let value = parseInt(quantityInput.value);
    if (value > 1) {
      quantityInput.value = value - 1;
    }
  });

  increaseBtn.addEventListener("click", function () {
    let value = parseInt(quantityInput.value);
    let max = currentVariant ? currentVariant.stock : 0;

    if (value < max) {
      quantityInput.value = value + 1;
    } else {
      // Thông báo đã đạt số lượng tối đa
      showToast("warning", "The maximum quantity is reached");
    }
  });

  // Xử lý thay đổi trực tiếp trên input
  quantityInput.addEventListener("change", function () {
    let value = parseInt(this.value);
    let max = currentVariant ? currentVariant.stock : 0;

    // Đảm bảo giá trị hợp lệ
    if (isNaN(value) || value < 1) {
      this.value = 1;
    } else if (value > max) {
      this.value = max;
      showToast("warning", "The maximum quantity is reached");
    }
  });
}
