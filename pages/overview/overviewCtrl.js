var OverviewCtrl = function ($http, $location, $rootScope) {
    var _this = this;
    this.$location = $location;
    this.$rootScope = $rootScope;

    $http.get('json/sample-symbols.json').success(function (data) {
        _this.stocksInfo = data;
    });
};
    angular.module('stockApp').controller('OverviewCtrl', OverviewCtrl);

OverviewCtrl.prototype.goToStockDetails = function (stockInfo) {
    this.$rootScope.viewAnimation = 'slide-left';
    this.$location.path('details').search('symbol', stockInfo.Symbol);
};