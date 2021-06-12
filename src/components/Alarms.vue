<template>
  <ion-content class="ion-padding">
    <ion-list>
      <ion-list-header>
        <ion-label> Alarms </ion-label>
      </ion-list-header>

      <ion-item v-for="(alarm, key) in alarms" :key="key">
        <ion-label> {{alarm.time + alarm.ampm}} </ion-label>
        <ion-toggle @ionChange="toggleAlarm(key)" :checked="alarm.isActive"></ion-toggle>
      </ion-item>
    </ion-list>
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
