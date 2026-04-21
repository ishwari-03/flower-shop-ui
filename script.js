document.addEventListener('DOMContentLoaded', () => {
    // --- Product Data ---
    const PRODUCTS = [
        { id: 1, name: 'Summer Bouquet', price: 22.99, oldPrice: 25.99, discount: '-10%', image: 'images/colour-flowers-white-pot-isolated-white.jpg.crdownload', category: 'bouquets' },
        { id: 2, name: 'Premium Vase Flowers', price: 120.99, oldPrice: 130.99, discount: '-25%', image: 'images/bright-flowers-vase-table.jpg', category: 'bouquets' },
        { id: 3, name: 'Anthurium Plant', price: 12.99, oldPrice: 15.99, discount: '-15%', image: 'images/red-anthurium-plant-gray-pot.jpg', category: 'indoor' },
        { id: 4, name: 'Monstera Plant', price: 39.00, oldPrice: 45.99, discount: '-8%', image: 'images/monstera-deliciosa-plant-pot.jpg', category: 'indoor' },
        { id: 5, name: 'Fern Plant', price: 25.50, oldPrice: 29.99, discount: '-12%', image: 'images/plant-terracotta-pot-birds-nest-fern-plant_53876-146303.avif', category: 'indoor' },
        { id: 6, name: 'Succulent Pot', price: 15.99, oldPrice: 18.99, discount: '-5%', image: 'images/succulent-plant-terracotta-pot-home-decor-object.jpg.crdownload', category: 'pots' },
        { id: 7, name: 'Pink Rose Mix', price: 45.00, oldPrice: 65.00, discount: '-30%', image: 'images/44.avif', category: 'bouquets' },
        { id: 8, name: 'Desk Bonsai', price: 55.00, oldPrice: 60.00, discount: '-10%', image: 'images/456.avif', category: 'indoor' },
        { id: 9, name: 'Terracotta Mini', price: 10.00, oldPrice: 12.00, discount: '-10%', image: 'images/succulent-plant-terracotta-pot-home-decor-object.jpg.crdownload', category: 'pots' },
        { id: 10, name: 'Blue Orchid', price: 35.00, oldPrice: 45.00, discount: '-22%', image: 'images/1.jpg', category: 'bouquets' },
        { id: 11, name: 'White Lily', price: 18.50, oldPrice: 22.00, discount: '-15%', image: 'images/2.jpg', category: 'bouquets' },
        { id: 12, name: 'Sun Flower', price: 12.00, oldPrice: 15.00, discount: '-20%', image: 'images/5.jpg', category: 'bouquets' },
        { id: 13, name: 'Purple Petunia', price: 8.99, oldPrice: 10.99, discount: '-18%', image: 'images/7.jpg', category: 'pots' },
        { id: 14, name: 'Jasmine Pot', price: 14.50, oldPrice: 16.00, discount: '-9%', image: 'images/3.webp', category: 'indoor' },
        { id: 15, name: 'Evergreen Fern', price: 29.99, oldPrice: 35.99, discount: '-16%', image: 'images/monstera-deliciosa-plant-pot.jpg', category: 'indoor' }
    ];

    // --- State Management ---
    let cart = JSON.parse(localStorage.getItem('flower_cart')) || [];
    let wishlist = JSON.parse(localStorage.getItem('flower_wishlist')) || [];
    let users = JSON.parse(localStorage.getItem('flower_users')) || [];
    let currentUser = JSON.parse(localStorage.getItem('flower_current_user')) || null;

    const saveCart = () => localStorage.setItem('flower_cart', JSON.stringify(cart));
    const saveWishlist = () => localStorage.setItem('flower_wishlist', JSON.stringify(wishlist));
    const saveUsers = () => localStorage.setItem('flower_users', JSON.stringify(users));
    const saveCurrentUser = () => localStorage.setItem('flower_current_user', JSON.stringify(currentUser));

    const updateCartCount = () => {
        const cartCountElements = document.querySelectorAll('#cart-count');
        const count = cart.reduce((total, item) => total + (item.quantity || 1), 0);
        cartCountElements.forEach(el => el.innerText = count);
    };

    // --- User UI Updates ---
    const updateAuthUI = () => {
        const userBtn = document.getElementById('user-btn');
        if (currentUser && userBtn) {
            userBtn.innerHTML = `<span style="font-size: 1.2rem; margin-right: .5rem;">Hi, ${currentUser.name.split(' ')[0]}</span><i class="fas fa-user"></i>`;
            userBtn.title = 'Logout';
            userBtn.onclick = (e) => {
                e.preventDefault();
                if(confirm('Do you want to logout?')) {
                    currentUser = null;
                    saveCurrentUser();
                    location.reload();
                }
            };
        }
    };

    updateCartCount();
    updateAuthUI();

    // --- Helper: Render Product Box ---
    const createProductBox = (product) => {
        const isLiked = wishlist.includes(product.id);
        const box = document.createElement('div');
        box.className = 'box';
        box.dataset.category = product.category;
        box.innerHTML = `
            <span class="discount">${product.discount}</span>
            <div class="image">
                <img src="${product.image}" loading="lazy" alt="${product.name}">
                <div class="icons">
                    <a href="#" class="fas fa-heart wishlist-toggle ${isLiked ? 'active' : ''}" data-id="${product.id}"></a>
                    <a href="#" class="cart-btn" data-id="${product.id}">add to cart</a>
                    <a href="details.html?id=${product.id}" class="fas fa-eye"></a>
                </div>
            </div>
            <div class="content">
                <h3>${product.name}</h3>
                <div class="price">$${product.price.toFixed(2)} <span>$${product.oldPrice.toFixed(2)}</span></div>
            </div>
        `;
        return box;
    };

    // --- Dynamic Rendering ---
    const renderProducts = (container, list) => {
        if (!container) return;
        container.innerHTML = '';
        if (list.length === 0) {
            container.innerHTML = '<p style="font-size: 2rem; text-align: center; width: 100%; padding: 2rem;">No products found.</p>';
            return;
        }
        list.forEach(p => container.appendChild(createProductBox(p)));
        attachProductListeners();
    };

    const path = window.location.pathname;
    if (path.includes('products.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const searchQuery = urlParams.get('q');
        const productsContainer = document.querySelector('.products .box-container');
        if (searchQuery) {
            const results = PRODUCTS.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
            renderProducts(productsContainer, results);
            const headingSpan = document.querySelector('.heading span');
            if (headingSpan) headingSpan.innerText = `Results for "${searchQuery}"`;
        } else {
            renderProducts(productsContainer, PRODUCTS);
        }
    } else if (path.includes('index.html') || path.endsWith('/') || path.endsWith('Copy/')) {
         const latestContainer = document.querySelector('#products .box-container');
         const trendingContainer = document.querySelector('#trending .box-container');
         
         if (latestContainer) {
             renderProducts(latestContainer, PRODUCTS.slice(0, 4)); // Reduced to 4 for performance
         }
         if (trendingContainer) {
             renderProducts(trendingContainer, PRODUCTS.slice(4, 8));
         }
    } else if (path.includes('details.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const id = parseInt(urlParams.get('id')) || 1;
        const product = PRODUCTS.find(p => p.id === id);

        if (product) {
            document.getElementById('product-name').innerText = product.name;
            document.getElementById('main-product-img').src = product.image;
            document.querySelector('.product-details .price').innerHTML = `$${product.price.toFixed(2)} <span style="font-size: 2rem; color: #999; text-decoration: line-through; margin-left: 1rem;">$${product.oldPrice.toFixed(2)}</span>`;
            
            // Sync small images
            const smallImgs = document.querySelectorAll('.small-images img');
            if (smallImgs.length > 0) {
                smallImgs[0].src = product.image;
                // Just use some variety for others if available, or hide
                if (smallImgs[1]) smallImgs[1].src = PRODUCTS[(id % PRODUCTS.length)].image;
                if (smallImgs[2]) smallImgs[2].src = PRODUCTS[((id + 1) % PRODUCTS.length)].image;
            }

            // Details Page Add to Cart
            const detailCartBtn = document.querySelector('.product-details .cart-btn');
            if (detailCartBtn) {
                detailCartBtn.onclick = (e) => {
                    e.preventDefault();
                    const qty = parseInt(document.querySelector('.product-details input[type="number"]').value) || 1;
                    const existing = cart.find(item => item.id === product.id);
                    if (existing) {
                        existing.quantity += qty;
                    } else {
                        cart.push({ ...product, quantity: qty });
                    }
                    saveCart();
                    updateCartCount();
                    alert(`${product.name} added to cart!`);
                };
            }
        }
    }

    // Wishlist Page Rendering
    const wishlistContainer = document.getElementById('wishlist-items-container');
    if (wishlistContainer) {
        const renderWishlist = () => {
            const likedProducts = PRODUCTS.filter(p => wishlist.includes(p.id));
            wishlistContainer.innerHTML = '';
            if (likedProducts.length === 0) {
                wishlistContainer.innerHTML = '<div class="empty-msg" style="text-align: center; font-size: 2rem; width: 100%; padding: 5rem 0;">Your wishlist is empty! <br><a href="products.html" class="btn" style="margin-top: 2rem;">Discover Flowers</a></div>';
                return;
            }
            likedProducts.forEach(p => wishlistContainer.appendChild(createProductBox(p)));
            attachProductListeners();
        };
        renderWishlist();
    }

    // --- Listeners ---
    function attachProductListeners() {
        document.querySelectorAll('.cart-btn').forEach(btn => {
            btn.onclick = (e) => {
                e.preventDefault();
                const id = parseInt(btn.dataset.id);
                const product = PRODUCTS.find(p => p.id === id);
                const existing = cart.find(item => item.id === id);
                if (existing) {
                    existing.quantity++;
                } else {
                    cart.push({ ...product, quantity: 1 });
                }
                saveCart();
                updateCartCount();
                alert(`${product.name} added to cart!`);
            };
        });

        document.querySelectorAll('.wishlist-toggle').forEach(btn => {
            btn.onclick = (e) => {
                e.preventDefault();
                const id = parseInt(btn.dataset.id);
                btn.classList.toggle('active');
                if (btn.classList.contains('active')) {
                    if (!wishlist.includes(id)) wishlist.push(id);
                } else {
                    wishlist = wishlist.filter(item => item !== id);
                    if (window.location.pathname.includes('wishlist.html')) {
                        btn.closest('.box').remove();
                        const items = document.querySelectorAll('#wishlist-items-container .box');
                        if (items.length === 0) location.reload();
                    }
                }
                saveWishlist();
            };
        });
    }

    // Search logic, Login logic, etc. (Keep existing)
    const searchForms = document.querySelectorAll('.search-form');
    searchForms.forEach(form => {
        form.onsubmit = (e) => {
            e.preventDefault();
            const query = form.querySelector('input').value;
            if (query.trim()) window.location.href = `products.html?q=${encodeURIComponent(query)}`;
        };
    });

    // Login logic
    const loginForm = document.getElementById('login-form') || document.querySelector('.login-form-container form');
    const toggleSignup = document.getElementById('toggle-signup');
    let isSignup = false;

    if (toggleSignup) {
        toggleSignup.onclick = (e) => {
            e.preventDefault();
            isSignup = !isSignup;
            const title = document.getElementById('login-title') || loginForm.querySelector('h3');
            const submitBtn = loginForm.querySelector('.btn') || loginForm.querySelector('input[type="submit"]');
            if (isSignup) {
                title.innerText = 'Register';
                submitBtn.value = 'Register Now';
                toggleSignup.innerText = 'already have an account? login';
                if (!document.getElementById('name-field')) {
                    const nameInput = document.createElement('input');
                    nameInput.type = 'text'; nameInput.placeholder = 'enter your name'; nameInput.id = 'name-field'; nameInput.className = 'box'; nameInput.required = true;
                    nameInput.style.cssText = 'width: 100%; margin: .7rem 0; font-size: 1.6rem; border: .1rem solid rgba(0,0,0,.1); border-radius: .5rem; padding: 1rem; text-transform: none;';
                    loginForm.insertBefore(nameInput, loginForm.querySelector('span'));
                }
            } else {
                title.innerText = 'Login'; submitBtn.value = 'Login Now'; toggleSignup.innerText = "don't have an account? create one";
                const nameField = document.getElementById('name-field'); if (nameField) nameField.remove();
            }
        };
    }

    if (loginForm) {
        loginForm.onsubmit = (e) => {
            e.preventDefault();
            const email = loginForm.querySelector('input[type="email"]').value;
            const password = loginForm.querySelector('input[type="password"]').value;
            if (isSignup) {
                const name = document.getElementById('name-field').value;
                if (users.find(u => u.email === email)) { alert('Email already exists!'); return; }
                users.push({ name, email, password }); saveUsers(); alert('Account created!'); if(toggleSignup) toggleSignup.click();
            } else {
                const user = users.find(u => u.email === email && u.password === password);
                if (user) { currentUser = user; saveCurrentUser(); alert('Logged in!'); window.location.reload(); } else { alert('Invalid credentials!'); }
            }
        };
    }

    // Header logic
    const searchBtn = document.getElementById('search-btn');
    const searchForm = document.querySelector('.search-form');
    if (searchBtn && searchForm) {
        searchBtn.onclick = () => {
            searchForm.classList.toggle('active');
            const lm = document.querySelector('.login-form-container'); if (lm) lm.style.top = '-110%';
        };
    }
    const loginBtn = document.getElementById('user-btn');
    const loginModal = document.querySelector('.login-form-container');
    if (loginBtn && loginModal && !currentUser) {
        loginBtn.onclick = (e) => { e.preventDefault(); loginModal.style.top = '0'; if (searchForm) searchForm.classList.remove('active'); };
    }
    const closeLoginBtn = document.getElementById('close-login-btn');
    if (closeLoginBtn && loginModal) closeLoginBtn.onclick = () => loginModal.style.top = '-110%';

    window.onscroll = () => {
        const toggler = document.getElementById('toggler'); if (toggler) toggler.checked = false;
        if (searchForm) searchForm.classList.remove('active');
        if (loginModal) loginModal.style.top = '-110%';
    };

    // Filter Buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    if (filterButtons.length > 0) {
        filterButtons.forEach(btn => {
            btn.onclick = () => {
                filterButtons.forEach(b => b.classList.remove('active')); btn.classList.add('active');
                const filter = btn.dataset.filter;
                const filtered = filter === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.category === filter);
                const pc = document.querySelector('.products .box-container');
                if (pc) { pc.innerHTML = ''; filtered.forEach(p => pc.appendChild(createProductBox(p))); attachProductListeners(); }
            };
        });
    }

    // Cart Rendering (Keep existing)
    const cartTableBody = document.querySelector('.cart-table tbody');
    if (cartTableBody) {
        const renderCartItems = () => {
            if (cart.length === 0) {
                const container = document.querySelector('.cart-container');
                if (container) container.innerHTML = '<div class="empty-cart-msg" style="text-align: center; font-size: 2.5rem; padding: 5rem 0;">Your cart is empty! <br><a href="products.html" class="btn" style="margin-top: 2rem;">Shop Now</a></div>';
                return;
            }
            cartTableBody.innerHTML = '';
            let total = 0;
            cart.forEach((item, index) => {
                const subtotal = item.price * (item.quantity || 1);
                total += subtotal;
                const row = document.createElement('tr');
                row.innerHTML = `<td><img src="${item.image}" alt="" style="width: 8rem; border-radius: .5rem;"></td><td>${item.name}</td><td>$${item.price.toFixed(2)}</td><td><input type="number" value="${item.quantity || 1}" min="1" class="qty-input" data-index="${index}" style="width: 5rem; padding: .5rem; font-size: 1.5rem; border: .1rem solid #ccc;"></td><td>$${subtotal.toFixed(2)}</td><td><i class="fas fa-trash remove-item" data-index="${index}" style="cursor:pointer; color: #c60763; font-size: 2rem;"></i></td>`;
                cartTableBody.appendChild(row);
            });
            const totalEl = document.getElementById('cart-total-amount'); if (totalEl) totalEl.innerText = total.toFixed(2);
        };
        renderCartItems();
        cartTableBody.addEventListener('change', (e) => { if (e.target.classList.contains('qty-input')) { cart[e.target.dataset.index].quantity = parseInt(e.target.value); saveCart(); renderCartItems(); updateCartCount(); } });
        cartTableBody.addEventListener('click', (e) => { if (e.target.classList.contains('remove-item')) { cart.splice(e.target.dataset.index, 1); saveCart(); renderCartItems(); updateCartCount(); } });
    }

    // --- Contact Form ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.onsubmit = (e) => {
            e.preventDefault();
            const formMsg = document.getElementById('form-msg');
            const submitBtn = contactForm.querySelector('.btn');
            
            const name = contactForm.querySelector('input[type="text"]').value;
            const email = contactForm.querySelector('input[type="email"]').value;
            const number = contactForm.querySelector('input[type="number"]').value;
            const message = contactForm.querySelector('textarea').value;

            if (name.length < 3) {
                alert('Please enter a valid name (at least 3 characters).');
                return;
            }
            if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
                alert('Please enter a valid email address.');
                return;
            }
            if (number.length < 10) {
                alert('Please enter a valid 10-digit phone number.');
                return;
            }
            if (message.length < 10) {
                alert('Message must be at least 10 characters long.');
                return;
            }

            submitBtn.value = 'sending...';
            submitBtn.disabled = true;

            setTimeout(() => {
                submitBtn.value = 'send message';
                submitBtn.disabled = false;
                contactForm.reset();
                if (formMsg) {
                    formMsg.innerText = 'Message sent! We will contact you soon.';
                    formMsg.style.display = 'block';
                    setTimeout(() => formMsg.style.display = 'none', 5000);
                }
            }, 1500);
        };
    }
});
