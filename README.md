# Visual Product Matcher

## Overview

The **Visual Product Matcher** is a web application that uses TensorFlow's MobileNet model to classify images and match them with relevant products from a product catalog. The application allows users to upload an image or paste an image URL, and the system will use machine learning to analyze the image and filter products based on predictions from the MobileNet model.

The app fetches a list of products from an external API and displays them. It includes pagination functionality with a "Show More" button to load additional products.

### Features

- **Image Upload**: Users can upload an image from their local system or paste an image URL.
- **Image Classification**: The app uses the MobileNet model to classify the uploaded or provided image.
- **Product Filtering**: The app filters products based on the classification results and displays matching items.
- **Product Grid**: Products are displayed in a grid format, with the ability to load more products using the "Show More" button.
- **Mobile Responsive**: The design is responsive and adjusts based on the screen size.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/visual-product-matcher.git
 
2. Navigate into the project directory:

``` bash
cd visual-product-matcher
```
3. Install the dependencies:
```bash
npm install
```
4. Start the development server:
```bash
npm run dev
```

### Technologies Used
- React: JavaScript library for building user interfaces.
- TensorFlow.js: A library for running machine learning models in the browser.
- MobileNet: Pre-trained deep learning model used for image classification.
- Tailwind CSS: Utility-first CSS framework for styling the app.
- Fakestore API: API used to fetch product data for display.
