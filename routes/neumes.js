var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'), //mongo connection
    bodyParser = require('body-parser'), //parses information from POST
    methodOverride = require('method-override'); //used to manipulate POST

global.neumesArray = [];

//Any requests to this controller must pass through this 'use' function
//Copy and pasted from method-override
router.use(bodyParser.urlencoded({ extended: true }))
router.use(methodOverride(function(req, res){
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
      }
}))
router.route('/editor')
    //GET all neumes
    .get(function(req, res, next) {
        //retrieve all neumes from Mongo
        mongoose.model('neume').find({}, function (err, neumes) {
              if (err) {
                  return console.error(err);
              } else {
                  //respond to both HTML and JSON. JSON responses require 'Accept: application/json;' in the Request Header
                  res.format({
                      //HTML response will render the index.jade file in the views/neumes folder. We are also setting "neumes" to be an accessible variable in our jade view
                    html: function(){
                        res.render('neumes/editor', {
                              title: 'Neumes',
                              "neumes" : neumes
                          });
                    },
                    //JSON response will show all neumes in JSON format
                    json: function(){
                        res.json(neumes);
                    }
                });
              }     
        });
    })

router.route('/user')
    //GET all neumes
    .get(function(req, res, next) {
        //retrieve all neumes from Mongo
        mongoose.model('neume').find({}, function (err, neumes) {
              if (err) {
                  return console.error(err);
              } else {
                  //respond to both HTML and JSON. JSON responses require 'Accept: application/json;' in the Request Header
                  res.format({
                      //HTML response will render the index.jade file in the views/neumes folder. We are also setting "neumes" to be an accessible variable in our jade view
                    html: function(){
                        res.render('neumes/user', {
                              title: 'Neumes',
                              "neumes" : neumes
                          });
                    },
                    //JSON response will show all neumes in JSON format
                    json: function(){
                        res.json(neumes);
                    }
                });
              }     
        });
    })
    
//build the REST operations at the base for neumes
//this will be accessible from http://127.0.0.1:3000/neumes if the default route for / is left unchanged
router.route('/')
    //GET all neumes
    .get(function(req, res, next) {
        //retrieve all neumes from Monogo
        mongoose.model('neume').find({}, function (err, neumes) {
              if (err) {
                  return console.error(err);
              } else {
                  //respond to both HTML and JSON. JSON responses require 'Accept: application/json;' in the Request Header
                  res.format({
                      //HTML response will render the index.jade file in the views/neumes folder. We are also setting "neumes" to be an accessible variable in our jade view
                    html: function(){
                        res.render('neumes/index', {
                              title: 'Neumes',
                              "neumes" : neumes
                          });
                    },
                    //JSON response will show all neumes in JSON format
                    json: function(){
                        res.json(neumes);
                    }
                });
              }     
        });
    })

    //POST a new neume
    .post(function(req, res) {
        // Get values from POST request. These can be done through forms or REST calls. These rely on the "name" attributes for forms
        var name = req.body.name;
        var folio = req.body.folio;
        var description = req.body.description;
        var classification = req.body.classification;
        var mei = req.body.mei;
        var dob = req.body.dob;

        //call the create function for our database
        mongoose.model('neume').create({
            name : name,
            folio : folio,
            description : description,
            classification : classification,
            mei : mei,
            dob : dob,
            imagePath : imageArray,
            project : project._id
            
             
        }, function (err, neume) {
              if (err) {
                  res.send("There was a problem adding the information to the database.");
              } else {
                  //neume has been created
                  console.log('POST creating new neume: ' + neume); //neume holds the new neume
                  neumesArray.push(neume);
                  mongoose.model("project").update({neumes : neume});
                  //Show neume array
                  //Neume requests for the images inside of neumes
                  res.format({
                    html: function(){
                        // If it worked, set the header so the address bar doesn't still say /adduser
                        res.location("neumes");
                        // And forward to success page
                        res.redirect("/projects/");
                    },
                    //JSON response will show the newly created neume
                    json: function(){
                        res.json(neume);
                    }
                });
                imageArray = [];
              }
        })
    });

/* GET New neume page. */
router.get('/new', function(req, res) {
     res.render('neumes/new', { title: 'Add New Neume' });
});

