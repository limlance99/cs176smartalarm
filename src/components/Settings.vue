<template>
  <ion-content fullscreen class="ion-padding">
      <ion-list-header>
        <ion-label> Settings </ion-label>
      </ion-list-header>

      <ion-item>
        <ion-label>Difficulty</ion-label>
        <ion-select :placeholder="difficulty" v-on:ionChange="changeDiff" interface="popover"> 
          <ion-select-option value="Easy">Easy</ion-select-option>
          <ion-select-option value="Medium">Medium</ion-select-option>
          <ion-select-option value="Hard">Hard</ion-select-option>
        </ion-select>
      </ion-item>
    <!-- </ion-list> -->
  </ion-content>
</template>

<script>
export default {
  name: "Settings",
  props: ["difficulty"],
  data() {
    return {
      diffs: ["Easy", "Medium", "Hard"],
    };
  },
  methods: {
    changeDiff(val) {
      this.$emit("changeDiff", val.detail.value);
      this.showSuccessToast(
        `Difficulty successfully changed to ${val.detail.value}.`
      );
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