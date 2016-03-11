import angular from 'angular';
import 'angular-ui-router';
import 'angular-local-storage';
import Services from './services/services';
import Components from './components/components';
import AppComponent from './app.component';
import 'normalize.css';

let appModule = angular.module('app', [
    'LocalStorageModule',
    'ui.router',
    Services.name,
    Components.name
])
.component('app', AppComponent);

/*
 * As we are using ES6 with Angular 1.x we can't use ng-app directive
 * to bootstrap the application as modules are loaded asynchronously.
 * Instead, we need to bootstrap the application manually
 */
var container = document.getElementById('app-container');
var noAngularDOM;

angular.element(document).ready(() => {
    System.import('jQuery');
    angular.bootstrap(container, [appModule.name]), {
        strictDi: true /* jshint expr: true */
    }; 
});

export default appModule;
export function __unload(){
    container = document.getElementById('app-container');
    container.remove();
    document.body.appendChild(noAngularDOM.cloneNode(true));
}
