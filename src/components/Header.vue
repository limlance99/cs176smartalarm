<template>
    <ion-header no-border>
        <ion-toolbar mode="ios">
            <ion-title>
                <h6> {{header}} </h6>
            </ion-title>
            <ion-icon v-if="header=='Alarms'" slot="end" name="add" style="margin-right:10px; font-size:24px; font-weight:100"></ion-icon>
            <span v-if="header=='Clock'" slot="end" style="font-size:12px; margin-right:10px;" @click="$emit('toggleAlarm');"> Test Alarm </span>
        </ion-toolbar>
    </ion-header>
</template>

<script>
export default {
    props: ["header"],
    methods: {
    }
}
</script>
