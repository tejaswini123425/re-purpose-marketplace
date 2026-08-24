import SellProduct from "./SellProduct";
import Login from "./Login";

import { useEffect, useState } from "react";
import "./App.css";

import { db, auth } from "./firebase";

import {
  collection,
  getDocs,
} from "firebase/firestore";

import {
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

function App() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showSell, setShowSell] = useState(false);

  const [selectedProduct, setSelectedProduct] =
    useState(null);

  // Wishlist is currently stored in app state
  const [wishlist, setWishlist] = useState([]);

  const categories = [
    "All",
    "Fashion",
    "Clothing",
    "Accessories",
    "Books",
    "Furniture",
    "Home Decor",
    "Electronics",
    "Other",
  ];

  // ==========================================
  // AUTHENTICATION
  // ==========================================

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
      }
    );

    return () => unsubscribe();
  }, []);

  // ==========================================
  // LOAD PRODUCTS FROM FIRESTORE
  // ==========================================

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const snapshot = await getDocs(
        collection(db, "products")
      );

      const productData = snapshot.docs.map(
        (document) => ({
          id: document.id,
          ...document.data(),
        })
      );

      setProducts(productData);
    } catch (error) {
      console.error(
        "Error loading products:",
        error
      );
    }
  };

  // ==========================================
  // PRODUCT ADDED FROM SELL PRODUCT
  // ==========================================

  const handleProductAdded = (newProduct) => {
    setProducts((previousProducts) => [
      ...previousProducts,
      newProduct,
    ]);
  };

  // ==========================================
  // WISHLIST
  // ==========================================

  const toggleWishlist = (product) => {
    if (!user) {
      setShowLogin(true);
      return;
    }

    setWishlist((previousWishlist) => {
      const alreadySaved =
        previousWishlist.some(
          (item) => item.id === product.id
        );

      if (alreadySaved) {
        return previousWishlist.filter(
          (item) => item.id !== product.id
        );
      }

      return [
        ...previousWishlist,
        product,
      ];
    });
  };

  const isWishlisted = (productId) => {
    return wishlist.some(
      (item) => item.id === productId
    );
  };

  // ==========================================
  // SEARCH + CATEGORY FILTER
  // ==========================================

  const filteredProducts =
    products.filter((product) => {

      const productName =
        product.name || "";

      const matchesSearch =
        productName
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchesCategory =
        selectedCategory === "All" ||
        product.category ===
          selectedCategory;

      return (
        matchesSearch &&
        matchesCategory
      );
    });

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="app">

      {/* ================= NAVBAR ================= */}

      <nav className="navbar">

        <div className="logo">
          <span>♻</span> Re:Purpose
        </div>

        <div className="nav-links">

          <span>Home</span>

          <span>Marketplace</span>

          <span>Categories</span>

          <button
            className="wishlist-nav"
            onClick={() => {

              if (!user) {
                setShowLogin(true);
                return;
              }

              alert(
                `You have ${wishlist.length} saved item(s) ❤️`
              );

            }}
          >
            ♡ Wishlist
          </button>

          {user ? (

            <button
              className="login-btn"
              onClick={() =>
                signOut(auth)
              }
            >
              Logout
            </button>

          ) : (

            <button
              className="login-btn"
              onClick={() =>
                setShowLogin(true)
              }
            >
              Login
            </button>

          )}

        </div>

      </nav>


      {/* ================= HERO ================= */}

      <section className="hero">

        <div>

          <p className="tagline">
            SUSTAINABLE • AFFORDABLE • UNIQUE
          </p>

          <h1>
            Give old things
            <br />
            <span>a new life.</span>
          </h1>

          <p className="hero-text">
            Buy, sell and discover beautiful
            products created from pre-loved
            materials.
          </p>

          <button
            className="primary-btn"
            onClick={() => {

              if (!user) {
                setShowLogin(true);
                return;
              }

              setShowSell(true);

            }}
          >
            + Sell an Item
          </button>

        </div>

        <div className="hero-art">
          ♻️
        </div>

      </section>


      {/* ================= MARKETPLACE ================= */}

      <section className="marketplace">

        <div className="section-header">

          <div>

            <p className="small-title">
              DISCOVER
            </p>

            <h2>
              Featured Products
            </h2>

          </div>

          <input
            type="text"
            placeholder="🔍 Search products..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />

        </div>


        {/* ================= CATEGORIES ================= */}

        <div className="category-filters">

          {categories.map(
            (category) => (

              <button
                key={category}
                className={
                  selectedCategory ===
                  category
                    ? "category-filter active"
                    : "category-filter"
                }
                onClick={() =>
                  setSelectedCategory(
                    category
                  )
                }
              >
                {category}
              </button>

            )
          )}

        </div>


        {/* ================= PRODUCTS ================= */}

        <div className="product-grid">

          {filteredProducts.length >
          0 ? (

            filteredProducts.map(
              (product) => (

                <div
                  className="product-card"
                  key={product.id}
                >

                  {/* IMAGE */}

                  <div className="product-image">

                    {product.imageUrl ? (

                      <img
                        src={
                          product.imageUrl
                        }
                        alt={
                          product.name
                        }
                      />

                    ) : (

                      <span>
                        {product.emoji ||
                          "♻️"}
                      </span>

                    )}

                    {/* WISHLIST HEART */}

                    <button
                      className="wishlist-btn"
                      onClick={() =>
                        toggleWishlist(
                          product
                        )
                      }
                      type="button"
                    >
                      {isWishlisted(
                        product.id
                      )
                        ? "♥"
                        : "♡"}
                    </button>

                  </div>


                  {/* PRODUCT INFORMATION */}

                  <div className="product-info">

                    <span className="category">
                      {
                        product.category
                      }
                    </span>

                    <h3>
                      {product.name}
                    </h3>

                    <p className="condition">
                      {
                        product.condition
                      }
                    </p>

                    <div className="product-bottom">

                      <strong>
                        ₹
                        {
                          product.price
                        }
                      </strong>

                      <button
                        onClick={() =>
                          setSelectedProduct(
                            product
                          )
                        }
                      >
                        View
                      </button>

                    </div>

                    <p className="seller">
                      Sold by{" "}
                      {
                        product.seller ||
                        "Unknown seller"
                      }
                    </p>

                  </div>

                </div>

              )
            )

          ) : (

            <div className="empty-products">

              <div>
                🌱
              </div>

              <h3>
                No products found
              </h3>

              <p>
                Try another search
                or category.
              </p>

            </div>

          )}

        </div>

      </section>


      {/* ================= LOGIN ================= */}

      {showLogin && (

        <Login
          onClose={() =>
            setShowLogin(false)
          }
        />

      )}


      {/* ================= SELL PRODUCT ================= */}

      {showSell && (

        <SellProduct
          onClose={() =>
            setShowSell(false)
          }
          onProductAdded={
            handleProductAdded
          }
        />

      )}


      {/* ================= PRODUCT DETAILS ================= */}

      {selectedProduct && (

        <div className="modal-overlay">

          <div className="product-details-modal">

            <button
              className="close-btn"
              onClick={() =>
                setSelectedProduct(
                  null
                )
              }
            >
              ×
            </button>


            {/* PRODUCT IMAGE */}

            <div className="details-image">

              {selectedProduct.imageUrl ? (

                <img
                  src={
                    selectedProduct.imageUrl
                  }
                  alt={
                    selectedProduct.name
                  }
                />

              ) : (

                <span>
                  {selectedProduct.emoji ||
                    "♻️"}
                </span>

              )}

            </div>


            {/* PRODUCT DETAILS */}

            <div className="details-content">

              <span className="category">
                {
                  selectedProduct.category
                }
              </span>

              <h2>
                {
                  selectedProduct.name
                }
              </h2>

              <p className="details-description">
                {
                  selectedProduct.description ||
                  "A beautiful product waiting for a new purpose."
                }
              </p>

              <p>
                <strong>
                  Condition:
                </strong>{" "}
                {
                  selectedProduct.condition
                }
              </p>

              <p>
                <strong>
                  Location:
                </strong>{" "}
                {
                  selectedProduct.location ||
                  "Not specified"
                }
              </p>

              <p className="details-seller">
                Sold by{" "}
                {
                  selectedProduct.seller ||
                  "Unknown seller"
                }
              </p>

              <div className="details-price">
                ₹
                {
                  selectedProduct.price
                }
              </div>

              <button
                className="buy-btn"
                onClick={() =>
                  alert(
                    "🛍️ Checkout will be added next!"
                  )
                }
              >
                Buy Now
              </button>

            </div>

          </div>

        </div>

      )}


      {/* ================= FOOTER ================= */}

      <footer>

        <p>
          Re:Purpose — Giving products
          a new purpose.
        </p>

        <p>
          Made with ♻️ by Tejaswini
        </p>

      </footer>

    </div>
  );
}

export default App;