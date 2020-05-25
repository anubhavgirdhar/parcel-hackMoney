import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import "chartjs-plugin-datalabels";

const options = {
    title: {
        display:true,
        text:'Defi Protocol Input Percentages'
      },
    plugins: {
        datalabels: {
          formatter: (value, ctx) => {
            let datasets = ctx.chart.data.datasets;
            let percentage=0;
            if (datasets.indexOf(ctx.dataset) === datasets.length - 1) {
              let sum = datasets[0].data.reduce((a, b) => a + b, 0);
              percentage = Math.round((value / sum) * 100) + "%";
              return percentage;
            } else {
            
                return percentage;
            }
          },
          color: "#03255B"
        }
      }
};

function UserHoldingChart({poolInvestPercentages}) {

    const pools=[];
    const percentages=[];
    if(poolInvestPercentages) {
        Object.keys(poolInvestPercentages).forEach(pool => {
            pools.push(pool);
            percentages.push(poolInvestPercentages[pool]);
        });
    }
    
    const data = {
        labels: pools,
        datasets: [{
            label: 'Defi Protocol Percentages',
            data: percentages,
            backgroundColor: ['#FF3D67', '#FFCD56', '#36A2EB', '#4BC0C0', '#BBA8FF']
        }]
    };

    return <Doughnut data={data} options={options} width={500} height={250}/>
}

export default UserHoldingChart;