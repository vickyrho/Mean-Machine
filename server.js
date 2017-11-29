// base setup //

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var morgan = require('morgan');
var port = 8000;
var User = require('./app/models/user');

app.use(bodyParser.urlencoded({extended:true }));
app.use(bodyParser.json());

// CORS requets //

app.use(function (req,res,next) {
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,	POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');
    next();
});

app.use(morgan('dev'));

// connecting to database //

mongoose.connect('mongodb://wiki:wiki@ds125146.mlab.com:25146/mydatabase');

// home page route //

app.get('/',function(req,res){
    res.send('welcome to home page');
});

var apiRouter = express.Router();

app.use('/api',apiRouter);
apiRouter.get('/', function(req,res){
    res.json({ message: ' hooray ! welcome to our api ' });
});

apiRouter.get(function (req,res,next) {
    console.log('somebody visited');
    next();
});

apiRouter.route('/users').post(function(req,res){

        var user = new User();
        user.name = req.body.name;
        user.username = req.body.username;
        user.password = req.body.password;

        user.save(function(err){
            if(err)
                return err;
            else
                return res.json({message:'User Created'});
            });
    });

apiRouter.route('/users').get(function(req,res){

             User.find(function(err,users){
                if(err)
                    res.send(err);
                else
                    res.json(users);
                });
    });

apiRouter.route('/users/:user_id').get(function(req,res){
    User.findById(req.params.user_id,function (err,user){
        if(err)
            res.send(err);
        else
            res.json(user);
    });
});

apiRouter.route('/users/:user_id').put(function(req,res){
   User.findById(req.params.user_id,function(err,user){
       if(err)
           res.send(err);
       if(req.body.name)
           user.name = req.body.name;
       if(req.body.password)
           user.password = req.body.password;
       if(req.body.username)
           user.username = req.body.username;

       user.save(function (err) {
           if(err)
               res.send(err);
           else
               res.json({message:'User Updated'});
       })
   });
});

apiRouter.route('/users/:_id').delete(function(req,res){
   User.remove({
       _id:req.params._id
    },function(err,user){
        if(err)
            res.send(err);
        else
            res.json({message:'user deleted'});
      });
});



app.listen(port);
console.log('Magic does not happen '+port);

