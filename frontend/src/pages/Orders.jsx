import React, { useEffect, useState } from 'react';

export default function Orders() {
    const [data, setData] = useState([]);

    useEffect(() => {
        // Fetch orders data from backend
        fetch('http://localhost:5000/api/orders')
            .then(res => res.json())
            .then(res => setData(res))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">Orders Page</h1>
            {data.length > 0 ? (
                <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(data, null, 2)}</pre>
            ) : (
                <p>No orders found.</p>
            )}
        </div>
    );
}
