import "../../css/style.css";
import "../../css/dataTables.bootstrap5.min.css";
import "../../AdminManager.css";
import { useEffect, useState } from "react";

import ReactPaginate from "react-paginate";
import { GetProductByID } from "services/ApiService";
import { GetFeebackList } from "services/ApiService";
import { useNavigate } from "react-router-dom";

export default function ReviewManager() {
  // Product
  const [data, setData] = useState([]);
  // const [statusProduct, setStatusProduct] = useState(false);
  const [total, setTotal] = useState(false);
  const [product, setProduct] = useState([]);

  // Pagination
  const [page, setPage] = useState(1); // current page
  const [totalPage, setTotalPage] = useState(1); // current page
  const count = (page - 1) * 12;

  const navigate = useNavigate();

  // // handle when user change product status
  // const handleChangeStatus = async (id) => {
  //   Swal.fire({
  //     title: "Are you sure?",
  //     text: "The changes you make may affect the display of products.",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonColor: "#3085d6",
  //     cancelButtonColor: "#d33",
  //     confirmButtonText: "Yes, delete it!",
  //   }).then(async (result) => {
  //     if (result.isConfirmed) {
  //       try {
  //         const response = await PutProductStatus(id);
  //         if (response.status === 200) {
  //           Swal.fire({
  //             icon: "success",
  //             title: "Your work has been saved",
  //             showConfirmButton: false,
  //             timer: 1500,
  //           });
  //           setStatusProduct(!statusProduct);
  //         }
  //       } catch (error) {
  //         console.log("err", error);
  //       }
  //     }
  //   });
  // };

  // handle when user switch to order page
  const handlePageClick = (event) => {
    setPage(+event.selected + 1);
  };
  const handleGotoProduct = (productID) => {
    navigate(`/products/ProductDetail/${productID}`);
  };

  useEffect(() => {
    const fetchDataProduct = async () => {
      try {
        const response = await GetFeebackList();
        if (response.status === 200) {
          // Set total page
          setTotalPage(Math.ceil(response.data.length / 12).toFixed());
          // Set total Product
          setTotal(response.data.length);
          let listProduct = [];
          let listFeedback = [];

          // only display 12 products per page
          for (var i = 0 + count; i < 12 + count; i++) {
            if (response.data[i] != null) {
              listFeedback[i] = response.data[i];
              const responseProduct = await GetProductByID(response.data[i].productId);
              if (responseProduct.status === 200) {
                listProduct[i] = responseProduct.data;
              }
            } else {
              break;
            }
          }
          setData(listFeedback);
          setProduct(listProduct);
        }
      } catch (error) {
        console.log("error", error);
      }
    };
    fetchDataProduct();
  }, [page]);

  return (
    <main className="mt-5 pt-3 mb-5">
      <div className="container pt-4">
        <div className="d-flex align-items-center justify-content-between">
          <div className="text-secondary small"> Total : {total} Reviews</div>
          <h2 className="text-center font-weight-bold">REVIEW TABLE</h2>
          <div style={{ width: "90px" }}></div>
        </div>
        <div style={{ minHeight: "700px" }}>
          <table className="table">
            <thead className="table-dark">
              <tr>
                <th>No</th>
                <th>Title</th>
                <th>Content</th>
                <th>Start</th>
                <th>Product Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((item, index) => {
                  return (
                    <tr
                      key={index}
                      style={{ backgroundColor: item.status === false ? "silver" : "white" }}
                    >
                      <td>{index + 1}</td>
                      <td>{item.title}</td>
                      <td>
                        {item.content.length > 60
                          ? `${item.content.substring(0, 120)}...`
                          : item.content}
                      </td>
                      <td>
                        {item.start} <i className="fa fa-star" aria-hidden="true"></i>
                      </td>

                      <td>{product[index].produc_name}</td>
                      <td>
                        <btn
                          className="btn btn-primary"
                          onClick={() => {
                            handleGotoProduct(item.productId);
                          }}
                        >
                          Go to Product
                        </btn>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <div>No product to show</div>
              )}
            </tbody>
          </table>
        </div>

        <div className="d-flex justify-content-center mb-5">
          <ReactPaginate
            breakLabel="..."
            nextLabel=">"
            onPageChange={handlePageClick}
            pageRangeDisplayed={5}
            pageCount={totalPage}
            previousLabel="<"
            pageClassName="page-item"
            pageLinkClassName="page-link"
            previousClassName="page-item"
            previousLinkClassName="page-link"
            nextClassName="page-item"
            nextLinkClassName="page-link"
            breakClassName="page-item"
            breakLinkClassName="page-link"
            containerClassName="pagination"
            activeClassName="active"
          />
        </div>
      </div>
    </main>
  );
}
