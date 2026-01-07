const baseUrl = "https://api.escuelajs.co/api/v1";

// Fetch and render products in table
const fetchProducts = async () => {
  try {
    const response = await fetch(`${baseUrl}/products?offset=0&limit=10`);
    const products = await response.json();
    console.log(products);
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

function renderProducts(productData) {
  const tbody = document.getElementById("table-body");
  tbody.innerHTML = ""; // Clear existing rows
  productData.forEach((product) => {
    tbody.innerHTML += `
          <tr class="bg-white border-b hover:bg-gray-50">
            <td class="px-6 py-4">${product.id}</td>
            <td class="px-6 py-4 font-medium text-gray-900">${product.title}</td>
            <td class="px-6 py-4 truncate max-w-xs">${product.description}</td>
            <td class="px-6 py-4">$${product.price}</td>
            <td class="px-6 py-4">${product.category.name}</td>
            <td class="px-6 py-4 flex gap-2">
              <button class="text-blue-600 hover:underline" onclick="getProductById(${product.id})">Edit</button>
              <button class="text-red-600 hover:underline" onclick="deleteProduct(${product.id})">Delete</button>
            </td>
          </tr>
        `;
  });
}

fetchProducts().then((products) => renderProducts(products));

// Fetch and render categories in dropdown
const fetchCategories = async () => {
  try {
    const response = await fetch(`${baseUrl}/categories`);
    const categories = await response.json();
    console.log(categories);
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

function renderCategories(categoryData) {
  const select = document.getElementById("category-select");
  select.innerHTML = '<option value="">All Categories</option>';
  categoryData.forEach((category) => {
    select.innerHTML += `
            <option value="${category.id}">${category.name}</option>
        `;
  });
}

fetchCategories().then((categories) => renderCategories(categories));

//Delete product

const deleteProduct = async (productId) => {
  try {
    const response = await fetch(`${baseUrl}/products/${productId}`, {
      method: "DELETE",
    });
    if (response.ok) {
      alert("Product deleted successfully");
      renderProducts(await fetchProducts());
      renderCategories(await fetchCategories());
    } else {
      alert("Failed to delete product");
    }
  } catch (error) {
    console.error("Error deleting product:", error);
    alert("Error deleting product");
  }
};

async function addProduct(event) {
  event.preventDefault();
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const price = parseFloat(document.getElementById("price").value);
  const categoryId = parseInt(document.getElementById("category").value);
  const imageUrl = document.getElementById("imageurl").value;
  const productForm = document.getElementById("productForm");
  const newProduct = {
    title,
    description,
    price,
    categoryId,
    images: [imageUrl],
  };
  console.log("New Product:", newProduct);
  try {
    const response = await fetch(`${baseUrl}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newProduct),
    });
    if (response.ok) {
      alert("Product added successfully");
      renderProducts(await fetchProducts());
      renderCategories(await fetchCategories());
      productForm.reset();
    } else {
      alert("Failed to add product");
    }
  } catch (error) {
    console.error("Error adding product:", error);
    alert("Error adding product");
  }
}

async function getProductById(productId) {
  try {
    const response = await fetch(`${baseUrl}/products/${productId}`);
    if (response.ok) {
      const product = await response.json();

      document.getElementById("productId").value = product.id;
      document.getElementById("title").value = product.title;
      document.getElementById("description").value = product.description;
      document.getElementById("price").value = product.price;
      document.getElementById("category").value = product.category.id;
      document.getElementById("imageurl").value = product.images[0];
      console.log("Fetched Product:", product);
      return product;
    } else {
      console.error("Failed to fetch product");
      return null;
    }
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

async function updateProduct(event) {
  event.preventDefault();
  const productId = document.getElementById("productId").value;
  if (!productId) {
    alert("No product selected for update");
    return;
  }
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const price = parseFloat(document.getElementById("price").value);
  const categoryId = parseInt(document.getElementById("category").value);
  const imageUrl = document.getElementById("imageurl").value;
  const updatedProduct = {
    title,
    description,
    price,
    categoryId,
    images: [imageUrl],
  };
  console.log("Updated Product:", updatedProduct);
  try {
    const response = await fetch(`${baseUrl}/products/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedProduct),
    });
    if (response.ok) {
      alert("Product updated successfully");
      renderProducts(await fetchProducts());
      renderCategories(await fetchCategories());
      productForm.reset();
    } else {
      alert("Failed to update product");
    }
  } catch (error) {
    console.error("Error updating product:", error);
    alert("Error updating product");
  }
}
