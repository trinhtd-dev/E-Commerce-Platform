/**
 * Xử lý lazy loading cho hình ảnh sản phẩm
 * Sử dụng Intersection Observer API để tải ảnh khi chúng xuất hiện trong viewport
 */
document.addEventListener("DOMContentLoaded", function () {
  // Kiểm tra xem trình duyệt có hỗ trợ Intersection Observer không
  if ("IntersectionObserver" in window) {
    const lazyImages = document.querySelectorAll(".lazy-image");

    const imageObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          // Khi phần tử xuất hiện trong viewport
          if (entry.isIntersecting) {
            const img = entry.target;
            // Lấy URL từ data-src và chuyển vào src
            const src = img.getAttribute("data-src");

            if (src) {
              // Tạo một hình ảnh tạm để đảm bảo tải đúng cách
              const tempImage = new Image();
              tempImage.onload = function () {
                img.src = src;
                img.classList.add("loaded");

                // Xác định placeholder và ẩn đi
                const productImage = img.closest(".product-image");
                if (productImage) {
                  const placeholder = productImage.querySelector(
                    ".lazy-load-placeholder"
                  );
                  if (placeholder) {
                    placeholder.style.opacity = "0";
                    placeholder.style.visibility = "hidden";
                  }
                }
              };
              tempImage.onerror = function () {
                // Nếu lỗi, hiển thị ảnh mặc định
                img.src = "/images/default-product.jpg";
                img.classList.add("loaded");

                // Ẩn placeholder ngay cả khi lỗi
                const productImage = img.closest(".product-image");
                if (productImage) {
                  const placeholder = productImage.querySelector(
                    ".lazy-load-placeholder"
                  );
                  if (placeholder) {
                    placeholder.style.opacity = "0";
                    placeholder.style.visibility = "hidden";
                  }
                }
              };
              tempImage.src = src;
            }

            // Ngừng theo dõi đối tượng này sau khi đã xử lý
            observer.unobserve(img);
          }
        });
      },
      {
        // Thiết lập ngưỡng hiển thị
        rootMargin: "50px 0px",
        threshold: 0.01,
      }
    );

    // Đăng ký từng ảnh để theo dõi
    lazyImages.forEach(function (image) {
      imageObserver.observe(image);
    });
  } else {
    // Dự phòng cho trình duyệt không hỗ trợ Intersection Observer
    // Tải tất cả ảnh ngay lập tức
    const lazyImages = document.querySelectorAll(".lazy-image");

    lazyImages.forEach(function (img) {
      if (img.getAttribute("data-src")) {
        img.setAttribute("src", img.getAttribute("data-src"));
        img.classList.add("loaded");

        // Ẩn placeholder luôn
        const productImage = img.closest(".product-image");
        if (productImage) {
          const placeholder = productImage.querySelector(
            ".lazy-load-placeholder"
          );
          if (placeholder) {
            placeholder.style.opacity = "0";
            placeholder.style.visibility = "hidden";
          }
        }
      }
    });
  }

  // Xử lý nút "Thêm vào giỏ" và các nút hành động khác
  const addToCartButtons = document.querySelectorAll(
    ".product-actions button.btn-primary"
  );

  addToCartButtons.forEach(function (button) {
    button.addEventListener("click", function (e) {
      if (button.disabled) return;

      const productCard = button.closest(".product-card");
      const productTitle =
        productCard.querySelector(".product-title").textContent;

      // Animation khi thêm vào giỏ
      button.innerHTML = '<i class="fas fa-check me-1"></i> Đã thêm';
      button.classList.remove("btn-primary");
      button.classList.add("btn-success");

      setTimeout(function () {
        button.innerHTML =
          '<i class="fas fa-shopping-cart me-1"></i> Thêm vào giỏ';
        button.classList.remove("btn-success");
        button.classList.add("btn-primary");
      }, 2000);

      console.log(`Đã thêm sản phẩm "${productTitle}" vào giỏ hàng`);
    });
  });

  // Xử lý các nút yêu thích
  const wishlistButtons = document.querySelectorAll(
    ".product-actions .btn-outline-danger"
  );

  wishlistButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      button.classList.toggle("active");
      if (button.classList.contains("active")) {
        button.classList.remove("btn-outline-danger");
        button.classList.add("btn-danger");
      } else {
        button.classList.remove("btn-danger");
        button.classList.add("btn-outline-danger");
      }
    });
  });
});
