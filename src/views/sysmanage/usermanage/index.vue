<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.userAccount" placeholder="用户名" class="filter-item" style="width:200px;" />
      <el-input v-model="listQuery.userName" placeholder="用户姓名" class="filter-item" style="width:200px;" />
      <el-button type="primary" icon="el-icon-search" class="filter-item" @click="handleQuery">查询</el-button>
      <el-button type="primary" icon="el-icon-edit" class="filter-item" @click="handleAdd">新增</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      stripe
      highlight-current-row
    >
      <el-table-column align="center" label="序号" min-width="1">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>

      <el-table-column label="用户名" min-width="2" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.userAccount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" min-width="2" align="center">
        <template slot-scope="scope">
          {{ scope.row.userName }}
        </template>
      </el-table-column>
      <el-table-column label="联系方式" min-width="2" align="center">
        <template slot-scope="scope">
          {{ scope.row.mobile }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="更新时间" min-width="2">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.updateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="3" align="center">
        <template slot-scope="scope">
          <el-button v-if="scope.row.userAccount!=='admin'" size="mini" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button v-if="scope.row.userAccount!=='admin'" size="mini" @click="handleDelete(scope.row.id)">删除</el-button>
          <el-button v-if="scope.row.userAccount!=='admin'" size="mini" @click="handleResetPwd(scope.row.id)">密码重置</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pagination"
      :current-page="listQuery.current"
      :page-sizes="[5, 10, 20, 40]"
      :page-size="listQuery.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="currentTotal"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />

    <el-dialog v-if="dialogFormVisible" :title="dialogTitle" :visible.sync="dialogFormVisible" @close="closeDialog">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="用户名" prop="userAccount">
          <el-input v-model="temp.userAccount" :disabled="dialogStatus!='create'" />
        </el-form-item>
        <el-form-item label="用户姓名" prop="userName">
          <el-input v-model="temp.userName" />
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="temp.mobile" />
        </el-form-item>
        <el-form-item label="角色">
          <el-select
            v-model="temp.roleIdList"
            multiple
            placeholder="请选择"
            style="width:100%"
          >
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog()">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?saveData():updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { selectPage, deleteUser, updateUser, saveUser, resetPassword, selectUserByUserAccount } from '@/api/user'
import { selectRoleList, selectUserRoleList } from '@/api/role'

export default {
  data() {
    var userAccountValidator = (rule, value, callback) => {
      if (this.dialogStatus === 'create') {
        selectUserByUserAccount(value).then(response => {
          var isExist = (response.data && response.data.userAccount) === value
          if (isExist) {
            callback(new Error('用户名已存在'))
          } else {
            callback()
          }
        })
      } else {
        callback()
      }
    }
    return {
      list: [],
      listLoading: true,
      currentTotal: 0,
      listQuery: {
        current: 1,
        size: 10,
        userAccount: '',
        userName: ''
      },
      dialogFormVisible: false,
      dialogTitle: '',
      dialogStatus: 'update',
      temp: {
        id: undefined,
        userAccount: '',
        userName: '',
        mobile: '',
        roleIdList: []
      },
      roleList: [],
      rules: {
        userAccount: [
          { required: true, message: '请输入用户名' },
          { min: 4, max: 10, message: '长度在4到10个字符' },
          { validator: userAccountValidator }
        ],
        userName: [{ required: true, message: '请输入用户姓名' }],
        mobile: [{ required: true, message: '请输入手机号' }]
      }
    }
  },
  created() {
    this.fetchData()
    this.selectRoleList()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      selectPage(this.listQuery).then(response => {
        this.list = response.data.records
        this.listQuery.current = response.data.current
        this.currentTotal = response.data.total
        this.listLoading = false
      })
    },
    selectRoleList() {
      selectRoleList().then(response => {
        this.roleList = response.data
      })
    },
    getUserRoleList(userId) {
      selectUserRoleList(userId).then(response => {
        const userRoleList = response.data || []
        userRoleList.forEach(userRole => {
          this.temp.roleIdList.push(userRole.id)
        })
      })
    },
    handleSizeChange(val) {
      this.listQuery.size = val
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.listQuery.current = val
      this.fetchData()
    },
    handleUpdate(user) {
      this.dialogStatus = 'update'
      this.dialogTitle = '修改'
      this.temp = Object.assign({}, user)
      this.temp.roleIdList = []
      this.dialogFormVisible = true
      this.getUserRoleList(user.id)
    },
    handleAdd() {
      this.dialogStatus = 'create'
      this.dialogTitle = '新增'
      this.dialogFormVisible = true
    },
    handleDelete(userId) {
      this.$confirm('是否确认删除用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUser(userId).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功！'
          })
          this.fetchData()
        })
      })
    },
    handleResetPwd(userId) {
      resetPassword(userId).then(() => {
        this.$message({
          type: 'success',
          message: '密码重置成功！'
        })
        this.fetchData()
      })
    },
    handleQuery() {
      this.listQuery.current = 1
      this.fetchData()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        userAccount: '',
        userName: '',
        mobile: '',
        roleIdList: []

      }
    },
    closeDialog() {
      this.resetTemp()
      this.dialogFormVisible = false
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updateUser(this.temp).then(() => {
            this.$message({
              type: 'success',
              message: '修改成功'
            })
            this.resetTemp()
            this.dialogFormVisible = false
            this.fetchData()
          })
        }
      })
    },
    saveData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          saveUser(this.temp).then(() => {
            this.$message({
              type: 'success',
              message: '添加成功'
            })
            this.resetTemp()
            this.dialogFormVisible = false
            this.fetchData()
          })
        }
      })
    }
  }
}
</script>
