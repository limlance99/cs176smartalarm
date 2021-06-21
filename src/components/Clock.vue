<template>
    <ion-content fullscreen>
    <div class="xc fullheight">
        <div>
            <ion-card-content text-center>
                <h4> {{ampm}} </h4>
                <h1> {{time.substring(0,2)}} <blink>:</blink> {{time.substring(3,5)}} </h1>
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

blink {
  -webkit-animation: 1s linear infinite condemned_blink_effect; /* for Safari 4.0 - 8.0 */
  animation: 1s linear infinite condemned_blink_effect;
}

/* for Safari 4.0 - 8.0 */
@-webkit-keyframes condemned_blink_effect {
  0% {
    visibility: hidden;
  }
  50% {
    visibility: hidden;
  }
  100% {
    visibility: visible;
  }
}

@keyframes condemned_blink_effect {
  0% {
    visibility: hidden;
  }
  50% {
    visibility: hidden;
  }
  100% {
    visibility: visible;
  }
}
</style>