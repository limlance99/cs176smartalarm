<template>
    <ion-header no-border>
        <ion-toolbar mode="ios" style="height:67.2px" class="vertical-align-content">
            <ion-title>
                <h6 :class="[[isMorning ? '' : 'dark'], 'headerText']"> {{header}} </h6>
            </ion-title>

            <ion-button no-padding :color="[isMorning ? 'secondary' : 'primary']" fill="clear" v-if="header=='Alarms'" slot="end" style="margin-right:10px; font-size:24px; font-weight:100" @click="openModal">
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
import { SERVER_URL } from "../../config.js"
import axios from "axios"
export default {
    props: ["header", "isMorning", "userID"],
    methods: {
        async openModal() {
            const modal = await this.$ionic.modalController
                .create({
                component: AddAlarm,
                componentProps: {
                    propsData: {
                        isMorning: this.isMorning
                    }
                },
                });
            await modal.present();
            const { data } = await modal.onWillDismiss();
            if (data == null) {
                return;
            }
            
            axios.post(`${SERVER_URL}/addalarm/${this.userID}/`, {alarm: data})
            .then(response => {
                console.log(response);
                if (response.status == 200){
                    this.$emit("pushToList", data);
                    this.$emit("getAlarms");   
                }
            });
            
        },
    }
}
</script>
