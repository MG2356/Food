const express = require("express");
const mongoose = require('mongoose');
const SignupModel = require("./Schema/Signup");
const FoodDetail = require("./Schema/Food")
const dotenv = require("dotenv");
const emailRoutes = require("./routes/emailRoutes");
const jwt = require('jsonwebtoken');
const BASE_URL = process.env.BASE_URL
const PORT = process.env.PORT||7000;

const app = express();
dotenv.config();

const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send('Website Working');
});

// Connect to the database
mongoose.connect('mongodb+srv://munishgoel45698:9r3jwSuO1CzegsfD@cluster0.9r9br1c.mongodb.net/FoodWeb', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("connected to db"))
  .catch(err => console.log("Error connecting to db: ", err));

// Routes
app.use("/email", emailRoutes);

// User registration
app.post('/Register', (req, res) => {
  SignupModel.create(req.body)
    .then(signup => {
      const token = jwt.sign({ id: signup._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      console.log("Generated Token: ", token);
      res.json({ signup, token });
    })
    .catch(err => {
      console.log("Error during registration: ", err);
      res.status(500).json({ error: "Registration failed" });
    });
});

// User login
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  SignupModel.findOne({ email: email })
    .then(user => {
      if (user) {
        if (user.password === password) {
          const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
          console.log("Generated Token: ", token);
          res.json({ message: "Success", token });
        } else {
          res.status(401).json({ message: "Invalid password" });
        }
      } else {
        res.status(404).json({ message: "No record found" });
      }
    })
    .catch(err => {
      console.log("Error during login: ", err);
      res.status(500).json({ error: "Login failed" });
    });
});
//product add 

app.post('/addmenu', (req, res) => {
  FoodDetail.create(req.body)
    .then(product => {
      res.json({ product });
    })
    .catch(err => {
      console.log("Error during adding the product: ", err);
    });
});
//update by user
app.put('/updateUser/:id', (req, res) => {
  const userId = req.params.userId;
  const updatedUserData = req.body; 
  
  SignupModel.findByIdAndUpdate(userId, updatedUserData, { new: true })
    .then(updatedUser => {
      res.json(updatedUser);
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
});
// delete by user
app.delete('/deleteUser/:id', (req, res) => {
  const userId = req.params.userId;
  
  SignupModel.findByIdAndDelete(userId)
    .then(deletedUser => {
      if (!deletedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json({ message: 'User deleted successfully' });
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
});
// Update product by ID
app.put('/updateProduct/:id', (req, res) => {
  const { id } = req.params;
  FoodDetail.findByIdAndUpdate(id, req.body, { new: true })
    .then(updatedProduct => {
      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json({ updatedProduct });
    })
    .catch(err => {
      console.log("Error during updating the product: ", err);
      res.status(500).json({ error: "Updating product failed" });
    });
});
// Delete product by ID
app.delete('/deleteProduct/:id', (req, res) => {
  const { id } = req.params;
  FoodDetail.findByIdAndDelete(id)
    .then(deletedProduct => {
      if (!deletedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json({ message: "Product deleted successfully" });
    })
    .catch(err => {
      console.log("Error during deleting the product: ", err);
      res.status(500).json({ error: "Deleting product failed" });
    });
});
// get product
app.get('/getProduct' ,(req,res)=>{
  FoodDetail.find({}).sort('-date') 

  .then(product => res.json(product))
  .catch(err=>res.json(err))

})
app.get('/getUsers' ,(req,res)=>{
  SignupModel.find({}).sort('-date') 

  .then(product => res.json(product))
  .catch(err=>res.json(err))

})
app.get('/product/:id', (req, res) => {
  const { id } = req.params;

  FoodDetail.findById(id)
    .then(product => {
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json({ product });
    }) 
    .catch(err => {
      console.log("Error during fetching the product: ", err);
      res.status(500).json({ error: "Fetching product failed" });
    });
});
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
