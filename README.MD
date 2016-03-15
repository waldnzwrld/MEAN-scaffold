Clone the repo

execute `npm install` which will build jspm dependencies and semantic ui

there are generators in gulp

gulp model --name NAME --parent PARENT --child CHILD
this will create a mongoose model with cascade delete and update middlewares built in
Use singular naming

gulp component --name NAME --parent components/path/to/parent
This will create an angular component 

gulp service --name NAME
This will create a service 

For components and services you will need to tie the component or service into the
appropriate components.js or services.js file. If a component is nested (has a parent)
it can be required int he parent. 

Be sure to include the appropriate routes for each model. 


