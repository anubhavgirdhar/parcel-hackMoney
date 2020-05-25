import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import "chartjs-plugin-datalabels";

const options = {
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

function UserHoldingChart({balances}) {

    const tokens=[];
    const balanceAmts=[];
    if(balances) {
        Object.keys(balances).forEach(token => {
            tokens.push(token);
            balanceAmts.push(balances[token]);
        });
    }
    
    const data = {
        labels: tokens,
        datasets: [{
            label: 'Wallet Balances',
            data: balanceAmts,
            backgroundColor: ['#FF3D67', '#FFCD56', '#36A2EB', '#4BC0C0', '#BBA8FF']
        }]
    };

    return <Doughnut data={data} options={options} width={300} height={300}/>
}

export default UserHoldingChart;