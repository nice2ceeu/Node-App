const container = document.getElementById("container")
const back = document.getElementById('back')
const searchBtn = document.getElementById('searchBtn')
const cartContainer = document.getElementById('cartContainer')
const cartButton = document.getElementById('cartButton')
const userCard = document.getElementById('userCard')
const userButton = document.getElementById('userButton')
let counter = document.getElementById('counter')



let userData;
let profile;

//retrieving static infos from login module
const userDataString = sessionStorage.getItem('userData');
  if (userDataString) {
    userData = JSON.parse(userDataString); 
  } else {
   window.location.href = 'index.html'
}

//func to get user's shits
async function get(){
  const data = {
    email: userData.email
}

try {
    const response = await fetch('/user/logged', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (response.ok) {
        profile = await response.json();
        userButton.innerHTML =`<button id="userButton">
				<img src=${profile.picture}>
				
			</button>`
        userCard.innerHTML =`<div class="userCard">
        <img src="${profile.picture}">
			<span id="userName">${profile.name}</span><br>
			<hr>
			<span id="userEmail">${profile.email}</span><br>
			<span id="userAge">${profile.age}</span><br>
			<span id="userId">${profile._id}</span>
			<hr>
      <button id="logoutButton">Logout</button></div>
			`;
      const logoutButton = document.getElementById('logoutButton')

        //logout and clear infos
logoutButton.onclick = ()=> {

  sessionStorage.clear
  window.location.href = "index.html"
}
        profile.cart.forEach((cartOfUser)=>{
          cart.push({
            imageUrl:cartOfUser.imageUrl,
            item:cartOfUser.item,
            price:cartOfUser.price,
            quantity:cartOfUser.quantity})
        
        cartContainer.innerHTML += `<div class="productCart" >
                  <img class="image" src="${cartOfUser.imageUrl}" alt="product image" >
                  <span class="item">${cartOfUser.item}</span>
                  <span class="price">${cartOfUser.price}</span>
                  <span class="quantity">${cartOfUser.quantity}</span>
                  <button class="remove">Remove</button> <button class="order">Order</button></div>`;
        
            let counts = Object.keys(cart).length
            counter.textContent = counts
        
        })

    }if(!response.ok){
    const message = await response.text();
    alert(message)
}
} catch (error) {
    alert(error);
}
}
//fetching user's cart and info
get();



let cartClick = 1
let profileClick = 1
let prodHolder = []
let cart = []


if(!userData.cart){
    let cntr = Object.keys(cart).length
    counter.textContent = cntr
}else{
 
}
//hidden container
cartContainer.style.display = "none";
userCard.style.display = "none";

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
      container.innerHTML += `<div class="productCard">
					<img class="image" src=${item.imageUrl} alt="image"/>
					<span class="item">${item.item}</span>
					<hr>
					<span class="price">${item.price}</span>
					<span class="quantity"> ${item.quantity}</span>
					<button class="addCart">Add to cart</button>
				</div>`
    }
  

  ))
  .catch((error) => console.error("Error:", error));
}
//shit displayed
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
      container.innerHTML = `<div class="productCard">
					<img class="image" src=${find.imageUrl} alt="image"/>
					<span class="item">${find.item}</span>
					<hr>
					<span class="price">${find.price}</span>
					<span class="quantity"> ${find.quantity}</span>
					<button class="addCart">Add to cart</button>
				</div>`

      }
  }

}

//display shits again
back.onclick =() =>{
  container.innerHTML=``
  display();
}

//add to cart

container.addEventListener('click', async function (e) {
  if (e.target.classList.contains('addCart')) {
    let productCard = e.target.closest('.productCard');

    const img = productCard.querySelector('.image').src;
    const item = productCard.querySelector('.item').textContent.toLowerCase().trim();
    const price = productCard.querySelector('.price').textContent;

    if (!cart.some(cartItem => cartItem.item === item)) {
      
      const cartItem = { imageUrl: img, item: item, price: price, quantity: 1 };
      cart.push(cartItem);
      
      cartContainer.innerHTML += `<div class="productCart" >
          <img class="image" src="${cartItem.imageUrl}" alt="product image" >
          <span class="item">${cartItem.item}</span>
          <span class="price">${cartItem.price}</span>
          <span class="quantity"> ${cartItem.quantity}</span>
          <button class="remove">Remove</button> <button class="order">Order</button></div>`;

          //adding item request code here

          const data = {
            userId: userData._id,
            imageUrl: cartItem.imageUrl,
            item: cartItem.item,
            price: cartItem.price,
            quantity: cartItem.quantity
        };
        
        try {
            const response = await fetch('/user/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
        
            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(errorMessage);
            }
        
            const result = await response.text();
            alert(result); 
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
        
        console.log(cart);
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

      const data = {
        userId: userData._id,
        item: existingCartItem.item,
        price: total,
        quantity: existingCartItem.quantity
        

    };
    
    try {
        const response = await fetch('/user/updateCart', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
    
        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(errorMessage);
        }
    
        const result = await response.text();
        alert(result); 
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
      console.log(cart)
    }
  }
  let cntr = Object.keys(cart).length
    counter.textContent = cntr
});
//removing shit
cartContainer.addEventListener('click', async function (e) {
  if (e.target.classList.contains('remove')) {
    let removeCard = e.target.closest('.productCart'); 
  
    const itemSelected = removeCard.querySelector('.item').textContent;
   
    cart.pop({item:itemSelected})
    removeCard.remove()
    console.log(cart)


    
    //removing item request code here
    const data={
      userId: userData._id,
      item: itemSelected
    };
     try {
      const response = await fetch('/user/deleteItem', {
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
      });
  
      if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(errorMessage);
      }
  
      const result = await response.text();
      alert(result); 
  } catch (error) {
      alert(`Error: ${error.message}`);
  }
      }

      let cntr = Object.keys(cart).length
    counter.textContent = cntr
    })

cartButton.onclick = ()=> {
  if(cartClick % 2 == 0){
    
  document.getElementById('cartContainer').style.display = "none";
  cartClick += 1
  }else{
  document.getElementById('cartContainer').style.display = "block";
  cartClick += 1
  }
}
userButton.onclick = ()=> {
  if(profileClick % 2 == 0){
    
  document.getElementById('userCard').style.display = "none";
  profileClick += 1
  }else{
  document.getElementById('userCard').style.display = "block";
  profileClick += 1
  }
}
//order route
cartContainer.addEventListener('click',async function (e) {
  if (e.target.classList.contains('order')) {
    let order = e.target.closest('.productCart'); 
    
    const itemSelected = order.querySelector('.item').textContent;
    const qtySelected = order.querySelector('.quantity').textContent
    const numQuantity = Number(qtySelected)
    console.log(`${itemSelected} is ordered biatch`)

    const data = {
      userId:userData._id,
      item: itemSelected,
      quantity: numQuantity
  };
    // updating products quantity
  try {
      const response = await fetch('/product/updateProd', {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
      });
  
      if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(errorMessage);
      }
        
      const result = await response.text();
      alert(result); 
  } catch (error) {
      alert(`Error: ${error.message}`);
  }
  //removing ordered item from cart
  try {
    const response = await fetch('/user/orderItem', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
    }
      
    const result = await response.text();
    alert(result); 
} catch (error) {
    alert(`Error: ${error.message}`);
}
  
    cart.pop({item:itemSelected})
    order.remove()
    let cntr = Object.keys(cart).length
    counter.textContent = cntr
      }
    })

  



