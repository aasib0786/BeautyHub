import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../services/FetchNodeServices";
import { hasPermission } from "../../services/permissionHelper";
import Pagination from "../../Components/Common/Pagination";
import ViewToggle from "../../Components/Common/ViewToggle";

const AllOrder = () => {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOption, setFilterOption] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // View mode & pagination
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem("orders_view_mode") || "list";
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handleViewChange = (mode) => {
    setViewMode(mode);
    localStorage.setItem("orders_view_mode", mode);
  };

  const storedUser = JSON.parse(sessionStorage.getItem("adminUser") || "{}");
  const storedRoleDetails = JSON.parse(sessionStorage.getItem("adminRoleDetails") || "null");

  const canDelete = hasPermission(storedUser, storedRoleDetails, "Manage Orders", "delete");

  // Fetch orders
  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("/api/v1/order/get-all-orders");
      if (response.status === 200) {
        setOrders(response?.data.orders || []);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders.");
    } finally {
      setIsLoading(false);
    }
  };

  // Delete order
  const deleteOrder = async (orderId) => {
    try {
      const confirmation = await Swal.fire({
        title: "Are you sure?",
        text: "This action cannot be undone!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
      });

      if (confirmation.isConfirmed) {
        const body = { orderId: orderId };
        const response = await axiosInstance.delete(`/api/v1/order/delete-order/${orderId}`, body);
        if (response?.status === 200) {
          setOrders((prevOrders) =>
            prevOrders.filter((order) => order._id !== orderId)
          );
          toast.success("Order deleted successfully.");
        }
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Failed to delete order.");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (e) => {
    setFilterOption(e.target.value);
    setCurrentPage(1);
  };

  // Filter orders
  let filteredOrders = [...orders];

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    filteredOrders = filteredOrders.filter(
      (order) =>
        order?.orderUniqueId?.toLowerCase().includes(q) ||
        order?.orderStatus?.toLowerCase().includes(q) ||
        order?.paymentStatus?.toLowerCase().includes(q) ||
        order?.paymentMethod?.toLowerCase().includes(q) ||
        order?.shippingAddress?.name?.toLowerCase().includes(q) ||
        order?.shippingAddress?.phone?.includes(q)
    );
  }

  if (filterOption === "today") {
    const today = new Date();
    filteredOrders = filteredOrders.filter(
      (order) => new Date(order.createdAt).toDateString() === today.toDateString()
    );
  } else if (filterOption === "yesterday") {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    filteredOrders = filteredOrders.filter(
      (order) => new Date(order.createdAt).toDateString() === yesterday.toDateString()
    );
  } else if (filterOption === "thisWeek") {
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    filteredOrders = filteredOrders.filter(
      (order) => new Date(order.createdAt) >= startOfWeek
    );
  } else if (filterOption === "thisMonth") {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    filteredOrders = filteredOrders.filter(
      (order) => new Date(order.createdAt) >= startOfMonth
    );
  }

  const totalItems = filteredOrders.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  const getStatusBadge = (status) => {
    const s = (status || "").toLowerCase();
    if (s.includes("delivered") || s.includes("completed")) {
      return <span className="badge bg-success">✓ {status}</span>;
    }
    if (s.includes("cancel") || s.includes("failed")) {
      return <span className="badge bg-danger">✕ {status}</span>;
    }
    if (s.includes("shipped") || s.includes("transit")) {
      return <span className="badge bg-info text-dark">🚚 {status}</span>;
    }
    return <span className="badge bg-warning text-dark">⏳ {status || "Pending"}</span>;
  };

  return (
    <>
      <ToastContainer />

      {/* Header Banner */}
      <div className="bread">
        <div className="head">
          <h4>📦 Customer Orders ({totalItems})</h4>
        </div>
      </div>

      {/* Toolbar Controls: Search, Date Filter, View Mode, Limit */}
      <div className="list-toolbar">
        <div className="list-toolbar-left">
          <div className="search-box" style={{ width: "280px" }}>
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="🔍 Search Order ID, customer, status..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>

          <select
            value={filterOption}
            onChange={handleFilterChange}
            className="form-select form-select-sm"
            style={{ width: "160px", borderRadius: "8px" }}
          >
            <option value="">All Dates</option>
            <option value="today">Today's Orders</option>
            <option value="yesterday">Yesterday</option>
            <option value="thisWeek">This Week</option>
            <option value="thisMonth">This Month</option>
          </select>

          {(searchQuery || filterOption) && (
            <button
              className="btn btn-sm btn-outline-secondary rounded-pill px-3"
              onClick={() => {
                setSearchQuery("");
                setFilterOption("");
                setCurrentPage(1);
              }}
            >
              <i className="fa-solid fa-xmark"></i> Clear
            </button>
          )}
        </div>

        <div className="list-toolbar-right">
          <ViewToggle viewMode={viewMode} onViewChange={handleViewChange} />

          <div className="items-limit-wrapper">
            <span>Show:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="items-limit-select"
            >
              <option value={10}>10 items</option>
              <option value={25}>25 items</option>
              <option value={50}>50 items</option>
              <option value={100}>100 items</option>
            </select>
          </div>
        </div>
      </div>

      {/* List (Table) View */}
      {viewMode === "list" && (
        <section className="main-table">
          <table className="table table-bordered table-striped table-hover align-middle">
            <thead>
              <tr>
                <th scope="col">Sr.No.</th>
                <th scope="col">Order ID</th>
                <th scope="col">Customer</th>
                <th scope="col">Items</th>
                <th scope="col">Final Amount</th>
                <th scope="col">Order Status</th>
                <th scope="col">Payment Mode</th>
                <th scope="col">Payment Status</th>
                <th scope="col">Order Date</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="10" className="text-center py-4">
                    <i className="fa-solid fa-circle-notch fa-spin me-2 text-primary"></i> Loading orders...
                  </td>
                </tr>
              ) : paginatedOrders.length > 0 ? (
                paginatedOrders.map((order, index) => (
                  <tr key={order?._id}>
                    <td>{startIndex + index + 1}</td>
                    <td>
                      <Link to={`/order-details/${order._id}`} className="fw-bold text-primary">
                        {order.orderUniqueId || order._id}
                      </Link>
                    </td>
                    <td>
                      <span>{order?.shippingAddress?.name || "Customer"}</span>
                    </td>
                    <td>
                      <span className="badge bg-secondary">{order.items?.length || 0} items</span>
                    </td>
                    <td>
                      <strong className="text-dark">₹{order.totalAmount}</strong>
                    </td>
                    <td>{getStatusBadge(order.orderStatus)}</td>
                    <td>
                      <span className="badge bg-light text-dark border">
                        {order.paymentMethod || "Online"}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${order.paymentStatus === "Paid" ? "bg-success" : "bg-warning text-dark"}`}>
                        {order.paymentStatus || "Pending"}
                      </span>
                    </td>
                    <td>
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "N/A"}
                    </td>
                    <td>
                      <Link to={`/order-details/${order?._id}`} className="bt edit">
                        Details <i className="fa-solid fa-arrow-up-right-from-square"></i>
                      </Link>
                      {canDelete && (
                        <>
                          &nbsp;
                          <button
                            className="bt delete"
                            onClick={() => deleteOrder(order?._id)}
                            title="Delete Order"
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="text-center py-4 text-muted">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      )}

      {/* Card (Grid) View */}
      {viewMode === "card" && (
        <div className="admin-card-grid">
          {isLoading ? (
            <div className="col-12 text-center py-5">
              <i className="fa-solid fa-circle-notch fa-spin fa-2x text-primary"></i>
              <p className="mt-2 text-muted">Loading orders...</p>
            </div>
          ) : paginatedOrders.length === 0 ? (
            <div className="col-12 text-center py-5 text-muted">
              <i className="fa-solid fa-box-open fa-3x mb-3 text-secondary"></i>
              <h5>No orders found</h5>
            </div>
          ) : (
            paginatedOrders.map((order) => (
              <div key={order._id} className="admin-order-card">
                <div className="order-card-header">
                  <span className="order-card-id">#{order.orderUniqueId || order._id.slice(-6)}</span>
                  {getStatusBadge(order.orderStatus)}
                </div>

                <div className="order-card-meta">
                  <div>
                    <strong>Customer:</strong> {order?.shippingAddress?.name || "Customer"}
                  </div>
                  {order?.shippingAddress?.phone && (
                    <div className="text-muted small">
                      <i className="fa-solid fa-phone me-1"></i> {order.shippingAddress.phone}
                    </div>
                  )}
                  <div className="d-flex justify-content-between align-items-center mt-1">
                    <span>{order.items?.length || 0} Items</span>
                    <span className="badge bg-light text-dark border">
                      {order.paymentMethod || "Online"}
                    </span>
                  </div>
                  <div className="order-card-date">
                    <i className="fa-regular fa-clock me-1"></i>
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ""}
                  </div>
                </div>

                <div className="order-card-footer">
                  <div>
                    <span className="text-muted small d-block">Total Amount</span>
                    <strong className="text-primary fs-5">₹{order.totalAmount}</strong>
                  </div>
                  <div className="d-flex align-items-center gap-1">
                    <Link to={`/order-details/${order._id}`} className="bt edit">
                      Manage <i className="fa-solid fa-arrow-right"></i>
                    </Link>
                    {canDelete && (
                      <button
                        className="bt delete"
                        onClick={() => deleteOrder(order._id)}
                        title="Delete Order"
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Pagination Controls */}
      {totalItems > 0 && (
        <Pagination
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onLimitChange={setItemsPerPage}
          limitOptions={[10, 25, 50, 100]}
          itemLabel="orders"
        />
      )}
    </>
  );
};

export default AllOrder;
