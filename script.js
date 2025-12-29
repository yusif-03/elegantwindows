// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            // Change icon when menu is open/closed
            if (mobileMenu.classList.contains('hidden')) {
                mobileMenuBtn.innerHTML = '☰';
            } else {
                mobileMenuBtn.innerHTML = '✕';
            }
        });
        
        // Close menu when clicking on a link
        const mobileMenuLinks = mobileMenu.querySelectorAll('a');
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.add('hidden');
                mobileMenuBtn.innerHTML = '☰';
            });
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    
    // Gallery Lightbox (only on gallery page)
    initGalleryLightbox();
    
    // Gallery Filter (only on gallery page)
    initGalleryFilter();
    
    // Form Validation (only on contact page)
    initFormValidation();
});

// Gallery Lightbox Functionality
function initGalleryLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    
    if (!galleryItems.length || !lightbox) return;
    
    let currentIndex = 0;
    const images = Array.from(galleryItems);
    
    function openLightbox(index) {
        currentIndex = index;
        const item = images[index];
        const title = item.querySelector('h3')?.textContent || '';
        const location = item.querySelector('p')?.textContent || '';
        const img = item.querySelector('img');
        
        // Check if there's an actual image or if it's a placeholder div
        if (img && img.src) {
            lightboxImage.innerHTML = `<img src="${img.src}" alt="${title}">`;
        } else {
            // Get the first div which contains the gradient background and emoji
            const imgContainer = item.querySelector('.gallery-item > div:first-of-type');
            if (imgContainer) {
                // Extract emoji from nested div
                const emojiDiv = imgContainer.querySelector('div');
                const emoji = emojiDiv ? emojiDiv.textContent.trim() : '🖼️';
                // Get gradient classes from the container
                const bgClasses = Array.from(imgContainer.classList)
                    .filter(cls => cls.includes('bg-gradient') || cls.includes('from-') || cls.includes('to-'))
                    .join(' ') || 'bg-gradient-to-br from-blue-100 to-blue-200';
                
                lightboxImage.innerHTML = `
                    <div class="${bgClasses} h-96 flex items-center justify-center rounded-lg" style="min-height: 500px;">
                        <div class="text-9xl">${emoji}</div>
                    </div>
                `;
            }
        }
        
        lightboxCaption.textContent = title + (location ? ' - ' + location : '');
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    function showNext() {
        currentIndex = (currentIndex + 1) % images.length;
        openLightbox(currentIndex);
    }
    
    function showPrev() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        openLightbox(currentIndex);
    }
    
    // Add click handlers to gallery items
    images.forEach((item, index) => {
        item.addEventListener('click', function() {
            openLightbox(index);
        });
    });
    
    // Lightbox controls
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }
    
    if (lightboxNext) {
        lightboxNext.addEventListener('click', showNext);
    }
    
    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', showPrev);
    }
    
    // Close on background click
    if (lightbox) {
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!lightbox || !lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowRight') {
            showNext();
        } else if (e.key === 'ArrowLeft') {
            showPrev();
        }
    });
}

// Gallery Filter Functionality
function initGalleryFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (!filterButtons.length) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => {
                btn.classList.remove('active', 'bg-blue-900', 'text-white');
                btn.classList.add('bg-gray-200', 'text-gray-700');
            });
            this.classList.add('active', 'bg-blue-900', 'text-white');
            this.classList.remove('bg-gray-200', 'text-gray-700');
            
            // Filter items
            galleryItems.forEach(item => {
                if (filter === 'all') {
                    item.style.display = '';
                } else {
                    const category = item.getAttribute('data-category');
                    if (category === filter) {
                        item.style.display = '';
                    } else {
                        item.style.display = 'none';
                    }
                }
            });
        });
    });
}

// Form Validation
function initFormValidation() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Clear previous errors
        clearErrors();
        
        // Get form values
        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const email = document.getElementById('email').value.trim();
        const address = document.getElementById('address').value.trim();
        const message = document.getElementById('message').value.trim();
        
        let isValid = true;
        
        // Validate name
        if (!name) {
            showError('name', 'Name is required');
            isValid = false;
        } else if (name.length < 2) {
            showError('name', 'Name must be at least 2 characters');
            isValid = false;
        }
        
        // Validate phone
        if (!phone) {
            showError('phone', 'Phone number is required');
            isValid = false;
        } else {
            const phoneRegex = /^[\d\s\-\+\(\)]+$/;
            if (!phoneRegex.test(phone) || phone.replace(/\D/g, '').length < 10) {
                showError('phone', 'Please enter a valid phone number');
                isValid = false;
            }
        }
        
        // Validate email
        if (!email) {
            showError('email', 'Email is required');
            isValid = false;
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showError('email', 'Please enter a valid email address');
                isValid = false;
            }
        }
        
        // Validate address
        if (!address) {
            showError('address', 'Address is required');
            isValid = false;
        } else if (address.length < 5) {
            showError('address', 'Please enter a complete address');
            isValid = false;
        }
        
        if (isValid) {
            // Show success message
            const successMessage = document.getElementById('formSuccess');
            if (successMessage) {
                successMessage.style.display = 'block';
                contactForm.reset();
                
                // Scroll to success message
                successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                
                // Hide success message after 5 seconds (optional)
                setTimeout(() => {
                    successMessage.style.display = 'none';
                }, 10000);
            }
        } else {
            // Scroll to first error
            const firstError = contactForm.querySelector('.error-message:not(:empty)');
            if (firstError) {
                firstError.closest('div').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        }
    });
    
    // Real-time validation (optional - provides immediate feedback)
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            // Clear error when user starts typing
            if (this.classList.contains('error')) {
                clearFieldError(this.id);
            }
        });
    });
}

function validateField(field) {
    const fieldId = field.id;
    const value = field.value.trim();
    
    clearFieldError(fieldId);
    
    switch(fieldId) {
        case 'name':
            if (value && value.length < 2) {
                showError('name', 'Name must be at least 2 characters');
            }
            break;
        case 'phone':
            if (value) {
                const phoneRegex = /^[\d\s\-\+\(\)]+$/;
                if (!phoneRegex.test(value) || value.replace(/\D/g, '').length < 10) {
                    showError('phone', 'Please enter a valid phone number');
                }
            }
            break;
        case 'email':
            if (value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    showError('email', 'Please enter a valid email address');
                }
            }
            break;
        case 'address':
            if (value && value.length < 5) {
                showError('address', 'Please enter a complete address');
            }
            break;
    }
}

function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(fieldId + 'Error');
    
    if (field) {
        field.classList.add('error');
    }
    
    if (errorElement) {
        errorElement.textContent = message;
    }
}

function clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(fieldId + 'Error');
    
    if (field) {
        field.classList.remove('error');
    }
    
    if (errorElement) {
        errorElement.textContent = '';
    }
}

function clearErrors() {
    const errorMessages = document.querySelectorAll('.error-message');
    const errorFields = document.querySelectorAll('.form-input.error');
    
    errorMessages.forEach(el => {
        el.textContent = '';
    });
    
    errorFields.forEach(field => {
        field.classList.remove('error');
    });
}
