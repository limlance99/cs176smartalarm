<template>
    <ion-content>
    <div class="xc fullheight">
        <div>
            <ion-card-content text-center>
                <h4> {{ampm}} </h4>
                <h1> {{time}} </h1>
                <p> {{date}} </p>
            </ion-card-content>
        </div>
    </div>
</ion-content>
</template>

<script>

export default {
    props: ["time", "date", "ampm"]
}
</script>

<style scoped>
.xc {
  display: flex;
  align-items: center;
  justify-content: center;
}

.fullheight {
  height: 100%;
}


</style>