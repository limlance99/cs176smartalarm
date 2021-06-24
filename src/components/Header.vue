<template>
    <ion-header no-border>
        <ion-toolbar mode="ios" style="height:67.2px" class="vertical-align-content">
            <ion-title>
                <h6 class="headerText"> {{header}} </h6>
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
    props: ["header", "alarms", "isMorning"],
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
            
            console.log(data);
            this.alarms.push(data);
            this.alarms.sort((a, b) => (this.convertTime12to24(a) > this.convertTime12to24(b)) ? 1 : -1);
            axios.post(`${SERVER_URL}/addalarm/16/`, {alarm: data})
            .then(response => {
                console.log(response);
                if (response.status == 200){
                    console.log(this.alarms);
                    this.$emit("getAlarms");
                    
                }
            });
            
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
