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
    
    // Check Telegram configuration after page load
    checkTelegramConfig();
    
    // Form Validation and Telegram Integration (for all forms)
    initFormValidation();
    initAllFormsTelegram();
});

/**
 * Check if Telegram configuration is loaded correctly
 */
function checkTelegramConfig() {
    if (typeof BOT_TOKEN === 'undefined' || typeof CHAT_ID === 'undefined' || !BOT_TOKEN || !CHAT_ID) {
        console.warn('⚠️ Telegram Bot configuration not found!');
        console.warn('Values:', { 
            BOT_TOKEN: typeof BOT_TOKEN !== 'undefined' ? 'defined (' + (BOT_TOKEN ? 'has value' : 'empty') + ')' : 'undefined',
            CHAT_ID: typeof CHAT_ID !== 'undefined' ? 'defined (' + (CHAT_ID ? 'has value' : 'empty') + ')' : 'undefined'
        });
        console.warn('Make sure config.js is loaded before script.js in your HTML files');
        console.warn('Check that config.js file exists and contains BOT_TOKEN and CHAT_ID variables');
    } else {
        console.log('✅ Telegram Bot configuration loaded successfully');
        console.log('Bot Token:', BOT_TOKEN.substring(0, 10) + '...');
        console.log('Chat ID:', CHAT_ID);
    }
}

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

// Telegram Bot API Configuration
// Configuration is loaded from config.js (which is in .gitignore)
// config.js should be loaded before this script in HTML files
// If config.js is not available, these will be undefined and forms will show an error
// Check if configuration was loaded from config.js
if (typeof BOT_TOKEN === 'undefined' || typeof CHAT_ID === 'undefined') {
    console.error('⚠️ Telegram Bot configuration not found!');
    console.error('Please create config.js from config.example.js template and add your BOT_TOKEN and CHAT_ID');
    console.error('Make sure config.js is loaded before script.js in your HTML files');
}

/**
 * Sends form data to Telegram using Telegram Bot API
 * Uses CORS proxy to bypass browser CORS restrictions
 * @param {Object} formData - Object containing form fields (name, phone, email, message, address)
 * @returns {Promise<boolean>} - Returns true if successful, false otherwise
 */
async function sendToTelegram(formData) {
    try {
        // Validate form data first
        if (!formData.name || !formData.phone) {
            console.error('Required form data missing: name or phone');
            throw new Error('Required form fields are missing');
        }

        console.log('📤 Attempting to send message via Vercel API...');
        
        // Use Vercel serverless function (works reliably, no CORS issues)
        // If BOT_TOKEN and CHAT_ID are in config.js, send them in the request for development
        // In production, they should be set as environment variables in Vercel
        const apiEndpoint = '/api/telegram';
        
        const requestBody = {
            name: formData.name,
            phone: formData.phone,
            email: formData.email || null,
            message: formData.message || null,
            address: formData.address || null,
            // Include tokens for fallback (if not set in Vercel env vars)
            // In production, these should be set in Vercel environment variables
            ...(typeof BOT_TOKEN !== 'undefined' && BOT_TOKEN ? { botToken: BOT_TOKEN } : {}),
            ...(typeof CHAT_ID !== 'undefined' && CHAT_ID ? { chatId: CHAT_ID } : {}),
        };
        
        // Try Vercel API endpoint first
        let response;
        let data;
        
        try {
            response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            // Check status first - if 404, API endpoint doesn't exist
            if (response.status === 404) {
                console.warn('⚠️ API endpoint returned 404 - endpoint not found');
                throw new Error('API endpoint not found (404)');
            }

            // Check if response is JSON or HTML
            const contentType = response.headers.get('content-type') || '';
            let responseText = '';
            
            try {
                responseText = await response.text();
            } catch (textError) {
                console.warn('⚠️ Could not read response text:', textError);
                throw new Error('Could not read API response');
            }

            // Try to parse as JSON only if Content-Type says it's JSON
            if (contentType.includes('application/json')) {
                try {
                    data = JSON.parse(responseText);
                } catch (jsonError) {
                    console.warn('⚠️ Response claims to be JSON but parsing failed:', jsonError);
                    console.warn('Response text:', responseText.substring(0, 200));
                    throw new Error('Invalid JSON response from API');
                }
            } else {
                // Response is not JSON (probably HTML 404 page or error)
                console.warn('⚠️ API endpoint returned non-JSON response');
                console.warn('Content-Type:', contentType);
                console.warn('Response:', responseText.substring(0, 200));
                throw new Error(`API endpoint returned non-JSON response. Status: ${response.status}`);
            }

            if (!response.ok) {
                console.error('API error:', data);
                throw new Error(data.error || `HTTP ${response.status}: ${response.statusText}`);
            }

            if (data.success) {
                console.log('✅ Message sent successfully to Telegram via API');
                return true;
            } else {
                console.error('API returned unsuccessful response:', data);
                throw new Error(data.error || 'Unknown API error');
            }
            
        } catch (apiError) {
            // If API is not available (404, network error, etc.), fallback to direct method with proxy
            console.warn('⚠️ Vercel API endpoint not available, trying fallback method...');
            console.warn('API error:', apiError.message);
            
            // Fallback: use direct Telegram API with proxy (only if config.js tokens are available)
            if (typeof BOT_TOKEN !== 'undefined' && typeof CHAT_ID !== 'undefined' && BOT_TOKEN && CHAT_ID) {
                return await sendToTelegramFallback(formData);
            } else {
                throw new Error('API endpoint not available and no fallback tokens configured');
            }
        }

    } catch (error) {
        console.error('❌ Error sending to Telegram:', error);
        console.error('Error details:', {
            message: error.message,
            stack: error.stack
        });
        
        return false;
    }
}

