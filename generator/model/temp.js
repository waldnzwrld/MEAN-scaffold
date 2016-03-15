'use strict';
let   mongoose = require('mongoose'),
        Schema = mongoose.Schema,
        //uncomment this line if this model has children
        //<%= upCaseChild %> = require('./<%= child %>'), 

  ///////////////////////////////////////////////////////////
 //                     Model                        //
//////////////////////////////////////////////////////////
        
        <%= name %>Schema = new Schema({
            owner : {type : mongoose.Schema.Types.ObjectId, ref : '<%= upCaseParent %>', index : true},
        });


  ///////////////////////////////////////////////////////////
 //                 Middleware                   //
//////////////////////////////////////////////////////////


//On Save push to Parent
<%= name %>Schema.post('save', (doc) => {
    var <%= upCaseParent %> = require('./<%= parent %>').model;
    <%= upCaseParent %>.findOneAndUpdate({_id: doc.owner}, {$push: {<%= name %>s: doc} }, {new: true}, (err, <%= parent %>) => {
    });
});

//On Update Push changes to Parent
<%= name %>Schema.post('findOneAndUpdate', (req) => {
    console.log('Updating <%= upCaseParent %>');
    if (req) {
        var <%= upCaseParent %> = require('./<%= parent %>').model;
        <%= upCaseParent %>.findOneAndUpdate({_id: req.owner, '<%= name %>s._id': req._id}, {$set: {'<%= name %>s.$': req} }, {new: true}, (err, <%= parent %>) => {
            if (err)
                console.log(err);
        });
    }
}); 

/*
//Uncomment this section if this model has children
//Cascade delete all Children 
<%= name %>Schema.post('remove', (doc) => {
    if (doc.<%= child %>s !== 0) {
        doc.<%= child %>s.forEach((<%= child %>) => {
            <%= upCaseChild %>.model.findById(<%= child %>._id, (err, <%= child %>) => {
                <%= child %>.remove();
            });
        });
    }
});
*/

//On Delete pull Child from Parent 
<%= name %>Schema.post('remove', (doc) => {
    let <%= upCaseParent %> = require('./<%= parent %>').model;
    let itemId = doc._id;
    try {
        <%= upCaseParent %>.findOneAndUpdate({_id: doc.owner}, { $pull: {<%= name %>s: {_id: doc._id } } }, {new: true}, (err, <%= parent %>) => {
        });
    } catch (err) {
        console.log(err);
    }
}); 

  //////////////////////////////////////////////////////////
 //                   Exports                      //
//////////////////////////////////////////////////////////

module.exports = {
    schema : <%= name %>Schema,
    model : mongoose.model('<%= upCaseName %>', <%= name %>Schema)
};