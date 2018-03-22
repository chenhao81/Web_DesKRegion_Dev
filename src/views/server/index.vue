<template>
  <div class="app-container">
    <el-alert
      style="margin-bottom: 5px"
      title="功能介绍：管理和维护区域内的服务器。"
      type="info"
      show-icon>
    </el-alert>
    <div class="filter-container" style="margin-top: 10px;">
      <el-input v-model="listQuery.searchCode" class="filter-item" style="width: 260px;"
                placeholder="请输入服务器名称/服务器IP"></el-input>
      <el-button type="slateblue" class="filter-item" icon="el-icon-search" @click="getServers">查询
      </el-button>
      <el-button type="slateblue" class="filter-item fr" @click.native="reBort" icon="el-icon-refresh">重启</el-button>
      <el-button type="slateblue" class="filter-item fr" @click.native="deleteAll" icon="el-icon-delete">删除</el-button>
      <el-button type="slateblue" class="filter-item fr" @click.native="refresh" icon="el-icon-refresh">刷新</el-button>
      <el-button type="slateblue" class="filter-item fr" @click.native="closeServer" icon="el-icon-close">关机
      </el-button>
    </div>
    <el-table :data="items" v-loading="listLoading" border fit highlight-current-row
              @selection-change="handleSelectionChange"
              style="width: 100%">
      <el-table-column
        type="selection"
        align="center"
        width="55">
      </el-table-column>
      <el-table-column align="center" label="服务器名称" min-width="100" prop="name">
      </el-table-column>
      <el-table-column align="center" label="服务器IP" min-width="150" prop="ip">
      </el-table-column>
      <el-table-column align="center" label="服务器配置" min-width="180" prop="setting">
      </el-table-column>
      <el-table-column align="center" label="服务端版本" min-width="100" prop="version">
      </el-table-column>
      <el-table-column align="center" label="服务器坐标" min-width="120" prop="position">
      </el-table-column>
      <el-table-column align="center" label="服务器状态" min-width="120" prop="status">
        <template slot-scope="scope">
          <span>{{ scope.row.status | fiterStatus }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="备注" min-width="180" prop="desc">
      </el-table-column>
      <el-table-column align="center" label="MAC地址" min-width="180" prop="mac">
      </el-table-column>
      <el-table-column align="center" label="操作" min-width="250">
        <template slot-scope="scope">
          <el-button type="text" @click="editServer(scope.row)">编辑</el-button>
          <el-button @click="resetPosition(scope.row)" type="text">修改坐标</el-button>
          <el-button @click="setip(scope.row)" type="text">设置IP</el-button>
          <el-button type="text">管理终端</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="items.length" class="pagination-container fr">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page.sync="listQuery.pageNo"
                     :page-sizes="[10,20,50,100]" :page-size="listQuery.pageSize"
                     layout="total, sizes, prev, pager, next, jumper" :total="items.length">
      </el-pagination>
    </div>
    <el-dialog
      width="50%"
      title="设置IP"
      custom-class="IPDialog defineDialog"
      top="5vh"
      append-to-body
      :before-close="resetF"
      :visible.sync="IPDialogShow">
      <el-form class="small-space" :model="IPQuery" label-position="right" :rules="IP_rules"
               ref="IPQueryForm"
               label-width="100px">
        <el-radio-group v-model="IPQuery.mode">
          <el-radio :label="0">自动获取IP地址</el-radio>
          <br>
          <el-radio :label="1">使用下面的IP地址</el-radio>
        </el-radio-group>
        <br>
        <div v-if="IPQuery.mode===1">
          <el-form-item label="IP地址：" prop="ip">
            <el-input v-model="IPQuery.ip" placeholder="例如：192.168.1.1"></el-input>
          </el-form-item>
          <el-form-item label="子网掩码：" prop="mask">
            <el-input v-model="IPQuery.mask" placeholder="例如：192.168.1.1"></el-input>
          </el-form-item>
          <el-form-item label="默认网关：" prop="gate">
            <el-input v-model="IPQuery.gate" placeholder="例如：192.168.1.1"></el-input>
          </el-form-item>
        </div>
        <el-radio-group v-model="IPQuery.dnstype">
          <el-radio :label="0">自动获取DNS服务器地址</el-radio>
          <br>
          <el-radio :label="1">使用下面的DNS服务器地址</el-radio>
        </el-radio-group>
        <div v-if="IPQuery.dnstype===1">
          <el-form-item label="首选DNS服务器：" prop="dns" label-width="150px">
            <el-input v-model="IPQuery.dns" placeholder="例如：192.168.1.1"></el-input>
          </el-form-item>
          <el-form-item label="备选DNS服务器：" prop="dns1" label-width="150px">
            <el-input v-model="IPQuery.dns1" placeholder="例如：192.168.1.1"></el-input>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="slateblue" @click.native="postActionSetIP">提 交</el-button>
        <el-button type="slateblue" @click.native="resetF">关 闭</el-button>
      </div>
    </el-dialog>
    <el-dialog
      width="50%"
      title="设置坐标"
      custom-class="PositionDialog defineDialog"
      top="5vh"
      append-to-body
      :before-close="resetFPosition"
      :visible.sync="PositionDialogShow">
      <el-form class="small-space" :model="positionQuery" label-position="right"
               ref="positionQueryForm"
               label-width="100px">
        <baidu-map
          class="map"
          :scroll-wheel-zoom="true"
          :center="positionQuery.position"
          :zoom="zoom"
          @moving="syncCenterAndZoom"
          @moveend="syncCenterAndZoom"
          @zoomend="syncCenterAndZoom">
          <bm-marker :position="positionQuery.position" :dragging="true" animation="BMAP_ANIMATION_BOUNCE"
                     @click="clickHandler">
            <bm-label :content="positionQuery.name" :style="{color: 'red', fontSize : '12px'}"
                      :offset="{width: 20, height: 0}"/>
          </bm-marker>
        </baidu-map>
        <el-row style="margin-top: 30px;">
          <el-col :span="11">
            <el-form-item label="经度">
              <el-input v-model="positionQuery.position.lng" style="width: 100%" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="纬度">
              <el-input v-model="positionQuery.position.lat" style="width: 100%" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="slateblue" @click.native="resetPositionAction">提 交</el-button>
        <el-button type="slateblue" @click.native="resetFPosition">关 闭</el-button>
      </div>
    </el-dialog>
    <el-dialog
      width="500"
      title="编辑服务器"
      custom-class="imageDialog defineDialog"
      top="5vh"
      append-to-body
      :before-close="resetFServer"
      :visible.sync="serverDialogShow">
      <el-form class="small-space" :model="serverQuery" label-position="left" :rules="server_rules"
               ref="serverQueryForm"
               label-width="100px">
        <el-form-item label="服务器名称" prop="name">
          <el-input v-model="serverQuery.name"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="desc">
          <el-input v-model="serverQuery.desc" type="textarea" autosize></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="slateblue" @click.native="postActionServer">提 交</el-button>
        <el-button type="slateblue" @click.native="resetFServer">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import { isValidIP, vChineseOrEnglish } from '@/utils/validate'

  const chkIP = (rule, value, callback) => {
    if (!value) {
      callback(new Error('请输入IP地址'))
    } else {
      if (!isValidIP(value)) {
        callback(new Error('ip地址格式不正确,如:192.168.0.1'))
      } else {
        callback()
      }
    }
  }
  const chkName = (rule, value, callback) => {
    if (!value) {
      callback(new Error('请输入名称'))
    } else {
      if (!vChineseOrEnglish(value)) {
        callback(new Error('仅支持中英文和数字'))
      } else {
        if (value.length > 20) {
          callback(new Error('密码长度不能超过20个字符'))
        }
      }
      callback()
    }
  }
  export default {
    filters: {
      fiterStatus(v) {
        const map = {
          1: '运行中',
          0: '已关机'
        }
        return map[v]
      }
    },
    data() {
      return {
        serverQuery: {},
        serverDialogShow: false,
        server_rules: {
          name: [
            {
              required: true,
              trigger: 'blur',
              validator: chkName
            }
          ]
        },
        zoom: 15,
        positionQuery: {
          position: {
            lng: 117.261881,
            lat: 31.814703
          }
        },
        PositionDialogShow: false,
        listLoading: false,
        ServerDialogShow: false,
        IP_rules: {
          ip: [
            {
              required: true,
              trigger: 'blur',
              validator: chkIP
            }
          ],
          mask: [
            {
              required: true,
              trigger: 'blur',
              validator: chkIP
            }
          ],
          gate: [
            {
              required: true,
              trigger: 'blur',
              validator: chkIP
            }
          ],
          dns: [
            {
              required: true,
              trigger: 'blur',
              validator: chkIP
            }
          ],
          dns1: [
            {
              required: true,
              trigger: 'blur',
              validator: chkIP
            }
          ]
        },
        IPQuery: {
          mode: 1,
          dnstype: 1
        },
        IPDialogShow: false,
        listQuery: {
          searchCode: '',
          pageNo: 1,
          pageSize: 10
        },
        items: [
          {
            id: 1,
            name: '永安一中',
            ip: '192.168.100.10',
            setting: 'E3-1230V5*1/32G/1T*4',
            version: 'V1.0',
            position: '117.261881,31.814703',
            status: 1,
            desc: '李老师 15695696226',
            mac: '00:30:18:0A:CB:64'
          }
        ],
        multipleSelection: []
      }
    },
    methods: {
      editServer(obj) {
        this.serverQuery = Object.assign({}, obj)
        this.serverDialogShow = true
      },
      postActionServer() {},
      resetFServer() {
        this.serverQuery = {}
        this.$refs.serverQueryForm.resetFields()
        this.serverDialogShow = false
      },
      clickHandler(e) {
        alert(`单击点的坐标为：${e.point.lng}, ${e.point.lat}`)
      },
      syncCenterAndZoom(e) {
        const { lng, lat } = e.target.getCenter()
        this.positionQuery.position.lng = lng
        this.positionQuery.position.lat = lat
        this.zoom = e.target.getZoom()
      },
      resetPosition(obj) {
        this.positionQuery = Object.assign({}, obj)
        this.positionQuery.position = {
          lng: obj.position.split(',')[0],
          lat: obj.position.split(',')[1]
        }
        this.PositionDialogShow = true
      },
      resetPositionAction() {
        console.log(this.positionQuery.position)
      },
      resetFPosition() {
        this.positionQuery = {
          position: {
            lng: 117.261881,
            lat: 31.814703
          }
        }
        this.$refs.positionQueryForm.resetFields()
        this.PositionDialogShow = false
      },
      setip(obj) {
        this.IPQuery = Object.assign({}, this.IPQuery, obj)
        this.IPDialogShow = true
      },
      postActionSetIP() {
        this.$refs.IPQueryForm.validate(valid => {
          if (valid) {
            // var query = this.IPQuery
            // term.postTerminalIpSet(query).then(res => {
            //   console.log(res)
            //   if (res.data.res === 0) {
            //     this.resetF()
            //     this.$message({
            //       type: 'success',
            //       message: res.data.msg
            //     })
            //     this.getTerminals()
            //   } else {
            //     this.resetF()
            //     this.$message({
            //       type: 'error',
            //       message: res.data.msg
            //     })
            //   }
            // })
          }
        })
      },
      resetF(done) {
        this.IPQuery = {}
        this.$refs.IPQueryForm.resetFields()
        this.IPDialogShow = false
        done()
      },
      handleSelectionChange(v) {
        this.multipleSelection = v
      },
      reBort() {},
      deleteAll() {},
      refresh() {},
      closeServer() {},
      getServers() {},
      handleSizeChange(v) {
        this.listQuery.pageSize = v
        this.getServers()
      },
      handleCurrentChange(v) {
        this.listQuery.pageNo = v
        this.getServers()
      }
    },
    created() {
      this.getServers()
    }
  }
</script>
<style scoped>
  .map {
    width: 100%;
    height: 305px;
  }
</style>
