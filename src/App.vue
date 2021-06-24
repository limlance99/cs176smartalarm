<template>
  <div id="app" :class="[isMorning ? 'light' : 'dark']">
    <ion-app>
      <!-- <ion-vue-router/> -->
      <ion-tabs>
        <ion-tab tab="alarms">
          <Header :header="'Alarms'" :alarms="listOfAlarms" :isMorning="isMorning"/>
          <Alarms :alarms="listOfAlarms" @toggleOne="toggleOne" :isMorning="isMorning"/>
        </ion-tab>

        <ion-tab tab="clock">
          <Header :header="'Clock'" @toggleAlarm="toggleAlarm" :isMorning="isMorning"/>
          <Clock :time="time" :date="date" :ampm="ampm" />
        </ion-tab>

        <ion-tab tab="statistics">
          <Header :header="'Statistics'" />
          <Statistics />
        </ion-tab>

        <ion-tab tab="settings">
          <Header :header="'Settings'" :isMorning="isMorning"/>
          <Settings :difficulty="currentDiff" v-on:changeDiff="changeDiff"/>
        </ion-tab>

        <ion-tab-bar slot="bottom" style="padding-top:5px; padding-bottom:5px" :color="[isMorning ? 'secondary' : 'primary']">
          <ion-tab-button tab="alarms">
            <!-- <ion-label>Alarms</ion-label> -->
            <ion-icon name="alarm"></ion-icon>
          </ion-tab-button>
          <ion-tab-button tab="clock">
            <!-- <ion-label>Clock</ion-label> -->
            <ion-icon name="clock"></ion-icon>
          </ion-tab-button>
          <ion-tab-button tab="statistics">
            <ion-label>Statistics</ion-label>
            <ion-icon name="stats"></ion-icon>
          </ion-tab-button>
          <ion-tab-button tab="settings">
            <!-- <ion-label>Settings</ion-label> -->
            <ion-icon name="settings"></ion-icon>
          </ion-tab-button>
        </ion-tab-bar>
      </ion-tabs>
    </ion-app>
  </div>
</template>

<script>
import Clock from "./components/Clock.vue";
import Alarms from "./components/Alarms.vue";
import Statistics from "./components/Statistics.vue";
import Settings from "./components/Settings.vue";
import Header from "./components/Header.vue";


import { newQuestion } from "./utils";
import axios from 'axios';
// import { ref } from "vue";

