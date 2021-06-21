<template>
  <ion-content fullscreen class="ion-padding">
    <!-- <ion-list>
      <ion-list-header>
        <ion-label> Alarms </ion-label>
      </ion-list-header> -->

      <ion-item v-for="(alarm, key) in alarms" :key="key" lines="none">
        <ion-grid>
        <ion-row class="outerbox ion-margin-vertical" style="width:100%">
          <ion-col>
            <h5 :class="[alarm.isActive ? 'regularText' : 'disabledText']" style="margin:0"> {{alarm.time + alarm.ampm}} </h5>
            <ion-col v-for="(day, index) in alarm.repetitions.filter(day => day.isActive)" :key="index">
              <span style="margin:0" :class="[alarm.isActive ? 'regularText' : 'disabledText']" v-if="day.isActive" > {{ day.day }} </span>
            </ion-col>
          </ion-col>
          <ion-col class="vertical-align-content" size="auto">
            <ion-toggle @ionChange="toggleAlarm(key)" :checked="alarm.isActive"></ion-toggle>
          </ion-col>
        </ion-row>
        </ion-grid>
      </ion-item>
    <!-- </ion-list> -->
  </ion-content>
</template>

<script>

export default {
    props: ["alarms"],
    methods: {
        toggleAlarm(key) {
            this.$emit("toggleAlarm", key);
        }
    }
}
</script>