/**
 * Fallback method: Send directly to Telegram using CORS proxy (if API endpoint is not available)
 */
async function sendToTelegramFallback(formData) {
    try {
        console.log('📤 Attempting fallback: sending via CORS proxy...');
        
        // Build formatted message
        let telegramMessage = `🆕 <b>New Contact Form Submission</b>\n\n`;
        telegramMessage += `👤 <b>Name:</b> ${escapeHtml(formData.name)}\n`;
        telegramMessage += `📞 <b>Phone:</b> ${escapeHtml(formData.phone)}\n`;
        
        if (formData.email) {
            telegramMessage += `📧 <b>Email:</b> ${escapeHtml(formData.email)}\n`;
        }
        
        if (formData.address) {
            telegramMessage += `📍 <b>Address:</b> ${escapeHtml(formData.address)}\n`;
        }
        
        if (formData.message) {
            telegramMessage += `\n💬 <b>Message:</b>\n${escapeHtml(formData.message)}\n`;
        }
        
        telegramMessage += `\n━━━━━━━━━━━━━━━━━━━━\n`;
        telegramMessage += `🕐 ${new Date().toLocaleString()}`;
        
        const telegramApiUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
        
        // Try using a simple CORS proxy
        const proxyUrl = `https://api.allorigins.win/post?url=${encodeURIComponent(telegramApiUrl)}`;
        
        const formDataObj = new URLSearchParams();
        formDataObj.append('chat_id', String(CHAT_ID));
        formDataObj.append('text', telegramMessage);
        formDataObj.append('parse_mode', 'HTML');
        
        const response = await fetch(proxyUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formDataObj.toString(),
        });
        
        if (response.ok) {
            const proxyData = await response.json();
            const telegramResponse = JSON.parse(proxyData.contents);
            
            if (telegramResponse.ok) {
                console.log('✅ Message sent successfully via fallback proxy method');
                return true;
            } else {
                console.error('Telegram API error via proxy:', telegramResponse);
                throw new Error(telegramResponse.description || 'Telegram API error');
            }
        } else {
            throw new Error(`Proxy HTTP ${response.status}: ${response.statusText}`);
        }
        
    } catch (fallbackError) {
        console.error('❌ Fallback method also failed:', fallbackError);
        throw fallbackError;
    }
}

/**
 * Escapes HTML special characters to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} - Escaped text
 */
function escapeHtml(text) {
    if (!text) return '';
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

/**
 * Shows error message to user
 * @param {string} message - Error message to display
 */
function showFormError(message) {
    // Try to use dedicated error element first
    const errorElement = document.getElementById('formError');
    const successMessage = document.getElementById('formSuccess');
    
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        setTimeout(() => {
            errorElement.style.display = 'none';
            errorElement.textContent = '';
        }, 5000);
    } else if (successMessage) {
        // Fallback to success message element with error styling
        successMessage.textContent = message;
        successMessage.style.display = 'block';
        successMessage.style.backgroundColor = '#ef4444'; // Red for error
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        setTimeout(() => {
            successMessage.style.display = 'none';
            successMessage.style.backgroundColor = '#10b981'; // Reset to green
            successMessage.textContent = "Thank you! We've received your request and will contact you soon.";
        }, 5000);
    } else {
        // Last resort: use alert
        alert(message);
    }
}

/**
 * Shows success message to user
 */
function showFormSuccess() {
    const errorElement = document.getElementById('formError');
    const successMessage = document.getElementById('formSuccess');
    
    // Hide error message if visible
    if (errorElement) {
        errorElement.style.display = 'none';
    }
    
    if (successMessage) {
        successMessage.style.display = 'block';
        successMessage.style.backgroundColor = '#10b981'; // Green
        successMessage.textContent = "Thank you! We've received your request and will contact you soon.";
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        setTimeout(() => {
            successMessage.style.display = 'none';
        }, 10000);
    }
}

