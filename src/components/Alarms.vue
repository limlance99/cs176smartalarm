<template>
  <ion-content fullscreen class="ion-padding">
    <!-- <ion-list>
      <ion-list-header>
        <ion-label> Alarms </ion-label>
      </ion-list-header> -->
      <p v-if="alarms.length == 0" class="regularText"> You have no alarms. Add an alarm now. </p>
      <ion-item v-for="(alarm, key) in listOfAlarms" :key="key" lines="none">
        <ion-grid>
        <ion-row class="outerbox ion-margin-vertical" style="width:100%">
          <ion-col @click="presentActionSheet(key)">
            <h4 :class="[alarm.isActive ? 'regularText' : 'disabledText']" style="margin:0"> {{alarm.time + alarm.ampm}}</h4>
            <ion-col v-for="(day, index) in alarm.repetitions.filter(day => day.isActive)" :key="index">
              <span style="margin:0" :class="[alarm.isActive ? 'regularText' : 'disabledText']" v-if="day.isActive" > {{ day.day }} </span>
            </ion-col>
          </ion-col>
          <ion-col class="vertical-align-content" size="auto">
            <ion-toggle :checked="alarm.isActive == 1"  :color="[isMorning ? 'secondary' : 'primary']"  @ionChange="toggleAlarm(key, $event)" mode="ios"></ion-toggle>
          </ion-col>
        </ion-row>
        </ion-grid>
      </ion-item>
    <!-- </ion-list> -->
  </ion-content>
</template>

<script>
import axios from 'axios'
import { SERVER_URL } from "../../config.js"
export default {
    props: ["alarms", "isMorning"],
    computed: {
    listOfAlarms() {
      let allAlarms = [...this.alarms];
      return allAlarms;
    }
  },
    methods: {
        toggleAlarm(key, e) {
            if (e.detail.checked != this.listOfAlarms[key].isActive) this.$emit("toggleOne", key);
        },
        async presentActionSheet(key) {
          const actionSheet = await this.$ionic.actionSheetController
            .create({
              buttons: [
                {
                  text: 'Delete',
                  role: 'destructive',
                  handler: () => {
                    // console.log('deleting alarm from db');
                    axios.get(`${SERVER_URL}/deletealarm/${this.listOfAlarms[key].id}`)
                    .then(response => {
                      if (response.status == 200) {
                        this.$emit("deleteAlarm", key);
                      }
                    });
                    
                  },
                },
                {
                  text: 'Cancel',
                  role: 'cancel',
                  handler: () => {
                  },
                },
              ],
            });
          await actionSheet.present();

          const { role } = await actionSheet.onDidDismiss();
        },
    }
}
</script>
