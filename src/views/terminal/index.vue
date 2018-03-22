<template>
  <div class="app-container">
    <el-alert
      style="margin-bottom: 5px"
      title="功能介绍：管理和维护终端。"
      type="info"
      show-icon>
    </el-alert>
    <div class="filter-container" style="margin-top: 10px;">
      <el-input v-model="listQuery.searchCode" class="filter-item" style="width: 260px;"
                placeholder="请输入绑定用户名/终端名称/终端IP"></el-input>
      <el-button type="slateblue" class="filter-item" icon="el-icon-search" @click="getTerminals()">查询
      </el-button>
      <el-button type="slateblue" class="filter-item fr" @click.native="deleteAll" icon="el-icon-delete">删除</el-button>
      <el-button type="slateblue" class="filter-item fr" @click.native="refresh" icon="el-icon-refresh">刷新</el-button>
      <el-button type="slateblue" class="filter-item fr" @click.native="closeTerminal" icon="el-icon-close">关机
      </el-button>
      <el-button type="slateblue" class="filter-item fr" @click.native="restart" icon="el-icon-news">重启</el-button>
    </div>
    <el-table :data="items" v-loading="listLoading" border fit highlight-current-row
              @selection-change="handleSelectionChange"
              style="width: 100%">
      <el-table-column
        type="selection"
        align="center"
        width="55">
      </el-table-column>
      <el-table-column align="center" label="终端名称" width="100" prop="name">
      </el-table-column>
      <el-table-column align="center" label="终端类型" width="100" prop="type">
        <template slot-scope="scope">
          <span>{{ scope.row.type | filterType }}</span>
        </template>
      </el-table-column>
      <!--
            <el-table-column align="center" label="绑定用户名" width="100" prop="user">
            </el-table-column>
      -->
      <el-table-column align="center" label="终端镜像" width="150" prop="image">
      </el-table-column>
      <el-table-column align="center" label="终端IP" min-width="150" prop="ip">
      </el-table-column>
      <el-table-column align="center" label="虚机IP" min-width="120" prop="vm_ip">
      </el-table-column>
      <el-table-column align="center" label="终端状态" width="120" prop="status">
        <template slot-scope="scope">
          <span>{{ scope.row.status | fiterStatus }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="MAC地址" min-width="180" prop="mac">
      </el-table-column>
      <el-table-column align="center" label="操作" width="230">
        <template slot-scope="scope">
          <!--          <el-button type="text" @click="terminalDialogShow=true">编辑</el-button> -->
          <el-button @click="recover(scope.row)" type="text">还原</el-button>
          <el-button @click="setip(scope.row)" type="text">设置IP</el-button>
          <el-button @click="update_image(scope.row)" type="text">更新镜像</el-button>
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
      width="500"
      title="编辑终端"
      custom-class="terminalDialog defineDialog"
      top="5vh"
      append-to-body
      :visible.sync="terminalDialogShow">
      <el-form class="small-space" :model="terminalQuery" label-position="left" :rules="terminal_rules"
               ref="terminalQueryStringForm"
               label-width="100px">
        <el-form-item label="终端类型" prop="type">
          <el-select v-model="terminalQuery.type" style="width: 100%">
            <el-option value="1" label="单用户"></el-option>
            <el-option value="2" label="多用户"></el-option>
            <el-option value="3" label="公用机"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="终端名称" prop="name">
          <span> 张三</span>
        </el-form-item>
        <el-form-item label="绑定镜像" prop="image">
          <span> Windows7_64.vdi</span>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="slateblue" @click.native="postAction">提 交</el-button>
        <el-button type="slateblue" @click.native="resetF">关 闭</el-button>
      </div>
    </el-dialog>
    <el-dialog
      width="500"
      title="更新镜像"
      custom-class="updateDialog defineDialog"
      top="5vh"
      append-to-body
      :visible.sync="updateDialogShow">
      <el-form class="small-space" :model="updateQuery" label-position="left" :rules="update_rules"
               ref="updateQueryForm"
               label-width="100px">
        <span style="color:#f00">点击确定后，会更新服务器上镜像。请输入镜像的更新信息：</span>
        <el-form-item label="镜像名称" prop="type">
          <el-input v-model="updateQuery.name" style="width: 100%" placeholder="请输入镜像名称，不超过25个字符"></el-input>
        </el-form-item>
        <el-form-item label="操作系统" prop="system">
          <el-select v-model="updateQuery.type" style="width: 100%">
            <el-option value="Windows 10" label="Windows 10"></el-option>
            <el-option value="Windows 7 32位" label="Windows 7 32位"></el-option>
            <el-option value="Windows 7 64位" label="Windows 7 64位"></el-option>
            <el-option value="Windows XP" label="Windows XP"></el-option>
            <el-option value="Linux" label="Linux"></el-option>
            <el-option value="其他" label="其他"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="操作系统" prop="system">
          <el-select v-model="updateQuery.type" style="width: 100%">
            <el-option value="0" label="个性化"></el-option>
            <el-option value="1" label="还原"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-alert
        title="更新镜像要求该终端必须重启，是否继续？"
        type="warning"
        show-icon>
      </el-alert>
      <div slot="footer" class="dialog-footer">
        <el-button type="slateblue" @click.native="postAction">确定</el-button>
        <el-button type="slateblue" @click.native="resetF">关 闭</el-button>
      </div>
    </el-dialog>
    <el-dialog
      width="80%"
      title="设置IP"
      custom-class="IPDialog defineDialog"
      top="5vh"
      append-to-body
      :visible.sync="IPDialogShow">
      <el-form class="small-space" :model="IPQuery" label-position="left" :rules="IP_rules"
               ref="IPQueryForm"
               label-width="100px">
        <div class="fl" style="width: 49%;border: 1px solid #409EFF;height:500px;padding: 10px;border-radius: 5px;">
          <span style="font-size: 16px;color:#409EFF">配置终端网络IP</span><br>
          <el-radio-group v-model="IPQuery.mode">
            <el-radio :label="0">自动获取IP地址</el-radio>
            <br>
            <el-radio :label="1">使用下面的IP地址</el-radio>
          </el-radio-group>
          <el-form-item label="IP地址：" prop="type">
            <el-input v-model="IPQuery.ip" placeholder="例如：192.168.1.1"></el-input>
          </el-form-item>
          <el-form-item label="子网掩码：" prop="type">
            <el-input v-model="IPQuery.mask" placeholder="例如：192.168.1.1"></el-input>
          </el-form-item>
          <el-form-item label="默认网关：" prop="type">
            <el-input v-model="IPQuery.gate" placeholder="例如：192.168.1.1"></el-input>
          </el-form-item>
          <el-radio-group v-model="IPQuery.dnstype">
            <el-radio :label="0">自动获取DNS服务器地址</el-radio>
            <br>
            <el-radio :label="1">使用下面的DNS服务器地址</el-radio>
          </el-radio-group>
          <el-form-item label="首选DNS服务器：" prop="type" label-width="150px">
            <el-input v-model="IPQuery.dns" placeholder="例如：192.168.1.1"></el-input>
          </el-form-item>
          <el-form-item label="备选DNS服务器：" prop="type" label-width="150px">
            <el-input v-model="IPQuery.dns1" placeholder="例如：192.168.1.1"></el-input>
          </el-form-item>
        </div>
        <div class="fr" style="width: 49%;border: 1px solid #409EFF;height:500px;padding: 10px;border-radius: 5px;">
          <span style="font-size: 16px;color:#409EFF">配置虚机网络IP</span><br>
          <el-form-item label="计算机名：" prop="vm_name">
            <el-input v-model="IPQuery.vm_name" placeholder="例如：192.168.1.1"></el-input>
          </el-form-item>
          <el-radio-group v-model="IPQuery.vm_mode">
            <el-radio :label="0">自动获取IP地址</el-radio>
            <el-radio :label="1">使用下面的IP地址</el-radio>
          </el-radio-group>
          <el-form-item label="IP地址：">
            <el-input v-model="IPQuery.vm_ip" placeholder="例如：192.168.1.1"></el-input>
          </el-form-item>
          <el-form-item label="子网掩码：">
            <el-input v-model="IPQuery.vm_mask" placeholder="例如：192.168.1.1"></el-input>
          </el-form-item>
          <el-form-item label="默认网关：">
            <el-input v-model="IPQuery.vm_gate" placeholder="例如：192.168.1.1"></el-input>
          </el-form-item>
          <el-radio-group v-model="IPQuery.vm_dnstype">
            <el-radio :label="0">自动获取DNS服务器地址</el-radio>
            <el-radio :label="1">使用下面的DNS服务器地址</el-radio>
          </el-radio-group>
          <el-form-item label="首选DNS服务器：" prop="type" label-width="150px">
            <el-input v-model="IPQuery.vm_dns" placeholder="例如：192.168.1.1"></el-input>
          </el-form-item>
          <el-form-item label="备选DNS服务器：" prop="type" label-width="150px">
            <el-input v-model="IPQuery.vm_dns1" placeholder="例如：192.168.1.1"></el-input>
          </el-form-item>
        </div>
        <div style="clear: both"></div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="slateblue" @click.native="postActionSetIP">提 交</el-button>
        <el-button type="slateblue" @click.native="resetF">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import * as term from '@/api/Terminal'

  export default {
    data() {
      return {
        options: [
          {
            value: 'zhinan',
            label: '用户组1',
            children: [
              {
                value: 'shejiyuanze',
                label: 'XXX组',
                children: [
                  {
                    value: 'yizhi',
                    label: 'XXX组'
                  }
                ]
              }
            ]
          },
          {
            value: 'zujian',
            label: '用户组2',
            children: [
              {
                value: 'basic',
                label: 'XXX组',
                children: [
                  {
                    value: 'layout',
                    label: 'XXX组'
                  }
                ]
              }
            ]
          }
        ],
        terminalDialogShow: false,
        updateDialogShow: false,
        IPDialogShow: false,
        update_rules: {},
        IP_rules: {},
        terminal_rules: {},
        terminalQuery: {
          terminalTitle: '编辑终端'
        },
        updateQuery: {},
        IPQuery: {
          ipAddr: 1
        },
        listLoading: false,
        total: 0,
        listQuery: {
          searchCode: '',
          pageNo: 1,
          pageSize: 10
        },
        multipleSelection: [],
        items: []
      }
    },
    methods: {
      setip(data) {
        this.IPQuery = data
        this.IPDialogShow = true
      },
      update_image() {
        this.updateDialogShow = true
      },
      recover(data) {
        this.$confirm('确定要还原终端？', '还原终端', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log(data)
          var query = { 'termids': [data.termid] }
          term.postTerminalRecover(query).then(res => {
            console.log(res)
            if (res.data.res === 0) {
              this.$message({
                type: 'success',
                message: res.data.msg
              })
              this.getTerminals()
            } else {
              this.$message({
                type: 'error',
                message: res.data.msg
              })
            }
          })
        })
      },
      postAction() {},
      postActionSetIP(data) {
        console.log(data)
        var query = this.IPQuery
        term.postTerminalIpSet(query).then(res => {
          console.log(res)
          if (res.data.res === 0) {
            this.resetF()
            this.$message({
              type: 'success',
              message: res.data.msg
            })
            this.getTerminals()
          } else {
            this.resetF()
            this.$message({
              type: 'error',
              message: res.data.msg
            })
          }
        })
      },
      resetF() {
        // this.$refs.terminalQueryStringForm.resetFields()
        this.IPDialogShow = false
      },
      handleCurrentChange(v) {
        this.listQuery.pageNo = v
        this.getTerminals()
      },
      handleSizeChange(v) {
        this.listQuery.pageSize = v
        this.getTerminals()
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      refresh() {
        this.getTerminals()
      },
      deleteAll() {
        if (this.multipleSelection.length <= 0) {
          this.$message({
            type: 'error',
            message: '请选择终端'
          })
          return
        }

        this.$confirm('确定要删除终端？', '删除终端', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var query = { 'termids': [] }
          for (var j = 0, len = this.multipleSelection.length; j < len; j++) {
            query.termids.push(this.multipleSelection[j].termid)
          }
          term.postTerminalDel(query).then(res => {
            console.log(res)
            if (res.data.res === 0) {
              this.$message({
                type: 'success',
                message: res.data.msg
              })
              this.getTerminals()
            } else {
              this.$message({
                type: 'error',
                message: res.data.msg
              })
            }
          })
        })
      },
      restart() {
        if (this.multipleSelection.length <= 0) {
          this.$message({
            type: 'error',
            message: '请选择终端'
          })
          return
        }
        this.$confirm('确定要重启终端？', '重启终端', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var query = { 'termids': [] }
          for (var j = 0, len = this.multipleSelection.length; j < len; j++) {
            query.termids.push(this.multipleSelection[j].termid)
          }
          term.postTerminalRebort(query).then(res => {
            console.log(res)
            if (res.data.res === 0) {
              this.$message({
                type: 'success',
                message: res.data.msg
              })
            } else {
              this.$message({
                type: 'error',
                message: res.data.msg
              })
            }
          })
        })
      },
      closeTerminal() {
        if (this.multipleSelection.length <= 0) {
          this.$message({
            type: 'error',
            message: '请选择终端'
          })
          return
        }
        this.$confirm('确定要重启终端？', '重启终端', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var query = { 'termids': [] }
          for (var j = 0, len = this.multipleSelection.length; j < len; j++) {
            query.termids.push(this.multipleSelection[j].termid)
          }
          term.postTerminalShutdown(query).then(res => {
            console.log(res)
            if (res.data.res === 0) {
              this.$message({
                type: 'success',
                message: res.data.msg
              })
            } else {
              this.$message({
                type: 'error',
                message: res.data.msg
              })
            }
          })
        })
      },
      getTerminals() {
        const query = Object.assign({}, this.listQuery)
        term.getTerminalSearchList(query).then(res => {
          console.log(res.data)
          if (res.data.res === 0) {
            this.items = res.data.terms
          }
        })
      }
    },
    created() {
      this.getTerminals()
      // console.log(this.$store.state.user.name)
    },
    filters: {
      filterType(t) {
        const map = {
          1: '多用户',
          2: '公用机',
          0: '单用户'
        }
        return map[t]
      },
      fiterStatus(v) {
        const map = {
          2: '已登录',
          1: '在线未登录',
          0: '离线'
        }
        return map[v]
      }
    }
  }
</script>
