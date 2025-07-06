// Get references to our HTML elements
const productImages = document.querySelectorAll('.product-image');
const cartCountElement = document.getElementById('cart-count');
const totalPriceDisplay = document.getElementById('total-price-display');
const cartItemsList = document.getElementById('cart-items-list');
const relatedItemsSection = document.querySelector('.related-items-section');
const relatedProductsGrid = document.getElementById('related-products-grid');

// Initialize our cart array
let cart = [];

// Define a product catalog for easy lookup and to store related item info
const productCatalog = {
    'pizza': {
        name: 'Pizza',
        price: 200.99,
        img: '../../assets/pizza.jpeg',
        related: ['fries', 'coke', 'salad']
    },
    'burger': {
        name: 'Burger',
        price: 150.00,
        img: '../../assets/burger.jpeg',
        related: ['fries', 'coke']
    },
    'fries': {
        name: 'Fries',
        price: 75.00,
        img: '../../assets/fries.jpeg',
        related: ['burger', 'coke', 'pizza']
    },
    'coke': {
        name: 'Coke',
        price: 50.00,
        img: '../../assets/cocoCola.jpeg',
        related: ['pizza', 'burger', 'fries']
    },
    'salad': {
        name: 'Side Salad',
        price: 4.50,
        img: '../../assets/salad.jpeg',
        related: ['pizza', 'burger']
    }
};


// Function to update the cart's visual display (count, total price, item list)
function updateCartDisplay() {
    let totalItemsInCart = 0;
    let totalPrice = 0;
    cartItemsList.innerHTML = '';

    if (cart.length === 0) {
        cartItemsList.innerHTML = '<li class="empty-cart-message">Your cart is empty.</li>';
        cartCountElement.classList.remove('active');
    } else {
        const emptyMessage = cartItemsList.querySelector('.empty-cart-message');
        if (emptyMessage) {
            emptyMessage.remove();
        }

        cart.forEach(item => {
            totalItemsInCart += item.quantity;
            totalPrice += item.price * item.quantity;

            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <span>${item.name} (x${item.quantity})</span>
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
            `;
            cartItemsList.appendChild(listItem);
        });

        cartCountElement.classList.add('active');
    }

    cartCountElement.textContent = totalItemsInCart;
    totalPriceDisplay.textContent = totalPrice.toFixed(2);
}

// Function to add an item to the cart
function addItemToCart(productId) {
    const product = productCatalog[productId];

    if (!product) {
        console.error(`Product with ID "${productId}" not found in catalog.`);
        return;
    }

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }

    updateCartDisplay();
    displayRelatedItems(productId);
}

// Function to display related items
function displayRelatedItems(currentProductId) {
    const product = productCatalog[currentProductId];
    relatedProductsGrid.innerHTML = '';

    if (product && product.related && product.related.length > 0) {
        relatedItemsSection.style.display = 'block';

        product.related.forEach(relatedId => {
            const relatedProduct = productCatalog[relatedId];
            if (relatedProduct && !cart.some(item => item.id === relatedId)) {
                const productCard = document.createElement('div');
                productCard.classList.add('product-card');
                productCard.innerHTML = `
                    <img src="${relatedProduct.img}" alt="${relatedProduct.name}" class="product-image"
                         data-product-name="${relatedProduct.name}"
                         data-product-price="${relatedProduct.price}"
                         data-product-id="${relatedId}">
                    <h3>${relatedProduct.name}</h3>
                    <p>$${relatedProduct.price.toFixed(2)}</p>
                `;
                relatedProductsGrid.appendChild(productCard);

                const newProductImage = productCard.querySelector('.product-image');
                newProductImage.addEventListener('click', () => {
                    addItemToCart(newProductImage.dataset.productId);
                    relatedItemsSection.style.display = 'none';
                });
            }
        });

        if (relatedProductsGrid.children.length === 0) {
            relatedItemsSection.style.display = 'none';
        }

    } else {
        relatedItemsSection.style.display = 'none';
    }
}

// Add click event listeners to all initial product images
productImages.forEach(image => {
    image.addEventListener('click', () => {
        const productId = image.dataset.productId;

        if (productId) {
            addItemToCart(productId);
        } else {
            console.warn('Could not add item: Missing product ID.');
        }
    });
});

// Initial update of the cart display when the page loads
updateCartDisplay();