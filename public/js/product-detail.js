function initProductGallery() {
  let galleryThumbs;
  let currentIndex = 0;

  initGalleryThumbs();
  initThumbnailsClickHandlers();
  initNavigationButtons(currentIndex);
  handleImageErrors();
  initLazyLoading();
}

document.addEventListener("DOMContentLoaded", function () {
  initProductGallery();
});

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

function initLazyLoading() {
  const thumbnails = document.querySelectorAll(".pd-gallery-thumb");

  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const image = entry.target;
            const dataSrc = image.getAttribute("data-src");

            // Thêm log để debug
            console.log("Loading image:", dataSrc);
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
