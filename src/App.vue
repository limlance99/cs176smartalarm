<template>
  <div id="app" :class="[isMorning ? 'light' : 'dark']">
    <ion-app>
      <!-- <ion-vue-router/> -->
      <ion-tabs>
        <ion-tab tab="alarms">
          <Header :header="'Alarms'" :alarms="listOfAlarms" :isMorning="isMorning" @getAlarms="getAlarms" @pushToList="pushToList" :userID="userID"/>
          <Alarms :alarms="listOfAlarms" @toggleOne="toggleOne" :isMorning="isMorning" @deleteAlarm="deleteAlarm"/>
        </ion-tab>

        <ion-tab tab="clock">
          <Header :header="'Clock'" @toggleAlarm="toggleAlarm" :isMorning="isMorning" @getAlarms="getAlarms" :userID="userID"/>
          <Clock :time="time" :date="date" :ampm="ampm" />
        </ion-tab>

        <ion-tab tab="statistics">
          <Header :header="'Statistics'" @getAlarms="getAlarms" :userID="userID"/>
          <Statistics :allStats="allStats" :weekStats="weekStats"/>
        </ion-tab>

        <ion-tab tab="settings">
          <Header :header="'Settings'" :isMorning="isMorning" @getAlarms="getAlarms" :userID="userID"/>
          <Settings :difficulty="currentDiff" v-on:changeDiff="changeDiff" :userID="userID" @getSettings="getSettings"/>
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
            <!-- <ion-label>Statistics</ion-label> -->
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
import PickMood from "./components/PickMood.vue";
import Pigstep from "./ringtones/Pigstep-InsaneInTheRain.mp3"

import { newQuestion } from "./utils";
import axios from 'axios';
import { SERVER_URL } from "../config.js"
// import { ref } from "vue";

