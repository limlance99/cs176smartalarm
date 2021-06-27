<template>
    <ion-content fullscreen class="ion-padding">
        <ion-grid>
            <ion-row>
                <span class="regularText"> Averages </span>
            </ion-row>
            <ion-row class="ion-margin-vertical">
                <ion-col size="5">
                    <p class="span subtitleText" style="text-align:center"> Snoozes Per Day </p>
                    <h5 class="regularText" style="text-align:center"> {{ aveSnoozes }} </h5>
                </ion-col>

                <ion-col size="7">
                    <p class="span subtitleText" style="text-align:center"> Time Taken to Wake </p>
                    <h5 class="regularText" style="text-align:center"> {{ aveTime }} </h5>
                </ion-col>
            </ion-row>

            <ion-row class="ion-margin-vertical">
                <ion-col size="5">
                    <p class="span subtitleText" style="text-align:center"> Sleep Quality </p>
                    <!-- <h5 class="regularText" style="text-align:center"> {{ aveQuality}} </h5> -->
                    <div class="width:100%" style="text-align:center">
                    <img :src="require(`@/assets/emojis/${emoticons[aveQuality]}.svg`)" class="icon h4" :class="emoticons[aveQuality]" style="height:50px; margin-top:15px" />
                    </div>
                </ion-col>

                <ion-col size="7">
                    <p class="span subtitleText" style="text-align:center"> Wake Up Time </p>
                    <h5 class="regularText" style="text-align:center"> {{ aveWake }} </h5>
                </ion-col>
            </ion-row>


            <ion-row style="margin-bottom: 10px">
                <ion-col>
                    <ion-select :value="graphToShow" @ionChange="onChange($event)" style="padding:2px" interface="popover" mode="ios" class="regularText">
                        <ion-select-option value="snoozes">Snoozes</ion-select-option>
                        <ion-select-option value="timeToWake">Time Taken to Wake Up</ion-select-option>
                        <ion-select-option value="wakeUpTime">Wake Up Time</ion-select-option>
                        <ion-select-option value="sleepQuality">Sleep Quality</ion-select-option>
                    </ion-select>
                </ion-col>
                <ion-col>
                    <p class="regularText span" style="text-align:right"> 7 days </p>
                </ion-col>
            </ion-row>
            
            <!-- <ion-row class="ion-margin-vertical"> -->
                <line-chart v-if="graphToShow != 'sleepQuality'" :data="dataChart" :options="options"></line-chart>
                <ion-row v-else>
                    <ion-col v-for="(mood,index) in sleepQuality" :key="index">
                        <!-- replace with icons -->
                        <!-- <div class="mood-emoji" style="text-align:center;"> {{ emoticons[mood] }} </div> -->
                        <img :src="require(`@/assets/emojis/${emoticons[mood]}.svg`)" class="icon h5" :class="emoticons[mood]" />
                    </ion-col>
                </ion-row>
                <ion-row>
                    <ion-col v-for="(day,index) in ['S', 'M', 'T', 'W', 'TH', 'F', 'S']" :key="index">
                        <p class="span subtitleText" style="text-align:center"> {{ day }} </p>
                    </ion-col>
                </ion-row>
            <!-- </ion-row> -->



            <ion-row style="margin-top: 40px">
                <span class="regularText"> Today </span>
            </ion-row>
            <ion-row class="ion-margin-vertical">
                <ion-col>
                    <p class="span regularText" style="text-align:left"> Snoozes </p>
                </ion-col>
                <ion-col>
                    <p class="span subtitleText" style="text-align:right"> {{ todaySnooze }} times </p>
                </ion-col>
            </ion-row>
            <ion-row class="ion-margin-vertical">
                <ion-col>
                    <p class="span regularText" style="text-align:left"> Time Taken to Wake </p>
                </ion-col>
                <ion-col>
                    <p class="span subtitleText" style="text-align:right"> {{ todayTime }} </p>
                </ion-col>
            </ion-row>
            <ion-row class="ion-margin-vertical">
                <ion-col>
                    <p class="span regularText" style="text-align:left"> Wake Up Time </p>
                </ion-col>
                <ion-col>
                    <p class="span subtitleText" style="text-align:right"> {{ todayWake }} </p>
                </ion-col>
            </ion-row>
            <ion-row class="ion-margin-vertical">
                <ion-col>
                    <p class="span regularText" style="text-align:left"> Sleep Quality </p>
                </ion-col>
                <ion-col>
                    <p class="span subtitleText" style="text-align:right"> {{ todayQuality }} </p>
                </ion-col>
            </ion-row>
        </ion-grid>
    </ion-content>
</template>

