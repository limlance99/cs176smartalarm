<template>
  <ion-content fullscreen class="ion-padding">
    <!-- <ion-list>
      <ion-list-header>
        <ion-label> Alarms </ion-label>
      </ion-list-header> -->

      <ion-item v-for="(alarm, key) in alarms" :key="key" lines="none" style="padding:10px">
        <h5 :class="[alarm.isActive ? 'regularText' : 'disabledText']"> {{alarm.time + alarm.ampm}} </h5>
        <ion-toggle @ionChange="toggleAlarm(key)" :checked="alarm.isActive"></ion-toggle>
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
