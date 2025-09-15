/**
 * Universal Bundle Template
 * A flexible, attractive, and universally compatible bundle component
 * that can adapt to any e-commerce store's branding and requirements.
 */

class UniversalBundleTemplate {
  constructor(module, functionalityInstance, options = {}) {
    this.module = module;
    this.functionality = functionalityInstance; // Store the instance
    this.options = {
      theme: 'modern', // modern, minimal, classic, custom
      layout: 'horizontal', // horizontal, vertical, grid
      showSavings: true,
      enableQuantity: false,
      autoSelectMain: true,
      mobileModal: true,
      ...options,
    };
  }

  generateHtml(offer, discount, productsWithDetails) {
    const bundleProducts = Array.from(this.module.bundleProducts?.values());

    return `
            <div class="universal-bundle" data-theme="${this.options.theme}" data-layout="${this.options.layout}">
                ${this.generateHeader(offer)}
                ${this.generateDesktopView(bundleProducts, this.module.bundleCalculation)}
                ${this.generateMobileView(bundleProducts, this.module.bundleCalculation)}
                ${this.options.mobileModal ? this.generateMobileModal(bundleProducts, this.module.bundleCalculation) : ''}
            </div>
        `;
  }

  generateHeader(offer) {
    const title = this.module?.title || offer?.title || 'عرض الحزمة';
    const subtitle =
      offer?.message ||
      'اختر المنتجات التي تريدها واحصل على خصم خاص عند الشراء معًا';

    return `
            <div class="universal-bundle__header">
                <h3 class="universal-bundle__title">${title}</h3>
                ${subtitle ? `<p class="universal-bundle__subtitle">${subtitle}</p>` : ''}
            </div>
        `;
  }

  generateDesktopView(products, pricing) {
    const productCards = products
      .map((product, index) =>
        this.generateProductCard(product, index, 'desktop'),
      )
      .join('<div class="universal-bundle__separator">+</div>');

    return `
            <div class="universal-bundle__desktop">
                <div class="universal-bundle__products">
                    ${productCards}
                </div>
                ${this.generatePricingSummary(pricing, 'desktop')}
            </div>
        `;
  }

  generateMobileView(products, pricing) {
    const compactImages = products
      .map(
        (product) =>
          `<div class="universal-bundle__compact-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
            </div>`,
      )
      .join('<div class="universal-bundle__compact-separator">+</div>');

    return `
            <div class="universal-bundle__mobile">
                <div class="universal-bundle__compact-products">
                    ${compactImages}
                </div>
                <button class="universal-bundle__expand-btn">
                    <span class="universal-bundle__expand-text">
                        أضافة <span class="number-of-products">${products.length}</span> منتجات: <span class="dynamic-total" id="dynamic-total">${salla.money({ amount: this.module.bundleCalculation?.finalTotal })}</span>
                    </span>
                    <svg class="universal-bundle__expand-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="m9 18 6-6-6-6"/>
                    </svg>
                </button>
            </div>
        `;
  }

  generateMobileModal(products, pricing) {
    const productList = products
      .map((product, index) =>
        this.generateProductCard(product, index, 'mobile'),
      )
      .join('');
    const title = this.module?.title || 'عرض الحزمة';

    return `
            <div class="universal-bundle__modal" id="universal-bundle-modal">
                <div class="universal-bundle__modal-backdrop"></div>
                <div class="universal-bundle__modal-content">
                    <div class="universal-bundle__modal-header">
                        <h3 class="universal-bundle__modal-title">${title}</h3>
                        <button class="universal-bundle__modal-close">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="m18 6-12 12"/>
                                <path d="m6 6 12 12"/>
                            </svg>
                        </button>
                    </div>
                    <div class="universal-bundle__modal-body">
                        <div class="universal-bundle__modal-products">
                            ${productList}
                        </div>
                        ${this.generatePricingSummary(pricing, 'mobile')}
                    </div>
                </div>
            </div>
        `;
  }

  generateProductCard(product, index, context) {
    const isMainProduct = index === 0;
    const cardClass = `universal-bundle__product ${context === 'mobile' ? 'universal-bundle__product--mobile' : ''}`;
    const productcheckboxClass =
      context === 'mobile' ? 'product-mobile-checkbox' : 'product-checkbox';

    return `
            <div class="${cardClass}" data-product-id="${product.id}" data-product-index="${index}">
                <div class="universal-bundle__product-image">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                    ${this.generateProductBadge(product, isMainProduct)}
                </div>
                <div class="universal-bundle__product-info">
                    <div class="universal-bundle__product-header">
                        ${isMainProduct ? '<span class="universal-bundle__product-label">المنتج الرئيسي:</span>' : ''}
                        <label class="universal-bundle__product-checkbox">
                            <input type="checkbox" class="universal-bundle__checkbox-input ${productcheckboxClass}" 
                                   ${isMainProduct && this.options.autoSelectMain ? 'checked disabled' : 'checked'}
                                    data-product-index="${index}" 
                                    data-product-id="${product.id}" 
                                    data-product-price="${product.price}" 
                                    data-has-option="${product.options && product.options.length > 0}"
                                   >
                            <span class="universal-bundle__checkbox-custom"></span>
                        </label>
                    </div>
                    <h4 class="universal-bundle__product-name">
                        <a   href="${product.url}" target="_blank" class="universal-bundle__product-link">
                            ${product.name}
                        </a>
                    </h4>
                    ${this.generateProductVariants(product)}
                    <div class="universal-bundle__product-pricing">
                        ${this.generateProductPrice(product)}
                        ${this.generateProductRating(product)}
                    </div>
                    ${this.options.enableQuantity ? this.generateQuantitySelector(product, index) : ''}
                </div>
            </div>
        `;
  }

