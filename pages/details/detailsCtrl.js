var DetailsCtrl = function($http, $location, $timeout, $rootScope) {
    var _this = this;

    this.$http = $http;
    this.$location = $location;
    this.$timeout = $timeout;
    this.$rootScope = $rootScope;

    $http.get('json/sample-symbols.json').success(function(data) {
        _this.stocksInfo = data;
        _this.symbols=[];
         _this.multiplesymbols = ['AAPL','GOOG'];
        for(stock in data){
             _this.symbols.push(data[stock].Symbol);
        }
        var searchedSymbol = $location.search().symbol;

        if (searchedSymbol) {
            _this.selectedStockInfo = _this.stocksInfo.filter(

            function(stockInfo) {
                return stockInfo.symbol === searchedSymbol
            })[0];
            _this.loadStockPricesForSymbol(searchedSymbol);
        }

    });

};

angular.module('stockApp').controller('DetailsCtrl', DetailsCtrl);

DetailsCtrl.prototype.onSelectedStockChange = function() {
    this.$rootScope.viewAnimation = '';
    this.$location.search('symbol', this.selectedStockInfo.Symbol);
};

DetailsCtrl.prototype.loadStockPricesForSymbol = function(symbol) {
    var _this = this;

    this.$http.get('json/' + symbol+'_daily.json').success(function(data) {
        _this.rowAnimateClass = '';
        _this.$timeout(function() {
            _this.rowAnimateClass = 'row-slide-end';
        }, 100);
         _this.dailyPrices={};
        _this.dailyPrices.stockInfo=[];
         var metadat=data["Meta Data"][0];
        var stockData=data["Time Series (Daily)"];//Time Series (Daily)
        var index = 0;
       for (key in stockData) {
            var stock=[];
            stock[0]=new Date(key).getTime();
            stock[1]=parseInt(stockData[key]["2. high"], 10);
            _this.dailyPrices.stockInfo.push(stock);
       }
         _this.dailyPrices.stockInfo.reverse();
        //_this.dailyPrices.stockInfo.sort(function(a, b){return a - b});

    });
};

DetailsCtrl.prototype.loadStockPricesForSymbolWithFilter = function(symbol,period) {
    var _this = this;
 
    this.$http.get('json/' + _this.$location.search().symbol+'_'+period+'.json').success(function(data) {
        _this.rowAnimateClass = '';
        _this.$timeout(function() {
            _this.rowAnimateClass = 'row-slide-end';
        }, 100);
         _this.dailyPrices={};
        _this.dailyPrices.stockInfo=[];
         var metadat=data["Meta Data"][0];
        if(period=='daily'){
        var stockData=data["Time Series (Daily)"];
        }
        else if(period=='monthly'){
            var stockData=data["Monthly Adjusted Time Series"];//Time Series (Daily)//Daily Time Series with Splits and Dividend Events
        }
        else{
           var stockData=data["Weekly Adjusted Time Series"];//Time Series (Daily)//Daily Time Series with Splits and Dividend Events 
        }
        var index = 0;
       for (key in stockData) {
            var stock=[];
            stock[0]=new Date(key).getTime();
            stock[1]=parseInt(stockData[key]["2. high"], 10);
            _this.dailyPrices.stockInfo.push(stock);
       }
         _this.dailyPrices.stockInfo.reverse();

    });
};
