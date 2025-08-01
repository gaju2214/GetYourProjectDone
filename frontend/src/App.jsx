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
import CategoriesPage from "./pages/Categories";
import CategoryPage from "./components/Subcategory";
import ProjectList from "./pages/ProjectList"; // or correct path
import ProjectAdminPanel from "./ProjectAdminPanel";
import Account from "./pages/Account";

function App() {
  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/getyourprojectdoneadmin"
          element={<ProjectAdminPanel />}
        />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/categories/:category" element={<CategoryPage />} />
        <Route path="/projects" element={<ProjectList />} />
        <Route path="/*" element={<NotFoundPage />} />
        <Route path="/projects/:category" element={<CategoryPage />} />
        <Route path="/account" element={<Account />} />
      </Routes>
    </>
  );
}

export default App;
