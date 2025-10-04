import { Icon } from "@mui/material";
import { GetProductByID, PutProduct, GetCategoryList } from "../../../../../services/ApiService";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

export default function UpdateProduct() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    productName: "",
    price: "",
    stock: "",
    description: "",
    categoryId: "",
    active: true
  });
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [productRes, categoriesRes] = await Promise.all([
          GetProductByID(id),
          GetCategoryList()
        ]);

        console.log('API Response - Categories:', categoriesRes); // Debug log

        // Xử lý dữ liệu category từ API
        const categoriesData = categoriesRes.data || categoriesRes || [];
        
        setFormData({
          productName: productRes.data?.productName || "",
          price: productRes.data?.price || "",
          stock: productRes.data?.stock || "",
          description: productRes.data?.description || "",
          categoryId: productRes.data?.category?.categoryId 
                    || productRes.data?.categoryId 
                    || "",
          active: productRes.data?.active ?? true
        });

        setCategories(categoriesData);
      } catch (error) {
        console.error("Fetch error:", error);
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: error.response?.data?.message || "Không thể tải dữ liệu",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "active" ? value === "true" : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      Swal.fire("Lỗi", "Vui lòng kiểm tra lại thông tin", "error");
      return;
    }

    const confirmation = await Swal.fire({
      title: "Xác nhận cập nhật",
      text: "Bạn chắc chắn muốn cập nhật sản phẩm này?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Cập nhật",
      cancelButtonText: "Hủy",
    });
    if (!confirmation.isConfirmed) return;

    setIsSubmitting(true);
    try {
      const response = await PutProduct(id, {
        ...formData,
        category: { categoryId: Number(formData.categoryId) }
      });
      
      if (response.status === 200) {
        await Swal.fire({
          icon: "success",
          title: "Thành công!",
          text: "Cập nhật sản phẩm thành công",
          timer: 1500
        });
        navigate("/admin/products");
      } else {
        throw new Error(response.data?.message || "Cập nhật thất bại");
      }
    } catch (error) {
      console.error("Update error:", error);
      Swal.fire({
        icon: "error",
        title: "Cập nhật thất bại",
        text: error.response?.data?.message || error.message || "Cập nhật thất bại",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.productName.trim()) {
      newErrors.productName = "Tên sản phẩm không được để trống";
    }
    if (!formData.price || formData.price <= 0) {
      newErrors.price = "Giá phải lớn hơn 0";
    }
    if (!formData.categoryId) {
      newErrors.categoryId = "Vui lòng chọn danh mục";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  if (isLoading) {
    return <div className="text-center mt-5">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="container space-sideBar mt-5 pt-5">
      <h2 className="text-center mb-4">CẬP NHẬT SẢN PHẨM</h2>
      
      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-3">
          <label htmlFor="productName" className="form-label">
            Tên sản phẩm *
          </label>
          <input
            type="text"
            className={`form-control ${errors.productName && "is-invalid"}`}
            id="productName"
            name="productName"
            value={formData.productName}
            onChange={handleInputChange}
            disabled={isSubmitting}
            required
          />
          {errors.productName && (
            <div className="invalid-feedback">{errors.productName}</div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="price" className="form-label">
            Giá *
          </label>
          <input
            type="number"
            className={`form-control ${errors.price && "is-invalid"}`}
            id="price"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            disabled={isSubmitting}
            required
          />
          {errors.price && (
            <div className="invalid-feedback">{errors.price}</div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="stock" className="form-label">
            Số lượng tồn kho *
          </label>
          <input
            type="number"
            className={`form-control ${errors.stock && "is-invalid"}`}
            id="stock"
            name="stock"
            value={formData.stock}
            onChange={handleInputChange}
            disabled={isSubmitting}
            required
          />
          {errors.stock && (
            <div className="invalid-feedback">{errors.stock}</div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Mô tả *
          </label>
          <textarea
            className={`form-control ${errors.description && "is-invalid"}`}
            id="description"
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleInputChange}
            disabled={isSubmitting}
            required
          />
          {errors.description && (
            <div className="invalid-feedback">{errors.description}</div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Danh mục *</label>
          <select
            className={`form-control ${errors.categoryId && "is-invalid"}`}
            name="categoryId"
            value={formData.categoryId}
            onChange={handleInputChange}
            disabled={isSubmitting}
            required
          >
            <option value="">-- Chọn danh mục --</option>
            {categories.map((category) => (
              <option 
                key={category.id || category.categoryId} 
                value={category.id || category.categoryId}
              >
                {category.categoryName || category.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <div className="invalid-feedback">{errors.categoryId}</div>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="active" className="form-label">
            Trạng thái *
          </label>
          <select
            className="form-control"
            id="active"
            name="active"
            value={formData.active}
            onChange={handleInputChange}
            disabled={isSubmitting}
            required
          >
            <option value={true}>Kích hoạt</option>
            <option value={false}>Ngừng kích hoạt</option>
          </select>
        </div>

        <div className="d-flex justify-content-between">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => navigate("/admin/products")}
            disabled={isSubmitting}
          >
            <Icon>arrow_back</Icon> Quay lại
          </button>
          
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Đang cập nhật...
              </>
            ) : (
              <>
                <Icon>save</Icon> Cập nhật
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}