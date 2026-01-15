import { useState, useEffect } from "react";
import Header from "./customers/CustomerHeader.jsx";
import {
    Search,
    MapPin,
    Star,

    Package,
    ShoppingCart,
    Grid,
    List,
    ChevronRight,
    Leaf,
    Phone,
    Mail,
    Award
} from "lucide-react";
import "./Market.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext"

export default function Market(props) {
    const { onPlaceOrder } = props;
    const navigate = useNavigate();
    const [viewMode, setViewMode] = useState("grid");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedFarmer, setSelectedFarmer] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [filterCategory, setFilterCategory] = useState("all");
    const [farmers, setFarmers] = useState([]);
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(true);
    // Load
    useEffect(() => {
        const fetchFarmersProducts = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/marcket/products`);

                if (!res.ok) {
                    throw new Error("Failed");
                }

                const data = await res.json();
                setFarmers(data);



            } catch (err) {
                setError(err.message);
                handleError("Server not responding. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchFarmersProducts();
    }, []);



    const allProducts = [];
    for (let i = 0; i < farmers.length; i++) {
        const farmer = farmers[i];

        for (let j = 0; j < farmer.products.length; j++) {
            const product = farmer.products[j];
            allProducts.push({
                ...product,
                farmerName: farmer.name,
                farmerId: farmer.id,
                farmerLocation: farmer.location,
                farmerRating: farmer.rating
            });
        }
    }

    const filteredFarmers = [];

    for (let i = 0; i < farmers.length; i++) {
        const farmer = farmers[i];
        const searchLower = searchQuery.toLowerCase();

        const nameMatch = (farmer.name || "").toLowerCase().includes(searchLower);
        const locationMatch = (farmer.location || "").toLowerCase().includes(searchLower);
        const ownerMatch = (farmer.owner || "").toLowerCase().includes(searchLower);

        if (nameMatch || locationMatch || ownerMatch) {
            filteredFarmers.push(farmer);
        }
    }

    const filteredProducts = [];

    for (let i = 0; i < allProducts.length; i++) {
        const product = allProducts[i];
        const searchLower = searchQuery.toLowerCase();

        const matchesSearch =
            (product.name || "").toLowerCase().includes(searchLower);

        const matchesCategory =
            filterCategory === "all" ||
            (product.category || "").toLowerCase() === filterCategory.toLowerCase();

        if (matchesSearch && matchesCategory) {
            filteredProducts.push(product);
        }
    }
    const handleFarmerClick = (farmer) => {
        setSelectedFarmer(farmer);
        setSelectedProduct(null);
    };

    const handleProductClick = (product) => {
        setSelectedProduct(product);
    };

    // const handleOrderClick = (product) => {
    //     if (onPlaceOrder) {
    //         const farmer = farmers.find(f => f.id === product.farmerId);
    //         onPlaceOrder({
    //             product: product,
    //             farmer: farmer
    //         });
    //     }

    // };
    const handleOrderClick = (product) => {
        //   const customer = JSON.parse(localStorage.getItem("user"));

        //   const farmer = farmers.find(f => f.id === product.farmerId);

        //   const orderPayload = {
        //     product: {
        //       id: product.id,
        //     },
        //     farmer: {
        //       id: farmer.id,
        //     }
        //   };

        navigate(`/page/place-order/${product.id}`);
    };

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 0; i < 5; i++) {
            const filled = i < Math.floor(rating);
            const starClass = filled ? "star-filled" : "star-empty";
            stars.push(
                <Star key={i} className={starClass} />
            );
        }
        return stars;
    };

    const gridClass = viewMode === "grid" ? "farmers-grid" : "farmers-list";
    const isAllFilter = filterCategory === "all";
    const isVegFilter = filterCategory === "vegetables";
    const isHerbFilter = filterCategory === "herbs";
    const isFruitsFilter = filterCategory === "fruits";
    const isEggsFilter = filterCategory === "eggs";
    const isChickenFilter = filterCategory === "chicken";
    if (isLoading) {
        return (
            <div className="loader-overlay">
                <div className="spinner2"></div>
            </div>
        );
    }
    return (
        <div className="marketplace-container">
            <div>
                <Header />
            </div>
            <div className="marketplace-main">
                <div className="marketplace-controls">
                    <div className="search-bar-marketplace">
                        <Search className="search-icon-marketplace" />
                        <input
                            type="text"
                            placeholder="Search farmers or products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input-marketplace"
                        />
                    </div>

                    <div className="controls-right">
                        <div className="filter-buttons">
                            <button
                                className={isAllFilter ? "filter-btn filter-active" : "filter-btn"}
                                onClick={() => setFilterCategory("all")}
                            >
                                All Products
                            </button>
                            <button
                                className={isVegFilter ? "filter-btn filter-active" : "filter-btn"}
                                onClick={() => setFilterCategory("vegetables")}
                            >
                                Vegetables
                            </button>
                            <button
                                className={isFruitsFilter ? "filter-btn filter-active" : "filter-btn"}
                                onClick={() => setFilterCategory("fruits")}
                            >
                                Fruits
                            </button>
                            <button
                                className={isHerbFilter ? "filter-btn filter-active" : "filter-btn"}
                                onClick={() => setFilterCategory("herbs")}
                            >
                                Herbs
                            </button>
                            <button
                                className={isEggsFilter ? "filter-btn filter-active" : "filter-btn"}
                                onClick={() => setFilterCategory("Eggs")}
                            >
                                Eggs
                            </button>
                            <button
                                className={isChickenFilter ? "filter-btn filter-active" : "filter-btn"}
                                onClick={() => setFilterCategory("chickens")}
                            >
                                Chickens
                            </button>
                        </div>

                        <div className="view-toggle">
                            <button
                                className={viewMode === "grid" ? "view-btn view-active" : "view-btn"}
                                onClick={() => setViewMode("grid")}
                            >
                                <Grid className="icon-sm" />
                            </button>
                            <button
                                className={viewMode === "list" ? "view-btn view-active" : "view-btn"}
                                onClick={() => setViewMode("list")}
                            >
                                <List className="icon-sm" />
                            </button>
                        </div>
                    </div>
                </div>

                {!selectedFarmer ? (
                    <div className="farmers-section">
                        <h2 className="section-title">Local Farmers</h2>
                        <div className={gridClass}>
                            {filteredFarmers.map((farmer) => {
                                return (
                                    <div
                                        key={farmer.id}
                                        className="farmer-card-marketplace"
                                        onClick={() => handleFarmerClick(farmer)}
                                    >
                                        <div className="farmer-card-header">
                                            <div className="farmer-avatar-marketplace">
                                                <Leaf className="icon-lg" />
                                            </div>
                                            {farmer.certified && (
                                                <div className="certified-badge">
                                                    <Award className="icon-xs" />
                                                    Certified Organic
                                                </div>
                                            )}
                                        </div>
                                        <div className="farmer-card-body">
                                            <h3>{farmer.name}</h3>
                                            <p className="farmer-owner">by {farmer.owner}</p>
                                            <div className="farmer-rating">
                                                <div className="rating-stars-small">
                                                    {renderStars(farmer.rating)}
                                                </div>
                                                <span className="rating-value">{farmer.rating}</span>
                                            </div>
                                            <div className="farmer-info-row">
                                                <MapPin className="icon-xs" />
                                                <span>{farmer.location}</span>
                                            </div>
                                            <div className="farmer-info-row">
                                                <Package className="icon-xs" />
                                                <span>{farmer.totalProducts} products available</span>
                                            </div>
                                            <p className="farmer-description">{farmer.description}</p>
                                        </div>
                                        <button className="view-products-btn">
                                            View Products
                                            <ChevronRight className="icon-sm" />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="products-section">
                            <h2 className="section-title">All Products</h2>
                            <div className="products-grid">
                                {filteredProducts.map((product, index) => {
                                    return (
                                        <div
                                            key={index}
                                            className="product-card-marketplace"
                                            onClick={() => handleProductClick(product)}
                                        >
                                            <div className="product-image-placeholder product-image">
                                                {product.image ? (
                                                    <img src={product.image} alt={product.name} />
                                                ) : (
                                                    <Package className="product-icon" />
                                                )}
                                            </div>
                                            <div className="product-card-body">
                                                <h4>{product.name}</h4>
                                                <p className="product-farmer">{product.category}</p>
                                                <div className="product-price-row">
                                                    <span className="product-price">${product.price.toFixed(2)}</span>
                                                    <span className="product-unit">per {product.unit}</span>
                                                </div>
                                                <div className="product-stock">
                                                    <span className="stock-badge">{product.stock} {product.unit} available</span>
                                                </div>

                                                <button
                                                    className="order-btn-small"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleOrderClick(product);
                                                    }}
                                                >
                                                    <ShoppingCart className="icon-xs" />
                                                    Order Now
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="farmer-detail-view">
                        <button
                            className="back-button"
                            onClick={() => setSelectedFarmer(null)}
                        >
                            ← Back to Farmers
                        </button>

                        <div className="farmer-detail-header">
                            <div className="farmer-detail-left">
                                <div className="farmer-avatar-large">
                                    <Leaf className="icon-xl" />
                                </div>
                                <div className="farmer-detail-info">
                                    <h1>{selectedFarmer.name}</h1>
                                    <p className="farmer-owner-large">by {selectedFarmer.owner}</p>
                                    <div className="farmer-rating-large">
                                        <div className="rating-stars-large">
                                            {renderStars(selectedFarmer.rating)}
                                        </div>
                                        <span className="rating-value-large">{selectedFarmer.rating} / 5.0</span>
                                    </div>
                                    {selectedFarmer.certified && (
                                        <div className="certified-badge-large">
                                            <Award className="icon-sm" />
                                            Certified Organic Farm
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="farmer-detail-contact">
                                <div className="contact-item">
                                    <MapPin className="icon-sm" />
                                    <span>{selectedFarmer.location}</span>
                                </div>
                                <div className="contact-item">
                                    <Mail className="icon-sm" />
                                    <span>{selectedFarmer.email}</span>
                                </div>
                                <div className="contact-item">
                                    <Phone className="icon-sm" />
                                    <span>{selectedFarmer.phone}</span>
                                </div>
                            </div>
                        </div>

                        <div className="farmer-description-box">
                            <p>{selectedFarmer.description}</p>
                        </div>

                        <div className="farmer-products-section">
                            <h2>
                                Available Products ({(selectedFarmer.products || []).length})
                            </h2>
                            <div className="products-grid">
                                {selectedFarmer.products.map((product) => {
                                    const productWithFarmer = {
                                        ...product,
                                        farmerName: selectedFarmer.name,
                                        farmerId: selectedFarmer.id,
                                        farmerLocation: selectedFarmer.location,
                                        farmerRating: selectedFarmer.rating
                                    };

                                    return (
                                        <div
                                            key={product.id}
                                            className="product-card-marketplace"
                                            onClick={() => handleProductClick(productWithFarmer)}
                                        >
                                            <div className="product-image-placeholder product-image">
                                                {product.image ? (
                                                    <img src={product.image} alt={product.name} />
                                                ) : (
                                                    <Package className="product-icon" />
                                                )}
                                            </div>
                                            <div className="product-card-body">
                                                <h4>{product.name}</h4>
                                                <span className="product-category">{(product.category)}</span>
                                                <div className="product-price-row">
                                                    <span className="product-price">${product.price.toFixed(2)}</span>
                                                    <span className="product-unit">per {product.unit}</span>
                                                </div>
                                                <div className="product-stock">
                                                    <span className="stock-badge">{product.stock} {product.unit} available</span>
                                                </div>
                                                <p className="product-description-small">{product.description}</p>
                                                <button
                                                    className="order-btn-small"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleOrderClick(productWithFarmer);
                                                    }}
                                                >
                                                    <ShoppingCart className="icon-xs" />
                                                    Order Now
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {selectedProduct && (
                <div className="product-modal-overlay" onClick={() => setSelectedProduct(null)}>
                    <div className="product-modal" onClick={(e) => e.stopPropagation()}>
                        <button
                            className="modal-close"
                            onClick={() => setSelectedProduct(null)}
                        >
                            ×
                        </button>
                        <div className="modal-content">
                            <div className="product-image-placeholder product-image">
                                {selectedProduct.image ? (
                                    <img src={selectedProduct.image} alt={selectedProduct.name} />
                                ) : (
                                    <Package className="product-icon" />
                                )}
                            </div>
                            <div className="modal-details">
                                <h2>{selectedProduct.name}</h2>
                                <p className="modal-farmer">from {selectedProduct.farmerName}</p>
                                <div className="modal-location">
                                    <MapPin className="icon-xs" />
                                    <span>{selectedProduct.farmerLocation}</span>
                                </div>
                                <div className="modal-price-section">
                                    <span className="modal-price">Nrs-{selectedProduct.price.toFixed(2)}</span>
                                    <span className="modal-unit">per {selectedProduct.unit}</span>
                                </div>
                                <div className="modal-stock">
                                    <Package className="icon-sm" />
                                    <span>{selectedProduct.stock} {selectedProduct.unit} in stock</span>
                                </div>
                                <div className="modal-description">
                                    <h3>Description</h3>
                                    <p>{selectedProduct.description}</p>
                                </div>
                                <button
                                    className="modal-order-btn"
                                    onClick={() => {
                                        handleOrderClick(selectedProduct);
                                        setSelectedProduct(null);
                                    }}
                                >
                                    <ShoppingCart className="icon-sm" />
                                    Place Order
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
