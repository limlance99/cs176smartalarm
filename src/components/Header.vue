<template>
    <ion-header no-border>
        <ion-toolbar mode="ios">
            <ion-title>
                <h6> {{header}} </h6>
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
            this.alarms.push(data);
        },
    }
}
</script>