export default {
  name: "app",
  components: { Header, Clock, Alarms, Statistics, Settings, PickMood},
  setup() {
    return {
    };
  },
  data() {
    return {
      userID: 5,
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
        // { time: "02:07", ampm: "AM", isActive: true, repetitions: [{day: 'Su', isActive: false}, {day: 'M', isActive: true}, {day: 'T', isActive: true}, {day: 'W', isActive: true},] },
        // { time: "06:08", ampm: "PM", isActive: true, repetitions: [{day: 'Su', isActive: false}, {day: 'M', isActive: false}, {day: 'T', isActive: true}, {day: 'W', isActive: false},] },
      ],
      hiddenAlarms: [],
      intervalcheckTime: null,
      intervalcheckAlarms: null,
      ringtone: new Audio(Pigstep),
      deferredPrompt: null,
      allStats: [],
      weekStats: [],
      rangToday : [],
    };
  },
  created() {
    this.updateTime();
    // get user id from session
    // this.loading.present();
    setTimeout(async () => {
        const loading = await this.$ionic.loadingController.create({
          message: "Loading data..."
        });
        loading.present();
        axios.get(`${SERVER_URL}/login`,{ withCredentials: true })
        .then(response => {
          // console.log("user current logged in: ",response.data);
          // this.loading.dismiss();
          this.userID = response.data.id != null ? response.data.id : 5;
          // console.log("current user: ", this.userID);
          this.getAlarms();
          this.getStats();
          this.getSettings();
          loading.dismiss();
        });
      // this.loading.dismiss();
    }, 0);
    


    window.addEventListener('beforeinstallprompt', (e) => {
      // alert("beforeinstallprompt");

      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      this.deferredPrompt = e;
      // Update UI notify the user they can install the PWA
      this.showInstallAlert();
      //if user id isnt the default user ID, delete user and set user id to 5
      if (this.userID != 5) {
        this.deleteUser(this.userID);
      }

    });

    window.addEventListener('appinstalled', () => {
      // Hide the app-provided install promotion
      // hideInstallPromotion();
      // Clear the deferredPrompt so it can be garbage collected
      this.deferredPrompt = null;
      // Optionally, send analytics event to indicate successful install
      // alert('PWA was installed');
      this.createUser();

    });
  },
  mounted() {
    this.intervalcheckTime = setInterval(
      function () {
        this.updateTime();
      }.bind(this),
      10000,
    );
    this.startAlarmChecker();
  },
  watch: {
    ampm() {
    }
  },
  methods: {
    async showInstallAlert() {
      const alert = await this.$ionic.alertController
        .create({
          message: `<p class="no-margin"> Install now for a more personalized experience. </p>`,
          mode: "ios",
          buttons: [
            {
              text: "Download",
              handler: () => {
                this.deferredPrompt.prompt();
                // Wait for the user to respond to the prompt
                this.deferredPrompt.userChoice.then((choiceResult) => {
                  if (choiceResult.outcome === 'accepted') {
                    // console.log('User accepted the install prompt');
                  } else {
                    // console.log('User dismissed the install prompt');
                  }
                });
                return true;
              },
            },
          ],
          backdropDismiss: true,
        });
      await alert.present();

      const { role } = await alert.onDidDismiss();
      // console.log('onDidDismiss resolved with role', role);
    },
    startAlarmChecker() {
      // console.log("start again");
      // console.log(this.listOfAlarms);
      clearInterval(this.intervalcheckAlarms);
      this.intervalcheckAlarms = setInterval(
      function () {
        this.checkAlarms();
      }.bind(this),
      1000,
      );
    },
    pushToList(data) {
      clearInterval(this.intervalcheckAlarms);
      let index = this.listOfAlarms.findIndex(element => this.convertTime12to24(element) > this.convertTime12to24(data));
      if (index == -1) this.listOfAlarms.push(data);
      else this.listOfAlarms.splice(index, 0, data);
      this.startAlarmChecker();
    },
    deleteAlarm(key) {
      this.listOfAlarms.splice(key, 1);
    },
    convertTime12to24(data) {
            let {time, ampm} = data;
            let [hours, minutes] = time.split(':');

            if (hours === '12') {
                hours = '00';
            }

            if (ampm === 'PM') {
                hours = parseInt(hours, 10) + 12;
            }

            return `${hours}:${minutes}`;
            },
    toggleOne(key) {
      let item = Object.assign({}, this.listOfAlarms[key]);
      this.$set(item, 'isActive', item.isActive == 1 ? 0 : 1);
      this.$set(this.listOfAlarms, key, item);
      axios.post(`${SERVER_URL}/togglealarm/${this.listOfAlarms[key].id}`, {isActive: this.listOfAlarms[key].isActive})
      .then(response => {
          // console.log(response);
          if (response.status == 200){
              this.getAlarms();
          }
      });
    },
    createUser() {
      // console.log('Creating User');
      setTimeout(async () => {
        const loading = await this.$ionic.loadingController.create({
          message: "Loading data..."
        });
        loading.present();
        axios.get(`${SERVER_URL}/adduser`)
        .then(response => {
          if (response.status == 200) {
            // alert('created new user with ID:', response.data.id);
            this.userID = response.data.id;
            // console.log(this.userID);
            loading.dismiss();
            this.getAlarms();
            this.getStats();
            this.getSettings();
          }
        });
        // this.loading.dismiss();
      }, 0);
    },
    getAlarms() {
      // console.log("fetching alarms from db");
      setTimeout(async () => {
        const loading = await this.$ionic.loadingController.create({
          message: "Loading data..."
        });
        loading.present();
        axios.get(`${SERVER_URL}/getalarms/${this.userID}`)
        .then(response => {
          loading.dismiss();
          this.listOfAlarms = response.data;
          // this.listOfAlarms.forEach((item) => JSON.parse(item.repetitions));
        });
      // this.loading.dismiss();
      }, 0);
      
    },

    getStats() {
      setTimeout(async () => {
        const loading = await this.$ionic.loadingController.create({
          message: "Loading data..."
        });
        loading.present();
        axios.get(`${SERVER_URL}/getallstat/${this.userID}`)
        .then(response => {
          this.allStats = response.data;
        });
        axios.get(`${SERVER_URL}/getweekstat/${this.userID}`)
        .then(response => {
          this.weekStats = response.data;
          loading.dismiss();
        });
      // this.loading.dismiss();
      }, 0);
      // console.log("fetching stats from db");
      
      
    },
    getSettings() {
      setTimeout(async () => {
        const loading = await this.$ionic.loadingController.create({
          message: "Loading data..."
        });
        loading.present();
        // console.log(this.userID);
        axios.get(`${SERVER_URL}/getsetting/${this.userID}`)
      .then(response => {
        // console.log(response);
        if (response.status == 200) {
          this.currentDiff = response.data[0].difficulty;
          loading.dismiss();
        }
      });
      // this.loading.dismiss();
      }, 0);
      // console.log("getting settings from db");
    },
    deleteUser(userID) {
      // console.log("deleting user from db: ", userID);
      axios.get(`${SERVER_URL}/deleteuser/${userID}`)
      .then(response => {
        this.userID = 5;
        this.getAlarms();
      });
    },
    checkAlarms() {
      var length = this.listOfAlarms.length;
      var cd = new Date();
      var day = cd.getDay();
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
        let item = Object.assign({}, this.listOfAlarms[i]);
        if (item.isActive == false) continue;

        var activeDays = []
        for (let i = 0; i < item.repetitions.length; ++i) {
          if (item.repetitions[i].isActive) 
            activeDays.push(i);
        } 

        var hasSetDay = activeDays.length > 0;
        var willRing = (hasSetDay) ? 
          item.time == time && item.ampm == amOrpm && activeDays.includes(day) :
          item.time == time && item.ampm == amOrpm;

        if (willRing && !this.rangToday.includes(item.time)) {
          var toPass = {time : item.time, ampm : item.ampm, origDateTime : new Date(), snoozes: 0};
          // this.$set(item, 'isActive', false);
          // this.$set(this.listOfAlarms, i, item);
          if (!hasSetDay) this.toggleOne(i);
          else this.rangToday.push(item.time);
          
          clearInterval(this.intervalcheckAlarms);
          this.toggleAlarm(toPass);
        }
      }

      var hiddenLength = this.hiddenAlarms.length;
      for (let i = 0; i < hiddenLength; ++i) {
        let item = Object.assign({},this.hiddenAlarms[i]);
        if (!item.isActive) continue;
        if (item.time == time && item.ampm == amOrpm) {
          // this.hiddenAlarms.splice(i, 1);
          // this.hiddenAlarms[i].isActive = !this.hiddenAlarms[i].isActive;
          item.isActive = false;
          clearInterval(this.intervalcheckAlarms);
          this.$set(this.hiddenAlarms, i, item);
          this.toggleAlarm(item);
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
      this.isMorning = cd.getHours() >= 7 && cd.getHours() < 17;
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
    toggleAlarm(alarmTime) {
      this.ringtone.play();
      this.math = newQuestion[this.currentDiff]();

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
                var origDateTime = alarmTime.origDateTime;
                var snoozes = alarmTime.snoozes + 1;
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
                  origDateTime : origDateTime,
                  snoozes : snoozes,
                };

                this.hiddenAlarms.push(
                  newHiddenAlarm
                );
                // console.log(this.hiddenAlarms);
                this.startAlarmChecker();
                this.ringtone.pause();
                this.ringtone.currentTime = 0;
                return true;
              },
            },
            {
              text: "Stop Alarm",
              handler: async (data) => {
                // Stop ringtone from playing
                this.startAlarmChecker();
                this.ringtone.pause();
                this.ringtone.currentTime = 0;

                // Compute time taken to wake up
                var origDateTime = alarmTime.origDateTime;
                var curDateTime = new Date();
                var timeElapsed = curDateTime.getTime() - origDateTime.getTime(); // elapsed time in milliseconds
                
                var elapsedHours = Math.floor(timeElapsed / 3600000).toString();
                var elapsedMins = Math.floor((timeElapsed - elapsedHours * 3600000) / 60000).toString();
                var elapsedSecs = Math.floor((timeElapsed - elapsedHours * 3600000 - elapsedMins * 60000)/1000).toString();

                if (elapsedHours.length < 2) elapsedHours = '0' + elapsedHours;
                if (elapsedMins.length < 2) elapsedMins = '0' + elapsedMins;
                if (elapsedSecs.length < 2) elapsedSecs = '0' + elapsedSecs;
                
                var timeToWake = elapsedHours + ':' + elapsedMins + ':' + elapsedSecs; 

                // Format wake up time
                var hours = curDateTime.getHours();
                var mins = curDateTime.getMinutes();
                // var ampm = (hours >= 12) ? 'PM' : 'AM';

                if (mins >= 60) {
                  mins = mins % 60;
                  hours = hours + 1;
                }

                // if (hours >= 12) hours = hours - 12;
                if (hours < 10) hours = '0' + hours;
                if (mins < 10) mins = '0' + mins;
                
                // var wakeUpTime = hours + ':' + mins + ' ' + ampm;
                var wakeUpTime = hours + ':' + mins + ':' + '00';

                // Get number of snoozes
                var snoozes = alarmTime.snoozes;

                // Pick wake up mood / sleep quality
                var mood = await this.openMoodPicker();

                // Hi Gene, this is for you :P
                // console.log("Statistical Data Stuff");
                // console.log("Snoozes : " + snoozes);
                // console.log("Time To Wake: " + timeToWake);
                // console.log("Wake Up Time: " +  wakeUpTime);
                // console.log("Mood: " + mood);

                var statPost = {
                  userID: this.userID,
                  snoozes: snoozes,
                  timeToWake: timeToWake,
                  wakeUpTime: wakeUpTime,
                  mood: mood
                }
                // console.log("adding statistics to db");
                axios.post(`${SERVER_URL}/addstat`, {statPost})
                .then(response => {
                    // console.log(response);
                    if (response.status == 200){
                        // this.getAlarms();
                        this.getStats();
                        // getStats here
                    }
                });
                return true; 
              },
            },
          ],
          backdropDismiss: false,
        })
        .then((a) => a.present());
    },
    async openMoodPicker() {
      const modal = await this.$ionic.modalController
          .create({
          component: PickMood,
          componentProps: {
              propsData: {
                isMorning : this.isMorning,
              }
          },
          });

      await modal.present();
      const { data } = await modal.onWillDismiss();
      if (data == null) {
          return null;
      }

      return data;
        
    },
  },
};
</script>

<style scoped>

</style>