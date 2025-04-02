const axios = require("axios");

class AddressService {
  constructor() {
    this.provinces = [
      { code: "01", name: "Hà Nội" },
      { code: "02", name: "Hồ Chí Minh" },
      { code: "03", name: "Đà Nẵng" },
      { code: "04", name: "Hải Phòng" },
      { code: "05", name: "Cần Thơ" },
      { code: "06", name: "An Giang" },
      { code: "07", name: "Bà Rịa - Vũng Tàu" },
      { code: "08", name: "Bắc Giang" },
      { code: "09", name: "Bắc Kạn" },
      { code: "10", name: "Bạc Liêu" },
      { code: "11", name: "Bắc Ninh" },
      { code: "12", name: "Bến Tre" },
      { code: "13", name: "Bình Định" },
      { code: "14", name: "Bình Dương" },
      { code: "15", name: "Bình Phước" },
      { code: "16", name: "Bình Thuận" },
      { code: "17", name: "Cà Mau" },
      { code: "18", name: "Cao Bằng" },
      { code: "19", name: "Đắk Lắk" },
      { code: "20", name: "Đắk Nông" },
      { code: "21", name: "Điện Biên" },
      { code: "22", name: "Đồng Nai" },
      { code: "23", name: "Đồng Tháp" },
      { code: "24", name: "Gia Lai" },
      { code: "25", name: "Hà Giang" },
      { code: "26", name: "Hà Nam" },
      { code: "27", name: "Hà Tĩnh" },
      { code: "28", name: "Hải Dương" },
      { code: "29", name: "Hậu Giang" },
      { code: "30", name: "Hòa Bình" },
      { code: "31", name: "Hưng Yên" },
      { code: "32", name: "Khánh Hòa" },
      { code: "33", name: "Kiên Giang" },
      { code: "34", name: "Kon Tum" },
      { code: "35", name: "Lai Châu" },
      { code: "36", name: "Lâm Đồng" },
      { code: "37", name: "Lạng Sơn" },
      { code: "38", name: "Lào Cai" },
      { code: "39", name: "Long An" },
      { code: "40", name: "Nam Định" },
      { code: "41", name: "Nghệ An" },
      { code: "42", name: "Ninh Bình" },
      { code: "43", name: "Ninh Thuận" },
      { code: "44", name: "Phú Thọ" },
      { code: "45", name: "Phú Yên" },
      { code: "46", name: "Quảng Bình" },
      { code: "47", name: "Quảng Nam" },
      { code: "48", name: "Quảng Ngãi" },
      { code: "49", name: "Quảng Ninh" },
      { code: "50", name: "Quảng Trị" },
      { code: "51", name: "Sóc Trăng" },
      { code: "52", name: "Sơn La" },
      { code: "53", name: "Tây Ninh" },
      { code: "54", name: "Thái Bình" },
      { code: "55", name: "Thái Nguyên" },
      { code: "56", name: "Thanh Hóa" },
      { code: "57", name: "Thừa Thiên Huế" },
      { code: "58", name: "Tiền Giang" },
      { code: "59", name: "Trà Vinh" },
      { code: "60", name: "Tuyên Quang" },
      { code: "61", name: "Vĩnh Long" },
      { code: "62", name: "Vĩnh Phúc" },
      { code: "63", name: "Yên Bái" },
    ];

    // Sample district data for major provinces
    this.districtsData = {
      "01": [
        // Hà Nội
        { code: "001", name: "Ba Đình" },
        { code: "002", name: "Hoàn Kiếm" },
        { code: "003", name: "Tây Hồ" },
        { code: "004", name: "Long Biên" },
        { code: "005", name: "Cầu Giấy" },
        { code: "006", name: "Đống Đa" },
        { code: "007", name: "Hai Bà Trưng" },
        { code: "008", name: "Hoàng Mai" },
        { code: "009", name: "Thanh Xuân" },
      ],
      "02": [
        // Hồ Chí Minh
        { code: "001", name: "Quận 1" },
        { code: "002", name: "Quận 2" },
        { code: "003", name: "Quận 3" },
        { code: "004", name: "Quận 4" },
        { code: "005", name: "Quận 5" },
        { code: "006", name: "Quận 6" },
        { code: "007", name: "Quận 7" },
        { code: "008", name: "Quận 8" },
        { code: "009", name: "Quận 9" },
        { code: "010", name: "Quận 10" },
        { code: "011", name: "Quận 11" },
        { code: "012", name: "Quận 12" },
      ],
      "03": [
        // Đà Nẵng
        { code: "001", name: "Hải Châu" },
        { code: "002", name: "Thanh Khê" },
        { code: "003", name: "Sơn Trà" },
        { code: "004", name: "Ngũ Hành Sơn" },
        { code: "005", name: "Liên Chiểu" },
        { code: "006", name: "Cẩm Lệ" },
      ],
    };

    // Sample ward data
    this.wardsData = {
      "001": [
        // Ba Đình (Hà Nội)
        { code: "00001", name: "Phúc Xá" },
        { code: "00002", name: "Trúc Bạch" },
        { code: "00003", name: "Vĩnh Phúc" },
        { code: "00004", name: "Cống Vị" },
        { code: "00005", name: "Liễu Giai" },
        { code: "00006", name: "Nguyễn Trung Trực" },
        { code: "00007", name: "Quán Thánh" },
        { code: "00008", name: "Ngọc Hà" },
      ],
      "001_02": [
        // Quận 1 (Hồ Chí Minh)
        { code: "00001", name: "Bến Nghé" },
        { code: "00002", name: "Bến Thành" },
        { code: "00003", name: "Cầu Kho" },
        { code: "00004", name: "Cầu Ông Lãnh" },
        { code: "00005", name: "Cô Giang" },
        { code: "00006", name: "Đa Kao" },
        { code: "00007", name: "Nguyễn Cư Trinh" },
        { code: "00008", name: "Nguyễn Thái Bình" },
        { code: "00009", name: "Phạm Ngũ Lão" },
        { code: "00010", name: "Tân Định" },
      ],
    };

    this.districts = {};
    this.wards = {};
  }

