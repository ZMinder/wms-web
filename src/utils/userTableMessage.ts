function getRoleType(roleId) {//获取角色tag标签的type
    switch (roleId) {
        case 0:
            return "danger"
        case 1:
            return "primary"
        case 2:
            return "success"
    }
}

function getRoleMsg(roleId) {//获取角色tag标签的替换值
    switch (roleId) {
        case 0:
            return "超级管理员"
        case 1:
            return "管理员"
        case 2:
            return "普通用户"
    }
}

function getGenderType(gender) {//获取角色tag标签的type
    switch (gender) {
        case "男":
            return "primary"
        case "女":
            return "warning"
    }
}

export {getGenderType, getRoleType, getRoleMsg}