// Form Validation
function initFormValidation() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Clear previous errors
        clearErrors();
        
        // Get form values
        const name = document.getElementById('name')?.value.trim() || '';
        const phone = document.getElementById('phone')?.value.trim() || '';
        const email = document.getElementById('email')?.value.trim() || '';
        const address = document.getElementById('address')?.value.trim() || '';
        const message = document.getElementById('message')?.value.trim() || '';
        
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
        
        // Validate address (if field exists)
        const addressField = document.getElementById('address');
        if (addressField) {
            if (!address) {
                showError('address', 'Address is required');
                isValid = false;
            } else if (address.length < 5) {
                showError('address', 'Please enter a complete address');
                isValid = false;
            }
        }
        
        if (!isValid) {
            // Scroll to first error
            const firstError = contactForm.querySelector('.error-message:not(:empty)');
            if (firstError) {
                firstError.closest('div').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
            return;
        }
        
        // Disable submit button to prevent double submission
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton?.textContent;
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
        }
        
        // Prepare form data for Telegram
        const formData = {
            name: name,
            phone: phone,
            email: email || null,
            message: message || null,
            address: address || null,
        };
        
            // Send to Telegram
            try {
                const success = await sendToTelegram(formData);
                
                if (success) {
                    // Show success message
                    showFormSuccess();
                    contactForm.reset();
                } else {
                    // Show error message with helpful information
                    console.error('❌ Telegram sending failed - check console above for detailed error messages');
                    console.error('');
                    console.error('🔍 Troubleshooting checklist:');
                    console.error('1. Open browser console (F12) and check for red error messages');
                    console.error('2. Verify config.js file exists and is in the same directory');
                    console.error('3. Check that config.js is loaded before script.js in HTML');
                    console.error('4. Verify BOT_TOKEN and CHAT_ID values in config.js are correct');
                    console.error('5. Test bot token: https://api.telegram.org/bot<YOUR_TOKEN>/getMe');
                    showFormError('Unable to send message automatically. Please call us directly at (660) 281-7001 or (660) 619-0827. Open browser console (F12) for troubleshooting details.');
                    // Don't reset form so user can see their data
                }
            } catch (error) {
                console.error('❌ Form submission error:', error);
                console.error('Error stack:', error.stack);
                showFormError('An error occurred: ' + error.message + '. Please call us at (660) 281-7001 or (660) 619-0827 for immediate assistance.');
            } finally {
            // Re-enable submit button
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText || 'Submit Request';
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

/**
 * Initialize Telegram integration for all forms on the page
 * Automatically detects forms and adds submit handlers
 */
function initAllFormsTelegram() {
    // Get all forms on the page
    const allForms = document.querySelectorAll('form');
    
    allForms.forEach(form => {
        // Skip if already handled by specific form handler
        if (form.id === 'contactForm') {
            return; // Already handled by initFormValidation
        }
        
        // Add submit handler for other forms
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Extract form data
            const formData = new FormData(form);
            const data = {};
            
            // Get all form fields
            form.querySelectorAll('input, textarea, select').forEach(field => {
                if (field.name && field.type !== 'submit' && field.type !== 'button') {
                    const value = field.value.trim();
                    if (value) {
                        data[field.name] = value;
                    }
                }
            });
            
            // Check for common field names
            const name = data.name || data.fullname || data['full-name'] || '';
            const phone = data.phone || data.tel || data.telephone || '';
            const email = data.email || data.mail || '';
            const message = data.message || data.comment || data.comments || data.notes || '';
            const address = data.address || data.location || '';
            
            // Validate required fields
            if (!name || !phone) {
                alert('Please fill in all required fields (Name and Phone).');
                return;
            }
            
            // Disable submit button
            const submitButton = form.querySelector('button[type="submit"], input[type="submit"]');
            const originalButtonText = submitButton?.textContent || submitButton?.value;
            if (submitButton) {
                submitButton.disabled = true;
                if (submitButton.tagName === 'BUTTON') {
                    submitButton.textContent = 'Sending...';
                } else {
                    submitButton.value = 'Sending...';
                }
            }
            
            // Prepare data for Telegram
            const telegramData = {
                name: name,
                phone: phone,
                email: email || null,
                message: message || null,
                address: address || null,
            };
            
            // Send to Telegram
            try {
                const success = await sendToTelegram(telegramData);
                
                if (success) {
                    // Show success
                    alert('Thank you! We\'ve received your request and will contact you soon.');
                    form.reset();
                } else {
                    alert('Failed to send message. Please try again or contact us directly.');
                }
            } catch (error) {
                console.error('Form submission error:', error);
                alert('An error occurred. Please try again or contact us directly.');
            } finally {
                // Re-enable submit button
                if (submitButton) {
                    submitButton.disabled = false;
                    if (submitButton.tagName === 'BUTTON') {
                        submitButton.textContent = originalButtonText;
                    } else {
                        submitButton.value = originalButtonText;
                    }
                }
            }
        });
    });
}
