import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";

function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/orders");
            setOrders(response.data);
        } catch (err) {
            console.error(err);
            setError("Failed to load orders.");
        } finally {
            setLoading(false);
        }
    };

    const cancelOrder = async (id) => {
        try {
            await api.put(`/orders/${id}/cancel`);
            await fetchOrders();
        } catch (err) {
            console.error(err);
            setError("Failed to cancel order.");
        }
    };

    if (loading) {
        return <h2>Loading orders...</h2>;
    }

    return (
        <div>
            <h1>Orders</h1>

            <Link to="/orders/create">Create Order</Link>

            <br />
            <br />

            {error && <p>{error}</p>}

            {orders.length === 0 ? (
                <p>No orders available.</p>
            ) : (
                orders.map((order) => (
                    <div
                        key={order.id}
                        style={{
                            border: "1px solid #ccc",
                            padding: "16px",
                            marginBottom: "12px",
                            borderRadius: "8px",
                        }}
                    >
                        <h2>Order #{order.id}</h2>

                        <p>User ID: {order.userId}</p>
                        <p>Product ID: {order.productId}</p>
                        <p>Quantity: {order.quantity}</p>
                        <p>Total: ₹{order.totalPrice}</p>
                        <p>Status: {order.status}</p>
                        <p>Created: {order.createdAt}</p>

                        {order.status !== "CANCELLED" && (
                            <button onClick={() => cancelOrder(order.id)}>
                                Cancel Order
                            </button>
                        )}
                    </div>
                ))
            )}
        </div>
    );
}

export default Orders;