  generateProductBadge(product, isMainProduct) {
    if (isMainProduct) {
      return '<div class="universal-bundle__product-badge universal-bundle__product-badge--main">Main</div>';
    }
    if (product.discount || product.price < product.originalPrice) {
      const discountPercentage =
        product.discount ||
        Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) *
            100,
        );
      return `<div class="universal-bundle__product-badge universal-bundle__product-badge--discount">${discountPercentage}%-</div>`;
    }
    if (product.isNew) {
      return '<div class="universal-bundle__product-badge universal-bundle__product-badge--new">New</div>';
    }
    return '';
  }

  generateProductVariants(product) {
    if (!product.options || product.options.length === 0) return '';

    return `
        <div class="product-options" data-product-id="${product.id}">
            <salla-product-options
            options="${product.options}"
            product-id="${product.id}">
            </salla-product-options>
        </div>
        `;
  }

  generateProductPrice(product) {
    const hasDiscount =
      product.originalPrice && product.originalPrice > product.price;

    return `
            <div class="universal-bundle__product-price" id="product-price-${product.id}">
                ${
                  hasDiscount
                    ? `<span class="universal-bundle__price-original product-regular-price-${product.id}" >${salla.money({ amount: product.originalPrice })}</span>`
                    : ''
                }
                <span class="universal-bundle__price-current product-current-price-${product.id}" >${salla.money({ amount: product.price })}</span>
            </div>
        `;
  }

  generateProductRating(product) {
    if (!product.rating) return '';

    const stars = Array.from({ length: 5 }, (_, i) => {
      const filled = i < Math.floor(product.rating);
      return `<span class="universal-bundle__star ${filled ? 'universal-bundle__star--filled' : ''}">${filled ? '★' : '☆'}</span>`;
    }).join('');

    return `
            <div class="universal-bundle__product-rating">
                <div class="universal-bundle__stars">${stars}</div>
                <span class="universal-bundle__rating-text">(${product.reviewCount || 0})</span>
            </div>
        `;
  }

  generateQuantitySelector(product, index) {
    return `
            <div class="universal-bundle__quantity">
                <label class="universal-bundle__quantity-label">Qty:</label>
                <div class="universal-bundle__quantity-controls">
                    <button type="button" class="universal-bundle__quantity-btn universal-bundle__quantity-btn--minus" data-product-index="${index}">-</button>
                    <input type="number" class="universal-bundle__quantity-input" value="${product.quantity || 1}" min="1" max="10" 
                           data-product-index="${index}">
                    <button type="button" class="universal-bundle__quantity-btn universal-bundle__quantity-btn--plus" data-product-index="${index}">+</button>
                </div>
            </div>
        `;
  }

  generatePricingSummary(pricing, context) {
    const ctaText =
      context === 'mobile'
        ? 'اضافة الى السلة'
        : `اضافة <span class="number-of-products">${this.module.bundleCalculation?.selectedProducts}</span> منتجات الى السلة`;

    return `
            <div class="universal-bundle__summary">
                <div class="universal-bundle__pricing">
                    <div class="universal-bundle__total">
                        <span class="universal-bundle__total-label">المجموع:</span>
                        <span class="universal-bundle__total-amount dynamic-total" id="dynamic-total" >${salla.money({ amount: this.module.bundleCalculation?.finalTotal })}</span>
                    </div>
                    <span class="universal-bundle__savings pricing-savings ${this.options.showSavings && this.module.bundleCalculation?.discountAmount > 0 ? '' : 'hidden'}">تخفيض ${salla.money({ amount: this.module.bundleCalculation?.discountAmount })}</span>
                </div>
                <button class="universal-bundle__cta fbt-add-to-cart-btn">
                    <span class="universal-bundle__cta-text">${ctaText}</span>
                    <svg class="universal-bundle__cta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6"/>
                    </svg>
                </button>
            </div>
        `;
  }

  setupEventListeners() {
    const modal = document.getElementById('universal-bundle-modal');
    if (!modal) return;

    const bundle = document.querySelector('.universal-bundle');
    if (!bundle) return;

    const expandBtn = bundle.querySelector('.universal-bundle__expand-btn');
    if (expandBtn) {
      expandBtn.addEventListener('click', () => this.openModal());
    }

    const modalCloseBtn = bundle.querySelector(
      '.universal-bundle__modal-close',
    );
    const modalBackdrop = bundle.querySelector(
      '.universal-bundle__modal-backdrop',
    );

    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', () => this.closeModal());
    }

    if (modalBackdrop) {
      modalBackdrop.addEventListener('click', () => this.closeModal());
    }
  }

  openModal() {
    const modal = document.getElementById('universal-bundle-modal');
    if (!modal) return;

    modal.classList.add('universal-bundle__modal--open');
    document.body.style.overflow = 'hidden';

    // Focus management for accessibility
    const closeBtn = modal.querySelector('.universal-bundle__modal-close');
    if (closeBtn) {
      closeBtn.focus();
    }
  }

  closeModal() {
    const modal = document.getElementById('universal-bundle-modal');
    if (!modal) return;

    modal.classList.remove('universal-bundle__modal--open');
    document.body.style.overflow = '';

    // Return focus to expand button
    const expandBtn = document.querySelector('.universal-bundle__expand-btn');
    if (expandBtn) {
      expandBtn.focus();
    }
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = UniversalBundleTemplate;
}
