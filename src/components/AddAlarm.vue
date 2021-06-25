<template>
    <ion-content fullscreen class="ion-padding">
        <!-- <ion-list> -->
        <ion-header no-border mode="ios">
              
          <!-- <ion-toolbar mode="ios"> -->
          <ion-row>
            <ion-col size="auto" class="vertical-align-content"> 
              <ion-button :color="[isMorning ? 'secondary' : 'primary']" fill="clear" style="padding:0" @click="exitModal">
                Back
              </ion-button>
            </ion-col>
            <ion-col class="vertical-align-content">
              <ion-title style="padding-left:10px">
                  <h6 class="headerText ion-text-center" style="margin:0"> Add Alarm </h6>
              </ion-title>
            </ion-col>
            <ion-col size="auto" class="vertical-align-content"> 
              <ion-button :color="[isMorning ? 'secondary' : 'primary']" fill="clear" style="padding:0;" @click="closeModal">
                  Done
              </ion-button>
            </ion-col>
          </ion-row>
          <!-- </ion-toolbar> -->
      </ion-header>
        <!-- <ion-header style="padding:0">
           <ion-toolbar mode="ios">
            <ion-button @click="exitModal" slot="start" color="primary" style="padding:0; margin:0" fill="clear"> Back </ion-button>
            <ion-title class="headerText"> <h6> Add Alarm </h6> </ion-title>
            <ion-button @click="closeModal" slot="end" color="primary" style="padding:0; margin:0"  fill="clear"> Done </ion-button>
           </ion-toolbar>
        </ion-header> -->

        <ion-item style="margin-top:10px; padding-left:10px; padding-right:10px" class="regularText" lines="none">
            <ion-label> Alarm Time </ion-label>
            <ion-datetime ref="ion-datetime" mode="ios" display-format="h:mm A" placeholder="Enter Time" value="2016-09-18T12:00:02.666Z" @ionChange="wibba = getHoursMins($event.target.value);">
            </ion-datetime>
        </ion-item>

        <ion-row style="margin-top:10px">
          <ion-col size="1.7" v-for="(w,index) in repetitions" :key="index" style="padding:2px;">
            <ion-button @click="w.isActive = !w.isActive" :color="[w.isActive ? isMorning ? 'secondary':'primary' : 'light']" :fill="[w.isActive ? 'solid' : 'clear']" style="max-width:30px; max-height: 33px"> {{w.day}} </ion-button>
          </ion-col>
        </ion-row>

        <!-- <ion-item>
          <scroller :scrollerTitle="vTitle" :itemList="vList"></scroller>
        </ion-item> -->
        
        <!-- <ion-item> -->
          <!-- <smooth-picker ref="smoothPicker" :data="data" :change="dataChange" class="h4"/> -->
        <!-- </ion-item> -->
        <!-- <ion-item>
            <ion-label> This was your input: </ion-label>
            <ion-label> {{ wibba }} </ion-label>
        </ion-item> -->
  
    <!-- </ion-list> -->
    </ion-content>
</template>

<script>
// import { IonDatetime, IonItem, IonLabel } from "@ionic/vue";
export default {
  name: 'AddAlarm',
  props: ["isMorning"],
  data() {
      return {
        wibba : '08:00 PM',
        repetitions: [
          {
            day: "S",
            isActive: false
          },
          {
            day: "M",
            isActive: false
          },
          {
            day: "T",
            isActive: false
          },
          {
            day: "W",
            isActive: false
          },
          {
            day: "TH",
            isActive: false
          },
          {
            day: "F",
            isActive: false
          },
          {
            day: "S",
            isActive: false
          }
        ]
      }

  },


  components: {
  },

  mounted() {
        // this.$nextTick(this.test);
  },

  methods : {
        getHoursMins (datetime) {
        let d = datetime.split('T')[1];
        let m = d.split(':')[0];
        let n = d.split(':')[1];
        var AmOrPm = m >= 12 ? 'PM' : 'AM';
        m = (m % 12) || 12;

        let digit = m >= 10 ? 0 : 1;
        var zero = "";
        for (var i = 0; i < digit; i++) {
            zero += "0";
        }

        let h = zero + m;
        var tm = h + ":" + n + " " + AmOrPm;
        return tm;
      },
      async closeModal() {
        let t = this.wibba.split(' ')[0];
        let ap = this.wibba.split(' ')[1];
        let thing = { time: t, ampm: ap, isActive: true, repetitions: this.repetitions};

        const modal = await this.$ionic.modalController;
        return modal.dismiss(thing);
      },

      async exitModal() {
        const modal = await this.$ionic.modalController;
        return modal.dismiss();
      }
  }
};
</script>