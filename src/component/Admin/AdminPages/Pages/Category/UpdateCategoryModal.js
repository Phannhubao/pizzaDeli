import { Icon } from "@mui/material";
import { PutCategory } from "../../../../../services/ApiService";
import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Swal from "sweetalert2";

export default function UpdateCategoryModal({ 
  show, 
  onHide, 
  category,
  onUpdateSuccess 
}) {
  const [formData, setFormData] = useState({
    categoryName: "",
    description: ""
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.categoryName.trim()) {
      newErrors.categoryName = "Category name is required";
    } else if (formData.categoryName.length < 3 || formData.categoryName.length > 30) {
      newErrors.categoryName = "Name must be 3-30 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 3 || formData.description.length > 300) {
      newErrors.description = "Description must be 3-300 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Set form data when modal opens
  useEffect(() => {
    if (show && category) {
      setIsLoading(true);
      try {
        setFormData({
          categoryName: category.categoryName || "",
          description: category.description || ""
        });
      } catch (error) {
        console.error("Error setting form data:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load category data",
        });
        onHide();
      } finally {
        setIsLoading(false);
      }
    } else {
      setFormData({ categoryName: "", description: "" });
      setErrors({});
    }
  }, [show, category, onHide]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      Swal.fire("Error", "Please fix the form errors", "error");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await PutCategory(category.categoryId, {
        categoryName: formData.categoryName,
        description: formData.description
      });
      
      if (response.status === 200) {
        await Swal.fire({
          icon: "success",
          title: "Updated!",
          text: "Category updated successfully",
          timer: 1500,
          showConfirmButton: false
        });
        onUpdateSuccess(response.data);
        onHide();
      } else {
        throw new Error(response.data?.message || "Update failed");
      }
    } catch (error) {
      console.error("Update error:", error);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: error.response?.data?.message || error.message || "Failed to update category",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          <Icon className="me-2">edit</Icon>
          Update Category
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        {isLoading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <span className="ms-2">Loading category data...</span>
          </div>
        ) : (
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Category Name *</Form.Label>
              <Form.Control
                type="text"
                name="categoryName"
                value={formData.categoryName}
                onChange={handleInputChange}
                isInvalid={!!errors.categoryName}
                disabled={isSubmitting}
              />
              <Form.Control.Feedback type="invalid">
                {errors.categoryName}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description *</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                isInvalid={!!errors.description}
                disabled={isSubmitting}
              />
              <Form.Control.Feedback type="invalid">
                {errors.description}
              </Form.Control.Feedback>
            </Form.Group>

            <div className="d-flex justify-content-end gap-2 mt-4">
              <Button 
                variant="secondary" 
                onClick={onHide}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Updating...
                  </>
                ) : (
                  <>
                    <Icon className="me-1">save</Icon>
                    Update
                  </>
                )}
              </Button>
            </div>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
}