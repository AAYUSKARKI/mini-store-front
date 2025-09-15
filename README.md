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
- **Product Listing** — Display a list of products
- **Product Details** — Display details of a single product
- **Add to Cart** — Add a product to the cart

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
## Notes
- The repository is public as requested: [https://github.com/AAYUSKARKI/mini-store-front](https://github.com/AAYUSKARKI/mini-store-front).