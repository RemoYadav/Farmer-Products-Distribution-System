import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { handleSuccess, handleError } from "../../util";
import Header from "./CustomerHeader";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Package,
  Calendar,
  DollarSign,
  FileText,
  ShoppingCart,
  Check,
  AlertCircle,
  Leaf,

} from "lucide-react";
// import { toast } from "sonner";
import "./css/PlaceOrders.css";
export default function PlaceOrders() {
  //  get prodcutId from market
  const { productId } = useParams();
  const token = localStorage.getItem("token");
  const [email, setEmail] = useState("")
  useEffect(() => {
    setEmail(localStorage.getItem("email") || "");
  }, []);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [profile, setProfile] = useState(null);

  const [orderData, setOrderData] = useState({
    customerName: "",
    email: "",
    phone: "",
    location: "",
    products: "",
    quantity: "",
    deliveryDate: "",
    notes: "",

  });
  const fetchProfile = async () => {
    try {
      const url = `${API_BASE_URL}/api/customer/profile`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });
      const result = await response.json();
      if (result.success && result.profile) {
        setProfile(result.profile); // populate form fields

        // setPreviewImage(result.profile.profileImageUrl || "");
      }
    } catch (err) {

      handleError("Error fetching profile");
    }
    finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [API_BASE_URL, token]);
  useEffect(() => {
    if (profile) {
      setOrderData(prev => ({
        ...prev,
        customerName: profile.fullName || "",
        email: profile.email || "",
        phone: profile.phone || "",
        location: `${profile?.location ?? ""} ${profile?.address ?? ""} ${profile?.city ?? ""}`
      }));
    }
  }, [profile]);

  const orderhandleChange = (e) => {
    const { name, value } = e.target;
    setOrderData({
      ...orderData,
      [name]: value
    });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };
  const validateForm = () => {
    const newErrors = {};

    if (!customerName) {
      newErrors.customerName = "Name is required";
    }

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email format";
    }

    if (!phone) {
      newErrors.phone = "Phone number is required";
    }

    if (!location) {
      newErrors.location = "Location is required";
    }

    if (!selectedProduct?._id) {
      newErrors.products = "Please select a product";
    }

    if (!orderData.quantity || orderData.quantity <= 0) {
      newErrors.quantity = "Please enter a valid quantity";
    }

    if (!orderData.deliveryDate) {
      newErrors.deliveryDate = "Delivery date is required";
    } else {
      const selectedDate = new Date(orderData.deliveryDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.deliveryDate = "Delivery date cannot be in the past";
      }
    }
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };
  const [productsAvailable, setProductsAvailable] = useState([]);

  // Load products from localStorage on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${API_BASE_URL}/api/place-order/products`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        const data = await res.json();

        if (!res.ok) {
          console.error("API error:", data.message);
          return;
        }

        // Ensure we have an array
        const productsArray = Array.isArray(data) ? data : data.products;

        if (!Array.isArray(productsArray)) {
          console.error("Products data is not an array:", data);
          return;
        }

        const productsMapped = productsArray.map(p => ({
          _id: p._id,
          productName: p.productName,
          price: p.price,
          unit: p.unit
        }));

        setProductsAvailable(productsMapped);

      } catch (error) {
        console.error("Fetch products error:", error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (productId && productsAvailable.length > 0) {
      const exists = productsAvailable.find(p => p._id === productId);

      if (exists) {
        setOrderData(prev => ({
          ...prev,
          products: productId   //  auto-select product
        }));
      }
    }
  }, [productId, productsAvailable]);
  const calculateTotal = () => {
    const selectedProduct = productsAvailable.find(p => p._id === orderData.products);
    if (selectedProduct && orderData.quantity) {
      const totalPrice = selectedProduct.price * parseFloat(orderData.quantity);
      return (totalPrice);
    }
    return "0.00";
  };
  const selectedProduct = productsAvailable.find(p => p._id === orderData.products);

  const getProductUnit = () => {
    const selectedProduct = productsAvailable.find(p => p._id === orderData.products);
    return selectedProduct ? selectedProduct.unit : "";
  };
  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);

      // Simulate API call
      try {
        const selectedProduct = productsAvailable.find(p => p._id === orderData.products);

        const token = localStorage.getItem("token");
        const totalPrice = calculateTotal()
        const payload = {
          customerName: orderData.customerName,
          email: orderData.email,
          phone: orderData.phone,
          location: orderData.location,
          product: selectedProduct?._id,   // BEST PRACTICE
          quantity: Number(orderData.quantity),
          deliveryDate: orderData.deliveryDate,
          price: selectedProduct?.price,
          notes: orderData.notes,
          totalPrice
        };
        // CREATE PRODUCT
        const res = await fetch(`${API_BASE_URL}/api/orders`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload),
        });
        const result = await res.json();
      
        const { success, message } = result;
        if (success) {
          handleSuccess(message);
          setTimeout(() => {
            // setProducts([...products, data.product]);

            setOrderData({

              products: "",
              quantity: "",
              deliveryDate: "",
              notes: ""
            });
            setIsSubmitting(false);
          }, 1000);
        }

        // resetForm();
      } catch (err) {
        console.error(err);
        setIsSubmitting(false);
        handleError("front Server error");
      }
    } else {
      setIsSubmitting(false);
      handleError("Please check your form submission");
    }
  };


  // Get minimum date (tomorrow)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  if (isLoading) {
    return (
      <div className="loader-overlay">
        <div className="spinner2"></div>
      </div>
    );
  }
  return (
    <div>
      <Header />
      <div className="order-container">
        {/* Header */}


        <div className="order-content">
          <div className="order-card">
            {/* Header */}
            <div className="order-header">
              <h1>Place Your Order</h1>

            </div>

            {/* Form */}
            <form onSubmit={handleSubmitOrder} className="order-form">
              {/* Personal Information */}
              <div className="form-section">
                <h2>Your Information</h2>

                <div className="form-row">
                  <div className=" relative mt-1 ">
                    <label htmlFor="customerName">
                      Full Name <span className="required">*</span>
                    </label>
                    <div className="input-wrapper">
                      <User className="input-icon" />
                      <input
                        type="text"
                        id="customerName"
                        name="customerName"
                        placeholder="John Doe"
                        value={orderData.customerName}
                        onChange={orderhandleChange}
                        className={errors.customerName ? "input-error" : ""}
                      />
                    </div>
                    {errors.customerName && (
                      <span className="error-message">
                        <AlertCircle className="error-icon" />
                        {errors.customerName}
                      </span>
                    )}
                  </div>

                  <div className="relative mt-1">
                    <label htmlFor="email">
                      Email Address <span className="required">*</span>
                    </label>
                    <div className="input-wrapper">
                      <Mail className="input-icon" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="john@example.com"
                        value={orderData.email}
                        onChange={orderhandleChange}
                        className={errors.email ? "input-error" : ""}
                      />
                    </div>
                    {errors.email && (
                      <span className="error-message">
                        <AlertCircle className="error-icon" />
                        {errors.email}
                      </span>
                    )}
                  </div>
                </div>

                <div className="form-row">
                  <div className="relative mt-1">
                    <label htmlFor="phone">
                      Phone Number <span className="required">*</span>
                    </label>
                    <div className="input-wrapper">
                      <Phone className="input-icon" />
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        placeholder="+977 98XXXXXXXX"
                        value={orderData.phone}
                        onChange={orderhandleChange}
                        className={errors.phone ? "input-error" : ""}
                      />
                    </div>
                    {errors.phone && (
                      <span className="error-message">
                        <AlertCircle className="error-icon" />
                        {errors.phone}
                      </span>
                    )}
                  </div>

                  <div className="relative mt-1">
                    <label htmlFor="location">
                      Delivery Location <span className="required">*</span>
                    </label>
                    <div className="input-wrapper">
                      <MapPin className="input-icon" />
                      <input
                        type="text"
                        id="location"
                        name="location"
                        placeholder="City, State"
                        value={orderData.location}
                        onChange={orderhandleChange}
                        className={errors.location ? "input-error" : ""}
                      />
                    </div>
                    {errors.location && (
                      <span className="error-message">
                        <AlertCircle className="error-icon" />
                        {errors.location}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Details */}
              <div className="form-section">
                <h2>Order Details</h2>

                <div className="form-row">
                  <div className="relative mt-1">
                    <label htmlFor="products">
                      Select Product <span className="required">*</span>
                    </label>
                    <div className="input-wrapper">
                      <Package className="input-icon" />
                      <select
                        id="products"
                        name="products"
                        value={orderData.products}
                        onChange={orderhandleChange}
                        className={errors.products ? "input-error" : ""}
                      >
                        <option value="">Select product</option>
                        {productsAvailable.map(p => (
                          <option key={p._id} value={p._id}>
                            {p.productName} - रु-{p.price}/{p.unit}
                          </option>
                        ))}
                      </select>

                    </div>
                    {errors.products && (
                      <span className="error-message">
                        <AlertCircle className="error-icon" />
                        {errors.products}
                      </span>
                    )}
                  </div>

                  <div className="relative mt-1">
                    <label htmlFor="quantity">
                      Quantity {getProductUnit() && `(${getProductUnit()})`} <span className="required">*</span>
                    </label>
                    <div className="input-wrapper">
                      <ShoppingCart className="input-icon" />
                      <input
                        type="number"
                        id="quantity"
                        name="quantity"
                        placeholder="0"
                        min="1"
                        step="1"
                        onWheel={(e) => e.target.blur()}
                        value={orderData.quantity}
                        onChange={orderhandleChange}
                        className={errors.quantity ? "input-error" : ""}
                      />
                    </div>
                    {errors.quantity && (
                      <span className="error-message">
                        <AlertCircle className="error-icon" />
                        {errors.quantity}
                      </span>
                    )}
                  </div>
                </div>

                <div className="form-row">
                  <div className="relative mt-1">
                    <label htmlFor="deliveryDate">
                      Preferred Delivery Date <span className="required">*</span>
                    </label>
                    <div className="input-wrapper">
                      <Calendar className="input-icon" />
                      <input
                        type="date"
                        id="deliveryDate"
                        name="deliveryDate"
                        min={getMinDate()}
                        value={orderData.deliveryDate}
                        onChange={orderhandleChange}
                        className={errors.deliveryDate ? "input-error" : ""}
                      />
                    </div>
                    {errors.deliveryDate && (
                      <span className="error-message">
                        <AlertCircle className="error-icon" />
                        {errors.deliveryDate}
                      </span>
                    )}
                  </div>

                  <div className="relative mt-1">
                    <label>Estimated Total</label>
                    <div className="total-display">
                      
                      <span className="total-amount">रु-{calculateTotal()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Notes */}
              <div className="form-section">
                <h2>Additional Notes</h2>

                <div className="relative mt-1">
                  <label htmlFor="notes">Special Instructions(Optional)</label>
                  <div className="textarea-wrapper">
                    <FileText className="textarea-icon" />
                    <textarea
                      id="notes"
                      name="notes"
                      placeholder="Any special requirements or preferences..."
                      rows="4"
                      value={orderData.notes}
                      onChange={orderhandleChange}
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="spinner" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Check className="submit-icon" />
                    Submit Order Request
                  </>
                )}
              </button>

              <p className="form-footer">
                Your request will be sent to the farmer for review. You will receive a confirmation email once it's approved.
              </p>
            </form>
          </div>
          <div className="flex justify-center">          {/* Info Cards */}
            <div className="info-cards">
              <div className="info-card">
                <div className="info-card-icon green">
                  <Leaf className="card-icon" />
                </div>
                <h3>100% Organic</h3>
                <p>All our produce is certified organic and grown without harmful pesticides</p>
              </div>

              <div className="info-card">
                <div className="info-card-icon blue">
                  <Package className="card-icon" />
                </div>
                <h3>Farm Fresh</h3>
                <p>Harvested within 24 hours of delivery to ensure maximum freshness</p>
              </div>

              <div className="info-card">
                <div className="info-card-icon orange">
                  <ShoppingCart className="card-icon" />
                </div>
                <h3>Direct from Farm</h3>
                <p>Support local agriculture by ordering directly from our family farm</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>

  );
}
