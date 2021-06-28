<template>
    <ion-content fullscreen class="ion-padding">
        <ion-grid>
            <ion-row>
                <span class="regularText"> Averages </span>
            </ion-row>
            <ion-row class="ion-margin-vertical">
                <ion-col size="5">
                    <p class="span subtitleText" style="text-align:center"> Snoozes Per Day </p>
                    <h5 class="regularText" style="text-align:center"> {{ aveSnoozes}} </h5>
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
                    <h5 v-if="allStatsLength == 0" class="regularText"> - </h5>
                    <img v-else :src="require(`@/assets/emojis/${emoticons[aveQuality]}.svg`)" class="icon h4" :class="emoticons[aveQuality]" style="height:50px; margin-top:15px" />
                    </div>
                </ion-col>

                <ion-col size="7">
                    <p class="span subtitleText" style="text-align:center"> Wake Up Time </p>
                    <h5 class="regularText" style="text-align:center"> {{ aveWake }} </h5>
                </ion-col>
            </ion-row>


            <ion-row style="margin-bottom: 10px">
                <ion-col>
                    <ion-select :value="graphToShow" @ionChange="onChange($event, true)" style="padding:2px" interface="popover" mode="ios" class="regularText">
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
            <div v-if="this.allStatsLength">
            <!-- <ion-row class="ion-margin-vertical"> -->
                <line-chart v-if="graphToShow != 'sleepQuality'" :data="dataChart" :options="options"></line-chart>
                <div v-else>
                    <ion-row>
                        <ion-col v-for="(n,index) in 7" :key="index">
                            <img v-if="weekGraphData.mood.length > index && weekGraphData.mood[index] != '-' " :src="require(`@/assets/emojis/${emoticons[weekGraphData.mood[index]]}.svg`)" class="icon h5" :class="emoticons[weekGraphData.mood[index]]"/>
                            <p v-if="weekGraphData.mood[index] == '-'" class="regularText" style="text-align:center; padding:0; margin:0"> - </p>
                        </ion-col>
                    </ion-row>
                    <ion-row>
                        <ion-col v-for="(day,index) in ['S', 'M', 'T', 'W', 'TH', 'F', 'S']" :key="index">
                            <p class="span subtitleText" style="text-align:center"> {{ day }} </p>
                        </ion-col>
                    </ion-row>
                </div>
            </div>
            <p v-else class="subtitleText"> No stats to show </p>
            <!-- </ion-row> -->



            <ion-row style="margin-top: 40px">
                <span class="regularText"> Most Recent </span>
            </ion-row>
            <ion-row class="ion-margin-vertical">
                <ion-col>
                    <p class="span regularText" style="text-align:left"> Snoozes </p>
                </ion-col>
                <ion-col>
                    <p class="span subtitleText" style="text-align:right"> {{ this.allStatsLength ? this.allStats[allStatsLength-1].snoozes + ' times' : 'No Record'}}  </p>
                </ion-col>
            </ion-row>
            <ion-row class="ion-margin-vertical">
                <ion-col>
                    <p class="span regularText" style="text-align:left"> Time Taken to Wake </p>
                </ion-col>
                <ion-col>
                    <p class="span subtitleText" style="text-align:right"> {{ this.allStatsLength ? this.allStats[allStatsLength-1].timeToWake : 'No Record' }}</p>
                </ion-col>
            </ion-row>
            <ion-row class="ion-margin-vertical">
                <ion-col>
                    <p class="span regularText" style="text-align:left"> Wake Up Time </p>
                </ion-col>
                <ion-col>
                    <p class="span subtitleText" style="text-align:right"> {{ this.allStatsLength ? todayWake : 'No Record' }} </p>
                </ion-col>
            </ion-row>
            <ion-row class="ion-margin-vertical">
                <ion-col>
                    <p class="span regularText" style="text-align:left"> Sleep Quality </p>
                </ion-col>
                <ion-col>
                    <p class="span subtitleText" style="text-align:right"> {{ this.allStatsLength ? word[this.allStats[allStatsLength-1].mood] : 'No Record'}} </p>
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
    computed: {
        todayWake() {
            return moment(this.allStats[this.allStatsLength-1].wakeUpTime, 'HH:mm:ss').format('hh:mm A');
        }
    },
    props: ['allStats', 'weekStats'],
    data () {
      return {
        // can be props instead
        // emoticons: ['😠', '😞', '😐', '😀', '😂'],
        emoticons: [ "angry", "sad-tear", "meh", "smile", "grin-stars"], 
        word: ['Very Bad', 'Bad', 'Neutral', 'Good', 'Very Good'],
        //
        graphToShow: "snoozes",

        // // placeholder 7-day data
        // snoozes: [1,2,3,4,5,6,7],
        // timeToWake: ['00:10:00', '00:10:00', '00:15:00', '00:05:00', '00:01:10', '00:05:30', '00:10:00'],
        // sleepQuality: [0, 1, 2, 3, 4, 2, 0],
        // wakeUpTime: ['10:10:00', '12:00:00', '13:01:30', '12:00:00', '12:00:00', '12:00:00', '12:00:00'],

        // //average values
        // aveSnoozes: 3.5,
        // aveTime: '00:20:00',
        // aveQuality: '0',
        // aveWake: '10:00 AM',

        // todaySnooze: 5,
        // todayTime: "10 min 30 sec",
        // // todayWake: "10:30 AM",
        // todayQuality: "Good",

        allStatsLength: 0,
        weekGraphData: {},
        dataChart:[],

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
    async created() {
        
        this.getAverageNumber();
        await this.formatWeekData();
        this.dataChart = this.weekGraphData.snoozes;
    },
    methods: {
        // call this also when new stats are added;
        getAverageNumber() {
            // snoozes
            var item
            var tempAnswer = 0;
            var tempAnsSnooze = 0;
            var tempAnsTTW = 0;
            var tempAnsWUT = 0;

            this.allStatsLength = this.allStats.length;
            for (item of this.allStats) {
                tempAnsSnooze += item.snoozes;
                tempAnsTTW += moment(item.timeToWake, 'HH:mm:ss').diff(moment().startOf('day'), 'seconds');
                tempAnsWUT += moment(item.wakeUpTime, 'HH:mm:ss').diff(moment().startOf('day'), 'seconds');
            }
            this.aveSnoozes = this.allStatsLength ? (tempAnsSnooze / this.allStatsLength).toFixed(2) : '-';

            tempAnsTTW = Math.floor(tempAnsTTW / this.allStatsLength);
            this.aveTime = this.allStatsLength ? (new Date(tempAnsTTW * 1000)).toUTCString().match(/(\d\d:\d\d:\d\d)/)[0] : '-';

            tempAnsWUT = Math.floor(tempAnsWUT / this.allStatsLength);
            tempAnsWUT = this.allStatsLength ? (new Date(tempAnsWUT * 1000)).toUTCString().match(/(\d\d:\d\d:\d\d)/)[0] :'-';
            this.aveWake = this.allStatsLength ? moment(tempAnsWUT, 'HH:mm:ss').format('hh:mm A'): '-';
            
            // // time to wake
            // tempAnswer = 0;
            // for (item of this.allStats.timeToWake) {
            //     tempAnswer += moment(item, 'HH:mm:ss').diff(moment().startOf('day'), 'seconds');
            // }
            // tempAnswer = Math.floor(tempAnswer / 7);
            // this.aveTime = (new Date(tempAnswer * 1000)).toUTCString().match(/(\d\d:\d\d:\d\d)/)[0];

            // // wake up time
            // tempAnswer = 0;
            // for (item of this.allStats.this.wakeUpTime) {
            //     tempAnswer += moment(item, 'HH:mm:ss').diff(moment().startOf('day'), 'seconds');
            // }
            // tempAnswer = Math.floor(tempAnswer / 7);
            // tempAnswer = (new Date(tempAnswer * 1000)).toUTCString().match(/(\d\d:\d\d:\d\d)/)[0];
            // this.aveWake = moment(tempAnswer, 'HH:mm:ss').format('hh:mm A');

            // sleep quality

            var greatestFreq = 0;
            var count = 0
            for(item of [0,1,2,3,4,5]){
                count = this.allStats.filter((stat) => stat.mood == item).length;
                if(count > greatestFreq){
                    greatestFreq = count
                    tempAnswer = item;
                }
            }
            this.aveQuality = tempAnswer;
        },

        onChange($event, clicked){
            this.graphToShow = clicked ? $event.target.value : this.graphToShow;
            var temp;
            var i
            if (this.graphToShow == "snoozes") {
                this.dataChart = this.weekGraphData.snoozes;
                this.$set(this.options.scales, 'yAxes', this.numY);
            }
            else if (this.graphToShow == "timeToWake") {        
                temp = JSON.parse(JSON.stringify(this.weekGraphData.timeToWake));
                for (i in this.weekGraphData.timeToWake) {
                    this.$set(temp, i, moment(this.weekGraphData.timeToWake[i], 'HH:mm:ss').diff(moment().startOf('day'), 'seconds'));
                }
                this.dataChart = temp;
                this.$set(this.options.scales, 'yAxes', this.timeStampY);
            }
            else if (this.graphToShow == "wakeUpTime") {
                temp = JSON.parse(JSON.stringify(this.weekGraphData.wakeUpTime));
                for (i in this.weekGraphData.wakeUpTime) {
                    this.$set(temp, i, moment(this.weekGraphData.wakeUpTime[i], 'HH:mm:ss').diff(moment().startOf('day'), 'seconds'));
                }
                this.dataChart = temp;
                this.$set(this.options.scales, 'yAxes', this.timeY);
            }
            // else if (this.graphToShow == "sleepQuality") {
            //     this.dataChart = [0,0,0,0,0,0,0];
            //     this.$set(this.options.scales, 'yAxes', this.noY);
            // }
        },

        formatWeekData() {
            this.weekGraphData = {
                snoozes: [],
                timeToWake: [],
                wakeUpTime: [],
                mood:[]
            };
            for (var item of this.weekStats) {
                if (item.dayOfWeek - 1 <= this.weekGraphData.snoozes.length - 1) { //normal entry or repeat value (multiple entries in one day)
                    this.$set(this.weekGraphData.snoozes,item.dayOfWeek-1, item.snoozes);
                    this.$set(this.weekGraphData.timeToWake,item.dayOfWeek-1, item.timeToWake);
                    this.$set(this.weekGraphData.wakeUpTime,item.dayOfWeek-1,item.wakeUpTime);
                    this.$set(this.weekGraphData.mood,item.dayOfWeek-1,item.mood);
                }
                else if (item.dayOfWeek - 1 > this.weekGraphData.snoozes.length - 1) { //if no entry before (i.e. if Monday (2) is the first entry) 2 - 1 > 0; 1 > 0
                    for (let i = 0; i <= (item.dayOfWeek - 1- this.weekGraphData.snoozes.length - 1); i++) {
                        this.weekGraphData.snoozes.push('-');
                        this.weekGraphData.timeToWake.push('-');
                        this.weekGraphData.wakeUpTime.push('-');
                        this.weekGraphData.mood.push('-');
                    }
                    this.weekGraphData.snoozes.push(item.snoozes);
                    this.weekGraphData.timeToWake.push(item.timeToWake);
                    this.weekGraphData.wakeUpTime.push(item.wakeUpTime);
                    this.weekGraphData.mood.push(item.mood);
                }
            }
        }
    },
    watch: {
        allStats() {
            console.log("stats updated, getting new average");
            this.getAverageNumber();
            // this.todayWake = moment(this.allStats[this.allStatsLength-1].wakeUpTime, 'HH:mm:ss').format('hh:mm A');
        },
        async weekStats() {
            console.log("week stats updated, getting new average");
            let res = await this.formatWeekData();
            this.onChange('dummy', false);
            // this.onChange('dummy', false);
        }
    }
})
</script>
