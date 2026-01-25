import React, { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import Header from "./AdminHeader";
import { handleSuccess, handleError } from "../../util";
import AdminOrder from "./AdminOrders";
import AdminUsers from "./AdminUsers";
import axios from "axios";
import {
  Shield,
  Users,

  Search,


} from "lucide-react";
import "./AdminDashboard.css";
import { Link, Navigate } from "react-router-dom";


export default function AdminProducts() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  console.log(products)
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/products`);
      const data = await res.json();
      setProducts(data);
      setFilteredProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAccess = async (id, currentStatus) => {
    try {
      await axios.put(`${API_BASE_URL}/api/admin/products/${id}/access`, {
        access: currentStatus === "allowed" ? "denied" : "allowed",
      });
      fetchProducts(); // reload list
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setEditData({
      productName: product.productName,
      category: product.category,
      price: product.price,
      stock: product.stock,
      unit: product.unit,
    });
  };

  // Save Edited Row
  const handleSave = async (id) => {
    try {
      await axios.put(`${API_BASE_URL}/api/admin/products/${id}`, editData);
      setEditingId(null);
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  // Cancel Editing
  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
  };
  // Search Filter Logic
  useEffect(() => {
    const query = searchQuery.toLowerCase().trim();

    if (!query) {
      setFilteredProducts(products);
      return;
    }

    const filtered = products.filter((product) => {
      const productName = product.productName.toLowerCase();
      const category = product.category.toLowerCase();

      // If farmer details exist in product
      const farmName = product.farmer?.farmName?.toLowerCase() || "";
      const email = product.farmer?.email?.toLowerCase() || "";

      return (
        productName.includes(query) ||
        category.includes(query) ||
        farmName.includes(query) ||
        email.includes(query)
      );
    });

    setFilteredProducts(filtered);
  }, [searchQuery, products]);


  if (isLoading) {
    return (
      <div className="loader-overlay">
        <div className="spinner2"></div>
      </div>
    );
  }
  return (
    <div className="admin-dashboard">
      {/* Header */}
      <Header />
      <div>


        {/* Search Bar */}
        <div className=" filters-section mt-3" style={{ margin: "20px 0" }}>
          <div className="ad-search-box">
                       <Search className="ad-search-icon" />      
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by product, category, farmer name, or email..."
            className=" mr-10 ml-5 flex justify-center"
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #060606",
            }}
          />
           
          </div>
        </div>
        {/* Products Tab */}
        {(
          <table className="w-full border-collapse bg-white shadow rounded-xl overflow-hidden">
            <thead className="bg-gray-100 text-sm text-gray-700">
              <tr>
                <th className="p-3 ">Product</th>
                <th className="p-3">Farm</th>
                <th className="p-3">Category</th>
                <th className="p-3">Price</th>
                <th className="p-3">Stock</th>
                <th className="p-3 ">Status</th>
                <th className="p-3 ">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product._id} className="border-t gap-x-8 gap-y-4 text-sm hover:bg-gray-50">
                  <td className="p-3 text-center font-medium">
                    {editingId === product._id ? (
                      <input
                        type="text"
                        value={editData.productName}
                        onChange={(e) => setEditData({ ...editData, productName: e.target.value })}
                        className="border rounded px-2 py-1"
                      />
                    ) : (
                      product.productName
                    )}
                  </td>

                  <td className="p-3 text-center">
                    {product.farmer?.farmName || "No Farmer"}
                  </td>

                  <td className="p-3 text-center">
                    {editingId === product._id ? (
                      <input
                        type="text"
                        value={editData.category}
                        onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                        className="border rounded px-2 py-1"
                      />
                    ) : (
                      product.category
                    )}
                  </td>

                  <td className="p-3 text-center">
                    {editingId === product._id ? (
                      <input
                        type="number"
                        value={editData.price}
                        onChange={(e) => setEditData({ ...editData, price: e.target.value })}
                        className="border rounded px-2 py-1"
                      />
                    ) : (
                      `रु${product.price}/${product.unit}`
                    )}
                  </td>

                  <td className="p-3 text-center">
                    {editingId === product._id ? (
                      <input
                        type="number"
                        value={editData.stock}
                        onChange={(e) => setEditData({ ...editData, stock: e.target.value })}
                        className="border rounded px-2 py-1"
                      />
                    ) : (
                      product.stock
                    )}
                  </td>

                  <td className="p-3">
                    <span
                      className={`px-3 py-1 flex justify-center rounded-full font-semibold ${product.access === "allowed"
                          ? "text-green-700"
                          : "text-red-700"
                        }`}
                    >
                      {product.access}
                    </span>
                  </td>

                  <td className="p-3 flex justify-center gap-2">
                    {editingId === product._id ? (
                      <>
                        <button
                          onClick={() => handleSave(product._id)}
                          className="px-4 py-1 rounded-md bg-green-600 text-white text-xs font-semibold"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancel}
                          className="px-4 py-1 rounded-md bg-gray-400 text-white text-xs font-semibold"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEdit(product)}
                          className="px-4 py-1 rounded-md bg-blue-600 text-white text-xs font-semibold"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => toggleAccess(product._id, product.access)}
                          className={`px-4 py-1 rounded-md text-white text-xs font-semibold ${product.access === "allowed"
                              ? "bg-red-600 hover:bg-red-700"
                              : "bg-green-600 hover:bg-green-700"
                            }`}
                        >
                          {product.access === "allowed" ? "Deny" : "Allow"}
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        )}


      </div>



      <ToastContainer />
    </div>
  );
}
