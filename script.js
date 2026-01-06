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
              <button class="text-blue-600 hover:underline">Edit</button>
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
    }
    );
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

