// Contact Form Handler
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('.btn-submit');
            const originalText = submitBtn.innerHTML;
            
            // Get form data
            const formData = new FormData(this);
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Basic validation
            if (!name || !email || !subject || !message) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            // Show loading state
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            
            // Submit form using Formspree
            fetch(this.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    // Show success notification
                    showNotification('Thank you for your message! I will get back to you soon.', 'success');
                    
                    // Clear the form
                    this.reset();
                    
                    // Clear visual validation states
                    clearValidationStates();
                    
                    // Show inline success message (optional)
                    showInlineSuccessMessage();
                    
                } else {
                    throw new Error('Form submission failed');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showNotification('Sorry, there was an error sending your message. Please try again later.', 'error');
            })
            .finally(() => {
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
            });
        });
    }
    
    // Form input validation styling
    const formInputs = document.querySelectorAll('.form-control');
    
    formInputs.forEach(input => {
        // Add focus effect
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
        
        // Real-time validation
        input.addEventListener('input', function() {
            validateField(this);
        });
    });
});

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Field validation function
function validateField(field) {
    const value = field.value.trim();
    const formGroup = field.parentElement;
    
    // Remove existing validation classes
    formGroup.classList.remove('valid', 'invalid');
    
    if (!value) {
        return; // Don't show error for empty field until blur
    }
    
    if (field.type === 'email') {
        if (isValidEmail(value)) {
            formGroup.classList.add('valid');
        } else {
            formGroup.classList.add('invalid');
        }
    } else {
        formGroup.classList.add('valid');
    }
}

// Clear validation states
function clearValidationStates() {
    const formGroups = document.querySelectorAll('.form-group');
    formGroups.forEach(group => {
        group.classList.remove('focused', 'valid', 'invalid');
        
        // Reset input icons
        const input = group.querySelector('.form-control');
        if (input) {
            input.value = '';
        }
    });
}

// Show inline success message
function showInlineSuccessMessage() {
    const formContainer = document.querySelector('.contact-form');
    const existingMessage = document.querySelector('.form-success-message');
    
    // Remove existing message if any
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create success message
    const successMessage = document.createElement('div');
    successMessage.className = 'form-success-message';
    successMessage.innerHTML = `
        <div style="
            background-color: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
            border-radius: 8px;
            padding: 20px;
            margin-top: 20px;
            text-align: center;
            animation: fadeIn 0.5s ease;
        ">
            <i class="fas fa-check-circle" style="font-size: 2rem; margin-bottom: 10px; color: #28a745;"></i>
            <h3 style="margin: 10px 0; color: #155724;">Message Sent Successfully!</h3>
            <p style="margin: 0; color: #155724;">Thank you for contacting me. I'll respond to your message as soon as possible.</p>
        </div>
    `;
    
    // Add to form
    const form = document.getElementById('contactForm');
    form.parentNode.insertBefore(successMessage, form.nextSibling);
    
    // Scroll to the success message
    successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Remove message after 8 seconds
    setTimeout(() => {
        if (successMessage.parentNode) {
            successMessage.style.opacity = '0';
            successMessage.style.transition = 'opacity 0.5s ease';
            setTimeout(() => {
                if (successMessage.parentNode) {
                    successMessage.parentNode.removeChild(successMessage);
                }
            }, 500);
        }
    }, 8000);
}

// Notification function
function showNotification(message, type) {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Set icon based on type
    const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
    
    notification.innerHTML = `
        <i class="fas ${icon}" style="margin-right: 10px;"></i>
        <span>${message}</span>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        font-size: 0.95rem;
        display: flex;
        align-items: center;
        background-color: ${type === 'success' ? '#28a745' : '#dc3545'};
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}