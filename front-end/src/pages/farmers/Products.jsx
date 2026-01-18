import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { handleSuccess, handleError } from "../../util";
import FarmerHeader from "./FarmerHeader"
import "./css/Products.css"
import {
  Package,

  Search,

  Save,
  X,
  Tag,
  IndianRupee,
  Edit,
  Trash2,
  ImageIcon,


  Plus,

} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";

export default function Products() {

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("token");

  const [email, setEmail] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [errors, setErrors] = useState({});
  const [products, setProducts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState([]); // filtered products


  const [productData, setProductData] = useState({
    productName: "",
    category: "",
    price: "",
    unit: "kg",
    stock: "",
    description: "",
    image: null,
    imagePreview: null
  });
  // const [errors, setErrors] = useState({});
  // Categories for products
  const categories = [
    "Vegetables",
    "Fruits",
    "Herbs",
    "Grains",
    "Dairy",
    "Eggs",
    "Honey",
    "Chicken",
    "Other"
  ];

  const units = ["lb", "kg", "oz", "bundle", "dozen", "jar", "bottle"];
  const normalizeProduct = (p) => ({
    _id: p._id,
    productName: p.productName || "",
    category: p.category,
    price: Number(p.price),
    unit: p.unit,
    stock: Number(p.stock) || 0,
    description: p.description,
    imagePreview: p.image ? `${API_BASE_URL}/${p.image}` : null
  });

  // Load products from localStorage on mount

  const fetchProducts = async () => {
  setIsLoading(true);

  try {
    const res = await fetch(`${API_BASE_URL}/api/products`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.message || "Failed to load products");
    }

    const data = await res.json();

    // Handle empty products safely
    if (!Array.isArray(data) || data.length === 0) {
      setProducts([]);
      setFilteredProducts([]);
      return;
    }

    const allowedProducts = data.map(p => ({
      _id: p._id,
      productName: p.productName,
      category: p.category,
      price: p.price,
      unit: p.unit,
      stock: p.stock,
      description: p.description,
      imagePreview: p.image ? `${API_BASE_URL}/${p.image}` : null,
    }));

    setProducts(allowedProducts);
    setFilteredProducts(allowedProducts);

  } catch (error) {
    console.error("Fetch products error:", error.message);

    // Show correct message
    handleError(
      error.message.includes("Failed to fetch")
        ? "Server not responding. Please try again later."
        : error.message
    );
  } finally {
    setIsLoading(false);
  }
};

useEffect(() => {
  fetchProducts();
}, []);
 // ✅ EMPTY dependency array



  // Save products to localStorage whenever they change


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleProductImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, image: "Image size should be less than 5MB" });
        return;
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        setErrors({ ...errors, image: "Please select a valid image file" });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setProductData(prev => ({
          ...prev,
          image: file,
          imagePreview: reader.result
        }));
        if (editingProduct) {
          setProducts(prev =>
            prev.map(p =>
              p._id === editingProduct._id
                ? { ...p, imagePreview: reader.result }
                : p
            )
          );
        }

        setErrors({ ...errors, image: "" });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setProductData({
      ...productData,
      image: null,
      imagePreview: null
    });
  };

  const validateProductForm = () => {
    const newErrors = {};

    if (!productData.productName) {
      newErrors.productName = "Product name is required";
    }

    if (!productData.category) {
      newErrors.category = "Category is required";
    }

    if (!productData.price || parseFloat(productData.price) <= 0) {
      newErrors.price = "Valid price is required";
    }

    if (!productData.stock || parseInt(productData.stock) < 0) {
      newErrors.stock = "Valid stock quantity is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setProductData({
      productName: "",
      category: "",
      price: "",
      unit: "kg",
      stock: "",
      description: "",
      image: null,
      imagePreview: null
    });
    setErrors({});
    setEditingProduct(null);
    setShowAddForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateProductForm()) return;

    try {
      const token = localStorage.getItem("token");

      const pData = new FormData();
      pData.append("productName", productData.productName || "");
      pData.append("category", productData.category);
      pData.append("price", productData.price);
      pData.append("unit", productData.unit);
      pData.append("stock", productData.stock);
      pData.append("description", productData.description);
      // pData.append("imagePreview", productData.imagePreview);

      if (productData.image) {
        pData.append("image", productData.image);
      }


      const url = editingProduct
        ? `${API_BASE_URL}/api/products/${editingProduct._id}`
        : `${API_BASE_URL}/api/products`;

      const method = editingProduct ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: pData,
      });

      const data = await response.json();

      if (!data.success) {
        toast.error(data.message);
        return;
      }
      setProducts(prev => [...prev, data.data]);
      toast.success(data.message);

      fetchProducts();
      resetForm();
      setEditingProduct(null);
      setShowAddForm(false);
      // 🔁 UPDATE UI
      // 🔁 UPDATE UI
      if (editingProduct) {
        if (!data.product) return;

        const updatedProduct = normalizeProduct(data.product);

        setProducts(prev =>
          prev.map(p =>
            p && p._id === editingProduct._id ? updatedProduct : p
          )
        );

      } else {
        if (!data.product) return;

        const newProduct = normalizeProduct(data.product);

        setProducts(prev => [...prev, newProduct]);
      }


      resetForm();
       fetchProducts();
      setEditingProduct(null);
      setShowAddForm(false);

    } catch (error) {
      console.error(error);
      toast.error("Server error");
    }
  };
  useEffect(() => {
  }, []);

  const handleEdit = (product) => {
    setProductData({
      _id: product._id || "",            // ✅ use _id
      productName: product.productName || "",   // ✅ match backend field
      category: product.category || "",
      price: product.price || "",
      unit: product.unit || "",
      stock: product.stock || "",
      description: product.description || "",
      image: null,
      imagePreview: product.imagePreview || "",// backend image URL
    });

    setEditingProduct(product); // product must have _id
    setShowAddForm(true);
    
  };


  const handleDeleteProduct = async (_id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${API_BASE_URL}/api/products/delete${_id}`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const data = await res.json();
      if (data.success) {
        handleSuccess(data.message);
        // setProducts(prev => prev.filter(p => p && p._id !== _id));
        fetchProducts();
        return;
      }

      // Remove from UI instantly


    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  };


  const getTotalValue = () => {

    return products.reduce((sum, p) => {
      if (!p || !p.stock) return sum;
      return sum + Number(p.price) * (p.stock);
    }, 0).toFixed(2);
  };

  const handleSearch = () => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      setFilteredProducts(products); // show all if search is empty
      return;
    }

    const filtered = products.filter((p) =>
      p.productName.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query)

    );

    setFilteredProducts(filtered);
  };
  useEffect(() => {
    handleSearch();
  }, [searchQuery]);

  // const filteredProducts = products.filter((product) => {
  //   if (!product) return false;

  //   const query = searchQuery.toLowerCase();

  //   return (
  //     product.productName?.toLowerCase().includes(query) ||
  //     product.category?.toLowerCase().includes(query) ||
  //     product.description?.toLowerCase().includes(query)
  //   );
  // });

  if (isLoading) {
    return (
      <div className="loader-overlay">
        <div className="spinner2"></div>
      </div>
    );
  }

  return (
    <div className="">

      <div>
        <FarmerHeader />
      </div>

      <div className="product-management">
        {/* Header */}
        {/* {mPeoduct } */}
        {
          (
            <div className="product-management">
              {/* Header */}
              <div className="pm-header">

                <div className="pm-header-content ">
                  <div className="product-search-box  ">
                    <Search className="product-search-icon " />
                    <input
                      type="text"
                      placeholder="Search requests..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="searchInput"
                    /><button className="searchBtn" onClick={handleSearch}>search</button>
                  </div>

                  <button
                    className="btn-add-product"
                    onClick={() => setShowAddForm(true)}
                  >
                    <Plus className="icon-sm" />
                    Add New Product
                  </button>
                </div>
              </div>

              <div className="pm-container">
                {/* Stats */}
                <div className="pm-stats">
                  <div className="stat-box">
                    <Package className="product-stat-icon" />
                    <div>
                      <p className="stat-label">Total Products</p>
                      <p className="stat-value">{products.length}</p>
                    </div>
                  </div>
                  <div className="stat-box">
                    <Tag className="product-stat-icon" />
                    <div>
                      <p className="stat-label">Total Items in Stock</p>
                      <p className="stat-value">
                        {products.reduce((sum, p) => sum + Number(p?.stock || 0), 0)}

                      </p>
                    </div>
                  </div>
                  <div className="stat-box">
                    <IndianRupee className="product-stat-icon" />
                    <div>
                      <p className="stat-label">Inventory Value</p>
                      <p className="stat-value">{getTotalValue()}</p>
                    </div>
                  </div>
                </div>

                {/* Add/Edit Form Modal */}
                {showAddForm && (
                  <div className="modal-overlay" onClick={resetForm}>
                    <div className="modal-content_product" onClick={(e) => e.stopPropagation()}>
                      <div className="modal-header">
                        <h2>{editingProduct ? "Edit Product" : "Add New Product"}</h2>
                        <button className="btn-close" onClick={resetForm}>
                          <X className="icon-sm" />
                        </button>
                      </div>

                      <form onSubmit={handleSubmit} className="product-form">
                        {/* Image Upload */}
                        <div className="form-group-full">
                          <label>Product Image</label>
                          <div className="image-upload-area">
                            {productData.imagePreview ? (
                              <div className="image-preview">
                                <img src={productData.imagePreview} alt="Preview" />
                                <button
                                  type="button"
                                  className="btn-remove-image"
                                  onClick={removeImage}
                                >
                                  <X className="icon-sm" />
                                </button>
                              </div>
                            ) : (
                              <label className="upload-placeholder">
                                <ImageIcon className="upload-icon" />
                                <span>Click to upload image</span>
                                <span className="upload-hint">PNG, JPG up to 5MB</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleProductImageChange}

                                  style={{ display: "none" }}
                                />
                              </label>
                            )}
                          </div>
                          {errors.image && (
                            <span className="error-text">{errors.image}</span>
                          )}
                        </div>

                        {/* Product Details */}
                        <div className="form-row">
                          <div className="form-group">
                            <label>
                              Product Name <span className="required">*</span>
                            </label>
                            <input
                              type="text"
                              name="productName"
                              placeholder="e.g., Organic Tomatoes"
                              value={productData.productName}
                              onChange={handleInputChange}
                              className={errors.productName ? "input-error" : ""}
                            />
                            {errors.name && (
                              <span className="error-text">{errors.name}</span>
                            )}
                          </div>

                          <div className="form-group">
                            <label>
                              Category <span className="required">*</span>
                            </label>
                            <select
                              name="category"
                              value={productData.category}
                              onChange={handleInputChange}
                              className={errors.category ? "input-error" : ""}
                            >
                              <option value="">Select category...</option>
                              {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                  {cat}
                                </option>
                              ))}
                            </select>
                            {errors.category && (
                              <span className="error-text">{errors.category}</span>
                            )}
                          </div>
                        </div>

                        <div className="form-row">
                          <div className="form-group">
                            <label>
                              Price <span className="required">*</span>
                            </label>
                            <div className="input-with-prefix">
                              <span className="input-prefix ">Nrs-</span>
                              <input
                                type="number"
                                name="price"
                                placeholder="0.00"
                                step="0.1"
                                min="0"
                                value={productData.price}
                                onChange={handleInputChange}
                                className={errors.price ? "input-error" : ""}
                              />
                            </div>
                            {errors.price && (
                              <span className="error-text">{errors.price}</span>
                            )}
                          </div>

                          <div className="form-group">
                            <label>Unit</label>
                            <select
                              className="unit-select"
                              name="unit"
                              value={productData.unit}
                              onChange={handleInputChange}
                            >
                              {units.map((unit) => (
                                <option key={unit} value={unit}>
                                  {unit}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="form-group">
                            <label>
                              Stock Quantity <span className="required">*</span>
                            </label>
                            <input
                              type="number"
                              name="stock"
                              placeholder="0"
                              min="0"
                              value={productData.stock}
                              onChange={handleInputChange}
                              className={errors.stock ? "input-error" : ""}
                            />
                            {errors.stock && (
                              <span className="error-text">{errors.stock}</span>
                            )}
                          </div>
                        </div>

                        <div className="form-group-full">
                          <label>Description</label>
                          <textarea
                            name="description"
                            placeholder="Describe your product..."
                            rows="3"
                            value={productData.description}
                            onChange={handleInputChange}
                          />
                        </div>

                        {/* Form Actions */}
                        <div className="form-actions">
                          <button type="button" className="btn-cancel" onClick={resetForm}>
                            Cancel
                          </button>
                          <button type="submit" className="btn-save">
                            <Save className="icon-sm" />
                            {editingProduct ? "Update Product" : "Add Product"}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                {/* Products Grid */}
                <div className="products-section">
                  <h2 className="section-title-product">Your Products</h2>
                  {filteredProducts.length === 0 ? (
                    <div className="empty-state">
                      <Package className="empty-icon" />
                      <p>No products yet</p>
                      <button
                        className="btn-add-first"
                        onClick={() => setShowAddForm(true)}
                      >
                        <Plus className="icon-sm" />
                        Add Your First Product
                      </button>
                    </div>
                  ) : (
                    <div className="products-grid">
                      {filteredProducts.map((product) => (
                        <div key={product._id} className="product-card">
                          <div className="product-image">
                            {product.imagePreview ? (
                              <img src={product.imagePreview} alt={product.productName} />
                            ) : (
                              <div className="no-image">
                                <ImageIcon className="no-image-icon" />
                              </div>
                            )}
                            <span className="product-category">{product.category}</span>
                          </div>
                          <div className="product-info">
                            <h3>{product.productName}</h3>
                            {product.description && (
                              <p className="product-description">{product.description}</p>
                            )}
                            <div className="product-details">
                              <div className="detail-item">
                                Nrs-
                                <span className="product-price">
                                  {product.price}/{product.unit}
                                </span>
                              </div>
                              <div className="detail-item">
                                <Package className="detail-icon" />
                                <span className={`product-stock ${parseInt(product.stock) < 10 ? "low-stock" : ""}`}>
                                  {product.stock} {product.unit}s in stock
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="product-actions">
                            <button
                              className="btn-edit"
                              onClick={() => handleEdit(product)}
                            >
                              <Edit className="icon-sm" />
                              Edit
                            </button>
                            <button
                              className="btn-delete"
                              onClick={() => handleDeleteProduct(product._id)}
                            >
                              <Trash2 className="icon-sm" />
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

          )
        };

      </div>
      <ToastContainer />
    </div>
  );
}
