import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

function CreateOrder() {
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);

    const [formData, setFormData] = useState({
        userId: "1",
        productId: "",
        quantity: "1",
    });

    const [loading, setLoading] = useState(false);
    const [productsLoading, setProductsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await api.get("/products");
            setProducts(response.data);
        } catch (err) {
            console.error(err);
            setError("Failed to load products.");
        } finally {
            setProductsLoading(false);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setLoading(true);
            setError("");

            await api.post("/orders", {
                userId: Number(formData.userId),
                productId: Number(formData.productId),
                quantity: Number(formData.quantity),
            });

            navigate("/orders");
        } catch (err) {
            console.error(err);

            const message =
                err.response?.data?.message || "Failed to create order.";

            setError(message);
        } finally {
            setLoading(false);
        }
    };

    if (productsLoading) {
        return <h2>Loading products...</h2>;
    }

    return (
        <div>
            <h1>Create Order</h1>

            {error && <p>{error}</p>}

            <form onSubmit={handleSubmit}>
                <div>
                    <label>User ID</label>
                    <br />
                    <input
                        type="number"
                        name="userId"
                        value={formData.userId}
                        onChange={handleChange}
                        min="1"
                        required
                    />
                </div>

                <br />

                <div>
                    <label>Product</label>
                    <br />

                    <select
                        name="productId"
                        value={formData.productId}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select a product</option>

                        {products.map((product) => (
                            <option
                                key={product.id}
                                value={product.id}
                            >
                                {product.name} - ₹{product.price} 
                                (Stock: {product.stock})
                            </option>
                        ))}
                    </select>
                </div>

                <br />

                <div>
                    <label>Quantity</label>
                    <br />

                    <input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        min="1"
                        required
                    />
                </div>

                <br />

                <button type="submit" disabled={loading}>
                    {loading ? "Creating..." : "Create Order"}
                </button>
            </form>
        </div>
    );
}

export default CreateOrder;