<template>
  <div id="app">
    <ion-app>
      <!-- <ion-vue-router/> -->
      <ion-tabs>
        <ion-tab tab="alarms">
          <Header :header="'Alarms'" />
          <Alarms :alarms="listOfAlarms" v-on:toggleAlarm="toggleOne" />
        </ion-tab>

        <ion-tab tab="clock">
          <Header :header="'Clock'" @toggleAlarm="toggleAlarm" />
          <Clock :time="time" :date="date" :ampm="ampm" />
        </ion-tab>

        <!-- <ion-tab tab="statistics">
          <Header :header="'Statistics'" />
          <Statistics />
        </ion-tab> -->

        <ion-tab tab="settings">
          <Header :header="'Settings'" />
          <Settings :difficulty="currentDiff" v-on:changeDiff="changeDiff" />
        </ion-tab>

        <ion-tab-bar slot="bottom">
          <ion-tab-button tab="alarms">
            <ion-label>Alarms</ion-label>
            <ion-icon name="alarm"></ion-icon>
          </ion-tab-button>
          <ion-tab-button tab="clock">
            <ion-label>Clock</ion-label>
            <ion-icon name="clock"></ion-icon>
          </ion-tab-button>
          <!-- <ion-tab-button tab="statistics">
            <ion-label>Statistics</ion-label>
            <ion-icon name="stats"></ion-icon>
          </ion-tab-button> -->
          <ion-tab-button tab="settings">
            <ion-label>Settings</ion-label>
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
// import Statistics from "./components/Statistics.vue";
import Settings from "./components/Settings.vue";
import Header from "./components/Header.vue";

import { newQuestion } from "./utils";
export default {
  name: "app",
  components: { Header, Clock, Alarms, /*Statistics,*/ Settings },

  data() {
    return {
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
        { time: "05:30", ampm: "AM", isActive: true },
        { time: "06:08", ampm: "PM", isActive: true },
      ],
    };
  },

  created() {
    this.intervalid1 = setInterval(
      function () {
        this.updateTime();
        this.checkAlarms();
      }.bind(this),
      1000
    );
  },
  methods: {
    toggleOne(key) {
      this.listOfAlarms[key].isActive = !this.listOfAlarms[key].isActive;
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
      for (let i = 0; i < length; ++i) {
        let item = this.listOfAlarms[i];
        if (!item.isActive) continue;
        if (item.time == time && item.ampm == amOrpm) {
          this.toggleAlarm();
          this.listOfAlarms[i].isActive = !this.listOfAlarms[i].isActive;
        }
      }
    },
    updateTime() {
      var cd = new Date();

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
      return this.zeroPadding(num, 2);
    },
    changeDiff(val) {
      this.currentDiff = val;
    },
    async toggleAlarm() {
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
  },
};
</script>

<style scoped>
</style>