<script>
import LineChart from './chart.vue'
import moment from 'moment'
export default({
    components: {
        LineChart
    },
    data () {
      return {
        // can be props instead
        // emoticons: ['😠', '😞', '😐', '😀', '😂'],
        emoticons: [ "angry", "sad-tear", "meh", "smile", "grin-stars"], 
        //
        graphToShow: "snoozes",

        // placeholder 7-day data
        snoozes: [1,2,3,4,5,6,7],
        timeToWake: ['00:10:00', '00:10:00', '00:15:00', '00:05:00', '00:01:10', '00:05:30', '00:10:00'],
        sleepQuality: [0, 1, 2, 3, 4, 2, 0],
        wakeUpTime: ['10:10:00', '12:00:00', '13:01:30', '12:00:00', '12:00:00', '12:00:00', '12:00:00'],

        //average values
        aveSnoozes: 3.5,
        aveTime: '00:20:00',
        aveQuality: '0',
        aveWake: '10:00 AM',

        todaySnooze: 5,
        todayTime: "10 min 30 sec",
        todayWake: "10:30 AM",
        todayQuality: "Good",

        // different yaxis confiugarions depending on data "type"
        timeY: [{
            type: 'linear',
            position: 'left',
            gridLines: {
                // display: false,
                color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
                fontColor: 'rgba(255, 255, 255, 0.5)',
                // min: moment('00:00:00', 'HH:mm:ss').diff(moment().startOf('day'), 'seconds'),
                stepSize: 1800,
                beginAtZero: false,
                callback: value => {
                    // moment(tempAnswer, 'HH:mm:ss').format('hh:mm A')
                    return moment((new Date(value * 1000)).toUTCString().match(/(\d\d:\d\d:\d\d)/)[0], 'HH:mm:ss').format('hh:mm A');
                }
            },
        }],

        timeStampY: [{
            type: 'linear',
            position: 'left',
            gridLines: {
                // display: false,
                color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
                fontColor: 'rgba(255, 255, 255, 0.5)',
                min: moment('00:00:00', 'HH:mm:ss').diff(moment().startOf('day'), 'seconds'),
                beginAtZero: false,
                callback: value => {
                    return (new Date(value * 1000)).toUTCString().match(/(\d\d:\d\d:\d\d)/)[0];
                }
            },
        }],

        numY: [{
            gridLines: {
                // display: false,
                color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
                min: 0,
                fontColor: 'rgba(255, 255, 255, 0.5)'
            }
        }],  

        noY: [{
            gridLines: {
                display: false,
            },
            ticks: {
                display: false
            }
        }],  

        datacollection: null,
        options: {
            responsive: true,
            // maintainAspectRatio: false,
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
                    gridLines: {
                        // display: false,
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        min: 0,
                        fontColor: 'rgba(255, 255, 255, 0.5)'
                    }
                }],  
                xAxes: [{
                    gridLines: {
                        display: false,
                    },
                    ticks: {
                        fontColor: 'rgba(255, 255, 255, 0.5)'
                    }
                }]  
            }
        
        }
      }
    },
    created() {
        this.dataChart = [1,2,3,4,5,6,7]
        this.getAverageNumber();
    },
    methods: {
        // call this also when new stats are added;
        getAverageNumber() {
            // snoozes
            var item
            var tempAnswer = 0;
            for (item of this.snoozes) {
                tempAnswer += item;
            }
            this.aveSnoozes = tempAnswer / 7;

            // time to wake
            tempAnswer = 0;
            for (item of this.timeToWake) {
                tempAnswer += moment(item, 'HH:mm:ss').diff(moment().startOf('day'), 'seconds');
            }
            tempAnswer = Math.floor(tempAnswer / 7);
            this.aveTime = (new Date(tempAnswer * 1000)).toUTCString().match(/(\d\d:\d\d:\d\d)/)[0];

            // wake up time
            tempAnswer = 0;
            for (item of this.wakeUpTime) {
                tempAnswer += moment(item, 'HH:mm:ss').diff(moment().startOf('day'), 'seconds');
            }
            tempAnswer = Math.floor(tempAnswer / 7);
            tempAnswer = (new Date(tempAnswer * 1000)).toUTCString().match(/(\d\d:\d\d:\d\d)/)[0];
            this.aveWake = moment(tempAnswer, 'HH:mm:ss').format('hh:mm A');
            // sleep quality

            var greatestFreq = 0;
            var count = 0
            for(item of [0,1,2,3,4,5]){
                count = this.sleepQuality.filter((mood) => mood == item).length;
                if(count > greatestFreq){
                    greatestFreq = count
                    tempAnswer = item;
                }
            }
            this.aveQuality = tempAnswer;
        },

        onChange($event){
            this.graphToShow = $event.target.value
            var temp;
            var i
            console.log("graph select changed", this.graphToShow);
            if (this.graphToShow == "snoozes") {
                this.dataChart = this.snoozes;
                this.$set(this.options.scales, 'yAxes', this.numY);
            }
            else if (this.graphToShow == "timeToWake") {        
                temp = JSON.parse(JSON.stringify(this.timeToWake));
                for (i in this.timeToWake) {
                    this.$set(temp, i, moment(this.timeToWake[i], 'HH:mm:ss').diff(moment().startOf('day'), 'seconds'));
                }
                this.dataChart = temp;
                this.$set(this.options.scales, 'yAxes', this.timeStampY);
            }
            else if (this.graphToShow == "wakeUpTime") {
                temp = JSON.parse(JSON.stringify(this.wakeUpTime));
                for (i in this.wakeUpTime) {
                    this.$set(temp, i, moment(this.wakeUpTime[i], 'HH:mm:ss').diff(moment().startOf('day'), 'seconds'));
                }
                this.dataChart = temp;
                this.$set(this.options.scales, 'yAxes', this.timeY);
            }
            // else if (this.graphToShow == "sleepQuality") {
            //     this.dataChart = [0,0,0,0,0,0,0];
            //     this.$set(this.options.scales, 'yAxes', this.noY);
            // }
        }
    },
    watch: {
        // datacollection() {
        //     console.log(this.datacollection.datasets[0])
        // }
    }
})
</script>
