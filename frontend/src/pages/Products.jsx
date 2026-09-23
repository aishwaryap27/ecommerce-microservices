import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";

function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/products");
            setProducts(response.data);
        } catch (err) {
            console.error(err);
            setError("Failed to load products.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <h2>Loading products...</h2>;
    }

    if (error) {
        return <h2>{error}</h2>;
    }

    return (
        <div>
            <h1>Products</h1>

            {products.length === 0 ? (
                <p>No products available.</p>
            ) : (
                <div>
                    {products.map((product) => (
                        <div key={product.id}>
                            <h2>{product.name}</h2>

                            <p>{product.description}</p>

                            <p>Price: ₹{product.price}</p>

                            <p>Stock: {product.stock}</p>

                            <p>Category: {product.category}</p>

                            <Link to={`/products/${product.id}`}>
                                View Details
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Products;