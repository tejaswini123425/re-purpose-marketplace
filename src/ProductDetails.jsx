function ProductDetails({ product, onClose }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: "white",
          width: "800px",
          maxWidth: "90%",
          padding: "30px",
          borderRadius: "20px",
          position: "relative",
          display: "flex",
          gap: "30px",
        }}
      >

        <button
          onClick={onClose}
          style={{
            position: "absolute",
            right: "15px",
            top: "10px",
            border: "none",
            background: "none",
            fontSize: "28px",
            cursor: "pointer",
          }}
        >
          ×
        </button>

        <div>
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              style={{
                width: "350px",
                height: "350px",
                objectFit: "cover",
                borderRadius: "15px",
              }}
            />
          ) : (
            <div
              style={{
                width: "350px",
                height: "350px",
                background: "#eee",
                borderRadius: "15px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "70px",
              }}
            >
              ♻️
            </div>
          )}
        </div>

        <div>
          <p>
            {product.category || "Other"}
          </p>

          <h1>{product.name}</h1>

          <h2>₹{product.price}</h2>

          <p>
            <strong>Condition:</strong>{" "}
            {product.condition || "Not specified"}
          </p>

          <p>
            {product.description ||
              "No description available."}
          </p>

          <p>
            📍 {product.location || "Not specified"}
          </p>

          <p>
            👤 Sold by{" "}
            {product.seller ||
              product.sellerEmail ||
              "Unknown seller"}
          </p>

          <button
            style={{
              marginTop: "20px",
              padding: "14px 30px",
              border: "none",
              borderRadius: "10px",
              background: "#7136b3",
              color: "white",
              cursor: "pointer",
            }}
          >
            Buy Now
          </button>
        </div>

      </div>
    </div>
  );
}

export default ProductDetails;