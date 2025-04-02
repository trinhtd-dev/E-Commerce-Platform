document.addEventListener("DOMContentLoaded", function () {
  // Initialize map
  const map = L.map("map").setView([10.762622, 106.660172], 13);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(map);

  let marker = null;
  const addressService = {
    async getDistricts(provinceCode) {
      try {
        const response = await fetch(`/api/address/districts/${provinceCode}`);
        return await response.json();
      } catch (error) {
        console.error("Error fetching districts:", error);
        return [];
      }
    },

    async getWards(districtCode) {
      try {
        const response = await fetch(`/api/address/wards/${districtCode}`);
        return await response.json();
      } catch (error) {
        console.error("Error fetching wards:", error);
        return [];
      }
    },

    async validateAddress(address) {
      try {
        const response = await fetch("/api/address/validate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(address),
        });
        return await response.json();
      } catch (error) {
        console.error("Error validating address:", error);
        return null;
      }
    },

    async getShippingFee(address) {
      try {
        const response = await fetch("/api/address/shipping-fee", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(address),
        });
        return await response.json();
      } catch (error) {
        console.error("Error calculating shipping fee:", error);
        return null;
      }
    },
  };

  // Province change handler
  document
    .getElementById("province")
    .addEventListener("change", async function () {
      const provinceCode = this.value;
      const districtSelect = document.getElementById("district");
      const wardSelect = document.getElementById("ward");

      // Reset district and ward selects
      districtSelect.innerHTML = '<option value="">Select District</option>';
      wardSelect.innerHTML = '<option value="">Select Ward/Commune</option>';

      if (provinceCode) {
        const districts = await addressService.getDistricts(provinceCode);
        districts.forEach((district) => {
          const option = document.createElement("option");
          option.value = district.code;
          option.textContent = district.name;
          districtSelect.appendChild(option);
        });
      }
    });

  // District change handler
  document
    .getElementById("district")
    .addEventListener("change", async function () {
      const districtCode = this.value;
      const wardSelect = document.getElementById("ward");

      // Reset ward select
      wardSelect.innerHTML = '<option value="">Select Ward/Commune</option>';

      if (districtCode) {
        const wards = await addressService.getWards(districtCode);
        wards.forEach((ward) => {
          const option = document.createElement("option");
          option.value = ward.code;
          option.textContent = ward.name;
          wardSelect.appendChild(option);
        });
      }
    });

  // Address validation and shipping fee calculation
  async function updateShippingFee() {
    const address = {
      province: document.getElementById("province").value,
      district: document.getElementById("district").value,
      ward: document.getElementById("ward").value,
      street: document.getElementById("street").value,
      houseNumber: document.getElementById("houseNumber").value,
      note: document.getElementById("addressNote").value,
    };

    // Validate address
    const validationResult = await addressService.validateAddress(address);
    if (validationResult && validationResult.coordinates) {
      // Update map marker
      if (marker) {
        map.removeLayer(marker);
      }
      marker = L.marker([
        validationResult.coordinates.lat,
        validationResult.coordinates.lng,
      ]).addTo(map);
      map.setView(
        [validationResult.coordinates.lat, validationResult.coordinates.lng],
        15
      );
    }

    // Calculate shipping fee
    const shippingFee = await addressService.getShippingFee(address);
    if (shippingFee) {
      document.getElementById(
        "shippingFee"
      ).textContent = `$${shippingFee.toFixed(2)}`;
      updateTotalAmount(shippingFee);
    }
  }

  // Update total amount
  function updateTotalAmount(shippingFee) {
    const subtotal = parseFloat(
      document
        .querySelector(".summary-row .summary-value")
        .textContent.replace("$", "")
    );
    const total = subtotal + shippingFee;
    document.getElementById("totalAmount").textContent = `$${total.toFixed(2)}`;
  }

  // Add event listeners for address fields
  ["province", "district", "ward", "street", "houseNumber"].forEach(
    (fieldId) => {
      document
        .getElementById(fieldId)
        .addEventListener("change", updateShippingFee);
    }
  );

  // Shipping method change handler
  document.querySelectorAll('input[name="shippingMethod"]').forEach((radio) => {
    radio.addEventListener("change", updateShippingFee);
  });

  // Form submission handler
  document
    .getElementById("shipping-form")
    .addEventListener("submit", async function (e) {
      e.preventDefault();

      const formData = new FormData(this);
      const orderData = {
        userInfo: {
          fullName: formData.get("fullName"),
          phone: formData.get("phone"),
          email: formData.get("email"),
          address: {
            province: {
              code: formData.get("province"),
              name: document.getElementById("province").options[
                document.getElementById("province").selectedIndex
              ].text,
            },
            district: {
              code: formData.get("district"),
              name: document.getElementById("district").options[
                document.getElementById("district").selectedIndex
              ].text,
            },
            ward: {
              code: formData.get("ward"),
              name: document.getElementById("ward").options[
                document.getElementById("ward").selectedIndex
              ].text,
            },
            street: formData.get("street"),
            houseNumber: formData.get("houseNumber"),
            note: formData.get("addressNote"),
          },
        },
        shippingMethod: formData.get("shippingMethod"),
        note: formData.get("note"),
      };

      try {
        const response = await fetch("/api/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        });

        if (response.ok) {
          const result = await response.json();
          window.location.href = `/orders/${result.orderId}`;
        } else {
          throw new Error("Failed to create order");
        }
      } catch (error) {
        console.error("Error creating order:", error);
        alert("Failed to create order. Please try again.");
      }
    });
});
