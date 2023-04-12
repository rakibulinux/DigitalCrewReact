import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";

const InventoryManagement = () => {
  const [items, setItems] = useState([]);
  console.log(items);
  useEffect(() => {
    // Connect to the Socket.IO server
    const socket = socketIOClient("http://localhost:5000");

    // Handle itemAdded event
    socket.on("itemAdded", (item) => {
      setItems((prevItems) => [...prevItems, item]);
    });

    fetch("http://localhost:5000/inventory")
      .then((res) => res.json())
      .then((data) => setItems(data));
    // Handle itemUpdated event
    socket.on("itemUpdated", (item) => {
      setItems((prevItems) =>
        prevItems.map((prevItem) =>
          prevItem._id === item._id ? item : prevItem
        )
      );
    });

    // Handle itemRemoved event
    socket.on("itemRemoved", (item) => {
      setItems((prevItems) =>
        prevItems.filter((prevItem) => prevItem._id !== item._id)
      );
    });

    // Clean up the socket on unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  // Render inventory items
  const renderItems = () => {
    return items.map((item) => (
      <tr className="border-2" key={item._id}>
        <td>{item.name}</td>
        <td>{item.price}</td>
        <td>{item.quantity}</td>
        {/* Render additional columns for other item properties */}
      </tr>
    ));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Inventory Management System</h1>
      <table className="w-full border-collapse">
        <thead>
          <tr className="p-2">
            <th className="border border-gray-500 px-4 py-2">Name</th>
            <th className="border border-gray-500 px-4 py-2">Price</th>
            <th className="border border-gray-500 px-4 py-2">Quantity</th>
            {/* Render additional headers for other item properties */}
          </tr>
        </thead>
        <tbody className="border-red-300 text-3xl font-bold underline">
          {renderItems()}
        </tbody>
      </table>
    </div>
  );
};

export default InventoryManagement;
