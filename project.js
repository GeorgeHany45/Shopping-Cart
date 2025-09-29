fetch('https://dummyjson.com/products')
  .then(res => res.json())
  .then(data => {
    const productsContainer = document.getElementById('products');
     renderProducts(data.products);
    filteredcategories(data.products);
    addtocart(data.products)
    searchingitem(data.products)
  })
  .catch(err => console.error('Error fetching products:', err));

  
  
  function renderProducts(products) {
  const productsContainer = document.getElementById('products');
  productsContainer.innerHTML = "";

  products.forEach(product => {
    const div = document.createElement('div');
    div.className = "productitems"
    div.innerHTML = `
      <img src="${product.thumbnail}" alt="${product.title}">
      <h3>${product.title}</h3>
      <p>Price: $${product.price}</p>
      <button class="cartbutton">Add to Cart</button>
    `;
    productsContainer.appendChild(div);
    
  });
}



  function filteredcategories(products) {
  
    const filteredcat = document.querySelectorAll('input[type=checkbox]')

    filteredcat.forEach((element)=>{
      element.addEventListener("click",function(){
     const checkedcat = Array.from(document.querySelectorAll('input[data-type=category]'))
        .filter(cat => cat.checked)
        .map(cat => cat.value);

      const pricecat = Array.from(document.querySelectorAll('input[data-type=price]'))
      .filter(price=>price.checked)
      .map(price=>price.value);

        let filteredproducts = products;

        if (checkedcat.length > 0) {
        filteredproducts = products.filter(product =>
          checkedcat.includes(product.category)
        );
      }
      if(pricecat.length>0){
        filteredproducts = filteredproducts.filter((product)=>{
          return pricecat.some(price =>{
            if(price==="under25") return product.price < 25;
            if(price==="range") return product.price >= 25 && product.price <= 50;
            if(price==="above50") return product.price > 50;
          })
        })
      }
       renderProducts(filteredproducts);
        addtocart(filteredproducts);
        searchingitem(filteredproducts);

      })
    })
  
}


function addtocart(products) {
  const productitems = document.querySelectorAll(".productitems");
  const cartbox = document.querySelector(".cartbox");

 
  let savedCart = JSON.parse(localStorage.getItem("cart")) || [];

  
  renderCart(savedCart);

  
  productitems.forEach((element, index) => {
    element.querySelector(".cartbutton").addEventListener("click", function () {
       const product = { ...products[index], count: 1, purchaseMessage: "" }; 
  savedCart.push(product);

  localStorage.setItem("cart", JSON.stringify(savedCart));
  renderCart(savedCart);
    });
  });

  
  function renderCart(cart) {
    cartbox.innerHTML = "";

    if (cart.length === 0) {
      cartbox.innerHTML = `<p class="empty-msg">The Cart is empty</p>`;
      localStorage.removeItem("cart");
      return;
    }

    cart.forEach(product => {
      const div = document.createElement("div");
      div.className = "cartproduct";
      div.innerHTML = `
        <img src="${product.thumbnail}" alt="${product.title}">
        <h3>${product.title}</h3>
        <p>Price: $${product.price}</p>
        <div class="itemcounter">
          <button class="plus">+</button>
          <p class="counter">${product.count}</p>
          <button class="minus">-</button>
        </div>
        <button class="purchasebutton">Purchase</button>
        <button class="removebutton">Remove</button>
        <p class="purchase-message"></p>
      `;
      cartbox.appendChild(div);

      const counter = div.querySelector(".counter");
      const plus = div.querySelector(".plus");
      const minus = div.querySelector(".minus");
      const removebutton = div.querySelector(".removebutton");
      const purchasebutton = div.querySelector(".purchasebutton");
      const purchaseMessage = div.querySelector(".purchase-message");

      
      plus.addEventListener("click", function () {
        product.count++;
        counter.innerHTML = product.count;
        localStorage.setItem("cart", JSON.stringify(savedCart));
      });

      
      minus.addEventListener("click", function () {
        if (product.count > 0) {
          product.count--;
        }
        counter.innerHTML = product.count;
        localStorage.setItem("cart", JSON.stringify(savedCart));
      });

     
      removebutton.addEventListener("click", function () {
        const index = savedCart.indexOf(product);  
    if (index > -1) {
    savedCart.splice(index, 1); 
    }

  localStorage.setItem("cart", JSON.stringify(savedCart));
  renderCart(savedCart);
      });

     
      if (product.purchaseMessage !== undefined) {
  purchaseMessage.innerHTML = product.purchaseMessage;
}

     
      purchasebutton.addEventListener("click", function () {
        if (product.count === 0) {
          product.purchaseMessage = "You should select at least one item";
        } else {
          product.purchaseMessage =
            `Total Price: ${(product.count * product.price).toFixed(2)}$`;
        }
        purchaseMessage.innerHTML = product.purchaseMessage;

  
  localStorage.setItem("cart", JSON.stringify(savedCart));
      });
    });
  }
}




function searchingitem(products){
  const searchtext = document.querySelector(".searchtext")
  const searchbutton = document.querySelector(".searchbutton")
  searchbutton.addEventListener("click",function(){
      const searchwords = searchtext.value.toLowerCase().trim()
    let searchedproducts = products.filter((product)=> product.title.toLowerCase().includes(searchwords))
    renderProducts(searchedproducts)
    addtocart(searchedproducts)
  })
}
  
