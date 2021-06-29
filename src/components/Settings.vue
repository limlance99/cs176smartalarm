<template>
  <ion-content fullscreen class="ion-padding">
      <ion-row>
        <ion-col class="vertical-align-content">
          <span class="regularText">Difficulty</span>
        </ion-col>
        <ion-col size="3">
          <ion-select :value="currDifficulty" @ionChange="changeDiff($event,true)" interface="popover" class="regularText" style="text-align:right"> 
            <ion-select-option value="Easy">Easy</ion-select-option>
            <ion-select-option value="Medium">Medium</ion-select-option>
            <ion-select-option value="Hard">Hard</ion-select-option>
          </ion-select>
        </ion-col>
      </ion-row>
    <!-- </ion-list> -->
  </ion-content>
</template>

<script>
import axios from 'axios';
import { SERVER_URL } from "../../config.js"


export default {
  name: "Settings",
  props: ["difficulty", "userID"],
  data() {
    return {
      diffs: ["Easy", "Medium", "Hard"],
      currDifficulty: "",
    };
  },
  created() {
    this.getSettings();
  },
  methods: {
    changeDiff($event, clicked) {
      if (!($event.target.value in ["Easy", "Medium", "Hard"])) return;
      this.$emit("changeDiff", $event.target.value, clicked);
      axios.get(`${SERVER_URL}/updatesettings/${this.userID}/${$event.target.value}`)
      .then(response => {
        if (response.status == 200) {
            this.showSuccessToast(
              `Difficulty successfully changed to ${$event.target.value}.`
            );
            this.getSettings();
        }
      });
    },
    getSettings() {
      // console.log("getting settings from db");
      axios.get(`${SERVER_URL}/getsetting/${this.userID}`)
      .then(response => {
        if (response.status == 200) {
            this.currDifficulty = response.data[0].difficulty;
        }
      });
      
    },
    async showSuccessToast(data) {
      const toast = await this.$ionic.toastController.create({
        message: data,
        duration: 2000,
        mode: "ios",
        position: "top",
        color: "success",
      });
      await toast.present();
    },
  },
};
</script>
<style scoped>
/* ion-select::part(placeholder)::first-letter {
  font-size: 24px;
  font-weight: 100;
} */
</style>