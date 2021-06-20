<template>
    <ion-content class="ion-padding">
        <ion-list>

        <ion-list-header>
            <ion-label> Add Alarm </ion-label>
            <ion-button @click="closeModal" color="primary" fill="clear"> Done </ion-button>
        </ion-list-header>

        <ion-item>
            <ion-label>Alarm Time</ion-label>
            <ion-datetime display-format="h:mm A" placeholder="Enter Time" value="2016-09-18T12:00:02.666Z" @ionChange="wibba = getHoursMins($event.target.value);"></ion-datetime>
        </ion-item>

        <ion-item>
            <ion-label> This was your input: </ion-label>
            <ion-label> {{ wibba }} </ion-label>
        </ion-item>
  
    </ion-list>
    </ion-content>
</template>

<script>
// import { IonDatetime, IonItem, IonLabel } from "@ionic/vue";

export default {
  name: 'AddAlarm',
  data() {
      return {
        wibba : '08:00 PM',
    }
  },

  methods : {
      getHoursMins (datetime) {
        let d = datetime.split('T')[1];
        let m = d.split(':')[0];
        let n = d.split(':')[1];
        var AmOrPm = m >= 12 ? 'PM' : 'AM';
        m = (m % 12) || 12;

        let digit = m >= 12 ? 0 : 1;
        var zero = "";
        for (var i = 0; i < digit; i++) {
            zero += "0";
        }

        let h = zero + m;
        var tm = h + ":" + n + " " + AmOrPm;
        return tm;
      },
      async closeModal() {
        let t = this.wibba.split(' ')[0];
        let ap = this.wibba.split(' ')[1];
        let thing = { time: t, ampm: ap, isActive: true};

        const modal = await this.$ionic.modalController;
        return modal.dismiss(thing)
      },
  }
};
</script>