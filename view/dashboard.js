const container = document.getElementById("container")
const back = document.getElementById('back')
const searchBtn = document.getElementById('searchBtn')
const cartContainer = document.getElementById('cartContainer')
const cartButton = document.getElementById('cartButton')



let prodHolder = []
let cart = []

//display all shits
fetch("/product/products")
  .then((response) => response.json())
  .then((data) =>
    data.forEach((item) => {
        prodHolder.push({
                        imageUrl: item.imageUrl,
                        item: item.item,
                        price: item.price,
                        quantity: item.quantity})
      container.innerHTML += `<div class="productCard" style="border: 2px solid black; width: 150px; height: 220px;  ">
                    <img class="image" src=${item.imageUrl} alt="fruit image" height=100px > <br>
                    <strong><span class="item"> ${item.item}</span> </strong><br>
                    Price:<span class="price"> ${item.price}</span> Php <br> 
                    Quantity:<span class="quantity"> ${item.quantity}</span> Pcs<br>
                    <br><button class="addCart" >Add to cart</button></div><br>`;
    })
  )
  .catch((error) => console.error("Error:", error));


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
      container.innerHTML = `<div class="productCard" style="border: 2px solid black; width: 150px; height: 220px;  ">
                    <img class="image" src=${find.imageUrl} alt="fruit image" height=100px > <br>
                    <strong><span class="item"> ${find.item}</span></strong><br>
                    Price:<span class="price"> ${find.price}</span> Php <br> 
                    Quantity:<span class="quantity"> ${find.quantity}</span> Pcs<br>
                    <br><button class="addCart">Add to cart</button></div><br>`;
      }
  }
  
}
//display shits again
back.onclick =() =>{
  container.innerHTML=``
  prodHolder.forEach(one => {
    container.innerHTML += `<div class="productCard" style="border: 2px solid black; width: 150px; height: 220px;  ">
                    <img class="image" src=${one.imageUrl} alt="fruit image" height=100px > <br>
                    <strong><span class="item"> ${one.item}</span></strong><br>
                    Price:<span class="price"> ${one.price}</span> Php <br> 
                    Quantity:<span class="quantity"> ${one.quantity}</span> Pcs<br>
                    <br><button  class="addCart" >Add to cart</button></div><br>`;
  })
}

//add to cart

container.addEventListener('click', function (e) {
  if (e.target.classList.contains('addCart')) {
    let productCard = e.target.closest('.productCard');

    const img = productCard.querySelector('.image').src;
    const item = productCard.querySelector('.item').textContent;
    const price = productCard.querySelector('.price').textContent;

     
    if (!cart.some(cartItem => cartItem.item === item)) {
      const cartItem = { imageUrl: img, item: item, price: price };
      cart.push(cartItem);
      console.log(cart)
      cartContainer.innerHTML += `<div class="productCart" style="border: 2px solid black; width: 150px; height: 220px;">
                      <img class="image" src=${cartItem.imageUrl} alt="product image" height=100px > <br>
                      <strong><span class="item"> ${cartItem.item}</span></strong><br>
                      Price:<span class="price"> ${cartItem.price}</span> Php <br> 
                      <br><button class="remove">Remove</button> <button class="order">Order</button></div><br>`;
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