// route middleware to validate :id
router.param('id', function(req, res, next, id) {
    //console.log('validating ' + id + ' exists');
    //find the ID in the Database
    mongoose.model('neume').findById(id, function (err, neume) {
        //if it isn't found, we are going to repond with 404
        if (err) {
            console.log(id + ' was not found');
            res.status(404)
            var err = new Error('Not Found');
            err.status = 404;
            res.format({
                html: function(){
                    next(err);
                 },
                json: function(){
                       res.json({message : err.status  + ' ' + err});
                 }
            });
        //if it is found we continue on
        } else {
            //uncomment this next line if you want to see every JSON document response for every GET/PUT/DELETE call
            //console.log(neume);
            // once validation is done save the new item in the req
            req.id = id;
            // go to the next thing
            next(); 
        } 
    });
});

router.route('/:id')
  .get(function(req, res) {
    mongoose.model('neume').findById(req.id, function (err, neume) {
      if (err) {
        console.log('GET Error: There was a problem retrieving: ' + err);
      } else {
        console.log('GET Retrieving ID: ' + neume._id);
        var neumedob = neume.dob.toISOString();
        neumedob = neumedob.substring(0, neumedob.indexOf('T'))
        res.format({
          html: function(){
              res.render('neumes/show', {
                "neumedob" : neumedob,
                "neume" : neume
              });
          },
          json: function(){
              res.json(neume);
          }
        });
      }
    });
  });
  //The new projectID should be here. 

router.route('/:id/edit')
	//GET the individual neume by Mongo ID
	.get(function(req, res) {
	    //search for the neume within Mongo
	    mongoose.model('neume').findById(req.id, function (err, neume) {
	        if (err) {
	            console.log('GET Error: There was a problem retrieving: ' + err);
	        } else {
	            //Return the neume
	            console.log('GET Retrieving ID: ' + neume._id);
              var neumedob = neume.dob.toISOString();
              neumedob = neumedob.substring(0, neumedob.indexOf('T'))
	            res.format({
	                //HTML response will render the 'edit.jade' template
	                html: function(){
	                       res.render('neumes/edit', {
	                          title: 'neume' + neume._id,
                            "neumedob" : neumedob,
	                          "neume" : neume,
                            "neumeImages" : neume.imagePath
	                      });
	                 },
	                 //JSON response will return the JSON output
	                json: function(){
	                       res.json(neume);
	                 }
	            });
	        }
	    }).populate('image').exec((err, posts) => {
      console.log("Populated Image " + posts);
    });
	})
	//PUT to update a neume by ID
	.put(function(req, res) {
	    // Get our REST or form values. These rely on the "name" attributes from the edit page
	    var name = req.body.name;
	    var folio = req.body.folio;
      var description = req.body.description;
      var classification = req.body.classification;
      var mei = req.body.mei;
	    var dob = req.body.dob;
	    global.editArray = [];

	    //find the document by ID
	    mongoose.model('neume').findById(req.id, function (err, neume) {
	        //update it
          editArray = neume.imagePath.concat(imageArray);
	        neume.update({
	            name : name,
	            folio : folio,
              description : description,
              classification : classification,
              mei : mei,
	            dob : dob,
              imagePath : editArray //adding the image to the image array without reinitializng everything
	        }, function (err, neumeID) {
	          if (err) {
	              res.send("There was a problem updating the information to the database: " + err);
	          } 
	          else {
	                  //HTML responds by going back to the page or you can be fancy and create a new view that shows a success page.
	                  res.format({
	                      html: function(){
	                           res.redirect("/neumes/");
	                     },
	                     //JSON responds showing the updated values
	                    json: function(){
	                           res.json(neume);
	                     }
	                  });
	           }
             //Deletes the file from the folder
             if(req.body.image == "deleted"){
             const fs = require('fs');

              fs.unlink('uploads/' + req.body.name + ".jpg", (err) => {
                if (err) throw err;
                console.log('successfully deleted');
              }); }
	        })
	    });
	})
	//DELETE a neume by ID
	.delete(function (req, res){
	    //find neume by ID
	    mongoose.model('neume').findById(req.id, function (err, neume) {
	        if (err) {
	            return console.error(err);
	        } else {
	            //remove it from Mongo
	            neume.remove(function (err, neume) {
	                if (err) {
	                    return console.error(err);
	                } else {
	                    //Returning success messages saying it was deleted
	                    console.log('DELETE removing ID: ' + neume._id);
	                    res.format({
	                        //HTML returns us back to the main page, or you can create a success page
	                          html: function(){
	                               res.redirect("/neumes");
	                         },
	                         //JSON returns the item with the message that is has been deleted
	                        json: function(){
	                               res.json({message : 'deleted',
	                                   item : neume
	                               });
	                         }
	                      });
	                }
	            });
	        }
	    });
	});
module.exports = router;