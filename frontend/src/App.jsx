import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import CreateProduct from "./pages/CreateProduct";
import Orders from "./pages/Orders";
import CreateOrder from "./pages/CreateOrder";

function App() {
    return (
        <BrowserRouter>
            <nav>
                <Link to="/products">Products</Link>
                {" | "}
                <Link to="/products/create">Create Product</Link>
                {" | "}
                <Link to="/orders">Orders</Link>
                {" | "}
                <Link to="/orders/create">Create Order</Link>
            </nav>

            <hr />

            <Routes>
                <Route path="/" element={<Products />} />

                <Route path="/products" element={<Products />} />

                <Route
                    path="/products/:id"
                    element={<ProductDetails />}
                />

                <Route
                    path="/products/create"
                    element={<CreateProduct />}
                />

                <Route path="/orders" element={<Orders />} />

                <Route
                    path="/orders/create"
                    element={<CreateOrder />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;