import {defineStore} from 'pinia'

const curGoods = defineStore({
    id: "curGoods",
    state: () => {
        return {
            id: null,
            goodsName: null,
            goodsCount: null
        }
    }
})

const curOperator = defineStore({
    id: "curOperator",
    state: () => {
        return {
            id: null,
            nickname: null
        }
    }
})

const realOperator = defineStore({
    id: "realOperator",
    state: () => {
        return {
            id: null,
            nickname: null
        }
    }
})

export {curGoods, realOperator, curOperator}