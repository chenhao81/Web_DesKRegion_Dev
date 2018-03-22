<template>
  <div class="dashboard-container">
    <div class="dashboard-editor-container">
      <div>
        <el-alert
          title="功能介绍：查看区域内服务器状态、云终端状态、终端使用率、快捷操作等整体概况。"
          type="info"
          show-icon>
        </el-alert>
      </div>
      <!--服务器-->
      <h2 style="color: #42b983;">关键指标</h2>
      <div class="server-wrapper" flex="">
        <div flex-box="1" class="server-right" flex="main:center box:mean cross:center">
          <div class="server-con">
            <div flex="main:center">
              <de-progress type="circle" :percentageText="Number(serviceInfo.cpu)"></de-progress>
            </div>
            <p>服务器</p>
          </div>
          <div class="server-con">
            <div flex="main:center">
              <de-progress type="circle" :percentageText="Number(serviceInfo.cpu)"></de-progress>
            </div>
            <p>云终端</p>
          </div>
          <div class="server-con">
            <div flex="main:center">
              <de-progress type="circle" :percentageText="Number(serviceInfo.cpu)"></de-progress>
            </div>
            <p>用户</p>
          </div>
          <div class="server-con">
            <div flex="main:center">
              <el-progress type="circle" :percentage="Number(serviceInfo.image.rate)"></el-progress>
            </div>
            <p>备份云盘空间({{ serviceInfo.image.used }}/{{ serviceInfo.image.total }})</p>
          </div>
          <div class="server-con">
            <div flex="main:center">
              <el-progress type="circle" :percentage="Number(serviceInfo.clouddisk.rate)"></el-progress>
            </div>
            <p>内存({{ serviceInfo.clouddisk.used }}/{{ serviceInfo.clouddisk.total }})</p>
          </div>
          <div class="server-con">
            <div flex="main:center">
              <el-progress type="circle" :percentage="Number(serviceInfo.image.rate)"></el-progress>
            </div>
            <p>镜像空间({{ serviceInfo.image.used }}/{{ serviceInfo.image.total }})</p>
          </div>
          <div class="server-con">
            <div flex="main:center">
              <el-progress type="circle" :percentage="Number(serviceInfo.recv)"></el-progress>
            </div>
            <p>接受带宽</p>
          </div>
          <div class="server-con">
            <div flex="main:center">
              <el-progress type="circle" :percentage="Number(serviceInfo.send)"></el-progress>
            </div>
            <p>发送带宽</p>
          </div>
        </div>
      </div>
      <h2 style="color: #42b983;">服务器</h2>
      <div flex="" class="cloud-terminal">
        <div class="cloud-container" flex="box:mean">
          <div class="cloud-container-left" flex="">
            <baidu-map
              class="map"
              :scroll-wheel-zoom="true"
              :center="center"
              :zoom="zoom"
              @moving="syncCenterAndZoom"
              @moveend="syncCenterAndZoom"
              @zoomend="syncCenterAndZoom">
              <bm-marker :position="item.position" :dragging="true" animation="BMAP_ANIMATION_BOUNCE"
                         v-for="(item,index) in points" :key="index"
                         @click="clickHandler">
                <bm-label :content="item.content" :style="{color: 'red', fontSize : '12px'}"
                          :offset="{width: 20, height: 0}"/>
              </bm-marker>
            </baidu-map>
          </div>
          <div class="cloud-container-right">
            <div flex="">
              <el-table
                :data="items"
                height="305"
                border
                style="width: 100%">
                <el-table-column
                  prop="name"
                  align="center"
                  label="服务器名称"
                  width="130">
                </el-table-column>
                <el-table-column
                  prop="ip"
                  align="center"
                  label="服务器IP"
                  width="130">
                </el-table-column>
                <el-table-column
                  prop="desc"
                  align="center"
                  label="备注">
                </el-table-column>
                <el-table-column
                  prop="status"
                  align="center"
                  label="状态">
                  <template slot-scope="scope">
                    <span :class="{green:scope.row.status===0,red:scope.row.status===1}">{{ scope.row.status | filterStatus}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  align="center"
                  label="校管理平台">
                  <template slot-scope="scope">
                    <el-button type="text">进入</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </div>
      <!--图表-->
      <div flex="" class="cloud-terminal" style="
      margin-top: 30px;
        color: white;">
        <div class="cloud-container" flex="box:mean">
          <div class="cloud-container-left" flex="">
            <div flex-box="0" class="cloud-terminal-left" style="background: #2795d5;text-indent: 1em">
              <h1>云终端：{{terminalInfo.total}}</h1>
              <p>已登录终端数：<span>{{ terminalInfo.logon }}</span></p>
              <p>在线未登录终端数：<span>{{ terminalInfo.online }}</span></p>
              <p>离线终端数：<span>{{ terminalInfo.offline }}</span></p>
            </div>
            <div flex-box="1" class="cloud-terminal-right" flex="">
              <pie-chart></pie-chart>
            </div>
          </div>
          <div class="cloud-container-right">
            <bar-chart></bar-chart>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import PieChart from './components/PieChart'
  import BarChart from './components/BarChart'
  import * as DashBoard from '@/api/Dashboard'
  import DeProgress from '@/components/progress/index'
  import { mapActions } from 'vuex'

  export default {
    name: 'dashboard-admin',
    components: {
      PieChart,
      BarChart,
      DeProgress
    },
    data() {
      return {
        center: {
          lng: 117.261881,
          lat: 31.814703
        },
        points: [],
        zoom: 15,
        regionQuery: {},
        regionDialogShow: false,
        region_rules: {},
        dataValue: [],
        lineChartData: {
          messages: {
            expectedData: [200, 192, 120, 144, 160, 130, 140],
            actualData: [180, 160, 151, 106, 145, 150, 130]
          },
          purchases: {
            expectedData: [80, 100, 121, 104, 105, 90, 100],
            actualData: [120, 90, 100, 138, 142, 130, 130]
          },
          shoppings: {
            expectedData: [130, 140, 141, 142, 145, 150, 160],
            actualData: [120, 82, 91, 154, 162, 140, 130]
          }
        },
        pickerOptions: {
          shortcuts: [
            {
              text: '今天',
              onClick(picker) {
                picker.$emit('pick', new Date())
              }
            },
            {
              text: '昨天',
              onClick(picker) {
                const date = new Date()
                date.setTime(date.getTime() - 3600 * 1000 * 24)
                picker.$emit('pick', date)
              }
            },
            {
              text: '一周前',
              onClick(picker) {
                const date = new Date()
                date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
                picker.$emit('pick', date)
              }
            }
          ]
        },
        serviceInfo: {
          ip: 0,
          cpu: 0,
          mem: 0,
          image: {
            used: 0,
            total: 0,
            rate: 0
          },
          clouddisk: {
            used: 0,
            total: 0,
            rate: ''
          },
          recv: 0,
          send: 0
        },
        terminalInfo: {
          total: 0,
          logon: 0,
          offline: 0,
          online: 0
        },
        items: [
          {
            id: 1,
            name: '永安一中',
            ip: '192.168.102.102',
            desc: '李老师 15695696226',
            status: 1,
            url: ''
          },
          {
            id: 1,
            name: '永安一中',
            ip: '192.168.102.102',
            desc: '李老师 15695696226',
            status: 0,
            url: ''
          },
          {
            id: 1,
            name: '永安一中',
            ip: '192.168.102.102',
            desc: '李老师 15695696226',
            status: 1,
            url: ''
          },
          {
            id: 1,
            name: '永安一中',
            ip: '192.168.102.102',
            desc: '李老师 15695696226',
            status: 1,
            url: ''
          },
          {
            id: 1,
            name: '永安一中',
            ip: '192.168.102.102',
            desc: '李老师 15695696226',
            status: 1,
            url: ''
          },
          {
            id: 1,
            name: '永安一中',
            ip: '192.168.102.102',
            desc: '李老师 15695696226',
            status: 1,
            url: ''
          }
        ]
      }
    },
    created() {
      this.getServiceInfo()
      this.getTerminalInfo()
      this._getData()
      this.addPoints()
    },
    filters: {
      filterStatus(v) {
        const map = {
          1: '运行中',
          0: '已关机'
        }
        return map[v]
      }
    },
    methods: {
      addPoints() {
        const points = []
        for (var i = 0; i < 10; i++) {
          const point = {
            position: {
              lng: 117.252466 + 0.0005 * i * Math.random() * 5, lat: 31.805682 + 0.0005 * i * Math.random() * 5
            },
            content: '其他'
          }
          points.push(point)
        }
        this.points = points
      },
      clickHandler(e) {
        alert(`单击点的坐标为：${e.point.lng}, ${e.point.lat}`)
      },
      goToImage() {
        this.$router.push(
          {
            path: '/images/images',
            query: { userId: 123 }
          }
        )
      },
      _search() {
        this._getData()
      },
      _getData() {},
      getServiceInfo() {
        DashBoard.getServerStatus().then(res => {
          if (res.data.res === 0) {
            this.serviceInfo = Object.assign({}, res.data)
            // console.log(this.serviceInfo)
          } else {
            this.$message({
              type: 'error',
              message: '获取服务器信息失败!'
            })
          }
        })
      },
      getTerminalInfo() {
        DashBoard.getTerminalInfo().then(res => {
          if (res.data.res === 0) {
            // console.log(res.data)
            this.terminalInfo = Object.assign({}, res.data)
            const info = [
              { value: this.terminalInfo.logon, name: '已登录' },
              { value: this.terminalInfo.online, name: '在线未登录' },
              { value: this.terminalInfo.offline, name: '未登录' }
            ]
            this.setTerminalInfo(info)
          } else {
            this.$message({
              type: 'error',
              message: '获取云终端信息失败!'
            })
          }
        })
      },
      syncCenterAndZoom(e) {
        const { lng, lat } = e.target.getCenter()
        this.center.lng = lng
        this.center.lat = lat
        this.zoom = e.target.getZoom()
      },
      postAction() {},
      resetF() {},
      jionRegion() {
        this.regionDialogShow = true
      },
      exportExcel() {},
      // handleSetLineChartData(type) {
      //   this.lineChartData = lineChartData[type]
      // }
      ...mapActions([
        'setTerminalInfo'
      ])
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  @import "flex.css";

  .red {
    color: red;
  }

  .green {
    color: green;
  }

  .map {
    width: 100%;
    height: 305px;
  }

  .dashboard-editor-container {
    background: #f3f3f3;
    .tips {
      background: #fff;
      width: 100%;
      color: #2483ba;
      font-size: 15px;
      height: 55px;
      margin: 6px 0;
      p {
        margin-left: 20px;
      }
      .gthimg {
        margin-left: 20px;
      }
      .close {
        margin-right: 50px;
      }
    }
    .serach-con {
      margin-bottom: 6px;
      background: white;
      .search-inp {
        width: 100%;
        padding: 20px 0;
        input {
          width: 30%;
          height: 50px;
          line-height: 50px;
          border: 1px solid #6cb7e3;
          text-indent: 35px;
          background: url("../../assets/images/search.png") no-repeat center left 10px;

        }
        .search-btn {
          width: 162px;
          height: 50px;
          line-height: 50px;
          text-align: center;
          background: #2795d5;
          outline: 0;
          padding: 0;
          border: none;
          font-size: 21px;
          color: white;
          margin-left: 17px;
        }
      }
    }
    .server-wrapper {
      width: 100%;
      height: 260px;
      background: white;
      margin-bottom: 30px;
      margin-top: 20px;
      .server-left {
        width: 204px;
        background: #2795d5;
        color: white;
        h1 {
          font-size: 21px;
          font-weight: normal;
          text-align: left;
          margin-left: 18px;
          margin-top: 28px;
          margin-bottom: 48px;
        }
        p {
          font-size: 13px;
          margin-bottom: 20px;
          margin-left: 18px;
        }
        .operation {
          font-size: 13px;
          color: white;
          margin-left: 6px;
          margin-top: 36px;
          .operation-btn {
            width: auto;
            height: 30px;
            line-height: 30px;
            text-align: center;
            border: 1px solid white;
            margin-right: 5px;
          }
        }
      }
      .server-right {
        width: 100%;
        color: #3c3c3c;
        font-size: 16px;
        .server-con {
          p {
            text-align: center;
            height: 36.8px;
          }
        }
      }
    }
    .cloud-terminal {
      width: 100%;
      .cloud-container {
        width: 100%;
        height: 305px;
        .cloud-container-left {
          margin-right: 35px;
          color: white;
          .cloud-terminal-left {
            width: 186px;
            h1 {
              font-size: 21px;
              font-weight: normal;
              margin-top: 30px;
              margin-bottom: 43px;
            }
            p {
              font-size: 13px;
              margin-bottom: 41px;
              span {
                font-size: 25px;
              }
            }
          }
          .cloud-terminal-right {
            background: white;
            color: #3c3c3c;
            font-size: 19px;
            .cloud-con-img {
              img {
                margin-right: 30px;
                margin-left: 30px;
              }
            }
          }
        }
        .cloud-container-right {
          background: white;
          box-sizing: border-box;
        }
      }
    }
    .chart-con {
      margin-top: 22px;
      height: 305px;
      .chart-con-left {
        text-align: center;
        margin-right: 37px;
        background: white;
        border-left: 19px solid #2795d5;
        box-sizing: border-box;
        .chart-title {
          width: 135px;
          font-size: 21px;
          color: #2795d5;
          text-align: center;
        }
      }
      .chart-con-right {
        text-align: center;
        background: white;
        box-sizing: border-box;
        .chart-title {
          width: 187px;
          font-size: 21px;
          color: #2795d5;
          text-align: center;
        }
      }
    }
  }
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
  .dashboard-editor-container {
    padding: 10px;
    background-color: rgb(240, 242, 245);
    .chart-wrapper {
      background: #fff;
      padding: 16px 16px 0;
      margin-bottom: 32px;
    }
  }
</style>
