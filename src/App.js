import React, { useState } from "react";
import "./App.css";

function App() {
  const storeItems = [
    { id: 101, name: "Red Hoodie", desc: "Warm and comfy", price: 35, stock: true },
    { id: 102, name: "Blue Jeans", desc: "Slim fit denim", price: 40, stock: true },
    { id: 103, name: "Sneakers", desc: "Running shoes", price: 55, stock: false },
    { id: 104, name: "Black Cap", desc: "Stylish street cap", price: 15, stock: true },
    { id: 105, name: "Green Jacket", desc: "Winter style", price: 60, stock: true },
    { id: 106, name: "White Shirt", desc: "Casual wear", price: 20, stock: true },
    { id: 107, name: "Leather Belt", desc: "Classic brown", price: 25, stock: true },
    { id: 108, name: "Sports Watch", desc: "Digital waterproof", price: 75, stock: false },
    { id: 109, name: "Sunglasses", desc: "UV protection", price: 30, stock: true },
    { id: 110, name: "Winter Gloves", desc: "Keep hands warm", price: 18, stock: true },
    { id: 111, name: "Beanie Hat", desc: "Cozy knitted", price: 12, stock: true },
    { id: 112, name: "Backpack", desc: "Durable travel bag", price: 45, stock: true },
    { id: 113, name: "Smartphone Case", desc: "Shockproof", price: 10, stock: true },
    { id: 114, name: "Wireless Earbuds", desc: "Bluetooth 5.0", price: 55, stock: true },
    { id: 115, name: "Water Bottle", desc: "Stainless steel", price: 22, stock: true },
  ];

  const [wishlist, setWishlist] = useState([storeItems[0], storeItems[1], storeItems[2]]);
  const [lastWishlist, setLastWishlist] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [showStore, setShowStore] = useState(false);

  const removeItem = (id) => setWishlist(wishlist.filter((item) => item.id !== id));
  const clearAll = () => { if (wishlist.length>0){setLastWishlist(wishlist); setWishlist([]);} };
  const undoClear = () => { if(lastWishlist){setWishlist(lastWishlist); setLastWishlist(null);} };
  const addFromStore = (item) => { if (!wishlist.find(w => w.id === item.id)) setWishlist([...wishlist, item]); };

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <header className="header">
        <div>
          <h2>Your Wishlist</h2>
          <p>There are {wishlist.length} products in this list</p>
        </div>
        <div className="header-actions">
          <button className="btn danger" onClick={clearAll}>Remove All</button>
          {lastWishlist && <button className="btn warning" onClick={undoClear}>Undo</button>}
          <button className="btn success" onClick={() => setShowStore(!showStore)}>
            {showStore ? "Close Store" : "+ Add Item"}
          </button>
          <button className="btn toggle" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>
      </header>

      <table className="wishlist-table">
        <thead>
          <tr>
            <th>Product</th><th>Price</th><th>Stock</th><th>Action</th>
          </tr>
        </thead>
        <tbody>
          {wishlist.length > 0 ? wishlist.map(item => (
            <tr key={item.id} className="fade-in">
              <td><strong>{item.name}</strong><p className="desc">{item.desc}</p></td>
              <td>${item.price.toFixed(2)}</td>
              <td>{item.stock ? <span className="badge in-stock">IN STOCK</span> : <span className="badge out-stock">OUT</span>}</td>
              <td><button className="btn danger small" onClick={()=>removeItem(item.id)}>✕</button></td>
            </tr>
          )) : <tr><td colSpan="4" className="empty">Your wishlist is empty.</td></tr>}
        </tbody>
      </table>

      {showStore && (
        <div className="store-panel">
          {storeItems.map(item => (
            <div key={item.id} className="store-card">
              <h4>{item.name}</h4>
              <p>{item.desc}</p>
              <p className="price">${item.price}</p>
              {item.stock ? 
                (wishlist.find(w => w.id === item.id) ? 
                  <span className="badge in-stock">Added</span> : 
                  <button className="btn primary small" onClick={()=>addFromStore(item)}>➕ Add</button>)
                : <span className="badge out-stock">OUT</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