export default {
  name: "app",
  components: { Header, Clock, Alarms, Statistics, Settings},
  setup() {
    return {
    };
  },
  data() {
    return {
      userID: 16,
      isMorning: false,
      toolbarHeader: "Alarms",
      time: "",
      date: "",
      ampm: "",
      week: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      month: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
      math: {},
      difficulties: ["Easy", "Medium", "Hard"],
      currentDiff: "Easy",
      listOfAlarms: [
        { time: "05:30", ampm: "AM", isActive: true, repetitions: ['M', 'T', 'W'] },
        { time: "06:08", ampm: "PM", isActive: true, repetitions: ['S'] },
      ],
      hiddenAlarms: [],
    };
  },
  mounted() {
  },
  created() {
    this.updateTime();
    this.getAlarms();
    // this.intervalid1 = setInterval(
    //   function () {
    //     this.updateTime();
    //     this.checkAlarms();
    //   }.bind(this),
    //   10000,
    // );
    window.addEventListener('beforeinstallprompt', (e) => {
      alert("beforeinstallprompt");

      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      deferredPrompt = e;
      // Update UI notify the user they can install the PWA
      showInstallPromotion();
    });
  },
  mounted() {
    this.intervalid1 = setInterval(
      function () {
        this.updateTime();
        this.checkAlarms();
      }.bind(this),
      1000,
    );
  },
  watch: {
    ampm() {
    }
  },
  methods: {
    getAlarms() {
      console.log("HOY");
      axios.get("http://localhost:3000/getalarms/16")
      .then(response => {
        console.log(response);
        this.listOfAlarms = response.data;
        // this.listOfAlarms.forEach((item) => JSON.parse(item.repetitions));
      });
    },
    toggleOne(key) {
      console.log('TOGGLE', this.listOfAlarms[key], this.listOfAlarms[key].id);
      this.listOfAlarms[key].isActive = this.listOfAlarms[key].isActive == 1 ? 0 : 1;
      axios.post(`http://localhost:3000/togglealarm/${this.listOfAlarms[key].id}`, {isActive: this.listOfAlarms[key].isActive})
      .then(response => {
          console.log(response);
          if (response.status == 200){
              // console.log(this.listOfAlarms);
          }
      });
    },

    checkAlarms() {
      var length = this.listOfAlarms.length;
      var cd = new Date();
      var hour = cd.getHours();
      var mins = this.zeroPadding(cd.getMinutes(), 2);
      var amOrpm;

      if (hour >= 12) {
        amOrpm = "PM";
        if (hour > 12) hour = this.zeroPadding(hour - 12, 2);
        else hour = this.zeroPadding(hour, 2);
      } else {
        amOrpm = "AM";
        if (hour == 0) hour = 12;
        else hour = this.zeroPadding(hour, 2);
      }
      var time = `${hour}:${mins}`;
      // console.log(this.listOfAlarms);
      for (let i = 0; i < length; ++i) {
        let item = this.listOfAlarms[i];
        if (!item.isActive) continue;
        if (item.time == time && item.ampm == amOrpm) {
          // console.log('alarms were checked');
          // console.log(this.listOfAlarms[i].isActive);
          // this.listOfAlarms[i].isActive = !this.listOfAlarms[i].isActive;
          this.$set(this.listOfAlarms[i], "isActive", !this.listOfAlarms[i].isActive);
          // console.log(this.listOfAlarms[i].isActive);
          this.toggleAlarm(item);
        }
      }

      var hiddenLength = this.hiddenAlarms.length;
      for (let i = 0; i < hiddenLength; ++i) {
        let item = this.hiddenAlarms[i];
        if (!item.isActive) continue;
        if (item.time == time && item.ampm == amOrpm) {
          this.toggleAlarm(item);
          // this.hiddenAlarms.splice(i, 1);
          this.hiddenAlarms[i].isActive = !this.hiddenAlarms[i].isActive;
        }
      }


      // Remove inactive hidden alarms
      var newList = [];
      for (let i = 0; i < hiddenLength; ++i) {
        if (this.hiddenAlarms[i].isActive)
          newList.push(this.hiddenAlarms[i]);
      }
      this.hiddenAlarms = [];
      for (let i = 0; i < newList.length; ++i) {
        this.hiddenAlarms.push(newList[i]);
      }

    },
    updateTime() {
      var cd = new Date();
      this.isMorning = cd.getHours() > 7 && cd.getHours() < 17;
      this.time =
        this.formatHour(cd.getHours()) +
        ":" +
        this.zeroPadding(cd.getMinutes(), 2);
      this.date =
        this.week[cd.getDay()] +
        ", " +
        this.month[cd.getMonth()] +
        " " +
        cd.getDate();
    },
    zeroPadding(num, digit) {
      var zero = "";
      for (var i = 0; i < digit; i++) {
        zero += "0";
      }
      return (zero + num).slice(-digit);
    },
    formatHour(num) {
      if (num >= 12) {
        this.ampm = "PM";
        if (num > 12) {
          return this.zeroPadding(num - 12, 2);
        }
        return this.zeroPadding(num, 2);
      }
      this.ampm = "AM";
      if (num == 0) {
        return 12;
      }
      this.isMorning = num > 7 && num < 17;
      return this.zeroPadding(num, 2);
    },
    changeDiff(val) {
      this.currentDiff = val;
    },
    async toggleAlarm(alarmTime) {
      this.math = await newQuestion[this.currentDiff]();
      return this.$ionic.alertController
        .create({
          message: `<p class="no-margin"> ${this.math.question} </p>`,
          mode: "ios",
          inputs: [
            {
              name: "answer",
              id: "answer",
              value: "",
              placeholder: "Enter your answer here",
            },
          ],
          buttons: [
            {
              text: "Submit",
              handler: (data) => {
                if (data.answer != this.math.answer) {
                  this.showErrorToast("Wrong answer");
                  return false;
                }
                this.showWakeupOptions(alarmTime);
                return true;
              },
            },
          ],
          backdropDismiss: false,
        })
        .then((a) => a.present());
    },
    async showErrorToast(data) {
      const toast = await this.$ionic.toastController.create({
        message: data,
        duration: 2000,
        mode: "ios",
        position: "top",
        color: "danger",
      });
      await toast.present();
    },
    async showWakeupOptions(alarmTime) {
      return this.$ionic.alertController
        .create({
          message: `<p class="no-margin"> Snooze or Stop Alarm </p>`,
          mode: "ios",
          buttons: [
            {
              text: "Snooze",
              handler: (data) => {
                var hours = parseInt(alarmTime.time.split(':')[0]);
                var mins = parseInt(alarmTime.time.split(':')[1]) + 1;
                var ampm = alarmTime.ampm;

                if (mins >= 60) {
                  mins = mins % 60;
                  hours = hours + 1;
                }

                if (hours >= 12) {
                  hours = hours - 12;
                  ampm = (ampm == "PM") ? "AM" : "PM";
                }

                if (hours < 10) {
                  hours = '0' + hours;
                }

                if (mins < 10) {
                  mins = '0' + mins;
                }

                var fullTime = hours + ':' + mins;
                var newHiddenAlarm = {
                  time : fullTime,
                  ampm : ampm,
                  isActive : true,
                };

                this.hiddenAlarms.push(
                  newHiddenAlarm
                );
                console.log(this.hiddenAlarms);
                return true;
              },
            },
            {
              text: "Stop Alarm",
              handler: (data) => {
                return true;
              },
            },
          ],
          backdropDismiss: false,
        })
        .then((a) => a.present());
    },
  },
};
</script>

<style scoped>

</style>