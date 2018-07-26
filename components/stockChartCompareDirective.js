//var app = angular.module('stockApp');

var seriesOptions = [],
            seriesCounter = 0;
angular.module('stockApp').directive('stockCompare', function () {
    return {
        scope: {
            series: '='
        },
        link: function (scope, element) {
            var seriesOptions = [],
            seriesCounter = 0;
            scope.$watch('series', function (newValue) {
                if (newValue) {
                   angular.forEach(newValue, function (name, i) {

            $.getJSON('json/' + name+'_monthly.json',    function (data) {
                      var stockArray=[];
                       var metadat=data["Meta Data"][0];
                    var stockData=data["Monthly Adjusted Time Series"];//Time Series (Daily)
                    var index = 0;
                for (key in stockData) {
                var stock=[];
                stock[0]=new Date(key).getTime();
                stock[1]=parseInt(stockData[key]["2. high"], 10);
                stockArray.push(stock);
                }
         stockArray.reverse();

        seriesOptions[i] = {
            name: name,
            data: stockArray
        };

        // As we're loading the data asynchronously, we don't know what order it will arrive. So
        // we keep a counter and create the chart when all the data is loaded.
        seriesCounter += 1;

        if (seriesCounter === newValue.length) {
            createChart();
            seriesCounter=0;
        }
    });
});
                }
            });
            
            function createChart() {

     element.highcharts('StockChart', {

        rangeSelector: {
            selected: 4
        },

        yAxis: {
            labels: {
                formatter: function () {
                    return (this.value > 0 ? ' + ' : '') + this.value + '%';
                }
            },
            plotLines: [{
                value: 0,
                width: 2,
                color: 'silver'
            }]
        },

        plotOptions: {
            series: {
                compare: 'percent',
                showInNavigator: true
            }
        },

        tooltip: {
            pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
            valueDecimals: 2,
            split: true
        },

        series: seriesOptions
    });
     var chart = $(element[0]).highcharts();
                 console.log(chart);  
                chart.redraw();
                

}
        }
    };
});