chartIt(); //calls function to create chart
            
// function to create chart using chart.js
async function chartIt(){
    let dataAnimXs = [];
    let dataAnimYmonth = []
    let dataAnimYcum = []
    let xMax = 300
    const data = await getData();
    let chartOptions = {
        plugins: {
            title: {
                display: true,
                align: 'start',
                padding: {
                    top: 0,
                    bottom: 25
                },
                color: 'rgb(255, 255, 255, 1.0)',
                text: "New Repos with GDScript since Godot v1.0",
                font: {
                    size: 20
                }
            },
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    color: 'rgb(255, 255, 255)'  
                }
                
            }
        },
        responsive: true,
        maintainAspectRatio: false,
        animations: {
            radius: {
                duration: 1000,
                easing: 'easeInQuad',
                from: 1,
                to: 0,
                loop: true
            }
        },
            layout: {
                padding: 50
            },
            scales: {
                x: {
                    grid: {
                        display: false,
                        fontColor: 'rgba(255, 255, 255, 1)'
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 1)'
                    }
                },
                y: {
                    min: 0,
                    max: xMax, 
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 1)'
                    }
                }
            }
    }
    let chartData = {
        labels: data.xs,
        datasets: [{
                type: 'bar',
                label: 'New Repos',
                data: dataAnimYmonth,
                borderWidth: 1,
                backgroundColor:'rgb(245,115,137)',
                borderColor: "rgba(255, 255, 255, 1)"
                    },{
                type: 'line',
                label: "Running Total",
                data: dataAnimYcum,
                fill: true,
                backgroundColor: 'rgba(255, 255, 255, 1)',
                pointStyle: 'circle'
            }]
    }
    const ctx = document.getElementById('chart');
    const myChart = new Chart(ctx, {
        data: chartData,
        options: chartOptions
        });

    
    //update chart on start up
    let updateChart = setInterval(
        function(){
            if (dataAnimYmonth.length != data.yMonth.length){
                dataAnimYmonth.push(data.yMonth[dataAnimYmonth.length])
                if(Math.max(...dataAnimYmonth) > xMax){
                    xMax = Math.max(...dataAnimYmonth) + 100 - (Math.max(...dataAnimYmonth)%100)
                    myChart.options.scales.y.max = xMax
                }
            } else{
                var delayUpdate = setTimeout(
                        function(){
                            let updateCum = setInterval(
                                function(){
                                    dataAnimYcum.push(data.yCum[dataAnimYcum.length])
                                    if (Math.max(...dataAnimYcum) >  xMax){
                                        myChart.options.scales.y.max = Math.max(...dataAnimYcum)
                                    }
                                    if (dataAnimYcum.length == data.yCum.length){
                                        clearInterval(updateCum)
                                    }
                                    myChart.update();
                                }, 25
                            )
                        }, 100
                    )
                clearInterval(updateChart)
        }
        myChart.update();
        }, 5);
    }

    function sleep(cht, data) {
        setTimeout(function(){ 
            console.log(cht)
            console.log(data)
            cht.update(); 
        }, 3000);
    }    

async function getData(){
    let yMonth = [];
    let yCum = [];
    let xs = [];
    const response = await fetch('sample.json');
    const data = await response.json();
    const yearKeys = Object.keys(data);
    const yearLen = yearKeys.length;
    for (let i = 0; i < yearLen; i++){
        const year = yearKeys[i];
        const monthKey = Object.keys(data[year]);
        const monthLen = monthKey.length;
        for(let j = 0; j < monthLen; j++){
            const row = monthKey[j] + " " + year;
            xs.push(row);
            const col = data[year][monthKey[j]];
            yMonth.push(col);
            if (yMonth.length == 1){
                yCum.push(parseFloat(col))
            }else{
                yCum.push(parseFloat(col) + parseFloat(yCum[yCum.length-1]))
            }
            }
        }
        return {xs, yMonth, yCum}
}