<template>
    <ion-content fullscreen class="ion-padding">
        <!-- <ion-list> -->
        <ion-header no-border>
            <ion-toolbar mode="ios" style="height:67.2px" class="vertical-align-content">
                <ion-title style="padding:0px">
                    <h6 :class="[isMorning ? '' : 'dark']" class='headerText ion-text-center'  style="margin:0; width:100%"> How is your mood? </h6>
                </ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-row>
            <!-- ['😠', '😞', '😐', '😀', '😂'] -->
            <ion-col v-for="(n, index) in 5" :key="index" @click="changeSelection(index)" style="padding:10px; cursor: pointer">
                <img :src="require(`@/assets/emojis/${emoticons[index]}.svg`)" class="icon h5" :class="[mood == index ? emoticons[index] : 'white-icon']" />
            </ion-col>
        </ion-row>

        <ion-button expand="block" fill="solid" @click="closeModal">Submit</ion-button>
    </ion-content>
</template>

<script>
// import { IonDatetime, IonItem, IonLabel } from "@ionic/vue";
export default {
  name: 'PickMood',
  props: ["isMorning"],
  data() {
      return {
          mood : -1,
          emoticons: [ "angry", "sad-tear", "meh", "smile", "grin-stars"],
      }
  },


  components: {
  },

  mounted() {
        // this.$nextTick(this.test);
  },

  methods : {

    async closeModal() {
        const modal = await this.$ionic.modalController;
        return modal.dismiss(this.mood);
    },

    async exitModal() {
        const modal = await this.$ionic.modalController;
        return modal.dismiss();
    },

    changeSelection(index) {
        console.log(index);
        this.mood = index;
    }
  }
};
</script>