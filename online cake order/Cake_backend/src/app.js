
const express = require("express");
const app = express();
let multer = require('multer')
const path = require("path");
const hbs = require("hbs");
const mongoose = require("mongoose");

require("./db/conn");
const Register = require("./models/register");
const NewCakes = require("./models/admin_page");

const { json } = require("express");

const port = process.env.port || 7000;

const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);

//Storage Setting
let storage = multer.diskStorage({
  destination: './public/uploads', //directory (folder) setting
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname) // file name setting
  }
})

//Upload Setting
let upload = multer({
  storage: storage
})

var imgModel = require('./models/admin_page');
const { fstat } = require("fs");

//home page
app.get("/", (req, res) => {
  res.render("Home");
});

//admin page
app.get("/admin_login", (req, res) => {
  res.render("admin_login");
})

//userlogin page
app.get("/Userlogin", (req, res) => {
  res.render("Userlogin");

})

//register page
app.get("/register", (req, res) => {
  res.render("register");

})

//admin page
app.get("/admin_page", (req, res) => {
  res.render("admin_page");
})

//cart page 2
app.get("/cart-2", (req, res) => {
  res.render("cart-2");
})

//add to cart page
app.get("/addcart", (req, res) => {
  res.render("addcart");
})

//cart pag 5
app.get("/cart-5", (req, res) => {
  res.render("cart-5");
})

//cart pag 6
app.get("/cart-6", (req, res) => {
  res.render("cart-6");
})

//cart pag 7
app.get("/cart-7", (req, res) => {
  res.render("cart-7");
})

//cart pag 8
app.get("/cart-8", (req, res) => {
  res.render("cart-8");
})
app.get("/view-cart", (req, res) => {
  res.render("view-cart");
})


// payment

const paypal = require("paypal-rest-sdk");



paypal.configure({
  mode: "sandbox", //sandbox or live
  client_id:
    "AUgaYK7qd68ZoNQsV0dIYnUkpsqREyGof66zNhP-qwMLd2EK2mzUZqz5Hfv38IqxF3AiIxXNL3oH4vss",
  client_secret:
    "EHFp5uaOkfqOVDiwr-eUkLbTJLydVnJwXsGKDxAONSDCQMeCH9iDiYRbwDJkk7-4D40ejPkSlNr9dJW9",
});



app.get("/index", (req, res) => {
  res.render("index");
});

app.post("/pay", (req, res) => {
    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: "http://localhost:7000/success",
        cancel_url: "http://localhost:7000/cancel",
      },
      transactions: [
        {
          item_list: {
            items: [
              {
                name: "Red Sox Hat",
                sku: "001",
                price: "5.00",
                currency: "USD",
                quantity: 1,
                // Image:""
              },
            ],
          },
          amount: {
            currency: "USD",
            total: "5.00",
          },
          description: "Hat for the best team ever",
        },
      ],
    };
  
    paypal.payment.create(create_payment_json, function (error, payment) {
      if (error) {
        throw error;
      } else {
        for (let i = 0; i < payment.links.length; i++) {
          if (payment.links[i].rel === "approval_url") {
            res.redirect(payment.links[i].href);
          }
        }
      }
    });
  });

  app.get("/success", (req, res) => {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
  
    const execute_payment_json = {
      payer_id: payerId,
      transactions: [
        {
          amount: {
            currency: "USD",
            total: "5.00",
          },
        },
      ],
    };
  
    paypal.payment.execute(
      paymentId,
      execute_payment_json,
      function (error, payment) {
        if (error) {
          console.log(error.response);
          throw error;
        } else {
          console.log(JSON.stringify(payment));
          res.send("Success");
        }
      }
    );
  });
  
  app.get('/cancel', (req, res) => res.send('Cancelled'));

app.post("/register", async (req, res) => {
  try {
    const password = req.body.password;
    const cpassword = req.body.confirmpassword;

    if (password === cpassword) {
      const registeremployee = new Register({
        Name: req.body.Name,
        email: req.body.email,
        password: password,
        //confirmpassword:cpassword
      })

      const registed = await registeremployee.save();
      res.status(201).render("Home");

    } else {
      res.send("invalid details")
    }

  } catch (error) {
    res.status(400).send(error);
  }
})




