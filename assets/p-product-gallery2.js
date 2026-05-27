// @ts-nocheck

console.log("Product gallery 22 initialized");

class PProductGallery2 extends HTMLElement {
    constructor(){
        super();
        this._onVariantChange = this._onVariantChange.bind(this);
        this.productHandle = this.dataset.productHandle;
        this.media = [];
        this.selectedVariantImages = [];
        this.selectedColor = null;
        this.colorIndex = {};
        this.colorHTMLIndex = {};
        this._hasPreloaded = false;
    }

    connectedCallback() {
        document.addEventListener('pango:variant:change', this._onVariantChange);
        this.storeProductMedia();
    }

    disconnectedCallback() {
        document.removeEventListener('pango:variant:change', this._onVariantChange);
    }

    async storeProductMedia(){
        const response = await fetch(`/products/${this.productHandle}.js`);
        const data = await response.json();
        console.log("API response:", data);
        this.media = data.media;
        console.log("Product media stored in gallery 2:", this.media);
        this._buildColorIndex();
    }

    _buildColorIndex(){
        this.colorIndex = {};
        this.colorHTMLIndex = {};

        this.media.forEach(mediaItem => {
            const alt = mediaItem.alt || '';
            const colorMatch = alt.match(/#Color_([^_]+)/);

            if (colorMatch) {
                const color = colorMatch[1].toLowerCase().trim();

                if (!this.colorIndex[color]) {
                    this.colorIndex[color] = [];
                    this.colorHTMLIndex[color] = '';
                }

                this.colorIndex[color].push(mediaItem);

                const imgSrc = mediaItem.preview_image?.src || mediaItem.src;
                const resizedSrc = imgSrc.replace(/(\.[^.]+)(\?|$)/, '_800x$1$2');

                this.colorHTMLIndex[color] += `
                    <div class="image-container" data-alt="${alt}">
                        <img src="${resizedSrc}" alt="${alt}" loading="lazy" />
                    </div>
                `;
            }
        });

        console.log("Color index built:", this.colorIndex);
        console.log("Color HTML index built:", this.colorHTMLIndex);
    }

    _preloadImages(){
        Object.values(this.colorIndex).flat().forEach(mediaItem => {
            const imgSrc = mediaItem.preview_image?.src || mediaItem.src;
            const resizedSrc = imgSrc.replace(/(\.[^.]+)(\?|$)/, '_800x$1$2');
            const img = new Image();
            img.src = resizedSrc;
        });
        console.log("Images preloaded");
    }

    _onVariantChange(event) {
        this.selectedColor = event.detail.toLowerCase();
        console.log("Variant changed in gallery 2:", this.selectedColor);
        this.updateGallery();

        if (!this._hasPreloaded) {
            this._preloadImages();
            this._hasPreloaded = true;
        }
    }

    updateGallery(){
        this.innerHTML = this.colorHTMLIndex[this.selectedColor] || '';
        console.log("Gallery updated for color:", this.selectedColor);
    }
}

customElements.define('p-product-gallery2', PProductGallery2);