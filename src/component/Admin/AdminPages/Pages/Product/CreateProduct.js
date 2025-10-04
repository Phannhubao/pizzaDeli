import { Icon } from "@mui/material";
import { PostProduct, PostImage, GetCategoryList } from "../../../../../services/ApiService";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function CreateProduct() {
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    productName: "",
    price: "",
    stock: "",
    description: "",
    active: true,
    categoryId: ""
  });
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [myFiles, setMyFiles] = useState([]);

  // Validate dữ liệu form
  const validateForm = (data) => {
    const errs = {};
    if (!data.productName || data.productName.trim().length < 3) {
      errs.productName = "Tên sản phẩm phải có ít nhất 3 ký tự";
    }
    if (!data.price || Number(data.price) <= 0) {
      errs.price = "Giá phải lớn hơn 0";
    }
    if (data.stock === "" || Number(data.stock) < 0) {
      errs.stock = "Số lượng tồn kho phải lớn hơn hoặc bằng 0";
    }
    if (!data.description || data.description.trim().length < 3) {
      errs.description = "Mô tả phải có ít nhất 3 ký tự";
    }
    if (!data.categoryId) {
      errs.categoryId = "Vui lòng chọn danh mục";
    }
    return errs;
  };

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: name === "active" ? value === "true" : value
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e) => {
    setMyFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newErrors = validateForm(product);
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        Swal.fire({ icon: "error", title: "Vui lòng nhập thông tin hợp lệ" });
        return;
      }

      // Chuẩn bị payload cho sản phẩm
      const payload = {
        productName: product.productName.trim(),
        price: Number(product.price),
        stock: Number(product.stock),
        description: product.description.trim(),
        active: product.active,
        category: { categoryId: Number(product.categoryId) }
      };

      console.log("Payload gửi đi:", payload); // Log payload để gỡ lỗi

      // 1. Tạo sản phẩm
      const response = await PostProduct(payload);
      if (!response || !response.data || !response.data.productId) {
        throw new Error("Server không trả về productId hoặc phản hồi không hợp lệ");
      }

      console.log("Tạo sản phẩm thành công:", response.data); // Log phản hồi data

      // 2. Upload ảnh nếu có
      if (myFiles.length > 0) {
        const formData = new FormData();
        myFiles.forEach((file, index) => {
          formData.append("file", file);
          formData.append("productId", response.data.productId);
          formData.append("caption", `Hình ảnh ${index + 1} cho sản phẩm ${response.data.productId}`);
          formData.append("isPrimary", index === 0 ? "true" : "false");
        });

        console.log("FormData gửi đi:", formData); // Log FormData (gỡ lỗi)

        await PostImage(formData);
      }

      Swal.fire("Thành công!", response.message || "Sản phẩm đã được tạo.", "success");
      navigate("/admin/products");

    } catch (error) {
      console.error("Lỗi khi tạo sản phẩm:", error.response || error);
      const errorMessage = error.response?.data?.message || error.message || "Lỗi server";
      Swal.fire({
        title: "Tạo thất bại",
        text: errorMessage,
        icon: "error"
      });
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await GetCategoryList();
        setCategories(data || []);
      } catch (err) {
        console.error("Lỗi khi lấy danh mục:", err);
        Swal.fire({ icon: "error", title: "Lỗi khi lấy danh mục" });
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="container mt-5 pt-5">
      <h2 className="text-center">Tạo sản phẩm mới</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3 mt-3">
          <label className="form-label">Tên sản phẩm:</label>
          <input
            type="text"
            className="form-control"
            name="productName"
            value={product.productName}
            onChange={handleChangeInput}
          />
          {errors.productName && <span className="text-danger">{errors.productName}</span>}
        </div>

        <div className="mb-3 mt-3">
          <label className="form-label">Giá:</label>
          <input
            type="number"
            className="form-control"
            name="price"
            value={product.price}
            onChange={handleChangeInput}
          />
          {errors.price && <span className="text-danger">{errors.price}</span>}
        </div>

        <div className="mb-3 mt-3">
          <label className="form-label">Số lượng tồn kho:</label>
          <input
            type="number"
            className="form-control"
            name="stock"
            value={product.stock}
            onChange={handleChangeInput}
          />
          {errors.stock && <span className="text-danger">{errors.stock}</span>}
        </div>

        <div className="mb-3 mt-3">
          <label className="form-label">Trạng thái:</label>
          <select
            className="form-control"
            name="active"
            onChange={handleChangeInput}
            value={product.active}
          >
            <option value={true}>Kích hoạt</option>
            <option value={false}>Không kích hoạt</option>
          </select>
        </div>

        <div className="mb-3 mt-3">
          <label className="form-label">Danh mục:</label>
          <select
            className="form-control"
            name="categoryId"
            onChange={handleChangeInput}
            value={product.categoryId}
          >
            <option value="">-- Chọn danh mục --</option>
            {categories.map((cat) => (
              <option key={cat.categoryId} value={cat.categoryId}>
                {cat.categoryName}
              </option>
            ))}
          </select>
          {errors.categoryId && <span className="text-danger">{errors.categoryId}</span>}
        </div>

        <div className="mb-3 mt-3">
          <label className="form-label">Mô tả:</label>
          <textarea
            rows="3"
            className="form-control"
            name="description"
            value={product.description}
            onChange={handleChangeInput}
          />
          {errors.description && <span className="text-danger">{errors.description}</span>}
        </div>

        <div className="mb-3 mt-3">
          <label className="form-label">Ảnh (không bắt buộc):</label>
          <input
            type="file"
            className="form-control"
            onChange={handleFileChange}
            multiple
            accept="image/*"
          />
        </div>

        <div className="d-flex justify-content-around align-items-center mt-4">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/admin/products")}
          >
            <Icon>arrow_back_ios</Icon> Quay lại
          </button>
          <button type="submit" className="btn btn-primary">
            <Icon>add</Icon> Tạo
          </button>
        </div>
      </form>
    </div>
  );
}