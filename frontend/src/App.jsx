import HomePage from "./pages/Home";
import "./App.css";
import Navigation from "./components/Navigation";
import OrdersPage from "./pages/Order";
import NotFoundPage from "./pages/404";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import CartPage from "./pages/Cart";
import LoginPage from "./pages/Auth";
import SuccessPage from "./pages/Suceess";
import ProductDetailPage from "./components/ProductDetails";
import ProjectList from "./pages/ProjectList"; // or correct path


function App() {
  return (
    // App.js or any component that receives routing from index.js

    <>
      <div className="w-full">
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/*" element={<NotFoundPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/projects" element={<ProjectList />} />
          {/* Add more routes as needed */}
        </Routes>
      </div>
    </>
  );
}

export default App;
