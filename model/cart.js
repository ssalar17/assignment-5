var shopCart = [];

module.exports.addPackage = (package) => {
    console.log("Adding cart" + package.title);
    return new Promise((resolve,reject) => {
        shopCart.push(package);
        resolve(shopCart.length);
    });
}

module.exports.removePackage = (package) =>{
    return new Promise((resolve,reject)=>{
        for(var i = 0; i < shopCart.length; i++) {
            if(shopCart[i].title == package) {
                shopCart.splice(i,1);
                i = shopCart.length;
            }
        }
        resolve();
    });
}

module.exports.getCart = () =>{
    return new Promise((resolve, reject) =>{
            resolve(shopCart);
    });
}

module.exports.checkout = () =>{
    return new Promise((resolve, reject) =>{
        var price=0;
        if(shopCart){
            shopCart.forEach(x => {
                price += x.price;
            });
        }
        resolve(price);
    });
}