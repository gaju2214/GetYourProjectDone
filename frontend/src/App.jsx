import HomePage from "./pages/Home";
import "./App.css";
import Navigation from "./components/Navigation";
import OrdersPage from "./pages/Order";
import NotFoundPage from "./pages/404";
import { BrowserRouter as Router, Routes, Route, useParams } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import CartPage from "./pages/Cart";
import Auth from "./pages/Auth";
import Login from "./pages/Login";
import SuccessPage from "./pages/Suceess";
import ProductDetailPage from "./components/ProductDetails";
import CategoriesPage from "./pages/Categories";
import CategoryPage from "./components/Subcategory";
import ProjectList from "./pages/ProjectList"; // or correct path
// import ProjectAdminPanel from "./ProjectAdminPanel";
import Account from "./pages/Account";

import ProfilePage from "./pages/Profile";
import AdminLogin from "./pages/Adlogin";
import AdminRegister from "./pages/Register";
import DeleteProject from "./pages/Editproject";
import ProjectAdminPanel from "./ProjectAdminPanel";

import EditProject from "./pages/Editproject";
import OrderSuccess from './pages/OrderSuccess'; // ✅ Add this import





function App() {

  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/account" element={<Account/>} />
       <Route path="/delete/:id" element={<DeleteProject Id={1} />} />
        <Route path="/getproject" element={<ProjectAdminPanel/>} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/profile" element={<Account />} />
        <Route path="/adlogin" element={<AdminLogin />} />
        <Route path="/projects/:id" element={<ProductDetailPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/adregister" element={<AdminRegister/>} />
        <Route path="/categories/:category" element={<CategoryPage />} />
        <Route path="/projects" element={<ProjectList/>} />
        <Route path="/projects/search" element={<ProjectList/>} />
              <Route path="/order-success" element={<OrderSuccess />} />

        <Route path="/pr" element={<EditProject/>} />
        
        


        <Route path="/*" element={<NotFoundPage />} />
        <Route path="/projectscat/:category" element={<CategoryPage />} />
      
        {/* just for fun */}
      </Routes>
    </>
  );
}
export default App;
