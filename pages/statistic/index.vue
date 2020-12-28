<template>
  <div id="page-statistic">
    <v-card class="mb-2" outlined>
      <v-card-text>
        <v-form ref="form" @submit.prevent="fetchData">
          <v-row>
            <v-col cols="12" sm="4">
              <v-select
                v-model="filter"
                :items="filterItems"
                label="Chọn điều kiện thống kê"
                dense
                @change="changeType(filter)"
              />
            </v-col>
          </v-row>
          <v-row v-if="isCustom">
            <v-col cols="12" sm="6">
              <v-menu
                v-model="menu"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="startDateFormatted"
                    label="Ngày bắt đầu"
                    prepend-icon="mdi-calendar"
                    readonly
                    @blur="date = parseDate(startDateFormatted)"
                    v-on="on"
                  />
                </template>
                <v-date-picker
                  v-model="startDate"
                  locale="vi"
                  color="primary lighten-1"
                  header-color="primary"
                  @input="menu = false"
                />
              </v-menu>
            </v-col>
            <v-col cols="12" sm="6">
              <v-menu
                v-model="menu2"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="endDateFormatted"
                    label="Ngày kết thúc"
                    prepend-icon="mdi-calendar"
                    readonly
                    @blur="date = parseDate(endDateFormatted)"
                    v-on="on"
                  />
                </template>
                <v-date-picker
                  v-model="endDate"
                  locale="vi"
                  color="primary lighten-1"
                  header-color="primary"
                  :min="startDate"
                  @input="menu2 = false"
                />
              </v-menu>
            </v-col>
            <v-col cols="12" sm="6">
              <v-btn type="submit" color="primary" dark>
                Tìm kiếm
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
    <v-container grid-list-xl fluid>
      <v-layout row wrap>
        <v-flex lg6 sm6 xs12>
          <h4>Thống kê người dùng mới</h4>
          <line-chart
            v-if="loaded"
            :chartdata="chartUserData"
            :options="options"
          />
        </v-flex>
        <v-flex lg6 sm6 xs12>
          <h4>Doanh số (VNĐ)</h4>
          <line-chart
            v-if="loaded"
            :chartdata="chartIncomeData"
            :options="optionIncomes"
          />
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import moment from 'moment'
import { getStatistics } from '@/api/statistic'
import LineChart from '@/components/charts/LineChart.vue'
import { formatPrice, formatDateLabels, getUnixTime } from '@/utils'

export default {
  components: { LineChart },
  data () {
    return {
      toggle_exclusive: undefined,
      filter: 'days',
      filterItems: [
        {
          value: 'days',
          text: '7 ngày gần nhất'
        },
        {
          value: 'weeks',
          text: '4 tuần gần nhất'
        },
        {
          value: 'months',
          text: 'Tháng'
        },
        {
          value: 'custom',
          text: 'Tùy chỉnh'
        }
      ],
      isCustom: false,
      startDate: null,
      endDate: null,
      startDateFormatted: null,
      endDateFormatted: null,
      menu: false,
      menu2: false,
      loaded: false,
      chartUserData: null,
      chartIncomeData: null,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false
        }
      },
      optionIncomes: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: false
        },
        tooltips: {
          callbacks: {
            label (tooltipItem) {
              return formatPrice(tooltipItem.yLabel) + ' (VNĐ)'
            }
          }
        },
        scales: {
          yAxes: [
            {
              ticks: {
                // Include a dollar sign in the ticks
                callback (value, index, values) {
                  return formatPrice(value)
                }
              }
            }
          ]
        }
      }
    }
  },
  watch: {
    startDate (val) {
      this.startDateFormatted = this.formatDate(this.startDate)
    },
    endDate (val) {
      this.endDateFormatted = this.formatDate(this.endDate)
    }
  },
  created () {
    this.$store.commit('SET_PAGE_HEADER_TITLE', 'Thống kê')
    this.fetchData()
  },
  methods: {
    formatDate (date) {
      if (!date) {
        return null
      }

      const [year, month, day] = date.split('-')
      return `${day}/${month}/${year}`
    },
    parseDate (date) {
      if (!date) {
        return null
      }

      const [month, day, year] = date.split('/')
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    },
    changeType (type) {
      if (this.filter === 'custom') {
        this.isCustom = true
      } else {
        this.isCustom = false
        this.fetchData()
      }
    },
    fetchData () {
      const chartUserData = {
        labels: [],
        datasets: [
          {
            label: 'Người dùng mới',
            borderColor: '#3f51b5',
            backgroundColor: '#3f51b5',
            fill: false,
            data: []
          }
        ]
      }
      const chartIncomeData = {
        labels: [],
        datasets: [
          {
            label: 'Doanh số (nghìn VNĐ)',
            borderColor: '#3f51b5',
            backgroundColor: '#3f51b5',
            fill: false,
            data: []
          }
        ]
      }

      const params = {}
      if (this.filter) {
        const filterLimits = {
          hours: Number(moment().format('H')) + 1,
          days: 7,
          weeks: 4,
          months: Number(moment().format('MM'))
        }
        params.type = this.filter
        params.limit = filterLimits[this.filter]
      }
      if (this.filter === 'custom') {
        if (this.startDate && this.endDate) {
          params.startDate = getUnixTime(this.startDate)
          params.endDate = getUnixTime(this.endDate)
          params.limit = 1
        } else {
          this.$store.commit('SET_SNACKBAR', true)
          this.$store.commit('SET_SNACKBAR_COLOR', 'red darken-4')
          this.$store.commit('SET_NOTIFY_MESSAGE', 'Vui lòng chọn ngày bắt đầu và kết thúc')
          return
        }
      }
      this.loaded = false
      return getStatistics(params)
        .then((res) => {
          this.loaded = true
          const labels = res.data.labels.map(datetime =>
            formatDateLabels(params.type, datetime)
          )
          chartUserData.labels = labels
          chartUserData.datasets[0].data = res.data.users

          chartIncomeData.labels = labels
          chartIncomeData.datasets[0].data = res.data.income

          this.chartUserData = chartUserData
          this.chartIncomeData = chartIncomeData
        })
        .catch((error) => {
          this.lists = []
          this.$store.commit('SET_SNACKBAR', true)
          this.$store.commit('SET_SNACKBAR_COLOR', 'red darken-4')
          this.$store.commit('SET_NOTIFY_MESSAGE', error.message)
        })
    }
  }
}
</script>
