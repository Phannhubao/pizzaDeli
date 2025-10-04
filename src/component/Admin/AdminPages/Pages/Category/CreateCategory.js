import { Icon } from "@mui/material";
import { PostCategory } from "../../../../../services/ApiService";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function CreateCategory() {
  const navigate = useNavigate();
  const [category, setCategory] = useState({
    categoryName: "",
    description: "",
  });
  const [errors, setErrors] = useState({});

  // Validate form
  const validateForm = (dataInput, existingCategories = []) => {
  let errors = {};

  // Kiểm tra tên
  if (!dataInput.categoryName) {
    errors.categoryName = "Please enter your Brand Name";
  } else if (dataInput.categoryName.length < 3 || dataInput.categoryName.length > 30) {
    errors.categoryName = "Brand Name must be between 3 - 30 characters";
  } else if (
    existingCategories.some(
      (cat) =>
        cat.categoryName.toLowerCase().trim() === dataInput.categoryName.toLowerCase().trim()
    )
  ) {
    errors.categoryName = "This Brand Name already exists";
  }

  // Kiểm tra mô tả
  if (!dataInput.description) {
    errors.description = "Please enter your description";
  } else if (dataInput.description.length < 3 || dataInput.description.length > 300) {
    errors.description = "Product Name must be between 3 - 300 characters";
  }

  return errors;
};


  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setCategory((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleBack = () => {
    navigate("/admin/categories");
  };

  const handleSubmit = (e) => {
    
  e.preventDefault();
  
  const newErrors = validateForm(category);
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    Swal.fire({
      icon: "error",
      title: "Please Enter Required Information",
    });
    return;
  }

  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, Create it!",
  }).then((result) => {
    if (!result.isConfirmed) return;

    PostCategory(category)
      .then((response) => {
        if (response?.status === 200 || response?.status === 201 || response?.data?.id) {
          Swal.fire({
            icon: "success",
            title: "Created!",
            text: "Category has been created successfully.",
          }).then(() => {
            navigate("/admin/categories");
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Create failed",
            text: response?.data?.message || "Unknown error",
          });
        }
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Create failed",
          text: error?.response?.data?.message || "Unknown error",
        });
      });
  });
};

  return (
    <div className="container space-sideBar mt-5 pt-5 font-weight-bold text-uppercase">
      <h2 className="text-center">Create New Category</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3 mt-3">
          <label htmlFor="categoryName" className="form-label w-100">
            Category Name:
          </label>
          <input
            type="text"
            className="form-control"
            id="categoryName"
            name="categoryName"
            value={category.categoryName}
            onChange={handleChangeInput}
          />
          {errors.categoryName && (
            <span className="text-danger h6">{errors.categoryName}</span>
          )}
        </div>

        <div className="mb-3 mt-3">
          <label htmlFor="description" className="form-label w-100">
            Description:
          </label>
          <textarea
            rows="3"
            className="form-control"
            id="description"
            name="description"
            value={category.description}
            onChange={handleChangeInput}
          />
          {errors.description && (
            <span className="text-danger h6">{errors.description}</span>
          )}
        </div>

        <div className="d-flex justify-content-around align-items-center mt-4">
          <div className="d-flex justify-content-between align-items-center w-50">
            <button
              className="btn btn-secondary d-flex align-items-center"
              onClick={handleBack}
              type="button"
            >
              <Icon>arrow_back_ios</Icon> <span> &nbsp;Back</span>
            </button>

            <button
              type="submit"
              className="btn btn-primary d-flex align-items-center"
            >
              <Icon>add</Icon> <span> &nbsp;Create</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
