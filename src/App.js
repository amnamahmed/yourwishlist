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
  ];

  // Wishlist states
  const [wishlist, setWishlist] = useState([storeItems[0], storeItems[1], storeItems[2], storeItems[3], storeItems[4]]);
  const [lastWishlist, setLastWishlist] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [showStore, setShowStore] = useState(false);

  // Shopping List states
  const [showShopping, setShowShopping] = useState(false);
  const [shoppingItems, setShoppingItems] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);

  // Wishlist functions
  const removeItem = (id) => setWishlist(wishlist.filter((item) => item.id !== id));
  const clearAll = () => { if (wishlist.length>0){setLastWishlist(wishlist); setWishlist([]);} };
  const undoClear = () => { if(lastWishlist){setWishlist(lastWishlist); setLastWishlist(null);} };
  const addFromStore = (item) => { if (!wishlist.find(w => w.id === item.id)) setWishlist([...wishlist, item]); };

  // Shopping List functions
  const addShoppingItem = () => {
    if (!selectedItemId) return alert("Please select an item!");
    const item = wishlist.find(w => w.id === parseInt(selectedItemId));
    if (shoppingItems.some((it, i) => it.name === item.name && i !== editingIndex)) return alert("This item already exists in shopping list!");

    if (editingIndex !== null) {
      const updated = [...shoppingItems];
      updated[editingIndex] = { name: item.name, price: item.price };
      setShoppingItems(updated);
      setEditingIndex(null);
    } else {
      setShoppingItems([...shoppingItems, { name: item.name, price: item.price }]);
    }

    setSelectedItemId("");
  };

  const removeShoppingItem = (index) => setShoppingItems(shoppingItems.filter((_, i) => i !== index));
  const editShoppingItem = (index) => {
    const item = shoppingItems[index];
    const wishlistItem = wishlist.find(w => w.name === item.name);
    setSelectedItemId(wishlistItem ? wishlistItem.id.toString() : "");
    setEditingIndex(index);
  };

  const total = shoppingItems.reduce((sum, item) => sum + item.price, 0);

  const getPriceClass = (price) => {
    if (price < 20) return "green";
    if (price >= 20 && price <= 50) return "orange";
    return "red";
  };

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <header className="header">
        <div>
          <h2>{showShopping ? "Shopping List" : "Your Wishlist"}</h2>
          {!showShopping && <p>There are {wishlist.length} products in this list</p>}
        </div>
        <div className="header-actions">
          {!showShopping && (
            <>
              <button className="btn danger" onClick={clearAll}>Remove All</button>
              {lastWishlist && <button className="btn warning" onClick={undoClear}>Undo</button>}
              <button className="btn success" onClick={() => setShowStore(!showStore)}>
                {showStore ? "Close Store" : "+ Add Item"}
              </button>
            </>
          )}
          <button className="btn secondary" onClick={() => setShowShopping(!showShopping)}>
            {showShopping ? "Back to Wishlist" : "🛒 Shopping List"}
          </button>
          <button className="btn toggle" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>
      </header>

      {!showShopping && (
        <>
          <table className="wishlist-table">
            <thead>
              <tr>
                <th>Product</th><th>Price</th><th>Stock</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              {wishlist.length > 0 ? wishlist.map(item => (
                <tr key={item.id}>
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
        </>
      )}

      {showShopping && (
        <div className="shopping-app">
          <div className="input-section">
            <select value={selectedItemId} onChange={(e) => setSelectedItemId(e.target.value)}>
              <option value="">-- Select from Wishlist --</option>
              {wishlist.map(item => (
                <option key={item.id} value={item.id}>{item.name} - ${item.price}</option>
              ))}
            </select>
            <button onClick={addShoppingItem}>{editingIndex !== null ? "Update" : "Add"}</button>
          </div>

          {shoppingItems.length === 0 ? (
            <p className="empty">Your shopping list is empty.</p>
          ) : (
            <ul className="list">
              {shoppingItems.map((item, index) => (
                <li key={index} className={getPriceClass(item.price)}>
                  <span>{item.name} - ${item.price.toFixed(2)}</span>
                  <div className="actions">
                    <button onClick={() => editShoppingItem(index)}>✏️</button>
                    <button onClick={() => removeShoppingItem(index)}>❌</button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <h3>Total: ${total.toFixed(2)}</h3>
        </div>
      )}
    </div>
  );
}

export default App;
