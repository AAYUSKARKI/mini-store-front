# Mini Storefront

A responsive storefront application built for the Hyteno Tech Frontend Internship second-round task. The application features a product catalog, filtering and sorting capabilities, a product detail page, and a cart with localStorage persistence. It emphasizes clean code, accessibility, and a modern UI.

## Tech Stack
- **Next.js (App Router)**
- **TypeScript**
- **Shadcn/UI**
- **Zustand**
- **Tailwind CSS** 
- **FakeStore API**
- **Vercel**

## Features
- **Product Listing**: Grid of products with image, title, price, and category.
- **Filtering & Sorting**: Filter by category and price range; sort by price (low to high, high to low); search by title.
- **Product Details**: Displays product image, title, price, description, category, and related products.
- **Cart**: Add/remove items, update quantities, view subtotals, and persist cart to localStorage.
- **UI**: Responsive layout, dark mode toggle,pagination, toast alerts for cart actions.

## Installation
To run the project locally, follow these steps:

```bash
# Clone the repository
git clone https://github.com/AAYUSKARKI/mini-store-front.git

# Navigate to the project directory
cd mini-store-front

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## Architecture Notes
- **Pages**:
  - `/` (Catalog): Fetches products from FakeStore API, handles filtering, sorting, and search.
  - `/product/[id]`: Dynamic route for product details, fetches single product and related products.
  - `/cart`: Displays cart items with quantity controls and persists to localStorage.
- **State Management**:
  - **Zustand**: Used for managing products, theme, filters, cart state (add/remove items, update quantities) and UI state (e.g., dark mode toggle).
  - **LocalStorage**: Persists cart data across page reloads.
- **Data Flow**:
  - Products are fetched from the FakeStore API 
  - Filtering, sorting, and search are handled client-side for performance.
  - Cart state is managed globally with Zustand and synced with localStorage on updates.

- **Responsive Design**: Tailwind CSS ensures the app is mobile-friendly and desktop-optimized.

## Deployment
The application is deployed on Vercel: [https://mini-store-front.vercel.app](https://mini-store-front.vercel.app).

## Trade-offs & Known Issues
- **Trade-offs**:
  - **Client-side Filtering**: Chosen for simplicity and speed with small datasets, but may not scale for thousands of products. Server-side filtering could be added for larger catalogs

- **Known Issues**:
  - **Scalability**: Client-side filtering may lag with thousands of products.
  - **API Error Handling**: Basic error states covered; lacks advanced retry logic.

## Notes
- The repository is public as requested: [https://github.com/AAYUSKARKI/mini-store-front](https://github.com/AAYUSKARKI/mini-store-front).
