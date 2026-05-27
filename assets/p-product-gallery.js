// @ts-nocheck


class PProductGallery extends HTMLElement {
    constructor(){
        super();
        this.imageContainersArray = this.querySelectorAll('.image-container');
        this._onVariantChange = this._onVariantChange.bind(this);
        this.variantPickerLabelsArray = document.querySelectorAll('variant-picker fieldset label');
        
    }
    connectedCallback() {
        this.removeAttribute('no-js');
        document.addEventListener('pango:variant:change', this._onVariantChange);
        console.log("this is the variant picker element:", this.variantPickerLabelsArray);
        this.showCheckedvariantOnFirstLoad()
    }

    disconnectedCallback() {
        document.removeEventListener('pango:variant:change', this._onVariantChange);
    }

    _onVariantChange(event) {
        const selectedColor = event.detail.toLowerCase();

        this.imageContainersArray.forEach((container) => {
            const containerColor = container.dataset.alt
                .replace('#Color_', '')
                .toLowerCase();
            
            if (containerColor === selectedColor) {
                container.classList.remove('hidden');
            } else {
                container.classList.add('hidden');
            }
        });
    }

    showCheckedvariantOnFirstLoad(){
        const checkedVariantInput = document.querySelector('variant-picker fieldset input:checked');
        if(checkedVariantInput){
            const selectedColor = checkedVariantInput.value.toLowerCase();
            this.imageContainersArray.forEach((container) => {
                const containerColor = container.dataset.alt
                    .replace('#Color_', '')
                    .toLowerCase();
                
                if (containerColor === selectedColor) {
                    container.classList.remove('hidden');
                } else {
                    container.classList.add('hidden');
                }
            });
        }
    }

}

customElements.define('p-product-gallery', PProductGallery );