  async initialize() {
    try {
      console.log("Address service initialized with local data");
      return true;
    } catch (error) {
      console.error("Error initializing address service:", error.message);
      return false;
    }
  }

  async getDistricts(provinceCode) {
    try {
      // Return from cache if available
      if (this.districts[provinceCode]) {
        return this.districts[provinceCode];
      }

      // Return from local data if available
      if (this.districtsData[provinceCode]) {
        this.districts[provinceCode] = this.districtsData[provinceCode];
        return this.districtsData[provinceCode];
      }

      // Return empty array if not found
      console.log(`No district data for province code: ${provinceCode}`);
      return [];
    } catch (error) {
      console.error("Error fetching districts:", error.message);
      return [];
    }
  }

  async getWards(districtCode) {
    try {
      // Return from cache if available
      if (this.wards[districtCode]) {
        return this.wards[districtCode];
      }

      // Return from local data if available
      const key = districtCode;
      if (this.wardsData[key]) {
        this.wards[districtCode] = this.wardsData[key];
        return this.wardsData[key];
      }

      // Return empty array if not found
      console.log(`No ward data for district code: ${districtCode}`);
      return [];
    } catch (error) {
      console.error("Error fetching wards:", error.message);
      return [];
    }
  }

  async validateAddress(address) {
    try {
      // Simple validation - check if required fields are present
      if (
        !address.province ||
        !address.district ||
        !address.ward ||
        !address.street
      ) {
        return {
          valid: false,
          message: "Missing required address fields",
        };
      }

      // Mock successful validation with coordinates
      return {
        valid: true,
        message: "Address validated successfully",
        coordinates: {
          lat: 10.762622 + Math.random() * 0.01,
          lng: 106.660172 + Math.random() * 0.01,
        },
      };
    } catch (error) {
      console.error("Error validating address:", error.message);
      return { valid: false, message: "Address validation failed" };
    }
  }

  async getShippingFee(address, weight = 1) {
    try {
      // Base fee
      let fee = 30000; // 30,000 VND base fee

      // Add fee based on province
      const provinceCode = address.province;

      // Higher fee for distant provinces
      if (provinceCode !== "01" && provinceCode !== "02") {
        fee += 20000; // Add 20,000 VND for provinces other than Hanoi and HCM
      }

      // Add fee based on weight
      fee += weight * 5000; // 5,000 VND per kg

      // Convert to USD (approximation)
      const feeUSD = fee / 23000;

      return parseFloat(feeUSD.toFixed(2));
    } catch (error) {
      console.error("Error calculating shipping fee:", error.message);
      return 2.5; // Default fee in USD
    }
  }

  async getEstimatedDelivery(address) {
    try {
      // Calculate estimated delivery date (3-5 days from now)
      const today = new Date();

      // Add 3 days for Hanoi and HCM, 5 days for other provinces
      const provinceCode = address.province;
      const daysToAdd = provinceCode === "01" || provinceCode === "02" ? 3 : 5;

      const deliveryDate = new Date(today);
      deliveryDate.setDate(today.getDate() + daysToAdd);

      return deliveryDate;
    } catch (error) {
      console.error("Error getting estimated delivery:", error.message);

      // Fallback to 5 days from now
      const fallbackDate = new Date();
      fallbackDate.setDate(fallbackDate.getDate() + 5);
      return fallbackDate;
    }
  }
}

module.exports = new AddressService();
