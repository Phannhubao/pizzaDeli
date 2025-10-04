import { Link } from "react-router-dom";

export default function AdminSidebar() {
  return (
    <>
      <div className="offcanvas offcanvas-start sidebar-nav bg-dark" tabIndex="-1" id="sidebar">
        <div className="offcanvas-body p-0">
          <nav className="navbar-dark">
            <ul className="navbar-nav pt-4">
              <li>
                <Link to="/home" className="nav-link px-3 active">
                  <span className="me-2">
                    <i className="fa-solid fa-store"></i>
                  </span>
                  <span>Go to Store</span>
                </Link>
              </li>
              <li>
                <Link to="/admin" className="nav-link px-3 active">
                  <span className="me-2">
                    <i className="bi bi-house-door-fill"></i>
                  </span>
                  <span>Dashboard</span>
                </Link>
              </li>
              <li className="my-4">
                <hr className="dropdown-divider bg-light" />
              </li>
              <li>
                <div className="text-muted small fw-bold text-uppercase px-3 mb-3">Management</div>
              </li>
              <li>
                <a className="nav-link px-3 sidebar-link" data-bs-toggle="collapse" href="#layouts">
                  <span className="me-2">
                    <i className="bi bi-archive-fill"></i>
                  </span>
                  <span>Manager</span>
                  <span className="ms-auto">
                    <span className="right-icon">
                      <i className="bi bi-chevron-down"></i>
                    </span>
                  </span>
                </a>
                <div className="collapse" id="layouts">
                  <ul className="navbar-nav ps-3">
                    <li>
                      <Link to="/admin/products" className="nav-link px-3">
                        <span className="me-2">
                          <i className="fa-solid fa-clock"></i>{" "}
                        </span>
                        <span>Products</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/admin/brands" className="nav-link px-3">
                        <span className="me-2">
                          <i className="fa-brands fa-bandcamp"></i>{" "}
                        </span>
                        <span>Brands</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/admin/orders" className="nav-link px-3">
                        <span className="me-2">
                          <i className="fa fa-shopping-cart" aria-hidden="true"></i>
                        </span>
                        <span>Orders</span>
                      </Link>
                    </li>
                    <li>
                      <Link to="/admin/reviews" className="nav-link px-3">
                        <span className="me-2">
                          <i className="fa fa-comment" aria-hidden="true"></i>
                        </span>
                        <span>Reviews</span>
                      </Link>
                    </li>
                  </ul>
                </div>
              </li>
              <li>
                <Link to="/admin/accounts" className="nav-link px-3">
                  <span className="me-2">
                    <i className="bi bi-person-square"></i>{" "}
                  </span>
                  <span>Account</span>
                </Link>
              </li>
              <li className="my-4">
                <hr className="dropdown-divider bg-light" />
              </li>
              <li>
                <div className="text-muted small fw-bold text-uppercase px-3 mb-3">Addons</div>
              </li>
              <li>
                <Link to="/admin#chart-js" className="nav-link px-3">
                  <span className="me-2">
                    <i className="bi bi-graph-up"></i>{" "}
                  </span>
                  <span>Charts</span>
                </Link>
              </li>
              <li>
                <Link to="/admin#order-list" className="nav-link px-3">
                  <span className="me-2">
                    <i className="bi bi-table"></i>{" "}
                  </span>
                  <span>Tables</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}