app.post("/Userlogin", async (req, res) => {

  try {
    const email = req.body.email;
    const password = req.body.psd;

    const useremail = await Register.findOne({ email: email });

    if (useremail.password === password) {
      res.status(201).render("addcart")


    } else {
      res.send("invalid login details");
    }
  }
  catch {
    res.status(400).send("invalid email")
  }

})

const userOrders = new mongoose.Schema({
  CakeName: {
    type: String,
    // required: true
  },
  CakePrice: {
    type: String,
    //required: true
  },
  CakeQuantity: {
    type: String,
    //required: true
  },

  Customer_Name: {
    type: String,
    //required: true
  },

  Customer_Phoneno: {
    type: Number,
   // required: true
  },
  Customer_Address: {
    type: String,
   // required: true
  },
  Customer_custommsg: {
    type: String,
   // required: true
  },
  Customer_order_status: {
    type: String,
   // required: true
  },



})

//we need to create collections
const Orders = new mongoose.model("Orders", userOrders);

app.post("/addcart", upload.single('single_input'), (req, res, next) => {
  // req.file
  // NewCakes.create({Cake_Image:req.file.filename})
  try {
    const aname = "admin";
    const password = "admin";

    // const useremail = await  Register.findOne({email:email});

    if (aname === password) {
      //res.status(201).render("addcart")
      //console.log("ad");
      const custdetails = new Orders({
        CakeName: req.body.user_title,
        CakePrice: req.body.user_price,
        CakeQuantity: req.body.user_quantity,
        Customer_Name: req.body.yourname,
        Customer_Phoneno: req.body.phonumber,
        Customer_Address: req.body.addressbar,
        Customer_custommsg: req.body.custonn,
        Customer_order_status:req.body.order_status


        //confirmpassword:cpassword
      })

      const added = custdetails.save();
      res.status(201).render("index");

    } else {
      res.send("invalid details");
    }
  }
  catch (error) {
    res.status(400).send(error);
  }

})

app.post("/admin_page", upload.single('single_input'), (req, res, next) => {
  // req.file
  // NewCakes.create({Cake_Image:req.file.filename})
  try {
    const aname = "admin";
    const password = "admin";

    // const useremail = await  Register.findOne({email:email});

    if (aname === password) {
      //res.status(201).render("addcart")
      //console.log("ad");
      const cdetails = new NewCakes({
        Cake_Name: req.body.c_name,
        Cake_description: req.body.cake_desc,
        Price: req.body.price,
        Flavour: req.body.flav,
        Weight: req.body.wght,
        Category: req.body.cake_category,
        Shopkeeper_Name: req.body.s_name,
        Shop_Name: req.body.shop_name,
        Shop_Mobile: req.body.s_mob,
        Cake_Image_Link: req.body.img_url
        //confirmpassword:cpassword
      })

      const added = cdetails.save();
      res.status(201).render("admin_page");

    } else {
      res.send("invalid details");
    }
  }
  catch (error) {
    res.status(400).send(error);
  }

})





// app.get('/view-cart', async (req, res) => {
//   const mongoose = require('mongoose');

//   // mongoose.connect('"mongodb+srv://admin:admin@cluster0.fit8mu3.mongodb.net/test"t', { useNewUrlParser: true });
//   let Order;
//   if (mongoose.models.Order) {
//       Order = mongoose.model('Order');
//   } else {
//       Order = mongoose.model('Order', new mongoose.Schema({
//           _id :String,
//           CakeName: String,
//           CakePrice: Number,
//           CakeQuantity: String,
//           Customer_Name: String,
//           Customer_Phoneno: Number,
//           Customer_Address: String,
//           Customer_custommsg: String,
//           // Customer_order_status:String

//       }));
//   }


//   const orders = await Order.aggregate([
//     {$project: {CakeName: 1, CakePrice: 1, CakeQuantity: 1, Customer_Name: 1, Customer_Phoneno: 1, Customer_Address: 1, Customer_custommsg: 1,}}
//   ]);
//   res.render('view-cart', { orders });
// });



// app.delete('/view-cart/:id', async (req, res) => {
//   const mongoose = require('mongoose');
//   let Order;
//   if (mongoose.models.Order) {
//       Order = mongoose.model('Order');
//   } else {
//       Order = mongoose.model('Order', new mongoose.Schema({
//           _id :String,
//           CakeName: String,
//           CakePrice: Number,
//           CakeQuantity: {type:Number, set: function(val) { return parseInt(val); }},
//           Customer_Name: String,
//           Customer_Phoneno: Number,
//           Customer_Address: String,
//           Customer_custommsg: String

