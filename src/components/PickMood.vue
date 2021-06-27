<template>
    <ion-content fullscreen class="ion-padding">
        <!-- <ion-list> -->
        <ion-header no-border mode="ios">
            <ion-title style="padding:0px">
                <h6 :class="[isMorning ? '' : 'dark']" class='headerText ion-text-center'  style="margin:0; width:100%"> How is your mood? </h6>
            </ion-title>
        </ion-header>

        <ion-list>
            <!-- ['😠', '😞', '😐', '😀', '😂'] -->
            <ion-radio-group allow-empty-selection="false" @ionChange="changeSelection">
                <ion-item>
                    <img :src="require(`@/assets/emojis/${emoticons[0]}.svg`)" class="icon h5" :class="emoticons[0]" />
                    <ion-radio slot="start" value='0'></ion-radio>
                </ion-item>

                <ion-item>
                    <img :src="require(`@/assets/emojis/${emoticons[1]}.svg`)" class="icon h5" :class="emoticons[1]" />
                    <ion-radio slot="start" value='1'></ion-radio>
                </ion-item>

                <ion-item>
                    <img :src="require(`@/assets/emojis/${emoticons[2]}.svg`)" class="icon h5" :class="emoticons[2]" />
                    <ion-radio slot="start" value='2'></ion-radio>
                </ion-item>

                <ion-item>
                    <img :src="require(`@/assets/emojis/${emoticons[3]}.svg`)" class="icon h5" :class="emoticons[3]" />
                    <ion-radio slot="start" value='3'></ion-radio>
                </ion-item>

                <ion-item>
                    <img :src="require(`@/assets/emojis/${emoticons[4]}.svg`)" class="icon h5" :class="emoticons[4]" />
                    <ion-radio slot="start" value='4'></ion-radio>
                </ion-item>
            </ion-radio-group>
        </ion-list>

        <ion-button expand="block" fill="outline" @click="closeModal">Submit</ion-button>
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

    changeSelection(event) {
        this.mood = event.detail.value;
    }
  }
};
</script>