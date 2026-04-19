document.addEventListener('DOMContentLoaded', () => {
    // --- State Management ---
    let cart = JSON.parse(localStorage.getItem('flower_cart')) || [];
    let wishlist = JSON.parse(localStorage.getItem('flower_wishlist')) || [];

    const saveCart = () => localStorage.setItem('flower_cart', JSON.stringify(cart));
    const saveWishlist = () => localStorage.setItem('flower_wishlist', JSON.stringify(wishlist));

    const updateCartCount = () => {
        const cartCountElement = document.getElementById('cart-count');
        if (cartCountElement) {
            cartCountElement.innerText = cart.reduce((total, item) => total + item.quantity, 0);
        }
    };

    // Initialize UI states
    updateCartCount();
    
    // Highlight existing wishlist items on load
    document.querySelectorAll('.fa-heart').forEach(heart => {
        const productId = heart.closest('.box')?.querySelector('h3')?.innerText || 'global';
        if (wishlist.includes(productId)) {
            heart.classList.add('active');
        }
    });

    // --- UI Logic ---
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('header .navbar a');

    window.onscroll = () => {
        // Handle active link highlighting
        sections.forEach(sec => {
            let top = window.scrollY;
            let offset = sec.offsetTop - 150;
            let height = sec.offsetHeight;
            let id = sec.getAttribute('id');

            if (top >= offset && top < offset + height) {
                navLinks.forEach(links => {
                    links.classList.remove('active');
                    const target = document.querySelector('header .navbar a[href*=' + id + ']');
                    if (target) target.classList.add('active');
                });
            }
        });

        // Close UI on scroll (mobile)
        const toggler = document.getElementById('toggler');
        if (toggler) toggler.checked = false;
        
        const searchForm = document.querySelector('.search-form');
        if (searchForm) searchForm.classList.remove('active');

        const loginModal = document.querySelector('.login-form-container');
        if (loginModal) loginModal.style.top = '-110%';
    };

    // Search Toggle
    const searchBtn = document.getElementById('search-btn');
    const searchForm = document.querySelector('.search-form');
    if (searchBtn && searchForm) {
        searchBtn.onclick = () => {
            searchForm.classList.toggle('active');
            if (searchForm.classList.contains('active')) {
                const loginModal = document.querySelector('.login-form-container');
                if (loginModal) loginModal.style.top = '-110%';
            }
        };
    }

    // Login Modal Toggle
    const loginBtn = document.getElementById('user-btn');
    const loginModal = document.querySelector('.login-form-container');
    const closeLoginBtn = document.getElementById('close-login-btn');

    if (loginBtn && loginModal) {
        loginBtn.onclick = (e) => {
            e.preventDefault();
            loginModal.style.top = '0';
            const searchForm = document.querySelector('.search-form');
            if (searchForm) searchForm.classList.remove('active');
        };
    }

    if (closeLoginBtn && loginModal) {
        closeLoginBtn.onclick = () => {
            loginModal.style.top = '-110%';
        };
    }

    // Chat Widget
    const chatBtn = document.getElementById('chat-btn');
    if (chatBtn) {
        chatBtn.onclick = () => {
            alert('How can we help you today? Our agents are online!');
        };
    }

    // Navigation and Mobile Menu
    navLinks.forEach(link => {
        link.onclick = () => {
            const toggler = document.getElementById('toggler');
            if (toggler) toggler.checked = false;
        };
    });

    // Cart Functionality (Adding)
    const addToCartButtons = document.querySelectorAll('.cart-btn');
    addToCartButtons.forEach(btn => {
        btn.onclick = (e) => {
            e.preventDefault();
            const productBox = btn.closest('.box');
            const name = productBox.querySelector('h3').innerText;
            const price = parseFloat(productBox.querySelector('.price').innerText.replace('$', ''));
            const image = productBox.querySelector('img').src; // This already captures absolute path with images/

            const existingItem = cart.find(item => item.name === name);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({ name, price, image, quantity: 1 });
            }

            saveCart();
            updateCartCount();
            
            // Notification animation
            const cartCountElement = document.getElementById('cart-count');
            if (cartCountElement) {
                cartCountElement.style.transform = 'scale(1.5)';
                setTimeout(() => cartCountElement.style.transform = 'scale(1)', 200);
            }
        };
    });

    // Wishlist Functionality
    const wishlistHearts = document.querySelectorAll('.fa-heart');
    wishlistHearts.forEach(heart => {
        heart.onclick = (e) => {
            e.preventDefault();
            const productId = heart.closest('.box')?.querySelector('h3')?.innerText || 'global';
            
            heart.classList.toggle('active');
            if (heart.classList.contains('active')) {
                if (!wishlist.includes(productId)) wishlist.push(productId);
            } else {
                wishlist = wishlist.filter(id => id !== productId);
            }
            saveWishlist();
        };
    });

    // --- Cart Page Rendering ---
    const cartTableBody = document.querySelector('.cart-table tbody');
    if (cartTableBody) {
        const renderCart = () => {
            if (cart.length === 0) {
                document.querySelector('.cart-container').innerHTML = '<div class="empty-cart-msg">Your cart is empty! <br><a href="products.html" class="btn">Shop Now</a></div>';
                return;
            }

            cartTableBody.innerHTML = '';
            let total = 0;

            cart.forEach((item, index) => {
                const subtotal = item.price * item.quantity;
                total += subtotal;

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td><img src="${item.image}" alt=""></td>
                    <td>${item.name}</td>
                    <td>$${item.price.toFixed(2)}</td>
                    <td>
                        <input type="number" value="${item.quantity}" min="1" class="qty-input" data-index="${index}" style="width: 5rem; padding: .5rem; font-size: 1.5rem; border: .1rem solid #ccc;">
                    </td>
                    <td>$${subtotal.toFixed(2)}</td>
                    <td><i class="fas fa-trash remove-item" data-index="${index}" style="cursor:pointer; color: #c60763; font-size: 2rem;"></i></td>
                `;
                cartTableBody.appendChild(row);
            });

            document.getElementById('cart-total-amount').innerText = total.toFixed(2);
        };

        renderCart();

        // Listen for quantity changes
        cartTableBody.addEventListener('change', (e) => {
            if (e.target.classList.contains('qty-input')) {
                const index = e.target.dataset.index;
                const newQty = parseInt(e.target.value);
                if (newQty > 0) {
                    cart[index].quantity = newQty;
                    saveCart();
                    renderCart();
                    updateCartCount();
                }
            }
        });

        // Listen for removals
        cartTableBody.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-item')) {
                const index = e.target.dataset.index;
                cart.splice(index, 1);
                saveCart();
                renderCart();
                updateCartCount();
            }
        });
    }

    // --- Contact Form ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.onsubmit = (e) => {
            e.preventDefault();
            const formMsg = document.getElementById('form-msg');
            const submitBtn = contactForm.querySelector('.btn');
            
            submitBtn.value = 'sending...';
            submitBtn.disabled = true;

            setTimeout(() => {
                submitBtn.value = 'send message';
                submitBtn.disabled = false;
                contactForm.reset();
                formMsg.innerText = 'Message sent! We will contact you soon.';
                formMsg.style.display = 'block';
                setTimeout(() => formMsg.style.display = 'none', 5000);
            }, 1500);
        };
    }

    // --- Filtering Engine ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productBoxes = document.querySelectorAll('.products .box');

    filterButtons.forEach(btn => {
        btn.onclick = () => {
            // Update active button
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            productBoxes.forEach(box => {
                box.classList.remove('show');
                box.classList.add('hide');

                setTimeout(() => {
                    if (filter === 'all' || box.dataset.category === filter) {
                        box.classList.remove('hide');
                        box.classList.add('show');
                    }
                }, 100);
            });
        };
    });
});
