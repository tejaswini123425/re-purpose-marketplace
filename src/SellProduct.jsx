import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db, auth, model } from "./firebase";

function SellProduct({ onClose, onProductAdded }) {

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "Fashion",
    condition: "Like New",
    location: "",
    imageUrl: "",
  });

  const [aiInput, setAiInput] = useState("");

  const [aiLoading, setAiLoading] = useState(false);

  const [loading, setLoading] = useState(false);


  // ==========================================
  // NORMAL FORM INPUT
  // ==========================================

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  };


  // ==========================================
  // GEMINI AI LISTING ASSISTANT
  // ==========================================

  const generateWithGemini = async () => {

    if (!aiInput.trim()) {
      alert(
        "Tell Gemini something about your product first."
      );
      return;
    }

    setAiLoading(true);

    try {

      const prompt = `
You are an AI assistant for an upcycling marketplace
called Re:Purpose.

Create a marketplace listing from this seller input:

"${aiInput}"

Return ONLY valid JSON in this exact format:

{
  "name": "short attractive product title",
  "description": "clear appealing product description",
  "category": "one of Fashion, Clothing, Accessories, Books, Furniture, Home Decor, Electronics, Other",
  "condition": "one of Like New, Excellent, Good, Fair, Refurbished, Handcrafted",
  "price": 0
}

Choose a realistic suggested price in Indian Rupees.

Do not include markdown.
Do not include explanations.
Return only JSON.
`;

      const result =
        await model.generateContent(
          prompt
        );

      const response =
        result.response.text();

      const cleanedResponse =
        response
          .replace(/```json/g, "")
          .replace(/```/g, "")
          .trim();

      const generated =
        JSON.parse(cleanedResponse);

      setForm((previousForm) => ({
        ...previousForm,

        name:
          generated.name ||
          previousForm.name,

        description:
          generated.description ||
          previousForm.description,

        category:
          generated.category ||
          previousForm.category,

        condition:
          generated.condition ||
          previousForm.condition,

        price:
          generated.price ||
          previousForm.price,
      }));

      alert(
        "✨ Gemini created your listing!"
      );

    } catch (error) {

      console.error(
        "Gemini error:",
        error
      );

      alert(
        "Gemini couldn't generate the listing. Please try again."
      );

    } finally {

      setAiLoading(false);

    }

  };


  // ==========================================
  // SUBMIT PRODUCT
  // ==========================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!auth.currentUser) {

      alert(
        "Please login before selling."
      );

      return;
    }

    setLoading(true);

    try {

      const newProduct = {

        name: form.name,

        description:
          form.description,

        price:
          Number(form.price),

        category:
          form.category,

        condition:
          form.condition,

        location:
          form.location,

        imageUrl:
          form.imageUrl,

        seller:
          auth.currentUser.email,

        sellerId:
          auth.currentUser.uid,

        createdAt:
          new Date(),

      };

      const document =
        await addDoc(
          collection(
            db,
            "products"
          ),
          newProduct
        );

      onProductAdded({

        id: document.id,

        ...newProduct,

      });

      alert(
        "🎉 Product listed successfully!"
      );

      onClose();

    } catch (error) {

      console.error(
        "Error adding product:",
        error
      );

      alert(
        "Could not add product."
      );

    } finally {

      setLoading(false);

    }

  };


  return (

    <div className="modal-overlay">

      <div className="sell-modal">

        <button
          className="close-btn"
          onClick={onClose}
          type="button"
        >
          ×
        </button>


        <h2>
          Sell an Item
        </h2>

        <p>
          Give your product a new purpose.
        </p>


        {/* =================================
            GEMINI AI ASSISTANT
        ================================= */}

        <div className="ai-assistant">

          <h3>
            ✨ Create with Gemini
          </h3>

          <p>
            Describe your product and
            Gemini will create the listing
            for you.
          </p>

          <textarea
            value={aiInput}
            onChange={(e) =>
              setAiInput(
                e.target.value
              )
            }
            placeholder="Example: I have an old pair of blue jeans that I turned into a stylish tote bag with a handmade pocket..."
          />

          <button
            type="button"
            className="ai-btn"
            onClick={
              generateWithGemini
            }
            disabled={aiLoading}
          >
            {aiLoading
              ? "✨ Gemini is creating..."
              : "✨ Generate with Gemini"}
          </button>

        </div>


        {/* =================================
            PRODUCT FORM
        ================================= */}

        <form
          onSubmit={handleSubmit}
        >

          <input
            name="name"
            placeholder="Product name"
            value={form.name}
            onChange={handleChange}
            required
          />


          <textarea
            name="description"
            placeholder="Describe your product..."
            value={
              form.description
            }
            onChange={handleChange}
            required
          />


          <input
            name="price"
            type="number"
            placeholder="Price (₹)"
            value={form.price}
            onChange={handleChange}
            required
          />


          <select
            name="category"
            value={
              form.category
            }
            onChange={handleChange}
          >

            <option>
              Fashion
            </option>

            <option>
              Clothing
            </option>

            <option>
              Accessories
            </option>

            <option>
              Books
            </option>

            <option>
              Furniture
            </option>

            <option>
              Home Decor
            </option>

            <option>
              Electronics
            </option>

            <option>
              Other
            </option>

          </select>


          <select
            name="condition"
            value={
              form.condition
            }
            onChange={handleChange}
          >

            <option>
              Like New
            </option>

            <option>
              Excellent
            </option>

            <option>
              Good
            </option>

            <option>
              Fair
            </option>

            <option>
              Refurbished
            </option>

            <option>
              Handcrafted
            </option>

          </select>


          <input
            name="location"
            placeholder="Location e.g. Pune"
            value={
              form.location
            }
            onChange={handleChange}
            required
          />


          <input
            name="imageUrl"
            type="url"
            placeholder="Product image URL"
            value={
              form.imageUrl
            }
            onChange={handleChange}
            required
          />


          <button
            type="submit"
            className="sell-submit"
            disabled={loading}
          >

            {loading
              ? "Listing..."
              : "List Product"}

          </button>

        </form>

      </div>

    </div>

  );

}

export default SellProduct;