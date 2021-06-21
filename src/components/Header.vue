<template>
    <ion-header no-border>
        <ion-toolbar mode="ios">
            <ion-title>
                <h6 class="headerText"> {{header}} </h6>
            </ion-title>

            <ion-button color="primary" fill="clear" v-if="header=='Alarms'" slot="end" style="margin-right:10px; font-size:24px; font-weight:100" @click="openModal">
                <ion-icon name="add">
                </ion-icon>
            </ion-button>
            <span v-if="header=='Clock'" slot="end" style="font-size:12px; margin-right:10px;" @click="$emit('toggleAlarm');"> Test Alarm </span>
        </ion-toolbar>
    </ion-header>
</template>

<script>
// import { IonButton, IonContent, IonPage, modalController } from '@ionic/vue';
// import modalController from '@ionic/vue';
import AddAlarm from './AddAlarm.vue';

export default {
    props: ["header", "alarms"],
    methods: {
        async openModal() {
            const modal = await this.$ionic.modalController
                .create({
                component: AddAlarm,
                componentProps: {
                },
                });
            await modal.present();
            const { data } = await modal.onWillDismiss();
            if (data == null) {
                return;
            }
            this.alarms.push(data);
            this.alarms.sort((a, b) => (this.convertTime12to24(a) > this.convertTime12to24(b)) ? 1 : -1)
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
            }
    }
}
</script>
