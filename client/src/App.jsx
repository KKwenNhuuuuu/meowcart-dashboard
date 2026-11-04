import { useEffect, useState } from "react";
import "./App.css";
import Chart from "./Chart";

function App() {
  const [totalProducts, setTotalProducts] = useState(0);
  const [activeProducts, setActiveProducts] = useState(0);
  const [draftProducts, setDraftProducts] = useState(0);
  const [ordersLast30, setOrdersLast30] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [currency, setCurrency] = useState("USD");
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {

    fetch("http://localhost:3000/api/productcount")
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          setTotalProducts(result.data.count);
        } else {
          setError(result.error);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));

    fetch("http://localhost:3000/api/activeproducts/count")
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          setActiveProducts(result.data.count);
        } else {
          setError(result.error);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));

    fetch("http://localhost:3000/api/draftproducts/count")
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          setDraftProducts(result.data.count);
        } else {
          setError(result.error);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));

    fetch("http://localhost:3000/api/orders/last30days/count")
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          setOrdersLast30(result.data.count);
        } else {
          setError(result.error);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));

    fetch("http://localhost:3000/api/orders/last30days/revenue")
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          setTotalRevenue(result.data.totalRevenue);
          setCurrency(result.data.currency);
        } else {
          setError(result.error);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));

    fetch("http://localhost:3000/api/inventory/lowstock")
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          setLowStockProducts(result.data);
        } else {
          setError(result.error);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));

  }, []);

  if (loading) return <div className="container">Loading...</div>;
  if (error) return <div className="container error">Error: {error}</div>;

  return (
    <div className="container">
      <h1>Dashboard</h1>

      <div className="cards">
        <div className="card">
          <h3>Total Products</h3>
          <p className="number">{totalProducts}</p>
        </div>
        <div className="card">
          <h3>Active Products</h3>
          <p className="number">{activeProducts}</p>
        </div>
        <div className="card">
          <h3>Draft Products</h3>
          <p className="number">{draftProducts}</p>
        </div>
        <div className="card">
          <h3>Orders (Last 30 days)</h3>
          <p className="number">{ordersLast30}</p>
        </div>
        <div className="card">
          <h3>Revenue (Last 30 days)</h3>
          <p className="number">
            {totalRevenue} {currency}
          </p>
        </div>
      </div>

      <h2>Low Stock Products (Inventory &lt; 5)</h2>
      {lowStockProducts.length === 0 ? (
        <p>No low stock products</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Product Title</th>
              <th>Inventory</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {lowStockProducts.map((product) => (
              <tr key={product.id}>
                <td>{product.title}</td>
                <td>{product.totalInventory}</td>
                <td>{product.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    
      <h2>Revenue of Last 14 Days</h2>
      <div className="chart-container">
        <Chart />
      </div>

    </div>
  );
}

export default App;