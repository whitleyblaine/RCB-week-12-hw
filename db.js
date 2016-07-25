//INITIALIZES THE NPM PACKAGES USED//
var mysql = require('mysql');
var inquirer = require('inquirer');

//INITIALIZES THE CONNECTION VARIABLE TO SYNC WITH A MYSQL DATABASE//
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root", //Your username//
  password: "E$*G8Y1el6rn0AshUb6YY5Nm6F62103$", //Your password//
  database: "bamazon"
})

//CREATES THE CONNECTION WITH THE SERVER AND MAKES THE TABLE UPON SUCCESSFUL CONNECTION//
connection.connect(function(err) {
  if (err) {
    console.error("error connecting: " + err.stack);
  }
  makeTable();
})

//FUNCTION TO GRAB THE PRODUCTS TABLE FROM THE DATABASE AND PRINT RESULTS TO CONSOLE//
var makeTable = function() {
  //SELECTS ALL OF THE DATA FROM THE MYSQL PRODUCTS TABLE - SELECT COMMAND!
  connection.query('SELECT * FROM products', function(err, res) {
    if (err) throw err;
    //PRINTS THE TABLE TO THE CONSOLE WITH MINIMAL STYLING//
    var tab = "\t";
    console.log("ItemID\tProduct Name\tDepartment Name\tPrice\t# In Stock");
    console.log("--------------------------------------------------------");
    //FOR LOOP GOES THROUGH THE MYSQL TABLE AND PRINTS EACH INDIVIDUAL ROW ON A NEW LINE//
    for (var i = 0; i < res.length; i++) {
        console.log(res[i].item_id + tab + res[i].product_name + tab + res[i].department_name + tab + res[i].price + tab + res[i].stock_quantity);
    }
    console.log("--------------------------------------------------------");
    //RUNS THE CUSTOMER'S PROMPTS AFTER CREATING THE TABLE. SENDS res SO THE promptCustomer FUNCTION IS ABLE TO SEARCH THROUGH THE DATA//
    promptCustomer(res);
  });
};

//FUNCTION CONTAINING ALL CUSTOMER PROMPTS//
var promptCustomer = function(res) {
  //PROMPTS USER FOR WHAT THEY WOULD LIKE TO PURCHASE//
  inquirer.prompt([{
    type: 'input',
    name: 'choice',
    message: 'What would you like to purchase?'
  }]).then(function(val) {
    //SET THE VAR correct TO FALSE SO AS TO MAKE SURE THE USER INPUTS A VALID PRODUCT NAME//
    var correct = false;
    //LOOPS THROUGH THE MYSQL TABLE TO CHECK THAT THE PRODUCT THEY WANTED EXISTS//
    for (var i = 0; i < res.length; i++) {
      //1. TODO: IF THE PRODUCT EXISTS, SET correct = true and ASK THE USER TO SEE HOW MANY OF THE PRODUCT THEY WOULD LIKE TO BUY//
      if (val.choice == res[i].product_name) {
        var quantity = res[i].stock_quantity;
        var id = res[i].item_id;
        var name = res[i].product_name;
        var price = res[i].price;
        correct = true;
        var checkQuantity = function() {
          inquirer.prompt([{
            type: 'input',
            name: 'quantity',
            message: 'How many would you like to buy?'
          }]).then(function(response) {
            if (response.quantity < quantity) {
              connection.query(`UPDATE products SET stock_quantity=${quantity - response.quantity} WHERE item_id=${id}`, function(err, res) {
                if (err) throw err;

                console.log(`Congratulations! You are the new owner of ${response.quantity} ${name}(s), for the low price of $${price * response.quantity}!!`);
                return;
              });
            } else {
              console.log("Please enter a quantity less than " + quantity);
              checkQuantity();
            };
          });
        };
        checkQuantity();
      };
    };
  });
};
     	//2. TODO: CHECK TO SEE IF THE AMOUNT REQUESTED IS LESS THAN THE AMOUNT THAT IS AVAILABLE//
      //3. TODO: UPDATE THE MYSQL TO REDUCE THE StockQuanaity by the THE AMOUNT REQUESTED -- UPDATE COMMAND!
      //4. TODO: SHOW THE TABLE again by calling the function that makes the table

    //IF THE PRODUCT REQUESTED DOES NOT EXIST, RESTARTS PROMPT//



