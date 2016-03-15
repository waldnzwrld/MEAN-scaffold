'use strict';
let   mongoose = require('mongoose'),
        Schema = mongoose.Schema,
        <%= cOpen %> <%= upCaseChild %> = require('./<%= child %>'), <%= cClose %>

  ///////////////////////////////////////////////////////////
 //                     Model                        //
//////////////////////////////////////////////////////////
        
        <%= name %>Schema = new Schema({
            <%= pOpen %> owner : {type : mongoose.Schema.Types.ObjectId, ref : '<%= upCaseParent %>', index : true}, <%= pClose %>
            <%= cOpen %> <%= children %> : [ <%= upCaseChild %>.schema], <%= cClose %>
        });


  ///////////////////////////////////////////////////////////
 //                 Middleware                   //
//////////////////////////////////////////////////////////

<%= pOpen %>
//On Save push to Parent
<%= name %>Schema.post('save', (doc) => {
    var <%= upCaseParent %> = require('./<%= parent %>').model;
    <%= upCaseParent %>.findOneAndUpdate({_id: doc.owner}, {$push: {<%= names %>: doc} }, {new: true}, (err, <%= parent %>) => {
    });
});

//On Update Push changes to Parent
<%= name %>Schema.post('findOneAndUpdate', (req) => {
    console.log('Updating <%= upCaseParent %>');
    if (req) {
        var <%= upCaseParent %> = require('./<%= parent %>').model;
        <%= upCaseParent %>.findOneAndUpdate({_id: req.owner, '<%= names %>._id': req._id}, {$set: {'<%= names %>.$': req} }, {new: true}, (err, <%= parent %>) => {
            if (err)
                console.log(err);
        });
    }
}); 

//On Delete pull Child from Parent 
<%= name %>Schema.post('remove', (doc) => {
    let <%= upCaseParent %> = require('./<%= parent %>').model;
    let itemId = doc._id;
    try {
        <%= upCaseParent %>.findOneAndUpdate({_id: doc.owner}, { $pull: {<%= names %>: {_id: doc._id } } }, {new: true}, (err, <%= parent %>) => {
        });
    } catch (err) {
        console.log(err);
    }
}); 
<%= pClose %>

<%= cOpen %>
//Cascade delete all Children 
<%= name %>Schema.post('remove', (doc) => {
    if (doc.<%= children %> !== 0) {
        doc.<%= children %>.forEach((<%= child %>) => {
            <%= upCaseChild %>.model.findById(<%= child %>._id, (err, <%= child %>) => {
                <%= child %>.remove();
            });
        });
    }
});
<%= cClose %>


  //////////////////////////////////////////////////////////
 //                   Exports                      //
//////////////////////////////////////////////////////////

module.exports = {
    schema : <%= name %>Schema,
    model : mongoose.model('<%= upCaseName %>', <%= name %>Schema)
};