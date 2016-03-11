import template from './<%= name %>.html!text';
import controller from './<%= name %>.controller';
import './<%= name %>.css!';

let <%= name %>Component = {
        template,
        controller,
        bindings: {}
};

export default <%= name %>Component;
