
<script>
import { Bar } from 'vue-chartjs'

export default {
  extends: Bar,
  // mixins: [reactiveProp],
  props: ['options', 'data'],
  computed: {
    optionsLocal: function() {
      return this.options;
    },
    chartData: function() {
      return this.data;
    }
  },
  mounted () {
    this.generateGraph();
    
  },
  methods: {
    generateGraph() {
      this.renderChart(
        {
          labels: [
            "S",
            "M",
            "T",
            "W",
            "TH",
            "F",
            "S"
          ],
          datasets: [
            {
              data: this.chartData,
              backgroundColor: [
              'rgba(255, 99, 132, 0.4)',
              'rgba(255, 159, 64, 0.4)',
              'rgba(255, 205, 86, 0.4)',
              'rgba(75, 192, 192, 0.4)',
              'rgba(54, 162, 235, 0.4)',
              'rgba(153, 102, 255, 0.4)',
              'rgba(201, 203, 207, 0.4)'
              ],
              borderColor: [
              'rgb(255, 99, 132)',
              'rgb(255, 159, 64)',
              'rgb(255, 205, 86)',
              'rgb(75, 192, 192)',
              'rgb(54, 162, 235)',
              'rgb(153, 102, 255)',
              'rgb(201, 203, 207)'
              ],
              borderWidth: 1
              }
          ]
        },
        this.optionsLocal
      );      
    }
  },
  watch: {
    chartData() {
      this.$data._chart.destroy();
      this.generateGraph();
    }
  }
}

</script>