import React, { useEffect, useState } from "react";

const ProductBestsellerList = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:8080/products/ranking");
        if (!response.ok) {
          throw new Error("Netzwerkfehler beim Laden der Produkte");
        }
        const data = await response.json();
        setProducts(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p>Lade Bestseller...</p>;
  if (error) return <p style={{ color: "red" }}>Fehler: {error}</p>;

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
              <td>{p.price}€</td>
              <td>{p.orders}</td>
              <td>{p.revenue}€</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductBestsellerList;
