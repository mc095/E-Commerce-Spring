import React, { useEffect, useState } from 'react';

const ProductsAdmin = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [editProduct, setEditProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    category: "",
    metalType: "",
    image: "",
    description: "",
    weight: ""
  });

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/products');
        if (!res.ok) throw new Error('Failed to load products');
        const data = await res.json();
        console.log('Fetched products:', data); // Debug: Log fetched products
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Helper function to get product ID (handles both _id and id)
  const getProductId = (product) => {
    return product._id || product.id;
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setProducts(products.filter(p => getProductId(p) !== productId));
        alert('Product deleted successfully');
      } else {
        throw new Error('Failed to delete');
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCreate = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.weight) {
      alert('Name, price, and weight are required');
      return;
    }

    const parsedPrice = parseFloat(newProduct.price);
    const parsedWeight = parseFloat(newProduct.weight);
    if (isNaN(parsedPrice) || isNaN(parsedWeight) || parsedPrice <= 0 || parsedWeight <= 0) {
      alert('Price and weight must be valid positive numbers');
      return;
    }

    try {
      setIsLoading(true);
      const requestBody = {
        ...newProduct,
        price: parsedPrice,
        weight: parsedWeight
      };
      console.log('Creating product:', requestBody); // Debug: Log request body
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      if (!res.ok) throw new Error('Failed to create product');

      const createdProduct = await res.json();
      console.log('Created product:', createdProduct); // Debug: Log response
      setProducts([...products, createdProduct]);
      setNewProduct({
        name: "",
        price: "",
        category: "",
        metalType: "",
        image: "",
        description: "",
        weight: ""
      });
      alert('Product created successfully');
    } catch (err) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!editProduct?.name || !editProduct?.price || !editProduct?.weight) {
      alert('Name, price, and weight are required');
      return;
    }

    const parsedPrice = parseFloat(editProduct.price);
    const parsedWeight = parseFloat(editProduct.weight);
    if (isNaN(parsedPrice) || isNaN(parsedWeight) || parsedPrice <= 0 || parsedWeight <= 0) {
      alert('Price and weight must be valid positive numbers');
      return;
    }

    // Get the correct product ID
    const productId = getProductId(editProduct);
    if (!productId) {
      alert('Product ID not found');
      return;
    }

    try {
      setIsLoading(true);
      const requestBody = {
        ...editProduct,
        price: parsedPrice,
        weight: parsedWeight
      };
      console.log('Updating product:', requestBody); // Debug: Log request body
      console.log('Product ID:', productId); // Debug: Log product ID

      const res = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      if (!res.ok) throw new Error('Failed to update product');

      const updatedProduct = await res.json();
      console.log('Updated product:', updatedProduct); // Debug: Log response
      setProducts(products.map(p => getProductId(p) === productId ? updatedProduct : p));
      setEditProduct(null);
      alert('Product updated successfully');
    } catch (err) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ marginBottom: '20px' }}>Manage Products</h2>

      {error && <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>}
      {isLoading && <div>Loading...</div>}

      <div style={{ marginBottom: '30px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f5f5f5' }}>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Name</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Price per gram</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Weight (g)</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Metal</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Category</th>
              <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={getProductId(product)} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '12px' }}>{product.name}</td>
                <td style={{ padding: '12px' }}>₹{product.price?.toFixed(2)}</td>
                <td style={{ padding: '12px' }}>{product.weight?.toFixed(2) || '-'}</td>
                <td style={{ padding: '12px' }}>{product.metalType || '-'}</td>
                <td style={{ padding: '12px' }}>{product.category || '-'}</td>
                <td style={{ padding: '12px' }}>
                  <button
                    onClick={() => setEditProduct({
                      ...product,
                      price: String(product.price),
                      weight: String(product.weight)
                    })}
                    style={{
                      padding: '6px 12px',
                      marginRight: '5px',
                      backgroundColor: '#4CAF50',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(getProductId(product))}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#f44336',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '30px',
        marginTop: '40px'
      }}>
        {/* Add New Product Form */}
        <div style={{
          border: '1px solid #ddd',
          padding: '20px',
          borderRadius: '8px',
          backgroundColor: '#f9f9f9'
        }}>
          <h3 style={{ marginBottom: '20px' }}>Add New Product</h3>
          <div style={{ display: 'grid', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Name:</label>
              <input
                value={newProduct.name}
                onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Price per gram (₹):</label>
              <input
                type="number"
                value={newProduct.price}
                onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Weight (grams):</label>
              <input
                type="number"
                value={newProduct.weight}
                onChange={e => setNewProduct({ ...newProduct, weight: e.target.value })}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Category:</label>
              <input
                value={newProduct.category}
                onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Metal Type:</label>
              <input
                value={newProduct.metalType}
                onChange={e => setNewProduct({ ...newProduct, metalType: e.target.value })}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Image URL:</label>
              <input
                value={newProduct.image}
                onChange={e => setNewProduct({ ...newProduct, image: e.target.value })}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Description:</label>
              <textarea
                value={newProduct.description}
                onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', minHeight: '80px' }}
              />
            </div>

            <button
              onClick={handleCreate}
              disabled={isLoading}
              style={{
                padding: '10px 15px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                marginTop: '10px'
              }}
            >
              {isLoading ? 'Creating...' : 'Create Product'}
            </button>
          </div>
        </div>

        {/* Edit Product Form (when editProduct is set) */}
        {editProduct && (
          <div style={{
            border: '1px solid #ddd',
            padding: '20px',
            borderRadius: '8px',
            backgroundColor: '#f9f9f9'
          }}>
            <h3 style={{ marginBottom: '20px' }}>Edit Product</h3>
            <div style={{ display: 'grid', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Name:</label>
                <input
                  value={editProduct.name}
                  onChange={e => setEditProduct({ ...editProduct, name: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Price per gram (₹):</label>
                <input
                  type="number"
                  value={editProduct.price}
                  onChange={e => setEditProduct({ ...editProduct, price: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Weight (grams):</label>
                <input
                  type="number"
                  value={editProduct.weight}
                  onChange={e => setEditProduct({ ...editProduct, weight: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Category:</label>
                <input
                  value={editProduct.category}
                  onChange={e => setEditProduct({ ...editProduct, category: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Metal Type:</label>
                <input
                  value={editProduct.metalType}
                  onChange={e => setEditProduct({ ...editProduct, metalType: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Image URL:</label>
                <input
                  value={editProduct.image}
                  onChange={e => setEditProduct({ ...editProduct, image: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Description:</label>
                <textarea
                  value={editProduct.description}
                  onChange={e => setEditProduct({ ...editProduct, description: e.target.value })}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', minHeight: '80px' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={handleUpdate}
                  disabled={isLoading}
                  style={{
                    padding: '10px 15px',
                    backgroundColor: '#2196F3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    flex: 1
                  }}
                >
                  {isLoading ? 'Updating...' : 'Update'}
                </button>
                <button
                  onClick={() => setEditProduct(null)}
                  style={{
                    padding: '10px 15px',
                    backgroundColor: '#f44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    flex: 1
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsAdmin;
