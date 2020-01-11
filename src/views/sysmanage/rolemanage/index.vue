<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.roleCode" placeholder="角色编码" class="filter-item" style="width:200px;" />
      <el-input v-model="listQuery.roleName" placeholder="角色名称" class="filter-item" style="width:200px;" />
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

      <el-table-column label="角色编码" min-width="2" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.roleCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色名称" min-width="2" align="center">
        <template slot-scope="scope">
          {{ scope.row.roleName }}
        </template>
      </el-table-column>
      <el-table-column label="备注" min-width="2" align="center">
        <template slot-scope="scope">
          {{ scope.row.remark }}
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
          <el-button v-if="scope.row.userAccount!=='admin'" size="mini" icon="el-icon-edit" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button v-if="scope.row.userAccount!=='admin'" size="mini" icon="el-icon-delete" @click="handleDelete(scope.row.id)">删除</el-button>
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
    <!-- 角色修改 -->
    <el-dialog v-if="dialogFormVisible" :title="dialogTitle" :visible.sync="dialogFormVisible" @close="closeDialog">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item label="角色编码" prop="roleCode">
          <el-input v-model="temp.roleCode" :disabled="dialogStatus!='create'" />
        </el-form-item>
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="temp.roleName" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="temp.remark" />
        </el-form-item>
        <el-form-item label="菜单权限">
          <el-tree
            ref="tree"
            :check-strictly="checkStrictly"
            :data="menuTreeData"
            :default-checked-keys="roleMenuData"
            :default-expand-all="true"
            :props="defaultProps"
            show-checkbox
            node-key="id"
            class="permission-tree"
          />
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
import { selectPage, deleteRole, updateRole, saveRole, selectRoleByRoleCode } from '@/api/role'
import { getMenuTree, getRoleMenu } from '@/api/menu'

export default {
  data() {
    var roleCodeValidator = (rule, value, callback) => {
      selectRoleByRoleCode(value).then(response => {
        var isExist = (response.data && response.data.userAccount) === value
        if (isExist) {
          callback(new Error('角色编码已存在'))
        } else {
          callback()
        }
      })
    }
    return {
      list: [],
      listLoading: true,
      currentTotal: 0,
      listQuery: {
        current: 1,
        size: 10,
        roleCode: '',
        roleName: ''
      },
      dialogFormVisible: false,
      dialogTitle: '',
      dialogStatus: 'update',
      temp: {
        id: undefined,
        roleCode: '',
        roleName: '',
        remark: '',
        menuIds: ''
      },
      rules: {
        roleCode: [
          { required: true, message: '请输入角色编码' },
          { min: 4, max: 10, message: '长度在1到8个字符' },
          { validator: roleCodeValidator }
        ],
        roleName: [
          { required: true, message: '请输入角色名次' },
          { min: 1, max: 10, message: '长度1到10个字符' }
        ],
        remark: [{ max: 80, message: '最大长度80个字符' }]
      },
      menuTreeData: [],
      roleMenuData: [],
      checkStrictly: false,
      defaultProps: {
        children: 'childrenList',
        label: 'menuName'
      }
    }
  },
  created() {
    this.fetchData()
    this.getMenuTree()
  },
  methods: {
    getMenuTree() {
      getMenuTree().then(response => {
        this.menuTreeData = response.data
      })
    },
    fetchData() {
      this.listLoading = true
      selectPage(this.listQuery).then(response => {
        this.list = response.data.records
        this.listQuery.current = response.data.current
        this.currentTotal = response.data.total
        this.listLoading = false
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
    handleUpdate(role) {
      this.dialogStatus = 'update'
      this.dialogTitle = '修改'
      this.temp = Object.assign({}, role)
      this.dialogFormVisible = true
      getRoleMenu(role.id).then(response => {
        this.roleMenuData = response.data
      })
    },
    handleAdd() {
      this.dialogStatus = 'create'
      this.dialogTitle = '新增'
      this.dialogFormVisible = true
    },
    handleDelete(userId) {
      this.$confirm('是否确认删除角色?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRole(userId).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功！'
          })
          this.fetchData()
        })
      })
    },
    handleQuery() {
      this.listQuery.current = 1
      this.fetchData()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        roleCode: '',
        roleName: '',
        remark: '',
        menuIds: ''
      }
      this.roleMenuData = []
    },
    closeDialog() {
      this.resetTemp()
      this.dialogFormVisible = false
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const checkedKeys = this.$refs.tree.getCheckedKeys()
          this.temp.menuIds = checkedKeys.join(',')
          updateRole(this.temp).then(() => {
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
          saveRole(this.temp).then(() => {
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