//       }));
//   }
//   let CakeQuantity = parseInt(req.body.CakeQuantity);

//   let newOrder = new Order({
//       _id : req.body._id,
//       CakeName: req.body.CakeName,
//       CakePrice: req.body.CakePrice,
//       CakeQuantity: CakeQuantity,
//       Customer_Name: req.body.Customer_Name,
//       Customer_Phoneno: req.body.Customer_Phoneno,
//       Customer_Address: req.body.Customer_Address,
//       Customer_custommsg: req.body.Customer_custommsg
//   });
 

//   const order = await Order.findOne({ _id: req.params.id });

//   await Order.deleteOne({_id: req.params.id});
//   res.sendStatus(200);


//   await Order.updateOne({_id: req.params.id}, {$set: {CakeQuantity: parseInt(req.body.CakeQuantity)}});


// });










////////////////manageorder//
const OrderSchema = new mongoose.Schema({
  _id : {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      auto: true
  },
  CakeName: String,
  CakePrice: Number,
  CakeQuantity: String,
  Customer_Name: String,
  Customer_Phoneno: Number,
  Customer_Address: String,
  Customer_custommsg: String,
  Customer_order_status:String
});
const Order = mongoose.model('Order', OrderSchema);

app.get('/manageorder', async (req, res) => {
  const orders = await Order.aggregate([
    {$project: {CakeName: 1, CakePrice: 1, CakeQuantity: 1, Customer_Name: 1, Customer_Phoneno: 1, Customer_Address: 1, Customer_custommsg: 1, Customer_order_status:1}}
  ]);
  res.render('manageorder', { orders });
});




app.delete('/manageorder', async (req, res) => {
  try {
    const deletedOrder = await Order.deleteOne({_id: req.body._id});
    if (!deletedOrder) {
      return res.status(404).send('Order not found');
    }
    res.sendStatus(200);
  } catch (error) {
    res.status(500).send(error);
  }
});

const { ObjectId } = require('mongodb');

app.delete('/manageorder', (req, res) => {
    const { _id } = req.body;
    const collection = client.db("test").collection("orders");
    collection.deleteOne({ _id: ObjectId(_id) }, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send(err);
        }
        return res.send({ message: 'Record deleted successfully' });
    });
});






const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://admin:admin@cluster0.fit8mu3.mongodb.net/test";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  // perform operations on the database here
  app.put('/manageorder', (req, res) => {
    const { _id, CakeName, CakePrice, CakeQuantity, Customer_Name, Customer_Phoneno, Customer_Address, Customer_custommsg,Customer_order_status } = req.body;
    const collection = client.db("test").collection("orders");
    collection.updateOne({ _id: ObjectId(_id) }, { $set: { CakeName, CakePrice, CakeQuantity, Customer_Name, Customer_Phoneno, Customer_Address, Customer_custommsg,Customer_order_status} }, (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      }
      return res.send({ message: 'Record updated successfully' });
    });
  });
  
  
});



app.get('/h', (req, res) => {
  res.render("h")
  
});

app.get('/h',(req,res)=>{
  client.connect(err => {
  const collection = client.db("test").collection("orders");
  //find method
 
  collection.find({Customer_Phoneno:Customer_Phoneno}).toArray(function(err, result) {
      var tableHtml = '<table border="1" style="width:100%"><tr><th>Device ID</th><th>Device Name</th></tr>';
      result.forEach(function(item) {
          tableHtml += '<tr><td>'+item.Customer_Phoneno+'</td><td>'+item.Customer_Address
          +'</td></tr>';
      });
      tableHtml += '</table>';
      res.send(`<html><body>${tableHtml}</body></html>`);
      client.close();
      
  });         
  });
});



// ipfs

const makeStorageClient = require('./storage');

// app.set('view engine', 'hbs');
// app.set('views', __dirname + '/templates/views');

app.get('/form', (req, res) => {
  const storageClient = makeStorageClient();
  res.render('form',{storageClient});
});

//
app.listen(port, () => {
  console.log(`server is running at port no ${port}`);
})