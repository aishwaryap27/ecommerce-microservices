import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/api";

function ProductDetails() {
    const { id } = useParams();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(`/products/${id}`);
            setProduct(response.data);
        } catch (err) {
            console.error(err);
            setError("Failed to load product.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <h2>Loading product...</h2>;
    }

    if (error) {
        return <h2>{error}</h2>;
    }

    if (!product) {
        return <h2>Product not found.</h2>;
    }

    return (
        <div>
            <Link to="/products">← Back to Products</Link>

            <h1>{product.name}</h1>

            <p>{product.description}</p>

            <p>Price: ₹{product.price}</p>

            <p>Stock: {product.stock}</p>

            <p>Category: {product.category}</p>

            <p>Created: {product.createdAt}</p>
        </div>
    );
}

export default ProductDetails;