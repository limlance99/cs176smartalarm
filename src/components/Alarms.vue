<template>
  <ion-content fullscreen class="ion-padding">
    <!-- <ion-list>
      <ion-list-header>
        <ion-label> Alarms </ion-label>
      </ion-list-header> -->
      <h5 v-if="alarms.length == 0" class="regularText"> You have no alarms. Add an alarm now. </h5>
      <ion-item v-for="(alarm, key) in alarms" :key="key" lines="none">
        <ion-grid>
        <ion-row class="outerbox ion-margin-vertical" style="width:100%">
          <ion-col @click="presentActionSheet(key)">
            <h4 :class="[alarm.isActive ? 'regularText' : 'disabledText']" style="margin:0"> {{alarm.time + alarm.ampm}}</h4>
            <ion-col v-for="(day, index) in alarm.repetitions.filter(day => day.isActive)" :key="index">
              <span style="margin:0" :class="[alarm.isActive ? 'regularText' : 'disabledText']" v-if="day.isActive" > {{ day.day }} </span>
            </ion-col>
          </ion-col>
          <ion-col class="vertical-align-content" size="auto">
            <ion-toggle  :checked="alarm.isActive ==1" :color="[isMorning ? 'secondary' : 'primary']" @ionChange="toggleAlarm(key)" ></ion-toggle>
          </ion-col>
        </ion-row>
        </ion-grid>
      </ion-item>
    <!-- </ion-list> -->
  </ion-content>
</template>

<script>
import axios from 'axios'
export default {
    props: ["alarms", "isMorning"],
    created() {
      console.log("HoOOoY:",this.alarms)
    },
    methods: {
        toggleAlarm(key) {
          console.log("TOGGGLE");
          this.$emit("toggleOne", key);
        },
        async presentActionSheet(key) {
          const actionSheet = await this.$ionic.actionSheetController
            .create({
              buttons: [
                {
                  text: 'Delete',
                  role: 'destructive',
                  handler: () => {
                    console.log(this.alarms[key].id);
                    axios.get(`http://localhost:3000/deletealarm/${this.alarms[key].id}`)
                    .then(response => {
                      console.log(response);
                      if (response.status == 200) {
                        this.alarms.splice(key, 1);
                      }
                    });
                    
                  },
                },
                {
                  text: 'Cancel',
                  role: 'cancel',
                  handler: () => {
                    // console.log('Cancel clicked')
                  },
                },
              ],
            });
          await actionSheet.present();

          const { role } = await actionSheet.onDidDismiss();
          // console.log('onDidDismiss resolved with role', role);
        },
    }
}
</script>
