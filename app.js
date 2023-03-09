const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('64089d34084d350aa8ad17db')
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
  .connect(
    'mongodb+srv://rinkookandpal1966:vidmate@cluster0.psi4fdm.mongodb.net/shop?retryWrites=true&w=majority',{
      useNewUrlParser: true,
      // useCreateIndex: true,
      useUnifiedTopology: true,
      // useFindAndModify: false 
    }
  )
  .then(result => {

    User.findOne().then(user=>{
      if(!user){
        const user=new User({
          name: 'ME',
          email:'me@gmail.com',
          cart: {
            items:[]
          }
        });
        user.save();
      }
    })

    console.log("connected")
    app.listen(4000);
  })
  .catch(err => {
    console.log(err);
  });
