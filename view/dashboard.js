const container = document.getElementById("container")
const back = document.getElementById('back')
const searchBtn = document.getElementById('searchBtn')
const cartContainer = document.getElementById('cartContainer')
const cartButton = document.getElementById('cartButton')

const userDataString = sessionStorage.getItem('userData');

      if (userDataString) {
          const userData = JSON.parse(userDataString); 
          console.log("Retrieved User Data:", userData);
      } else {
          console.log("No userData found in session storage");
      }

let click = 1
let prodHolder = []
let cart = []

document.getElementById('cartContainer').style.display = "none";


//display all shits
function display(){
fetch("/product/products")
  .then((response) => response.json())
  .then((data) =>
    data.forEach((item) => {
        prodHolder.push({
                        imageUrl: item.imageUrl,
                        item: item.item,
                        price: item.price,
                        quantity: item.quantity})
      container.innerHTML += `<div class="productCard"  ">
                    <img class="image" src=${item.imageUrl} alt="product image"> 
                    <span class="item"> ${item.item}</span> 
                    Price: <span class="price">${item.price}</span> Php 
                    Quantity: <span class="quantity">${item.quantity}</span>Pcs
                    <button class="addCart" >Add to cart</button></div>`;
    })
  )
  .catch((error) => console.error("Error:", error));
}
  display();
  //search shits
searchBtn.onclick =() => {
    let itemSearch = document.getElementById('itemSearch').value
    let lowerCased = itemSearch.toLowerCase().trim()

    if(lowerCased ==''){
      alert('field is empty')
    }else{
      const find = prodHolder.find(prodHolder => prodHolder.item === lowerCased);
      if(find ===undefined){
        alert('Can\'t find item')
      }else{
      container.innerHTML=``;
      container.innerHTML = `<div class="productCard" ">
                    <img class="image" src=${find.imageUrl} alt="product image" > 
                    <span class="item"> ${find.item}</span>
                    Price:<span class="price"> ${find.price}</span> Php  
                    Quantity:<span class="quantity"> ${find.quantity}</span> Pcs
                    <button class="addCart">Add to cart</button></div><br>`;
      }
  }

}
//display shits again
back.onclick =() =>{
  container.innerHTML=``
  display();
}

//add to cart

container.addEventListener('click', function (e) {
  if (e.target.classList.contains('addCart')) {
    let productCard = e.target.closest('.productCard');

    const img = productCard.querySelector('.image').src;
    const item = productCard.querySelector('.item').textContent;
    const price = productCard.querySelector('.price').textContent;

    if (!cart.some(cartItem => cartItem.item === item)) {
      
      const cartItem = { imageUrl: img, item: item, price: price, quantity: 1 };
      cart.push(cartItem);
      
      cartContainer.innerHTML += `<div class="productCart" >
          <img class="image" src="${cartItem.imageUrl}" alt="product image" >
          <span class="item">${cartItem.item}</span>
          Quantity: <span class="quantity">${cartItem.quantity}</span>
          Total Amount: <span class="price">${cartItem.price}</span> Php
          <button class="remove">Remove</button> <button class="order">Order</button></div>`;
    } else {
      
      const existingCartItem = cart.find(cartItem => cartItem.item === item);
      existingCartItem.quantity += 1; 
      existingCartItem.price = Number(existingCartItem.price)
      let total = existingCartItem.price * existingCartItem.quantity
      
      const productCartDivs = cartContainer.querySelectorAll('.productCart');
      productCartDivs.forEach(div => {
          const itemName = div.querySelector('.item').textContent;
          if (itemName === existingCartItem.item) {
              let quantitySpan = div.querySelector('.quantity');
              let priceSpan = div.querySelector('.price');
              quantitySpan.textContent = existingCartItem.quantity; 
              priceSpan.textContent = total
          }
      });
    }
  }
});

cartContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('remove')) {
    let removeCard = e.target.closest('.productCart'); 
  
    const itemSelected = removeCard.querySelector('.item').textContent;
   
    cart.pop({item:itemSelected})
    removeCard.remove()
    console.log(cart)
      }
    })

cartButton.onclick = ()=> {
  if(click % 2 == 0){
    
  document.getElementById('cartContainer').style.display = "none";
  click += 1
  }else{
  document.getElementById('cartContainer').style.display = "block";
  click += 1
  }
}

//order route
cartContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('order')) {
    let order = e.target.closest('.productCart'); 
    
    const itemSelected = order.querySelector('.item').textContent;
    console.log(`${itemSelected} is ordered biatch`)

    cart.pop({item:itemSelected})
    console.log(`remaining items in the cart`, cart)
    order.remove()
      }
    })