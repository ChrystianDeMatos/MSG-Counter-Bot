const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const backend = require('./backend.js');

const width = 600;
const height = 600;
const chartCallback = (ChartJS) => {

    // Global config example: https://www.chartjs.org/docs/latest/configuration/
    ChartJS.defaults.global.elements.rectangle.borderWidth = 2;
    ChartJS.defaults.global.defaultFontColor = 'white';

    // Global plugin example: https://www.chartjs.org/docs/latest/developers/plugins.html
    ChartJS.plugins.register({
        beforeDraw: function (chart, easing) {
            if (chart.config.options.chartArea && chart.config.options.chartArea.backgroundColor) {
                var ctx = chart.chart.ctx;
                var chartArea = chart.chartArea;
                var offset = 50;

                ctx.save();

                console.log(ctx.canvas)

                ctx.fillStyle = chart.config.options.chartArea.backgroundColor;
                ctx.fillRect(chartArea.left - offset, chartArea.top - offset, chartArea.right - chartArea.left + offset * 2, chartArea.bottom - chartArea.top + offset * 2);

                ctx.restore();
            }
        }
        // plugin implementation
    });
    // New chart type example: https://www.chartjs.org/docs/latest/developers/charts.html
    ChartJS.controllers.MyType = ChartJS.DatasetController.extend({
        // chart implementation
    });
};
const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, chartCallback });

module.exports = {
    testt: async (serverId) => {
        let resp = await backend.getRecords(serverId);
        const configuration = {
            type: 'bar',
            data: {
                labels: ['1', '2', '3', '4', '5'],
                datasets: [{
                    label: '# de mensagens',
                    data: resp,
                    backgroundColor:
                        'rgba(255, 99, 132, 0.2)',
                    borderColor:
                        'rgba(255,99,132,1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            callback: (value) => '#' + value
                        },
                        gridLines: {
                            color: 'rgba(255, 255, 255, 0.4)'
                        },
                    }],
                    xAxes: [{
                        gridLines: {
                            color: 'rgba(255, 255, 255, 0.4)'
                        },
                        lineWidth: 10
                    }],
                },
                chartArea: {
                    backgroundColor: 'rgba(0, 0, 0, 0.4)'
                },
                
            }
        };
        const image = await chartJSNodeCanvas.renderToDataURL(configuration);
        //console.log(req.params.teste)
        //let resp = await backend.getRecords(req.params.teste);
        return image;
    }
}