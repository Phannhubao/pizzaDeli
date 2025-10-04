import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { Icon } from "@mui/material";
import Swal from "sweetalert2";
import { PostImage } from "../../../../../services/ApiService";

const ImageUploadModal = ({ 
  show, 
  onHide, 
  productId, 
  onUploadSuccess 
}) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageCaption, setImageCaption] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // Xử lý khi chọn file ảnh
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Kiểm tra kích thước file (tối đa 5MB)
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire("Lỗi", "Ảnh không được vượt quá 5MB", "error");
        return;
      }
      
      // Kiểm tra định dạng file
      const validTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        Swal.fire("Lỗi", "Chỉ chấp nhận file ảnh (JPEG, PNG, WEBP)", "error");
        return;
      }
      
      setSelectedImage(file);
    }
  };

  // Xóa ảnh đã chọn
  const handleRemoveImage = () => {
    setSelectedImage(null);
  };

  // Upload ảnh lên server
  const handleUploadImage = async () => {
    if (!productId || !selectedImage) {
      Swal.fire("Lỗi", "Vui lòng chọn ảnh", "error");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedImage);
      formData.append("productId", productId);
      formData.append("caption", imageCaption || `Ảnh sản phẩm ${productId}`);
      formData.append("isPrimary", "true");

      const response = await PostImage(formData);
      
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Thành công",
          text: "Đã tải lên ảnh thành công",
          timer: 1500,
          showConfirmButton: false
        });
        onUploadSuccess();
        onHide();
      }
    } catch (error) {
      console.error("Lỗi khi upload ảnh:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: error.response?.data?.message || "Tải lên thất bại"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Thêm ảnh cho sản phẩm #{productId}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3">
          <label htmlFor="imageUpload" className="form-label">
            Chọn ảnh (JPG/PNG, tối đa 5MB)
          </label>
          <input
            type="file"
            className="form-control"
            id="imageUpload"
            onChange={handleFileChange}
            accept="image/jpeg, image/png, image/webp"
          />
        </div>

        {selectedImage && (
          <div className="mt-3">
            <div className="card border-primary">
              <div className="card-header bg-primary text-white">
                Ảnh đã chọn
              </div>
              <div className="card-body">
                <img 
                  src={URL.createObjectURL(selectedImage)} 
                  className="img-fluid rounded mb-3" 
                  alt="Preview"
                  style={{ maxHeight: "200px", display: "block", margin: "0 auto" }}
                />
                <div className="mb-3">
                  <label className="form-label">Mô tả ảnh</label>
                  <input
                    type="text"
                    className="form-control"
                    value={imageCaption}
                    onChange={(e) => setImageCaption(e.target.value)}
                    placeholder="Nhập mô tả..."
                  />
                </div>
                <button
                  className="btn btn-danger w-100"
                  onClick={handleRemoveImage}
                >
                  <Icon fontSize="small">delete</Icon> Xóa ảnh
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Đóng
        </Button>
        <Button 
          variant="primary" 
          onClick={handleUploadImage}
          disabled={isUploading || !selectedImage}
        >
          {isUploading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Đang tải lên...
            </>
          ) : (
            <>
              <Icon fontSize="small">cloud_upload</Icon> Tải lên
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ImageUploadModal;