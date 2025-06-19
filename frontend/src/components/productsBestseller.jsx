import React, { useState, useEffect } from "react";

const ProductBestsellerList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // MOCK-DATEN statt API-Request
    const mockData = [
      { name: "Pizza Margherita", size: "Medium", price: 7.0, orders: 83, revenue: 679 },
      { name: "Pizza Veggie", size: "Large", price: 8.5, orders: 85, revenue: 569 },
      { name: "Sicilian Pizza", size: "Small", price: 9.5, orders: 64, revenue: 453 }
    ];
    setProducts(mockData);
  }, []);

  return (
    <div className="product-list-container">
      <h3>Bestseller</h3>
      <table className="product-table">
        <thead>
          <tr>
            <th>Produkt</th>
            <th>Preis</th>
            <th>Bestellungen</th>
            <th>Umsatz</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p, index) => (
            <tr key={index}>
              <td>
                <strong>{p.name}</strong>
                <br />
                <span className="size-info">{p.size}</span>
              </td>
              <td>{p.price.toFixed(2)} €</td>
              <td>{p.orders}</td>
              <td>{p.revenue.toFixed(0)} €</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductBestsellerList;
