<template>
    <ion-content fullscreen class="ion-padding">
        <ion-grid>
            <ion-row>
                <span class="regularText"> Averages </span>
            </ion-row>
            <ion-row class="ion-margin-vertical">
                <ion-col size="5">
                    <p class="span regularText" style="text-align:center"> Snoozes Per Day </p>
                    <h4 class="regularText" style="text-align:center"> 100 </h4>
                </ion-col>

                <ion-col size="7">
                    <p class="span regularText" style="text-align:center"> Time Taken to Wake </p>
                    <h4 class="regularText" style="text-align:center"> 100 </h4>
                </ion-col>
            </ion-row>

            <ion-row class="ion-margin-vertical">
                <ion-col size="5">
                    <p class="span regularText" style="text-align:center"> Sleep Quality </p>
                    <h4 class="regularText" style="text-align:center"> 100 </h4>
                </ion-col>

                <ion-col size="7">
                    <p class="span regularText" style="text-align:center"> Wake Up Time </p>
                    <h4 class="regularText" style="text-align:center"> 100 </h4>
                </ion-col>
            </ion-row>
            <line-chart :chart-data="datacollection" :options="options" style="color:white"></line-chart>
        </ion-grid>
    </ion-content>
</template>

<script>
import LineChart from './chart.vue'

export default({
    components: {
        LineChart
    },
    data () {
      return {
        datacollection: null,
        options: {
            legend: {
                display: false
            },
            tooltips: {
                callbacks: {
                label: function(tooltipItem) {
                        return tooltipItem.yLabel;
                }
                }
            },
            scales: {
                yAxes: [{
                ticks: {
                    min: 0,
                    }
                }]
            }
        
        }
      }
    },
    created() {
        this.datacollection = {
          labels: ['S', 'M', 'T', 'W', 'TH', 'F', 'S'],
          datasets: [{
            data: [1, 2, 3, 4, 5, 6, 7],
            backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 205, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(201, 203, 207, 0.2)'
            ],
            borderColor: [
            'rgb(255, 99, 132)',
            'rgb(255, 159, 64)',
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)',
            'rgb(153, 102, 255)',
            'rgb(201, 203, 207)'
            ],
            borderWidth: 1
        }]
        }
    },
    methods: {
    }
})
</script>
