import './style.css'

// Navigation functionality
class Navigation {
  constructor() {
    this.navbar = document.querySelector('.navbar');
    this.navLinks = document.querySelectorAll('.nav-link');
    this.hamburger = document.querySelector('.hamburger');
    this.navMenu = document.querySelector('.nav-menu');
    this.sections = document.querySelectorAll('section');
    
    this.init();
  }

  init() {
    this.setupScrollEffect();
    this.setupNavigation();
    this.setupMobileMenu();
    this.setupActiveLink();
  }

  setupScrollEffect() {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 100) {
        this.navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        this.navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
      } else {
        this.navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        this.navbar.style.boxShadow = 'none';
      }
    });
  }

  setupNavigation() {
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
          targetSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }

        // Close mobile menu if open
        this.navMenu.classList.remove('active');
      });
    });
  }

  setupMobileMenu() {
    this.hamburger.addEventListener('click', () => {
      this.navMenu.classList.toggle('active');
    });
  }

  setupActiveLink() {
    const observerOptions = {
      threshold: 0.3,
      rootMargin: '-100px 0px -50% 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          this.updateActiveLink(id);
        }
      });
    }, observerOptions);

    this.sections.forEach(section => {
      observer.observe(section);
    });
  }

  updateActiveLink(activeId) {
    this.navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${activeId}`) {
        link.classList.add('active');
      }
    });
  }
}

// Theme toggle functionality
class ThemeToggle {
  constructor() {
    this.toggleButton = document.getElementById('themeToggle');
    this.currentTheme = localStorage.getItem('theme') || 'light';
    
    this.init();
  }

  init() {
    this.applyTheme(this.currentTheme);
    this.setupToggle();
  }

  setupToggle() {
    this.toggleButton.addEventListener('click', () => {
      this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
      this.applyTheme(this.currentTheme);
      localStorage.setItem('theme', this.currentTheme);
    });
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const icon = this.toggleButton.querySelector('i');
    
    if (theme === 'dark') {
      icon.className = 'fas fa-sun';
    } else {
      icon.className = 'fas fa-moon';
    }
  }
}

// Animations and interactions
class AnimationController {
  constructor() {
    this.init();
  }

  init() {
    this.setupScrollAnimations();
    this.setupHoverEffects();
    this.setupTypingAnimation();
  }

  setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, observerOptions);

    // Animate sections on scroll
    document.querySelectorAll('.skill-category, .project-card, .stat').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });
  }

  setupHoverEffects() {
    // Add ripple effect to buttons
    document.querySelectorAll('.btn').forEach(button => {
      button.addEventListener('click', this.createRipple);
    });
  }

  createRipple(e) {
    const button = e.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    button.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  setupTypingAnimation() {
    const roleElement = document.querySelector('.hero-role');
    const roles = ['Full Stack Developer', 'Frontend Developer', 'Backend Developer', 'UI/UX Designer'];
    let currentRoleIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;

    const typeSpeed = 100;
    const deleteSpeed = 50;
    const pauseTime = 2000;

    const typeWriter = () => {
      const currentRole = roles[currentRoleIndex];
      
      if (isDeleting) {
        roleElement.textContent = currentRole.substring(0, currentCharIndex - 1);
        currentCharIndex--;
        
        if (currentCharIndex === 0) {
          isDeleting = false;
          currentRoleIndex = (currentRoleIndex + 1) % roles.length;
          setTimeout(typeWriter, 500);
          return;
        }
        setTimeout(typeWriter, deleteSpeed);
      } else {
        roleElement.textContent = currentRole.substring(0, currentCharIndex + 1);
        currentCharIndex++;
        
        if (currentCharIndex === currentRole.length) {
          isDeleting = true;
          setTimeout(typeWriter, pauseTime);
          return;
        }
        setTimeout(typeWriter, typeSpeed);
      }
    };

    // Start typing animation after a delay
    setTimeout(typeWriter, 1000);
  }
}

// Contact form functionality
class ContactForm {
  constructor() {
    this.form = document.getElementById('contactForm');
    this.init();
  }

  init() {
    this.form.addEventListener('submit', this.handleSubmit.bind(this));
    this.setupValidation();
  }

  setupValidation() {
    const inputs = this.form.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => this.clearErrors(input));
    });
  }

  validateField(field) {
    const value = field.value.trim();
    let isValid = true;

    // Remove existing error styling
    field.classList.remove('error');

    if (!value) {
      isValid = false;
    } else if (field.type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      isValid = emailRegex.test(value);
    }

    if (!isValid) {
      field.classList.add('error');
    }

    return isValid;
  }

  clearErrors(field) {
    field.classList.remove('error');
  }

  handleSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(this.form);
    const data = Object.fromEntries(formData);
    
    // Validate all fields
    const inputs = this.form.querySelectorAll('input, textarea');
    let isFormValid = true;
    
    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isFormValid = false;
      }
    });

    if (isFormValid) {
      this.submitForm(data);
    } else {
      this.showMessage('Please fill in all fields correctly.', 'error');
    }
  }

  async submitForm(data) {
    const submitButton = this.form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    // Show loading state
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;

    try {
      // Simulate form submission (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      this.showMessage('Thank you! Your message has been sent successfully.', 'success');
      this.form.reset();
    } catch (error) {
      this.showMessage('Sorry, there was an error sending your message. Please try again.', 'error');
    } finally {
      submitButton.textContent = originalText;
      submitButton.disabled = false;
    }
  }

  showMessage(message, type) {
    // Remove existing messages
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
      existingMessage.remove();
    }

    const messageElement = document.createElement('div');
    messageElement.className = `form-message ${type}`;
    messageElement.textContent = message;
    
    this.form.appendChild(messageElement);
    
    // Remove message after 5 seconds
    setTimeout(() => {
      messageElement.remove();
    }, 5000);
  }
}

// Smooth scrolling for scroll indicator
class ScrollIndicator {
  constructor() {
    this.indicator = document.querySelector('.scroll-indicator');
    this.init();
  }

  init() {
    if (this.indicator) {
      this.indicator.addEventListener('click', () => {
        const aboutSection = document.getElementById('about');
        aboutSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      });
    }
  }
}

// Initialize all functionality
document.addEventListener('DOMContentLoaded', () => {
  new Navigation();
  new ThemeToggle();
  new AnimationController();
  new ContactForm();
  new ScrollIndicator();
});

// Add CSS for form messages and ripple effect
const additionalStyles = `
  .form-message {
    padding: 12px;
    border-radius: 8px;
    margin-top: 1rem;
    font-weight: 500;
  }

  .form-message.success {
    background-color: #d1fae5;
    color: #065f46;
    border: 1px solid #a7f3d0;
  }

  .form-message.error {
    background-color: #fee2e2;
    color: #991b1b;
    border: 1px solid #fca5a5;
  }

  .form-group input.error,
  .form-group textarea.error {
    border-color: #ef4444;
  }

  .btn {
    position: relative;
    overflow: hidden;
  }

  .ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    animation: ripple-animation 0.6s linear;
    pointer-events: none;
  }

  @keyframes ripple-animation {
    to {
      transform: scale(2);
      opacity: 0;
    }
  }

  [data-theme="dark"] .form-message.success {
    background-color: #064e3b;
    color: #a7f3d0;
  }

  [data-theme="dark"] .form-message.error {
    background-color: #7f1d1d;
    color: #fca5a5;
  }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);