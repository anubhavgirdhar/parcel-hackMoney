import React from 'react';
import { HorizontalBar } from 'react-chartjs-2';
import "chartjs-plugin-datalabels";



function SavedTransactionsChart({savedTransactionCount, maxCount}) {    
    const maximum = !maxCount ? 6: maxCount;
    const maxHeight = !maxCount ? 100 : 300 
    const saved = (savedTransactionCount ===-1) ? savedTransactionCount+1 : savedTransactionCount;
    const data = {
        labels: [],
        datasets: [
          {
            label: 'Saved',
            backgroundColor: '#36A2EB',
            borderWidth: 1,
            width:1,
            min:0,
            max:6,
            step:1,
            hoverBackgroundColor: '#3FBDA6',
            data: [saved]
          }
        ]
      };
      const options = {
        title: {
          display:true,
          text:'Saved Transactions'
        },
        label:false,
        scales: {
          xAxes: [
            {
              ticks:{
                beginAtZero:true,
                min:0,
                max:maxCount
              }
            }
          ]
        }
    };


    return <HorizontalBar data={data} options={options} width={500} height={maxHeight}/>
}

export default SavedTransactionsChart;
