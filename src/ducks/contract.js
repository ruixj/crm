import instance from 'utils/instance'
import { actions as appActions } from './app'
import { message as Msg } from 'antd'
import {
    addContract,
    editContract,
    deleteContract,
    getContractPage,
    getUserContract,
    getContractDetail,
    getCompanyContract,
} from 'utils/api'

export const types = {
    SET_CONTRACT:    'contract/SET_CONTRACT',
    DELETE_CONTRACT: 'contract/DELETE_CONTRACT',
    UPDATE_CONTRACT: 'contract/UPDATE_CONTRACT',
    CREATE_CONTRACT: 'contract/CREATE_CONTRACT',
}

export const actions = {
    deleteContract: data => ({ type: types.DELETE_CONTRACT, data }),
    updateContract: data => ({ type: types.UPDATE_CONTRACT, data }),
    setContract: ({ data, total }) => ({ type: types.SET_CONTRACT, data, total }),
    aGetContractPage: page => async (dispatch) => {
        try {
            dispatch(appActions.startFetch())
            const result = await instance.get(getContractPage(page))
            !result.data.success && Msg.error('Not Data!')
            dispatch(actions.setContract(result.data))
            dispatch(appActions.finishFetch())
        } catch (err) {
            console.error(err)
            Msg.error('获取合同失败！请重试')
            dispatch(appActions.finishFetch())
        }
    },
}

const initialState = {
    total: null,
    contracts: []
}

const handle = (state, action) => {
    const data = action.data
    switch (action.type) {
        case types.SET_CONTRACT:
            return {
                ...state,
                key: state.id
            }

        default:
            return state
    }
}

// Reducer
export default (state = initialState, action) => {
    switch (action.type) {
        case types.SET_CONTRACT:
            return {
                ...state,
                total: action.total,
                contracts: action.data.map(item => handle(item, action))
            }

        default:
            return state
    }
}