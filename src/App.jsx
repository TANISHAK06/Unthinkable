import React, { useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";
import "./App.css";

function App() {
  const [image, setImage] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9;
  const [model, setModel] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageUrl, setImageUrl] = useState(""); // Store image URL

  // Fetch products from the API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://fakestoreapi.in/api/products");
      const data = await response.json();
      if (data.status === "SUCCESS") {
        setProducts(data.products);
        setDisplayedProducts(data.products.slice(0, productsPerPage));
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  // Load the model when the app loads
  useEffect(() => {
    fetchProducts();
    mobilenet.load().then((loadedModel) => {
      setModel(loadedModel);
      console.log("MobileNet model loaded");
    });
  }, []);

  // Handle image upload and trigger classification
  const handleImageUpload = async (event) => {
    if (event.target.files[0]) {
      const file = event.target.files[0];
      setImage(URL.createObjectURL(file)); // Set the local image URL
      setImageUrl(""); // Clear any URL entered manually
      setImageLoaded(false); // Reset loaded state
      await classifyImage(file); // Classify once the image is uploaded
    }
  };

  // Classify the uploaded image using MobileNet model
  const classifyImage = async (imageData) => {
    const imgElement = new Image();
    imgElement.src = URL.createObjectURL(imageData);
    imgElement.onload = async () => {
      setImageLoaded(true); // Mark the image as loaded
      console.log("Image loaded, classifying...");
      if (model) {
        try {
          const predictions = await model.classify(imgElement);
          console.log("Predictions: ", predictions);
          searchByLabels(predictions);
        } catch (error) {
          console.error("Error during classification:", error);
        }
      }
    };
  };

  // Check if imageUrl has changed, and if so, classify the image
  useEffect(() => {
    if (imageUrl) {
      const imgElement = new Image();
      imgElement.src = imageUrl;
      imgElement.onload = async () => {
        setImageLoaded(true);
        console.log("Image loaded from URL, classifying...");
        if (model) {
          try {
            const predictions = await model.classify(imgElement);
            console.log("Predictions: ", predictions);
            searchByLabels(predictions);
          } catch (error) {
            console.error("Error during classification:", error);
          }
        }
      };
    }
  }, [imageUrl, model]);

  // Filter products based on the predictions
  const searchByLabels = (predictions) => {
    const searchKeywords = predictions.map((p) => p.className.toLowerCase());
    console.log("Search Keywords: ", searchKeywords);

    if (searchKeywords.length === 0) {
      setDisplayedProducts(products.slice(0, productsPerPage));
      return;
    }

    const filtered = products.filter((product) =>
      searchKeywords.some(
        (keyword) =>
          product.title.toLowerCase().includes(keyword) ||
          product.description.toLowerCase().includes(keyword) ||
          product.category.toLowerCase().includes(keyword)
      )
    );

    setFilteredProducts(filtered);
    setDisplayedProducts(filtered.slice(0, productsPerPage));
    setCurrentPage(1);
  };

  // Handle "Show More" button for pagination
  const handleShowMore = () => {
    const nextPage = currentPage + 1;
    const source = filteredProducts.length > 0 ? filteredProducts : products;
    const newProducts = source.slice(
      nextPage * productsPerPage - productsPerPage,
      nextPage * productsPerPage
    );

    setDisplayedProducts((prev) => [...prev, ...newProducts]);
    setCurrentPage(nextPage);
  };

  // Determine if the "Show More" button should be visible
  const shouldShowButton = () => {
    const source = filteredProducts.length > 0 ? filteredProducts : products;
    return (
      source.length > 0 &&
      displayedProducts.length < source.length &&
      displayedProducts.length > 0
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold font-montserrat ">
          Visual Product Matcher
        </h1>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder=" Paste image URL"
            className="p-2 border rounded-full "
          />
          <span
            onClick={() => document.getElementById("fileInput").click()}
            className="cursor-pointer text-xl "
          >
            📁
          </span>
          {imageUrl || image ? (
            <a
              href={imageUrl || image}
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl"
            >
              👁️
            </a>
          ) : null}
        </div>
        <input
          id="fileInput"
          type="file"
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>

      {/* Product grid */}
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {displayedProducts.length > 0 ? (
              displayedProducts.map((product) => (
                <div
                  key={product.id}
                  className="p-4 bg-white border shadow hover:shadow-xl rounded-lg"
                >
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-48 object-contain mb-4"
                  />
                  <h2 className="text-lg font-semibold">{product.title}</h2>
                  <p className="text-gray-600">$ {product.price}</p>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-600 mt-8 col-span-full">
                The TensorFlow Model is not able to find the product matching
                the image.
              </div>
            )}
          </div>

          {/* Show More button */}
          {shouldShowButton() && (
            <div className="flex justify-center mt-8">
              <button
                onClick={handleShowMore}
                className="px-6 py-3 bg-blue-500 text-white font-bold rounded-full hover:bg-blue-600 transition"
              >
                Show More
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
