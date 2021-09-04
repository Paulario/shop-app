export let shop = (function() {
    let balance = 1000;
    let prices = {
        beer: 24,
        wine: 119,
        pepsi: 15,
    };
    let stock = {
        beer: 100,
        wine: 50,
        pepsi: 80,
    };
    let bucket = [];
    function getTotal(){
        let total = 0;
        bucket.forEach(elem => {
            total += prices[elem.name] * elem.qty;
        });
        return total;
    }
    function addToBucket(name, qty) {
        let totalOrdered = 0;
        getBucket().forEach(item => {
            if(item.name === name){
                totalOrdered += item.qty;
            }
        });
        if(!stock[name]){
            throw new ReferenceError(`No such item (${name})`);
        } else if(qty > stock[name] - totalOrdered){
            throw new RangeError(`Not enough ${name}`);
        } else{
            bucket.push({ name: name, qty: +qty });
        }
    }
    function getBalance() {
        return balance;
    }
    function cancelLastOrder(){
        bucket.splice(bucket.length - 1, 1);
    }
    function getBucket() {
        return bucket;
    }
    function replenish(name, qty) {
        if(stock[name]){
            stock[name] += qty;
        } else {
            stock[name] = qty;
        }
    }
    function emptyBucket() {
        bucket = [];
    }
    function buyOrdered(){
        let total = getTotal();
        bucket.forEach(elem => {
            stock[elem.name] -= elem.qty;
        });
        balance += total;
    }
    function getStock(){
        return Object.assign({}, stock);
    }
    return {
        getBucket: getBucket,
        emptyBucket: emptyBucket,
        buy: buyOrdered,
        replenish: replenish,
        cancelLastOrder: cancelLastOrder,
        getTotal: getTotal,
        addToBucket: addToBucket,
        getStock:  getStock,
        getBalance: getBalance,
    }
})();


export function fadeOut({ elem, time=1000, callback, display }){
    let start = new Date();
    let timePassed = new Date() - start;
    let frameTimeGap = time / 120;
    let timerID;
    elem.style.opacity = 1;
    elem.style.display = display || 'block';
    timerID = setInterval(() => {
        if(timePassed - 200 > time){
            elem.style.display = 'none';
            clearInterval(timerID);
            if(callback){
                callback(elem, time);
            }
            return;
        } else {
            timePassed = new Date() - start;
            fade(timePassed)
        }
    }, frameTimeGap);
    function fade(timePassed) {
        elem.style.opacity = 1 - timePassed / time;
    }
}

export function fadeIn({elem, time, callback, display}){
    let start = new Date();
    let timePassed = new Date() - start;
    let frameTimeGap = time / 120;
    let timerID;

    elem.style.opacity = 0;
    elem.style.display = display || 'block';

    timerID = setInterval(() => {
        if(timePassed > time){
            clearInterval(timerID);
            if(callback){
                callback(elem, time);
            }
            return;
        }

        timePassed = new Date() - start;
        fade(timePassed)
    }, frameTimeGap);

    function fade(timePassed) {
        elem.style.opacity = timePassed / time;
    }
}
