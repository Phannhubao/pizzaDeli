import "../../css/style.css";
import "../../css/dataTables.bootstrap5.min.css";
import "../../AdminManager.css";
import "./CategoryManager.css"; // Thêm file CSS mới
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@mui/material";
import ReactPaginate from "react-paginate";
import Swal from "sweetalert2";
import { GetCategoryList, DeleteCategory } from "../../../../../services/ApiService";
import UpdateCategoryModal from "./UpdateCategoryModal"; 

export default function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 12;
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const response = await GetCategoryList();
        if (Array.isArray(response)) {
          setCategories(response);
        } else {
          throw new Error("Invalid data format received");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load categories. Please try again later.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Handle delete category
  const handleDelete = async (categoryId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await DeleteCategory(categoryId);
        setCategories(categories.filter(cat => cat.categoryId !== categoryId));
        Swal.fire("Deleted!", "The category has been deleted.", "success");
      } catch (error) {
        Swal.fire("Error!", "Failed to delete category.", "error");
      }
    }
  };

  // Handle page change
  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  // Calculate paginated data
  const offset = currentPage * itemsPerPage;
  const paginatedCategories = categories.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(categories.length / itemsPerPage);

  // Open update modal
  const handleOpenUpdateModal = (category) => {
    setSelectedCategory(category);
    setShowUpdateModal(true);
  };

  // Handle update success
  const handleUpdateSuccess = (updatedCategory) => {
    setCategories(categories.map(cat => 
      cat.categoryId === updatedCategory.categoryId ? updatedCategory : cat
    ));
    setShowUpdateModal(false);
  };

  return (
    <main className="category-manager-container">
      <div className="container pt-4">
        <div className="category-manager-header">
          <div className="category-manager-title">
            <h2>Category Management</h2>
            <p className="category-count">
              Total: {categories.length} {categories.length === 1 ? "Category" : "Categories"}
            </p>
          </div>
          <Link 
            to="create" 
            className="btn-create-category"
          >
            <Icon>add</Icon>
            <span>Create New</span>
          </Link>
        </div>

        {isLoading ? (
          <div className="category-loading">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading categories...</p>
          </div>
        ) : (
          <>
            {categories.length > 0 ? (
              <>
                <div className="category-grid">
                  {paginatedCategories.map((category, index) => (
                    <div key={category.categoryId} className="category-card">
                      <div className="category-card-header">
                        <h3 className="category-name">{category.categoryName}</h3>
                        <div className="category-actions">
                          <button
                            onClick={() => handleOpenUpdateModal(category)}
                            className="btn-action btn-edit"
                            title="Edit"
                          >
                            <Icon fontSize="small">edit</Icon>
                          </button>
                          <button
                            onClick={() => handleDelete(category.categoryId)}
                            className="btn-action btn-delete"
                            title="Delete"
                          >
                            <Icon fontSize="small">delete</Icon>
                          </button>
                        </div>
                      </div>
                      <div className="category-card-body">
                        <p className="category-description">
                          {category.description || "No description available"}
                        </p>
                      </div>
                      <div className="category-card-footer">
                        <span className="category-id">ID: {category.categoryId}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {pageCount > 1 && (
                  <div className="pagination-container">
                    <ReactPaginate
                      breakLabel="..."
                      nextLabel={<Icon>chevron_right</Icon>}
                      onPageChange={handlePageClick}
                      pageRangeDisplayed={5}
                      pageCount={pageCount}
                      previousLabel={<Icon>chevron_left</Icon>}
                      renderOnZeroPageCount={null}
                      containerClassName="pagination"
                      pageClassName="page-item"
                      pageLinkClassName="page-link"
                      previousClassName="page-item"
                      previousLinkClassName="page-link"
                      nextClassName="page-item"
                      nextLinkClassName="page-link"
                      breakClassName="page-item"
                      breakLinkClassName="page-link"
                      activeClassName="active"
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="no-categories">
                <div className="no-categories-content">
                  <Icon className="no-categories-icon">category</Icon>
                  <h3>No Categories Found</h3>
                  <p>Get started by creating your first category</p>
                  <Link 
                    to="create" 
                    className="btn-create-first"
                  >
                    <Icon>add</Icon>
                    <span>Create Your First Category</span>
                  </Link>
                </div>
              </div>
            )}
          </>
        )}

        {/* Update Category Modal */}
        {selectedCategory && (
          <UpdateCategoryModal
            show={showUpdateModal}
            onHide={() => setShowUpdateModal(false)}
            category={selectedCategory}
            onUpdateSuccess={handleUpdateSuccess}
          />
        )}
      </div>
    </main>
  );
}