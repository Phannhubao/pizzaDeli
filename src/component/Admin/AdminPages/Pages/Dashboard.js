import "../css/style.css";
import "../css/dataTables.bootstrap5.min.css";
import "../css/Dashboard.css"; // Tạo file CSS mới cho dashboard
import ChartQuantityProduct from "../Chart/ChartQuantityProduct";
import ChartProductOrder from "../Chart/ChartProductOrder";
import { useEffect, useState } from "react";
import {
  GetCategoryList,
  GetOrderDetailList,
  GetProductList,
  GetAllOrders
} from "../../../../services/ApiService";
import { Icon } from "@mui/material";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [brandCount, setBrandCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [detailList, setDetailList] = useState([]);

  useEffect(() => {
    // --- Tính tổng doanh thu từ các đơn hàng COMPLETED ---
    const fetchRevenue = async () => {
      try {
        const res = await GetAllOrders();
        console.log("Raw GetAllOrders response:", res);

        let orders = [];
        if (res && Array.isArray(res.data)) {
          orders = res.data;
        } else if (Array.isArray(res)) {
          orders = res;
        }

        const total = orders
          .filter(order => order.status === "COMPLETED")
          .reduce((sum, order) => sum + (Number(order.totalPrice) || 0), 0);

        console.log("Final Total Revenue (COMPLETED orders):", total);
        setTotalRevenue(total);
      } catch (err) {
        console.error("Error loading orders:", err);
        setTotalRevenue(0);
      }
    };

    // --- Lấy danh sách chi tiết đơn hàng để hiển thị bảng ---
    const fetchOrderDetails = async () => {
      try {
        const detailRes = await GetOrderDetailList();
        console.log("Raw GetOrderDetailList response:", detailRes);

        let details = [];
        if (detailRes && Array.isArray(detailRes.data)) {
          details = detailRes.data;
        } else if (detailRes && detailRes.data && Array.isArray(detailRes.data.data)) {
          details = detailRes.data.data;
        } else if (Array.isArray(detailRes)) {
          details = detailRes;
        }

        console.log("Normalized Order Details:", details);
        setDetailList(details.slice(0, 10000));
      } catch (error) {
        console.error("Error loading order details:", error);
        setDetailList([]);
      }
    };

    const fetchCategory = async () => {
      try {
        const categories = await GetCategoryList();
        console.log("Raw GetCategoryList response:", categories);

        let categoryData = [];
        if (categories && Array.isArray(categories.data)) {
          categoryData = categories.data;
        } else if (Array.isArray(categories)) {
          categoryData = categories;
        }
        setBrandCount(categoryData.length);
      } catch (error) {
        console.log("Error loading categories:", error);
        setBrandCount(0);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await GetProductList();
        console.log("Raw GetProductList response:", response);

        let productData = [];
        if (response && Array.isArray(response.data)) {
          productData = response.data;
        } else if (Array.isArray(response)) {
          productData = response;
        }
        setProductCount(productData.length);
      } catch (error) {
        console.log("Error loading products:", error);
        setProductCount(0);
      }
    };

    fetchRevenue();
    fetchOrderDetails();
    fetchCategory();
    fetchProducts();
  }, []);

  console.log("Render TotalRevenue:", totalRevenue);

  return (
    <main className="dashboard-main mt-5 pt-3">
      <div className="container-fluid">
        {/* Header */}
        <div className="row">
          <div className="col-md-12">
            <div className="dashboard-header">
              <h4>Dashboard Overview</h4>
              <p>Welcome to your Pizza Deli administration panel</p>
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="row">
          <DashboardCard
            title="TOTAL REVENUE"
            icon="payments"
            value={`${totalRevenue.toLocaleString()} VND`}
            link="/admin/orders"
            bg="revenue-card"
          />
          <DashboardCard
            title="CATEGORIES"
            icon="category"
            value={`${brandCount} Categories`}
            link="/admin/categories"
            bg="categories-card"
          />
          <DashboardCard
            title="PRODUCTS"
            icon="inventory_2"
            value={`${productCount} Products`}
            link="/admin/products"
            bg="products-card"
          />
        </div>

        {/* Charts */}
        <div className="row chart-section">
          <div className="col-lg-5 mb-4">
            <div className="card h-100 chart-card">
              <div className="card-header chart-header">
                <i className="bi bi-bar-chart-fill me-2"></i> Product Quantity Distribution
              </div>
              <div className="card-body chart-body">
                <ChartQuantityProduct />
              </div>
            </div>
          </div>

          <div className="col-lg-7 mb-4">
            <div className="card h-100 chart-card">
              <div className="card-header chart-header">
                <i className="bi bi-graph-up me-2"></i> Product Order Trends
              </div>
              <div className="card-body chart-body">
                <ChartProductOrder />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders Table */}
        <div className="row">
          <div className="col-md-12 mb-4">
            <div className="card data-card">
              <div className="card-header data-header">
                <span><i className="bi bi-table me-2"></i> Recent Order Details</span>
                <Link to="/admin/orders" className="view-all-link">
                  View All <i className="bi bi-arrow-right"></i>
                </Link>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover data-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Order ID</th>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detailList.length > 0 ? (
                        detailList.map((item) => (
                          <tr key={item.detailId}>
                            <td><span className="id-badge">{item.detailId}</span></td>
                            <td>ORD-{item.orderId}</td>
                            <td>
                              <div className="product-info">
                                <div className="product-name">{item.produc_name || "N/A"}</div>
                                <div className="product-id">ID: {item.productId}</div>
                              </div>
                            </td>
                            <td>{item.quantity}</td>
                            <td>{Number(item.price).toLocaleString()} VND</td>
                            <td className="fw-bold">
                              {(Number(item.quantity) * Number(item.price)).toLocaleString()} VND
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="text-center py-4">
                            <div className="no-data">
                              <i className="bi bi-inbox"></i>
                              <p>No order detail data available</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function DashboardCard({ title, icon, value, link, bg }) {
  return (
    <div className="col-md-4 mb-4">
      <div className={`card stat-card ${bg} h-100`}>
        <div className="card-body">
          <div className="stat-icon">
            <Icon>{icon}</Icon>
          </div>
          <h5 className="stat-title">{title}</h5>
          <h3 className="stat-value">{value}</h3>
        </div>
        <div className="card-footer">
          <Link to={link} className="stat-link">
            View Details <i className="bi bi-arrow-right"></i>
          </Link>
        </div>
      </div>
    </div>
  );
}
