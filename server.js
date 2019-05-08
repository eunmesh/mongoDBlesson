var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var db = mongoose.connect('mongodb://localhost/my-shop');

var Product = require('./model/product');
var WishList = require('./model/wishlist');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.post('/product',function(req,res){
    var p = new Product();
    p.title = req.body.title;
    p.price = req.body.price;
    p.save(function(err,savedProduct){
        if(err){
            res.status(500).send({error:"could not save product"});
        }else{
            res.status(200).send(savedProduct);
        }
    });
});

app.get('/product',function(request,response){
    Product.find(function(err,data){
        if (err){
            response.send({error:"could not get product"});
        }
        else {
            response.status(200).send(data);
        }
    });
});

/* app.post('/wishlist',function(request,response){

    var newWishList = new WishList();
    if(!request.body._id){
        var objectID = request.body._id;

        
        newWishList.proucts.objectID = objectID;
    }
    else{
        
        if(request.body.title == "")
        {
            response.send(500).send({error:"can not find wishlist"});
        }else{
            newWishList.title = request.body.title;
            response.send(200).send(newWishList);
        }
    }
   
}); */
app.post('/wishlist',function(req,res){
    //var newWishlist = new WishList();
    if(req.body.title==""){
        res.status(500).send({error:"wishlist not created"});
    }
    else{
        var newWishlist = new WishList();
        newWishlist.title = req.body.title;
        newWishlist.save(function(err,newData){
            if(err){
                res.status(500).send({error:"could not save wishlist"});
            }else{
                res.status(200).send(newData);
            }
        });
        
    }
});
app.get('/wishlist',function(req,res){
    WishList.find({}).populate({path:'products',model:'Product'}).exec(function(err,wishLists){
        if(err){
            res.status(500).send({error:"error"});
            
        }else{
           // console.log("first product in the wishlist is: "+ {$arrayElemAt:[wishLists.products, 1 ]});
            res.send(wishLists);
        }
    });
});
app.put('/wishlist/product/add',function(req,res){
    Product.findOne({_id:req.body.productID},function(err,data){
        if(err){
            res.status(500).send({erro:"could not update wishlist"});
        }else
        {
            WishList.update({_id:req.body.wishListID},{$addToSet:{products:data._id}},function(err,newItem){
                
            if(err)
            {
                res.send({error:"could not add item to the products list"});
            }else
            {
                
                    res.send(newItem);
            }
        });
    }
});
});
app.listen(3000,function(){
    console.log("db server api running on port 3000");
});