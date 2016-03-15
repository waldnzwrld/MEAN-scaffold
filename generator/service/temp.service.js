
const HTTP = new WeakMap();
class <%= upCaseName %>SvcCtrl {
        constructor ($http) {
            HTTP.set(this, $http);
        }
        create<%= upCaseName %>(id, data) {
                return HTTP.get(this).post(`/URL`, data).then(result => result.data);
        }
        get<%= upCaseName %>s(id) {
                return HTTP.get(this).get(`/URL`).then(result => result.data);
        }
        get<%= upCaseName %>(id) {
                return HTTP.get(this).get(`/URL`).then(result => result.data);
        }
        update<%= upCaseName %>(id, data) {
                return HTTP.get(this).put(`/URL`, data).then(result => result.data);
        }
        delete<%= upCaseName %>(id) {
                return HTTP.get(this).delete(`URL`).then(result => result.data);
        }
}


<%= upCaseName %>SvcCtrl.$inject = ['$http'];

export default <%= upCaseName %>SvcCtrl;

