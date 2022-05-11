const searchProduct = (arr, value) => {
  var result = { status: "" };
  for (let i in arr) {
    if (arr[i].id == value) {
      result.status = "success";
      result.product = arr[i];
      return result;
    }
  }
  if (result.status === "") {
    result.status = "error";
    result.message =
      "Invalid product id. Valid product id range is 100 to 110.";
    return result;
  }
};

const searchPostalCode = (arr, value) => {
  var result = { status: "" };
  for (let i in arr) {
    if (arr[i].postal_code == value) {
      result.status = "success";
      result.distance_in_kilometers = arr[i].distance_in_kilometers;
      return result;
    }
  }
  if (result.status === "") {
    result.status = "error";
    result.message = "Invalid postal code, valid ones are 465535 to 465545.";
    return result;
  }
};

const addToCart = (arr, value, quantity) => {
  var result = { status: "" };
  for (let i in arr) {
    if (arr[i].id == value) {
      result.status = "success";
      result.message = "Item has been added to cart";
      return result;
    }
  }
  if (result.status === "") {
    result.status = "error";
    result.message = "Invalid product id";
    return result;
  }
};

const getCartItems = (arr, products) => {
  var result = { status: "" };
  result.status = "success";
  result.message = "Item available in the cart";

  for(let i in arr){
    for(let j in products){
      if(arr[i].product_id === products[j].id){
        arr[i].description = products[j].name;
        break;
      }
    }
  }
  result.item = arr;
  return result;
}

const emptyCartItems = (value) => {
  var result = { status: ""};
  if(value === "empty_cart" ){
    result.status = "success";
    result.message = "All items have been removed from the cart !";
    return result;
  }else{
    result.status="error";
    result.message = "Error state. Bad request.";
    return result;
  }
}

const totalCharge = (arr, products, distance) => {
  var result = { status: ""};
  var total_weight = 0;
  var product_price = 0;
  var total_price=0;
  arr.map( ele => {
    for(let i in products){
      if(ele.product_id === products[i].id){
        total_weight += (products[i].weight_in_grams * ele.quantity);
        product_price += (products[i].price * ele.quantity) - (products[i].price * ele.quantity) * (products[i].discount_percentage/100);
      }
    }
  })
  total_weight /=1000;
  product_price=Math.round((product_price + Number.EPSILON) * 100) / 100
  if(distance<5.0){
    (total_weight<=2.0)?(total_price=product_price+12):((total_weight>=2.01 && total_weight<=5)?(total_price=product_price+14):
     ((total_weight>=5.01 && total_weight<=20)?(total_price=product_price+16):(total_price=product_price+21)))
  }
  else if(distance >=5 && distance <= 20){
    (total_weight<=2.0)?(total_price=product_price+15):((total_weight>=2.01 && total_weight<=5)?(total_price=product_price+18):
    ((total_weight>=5.01 && total_weight<=20)?(total_price=product_price+25):(total_price=product_price+35)))
  }

  else if(distance >=21 && distance <= 50){
    (total_weight<=2.0)?(total_price=product_price+20):((total_weight>=2.01 && total_weight<=5)?(total_price=product_price+24):
    ((total_weight>=5.01 && total_weight<=20)?(total_price=product_price+30):(total_price=product_price+50)))

  }
  else if(distance >=51 && distance <= 500){
    (total_weight<=2.0)?(total_price=product_price+50):((total_weight>=2.01 && total_weight<=5)?(total_price=product_price+55):
    ((total_weight>=5.01 && total_weight<=20)?(total_price=product_price+80):(total_price=product_price+90)))

  }
  else if(distance >=501 && distance <= 800){
    (total_weight<=2.0)?(total_price=product_price+100):((total_weight>=2.01 && total_weight<=5)?(total_price=product_price+110):
    ((total_weight>=5.01 && total_weight<=20)?(total_price=product_price+130):(total_price=product_price+150)))

  }else{
    (total_weight<=2.0)?(total_price=product_price+220):((total_weight>=2.01 && total_weight<=5)?(total_price=product_price+250):
     ((total_weight>=5.01 && total_weight<=20)?(total_price=product_price+270):(total_price=product_price+300)))
  }
  
  total_price=total_price.toLocaleString("en-US");
  var cost = "Total value of your shopping cart is - $"+total_price;
  result.status = "success";
  result.message = cost;
  return result;

}

module.exports = {
  searchProduct,
  searchPostalCode,
  addToCart,
  getCartItems,
  emptyCartItems,
  totalCharge
};
