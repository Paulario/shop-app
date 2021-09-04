import { shop, fadeIn, fadeOut } from './shop.js';

{
    let btns = document.querySelectorAll('input[type="button"], button');

    btns.forEach(elem => {
        elem.addEventListener('mousedown', function() {
            this.classList.add('keydown');
        });
        elem.addEventListener('mouseup', function() {
            this.classList.remove('keydown');
        });
    });

    let inputForm = document.forms.inputForm;
    let displayForm = document.forms.displayForm;
    let modalBg = document.querySelector('.modal-background');

    function updateDisplayForm() {
        displayForm.balance.value = shop.getBalance() + ' uah';
        displayForm.pepsi.value = shop.getStock().pepsi;
        displayForm.beer.value = shop.getStock().beer;
        displayForm.wine.value = shop.getStock().wine;
    }
    function displayBucket() {
        inputForm.bucket.value = "";
        shop.getBucket().forEach(elem => {
            inputForm.bucket.value += `${elem.name} (${elem.qty}x)\n`;
        });
        document.querySelector('#total').textContent = shop.getTotal();
    }
    inputForm.add.addEventListener('click', function() {
        let qty = inputForm.amount.value
        if(qty){
            try {
                let item = inputForm.item.value;
                shop.addToBucket(item, qty);
                inputForm.amount.value = "";
                displayBucket();
            } catch(err) {
                modalBg.innerHTML = `
                    <div class="modal-window">
                        <div class="wrapper">
                            <div class="modal-window-title">[Error]</div>
                            <div class="modal-window-content">Cause: ${err.message}</div>
                        </div>
                    </div>`;
                let options = { elem: modalBg, display: 'flex', time: 500 };
                fadeIn(options);
            }
        } else {
            inputForm.amount.classList.add('otl-red');
            setTimeout(() => {
                inputForm.amount.classList.remove('otl-red');
            }, 2000);
        }
    });

    modalBg.addEventListener('click', function() {
        let options = { elem: modalBg, display: 'flex', time: 500 };
        fadeOut(options);
    });

    inputForm.cancel.addEventListener('click', (event) => {
        event.preventDefault();
        shop.cancelLastOrder();
        displayBucket();
    });

    inputForm.clear.addEventListener('click', (event) => {
        event.preventDefault();
        shop.emptyBucket();
        displayBucket();
    });

    inputForm.buy.addEventListener('click', function() {
        shop.buy();
        updateDisplayForm();
        document.querySelector('#check').innerHTML = printCheck();
        shop.emptyBucket();
        displayBucket();
    });

    updateDisplayForm();
    function printCheck() {
        let out = `<p>-------------------</p>`;
        shop.getBucket().forEach(elem => {
            out += `<p>${elem.name} (${elem.qty}x)</p>`;
        });
        out += `<br><p>Total: ${shop.getTotal()} uah</p>`;
        out += `<p>-------------------</p>`;
        return out;
    }
}

