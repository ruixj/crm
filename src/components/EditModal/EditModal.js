import React from 'react'
import { Modal, Form, Input, InputNumber, Select, Cascader } from 'antd'
import PropTypes from 'prop-types'
import city from 'utils/city'
import { isEmptyObject, getTime } from 'utils/func'

const FormItem = Form.Item
const Option = Select.Option
const TextArea = Input.TextArea
const formItemLayout = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 14,
    },
}
const initFunc = (data, item) => {
    if (data.string) {
        return `${item[data.key]}`
    }
    if (data.address) {
        return item.address.split(' ')
    }
    return item[data.key]
}

const editModal = ({
    eid,
    onOk,
    form,
    type,
    formData,
    onCreate,
    item = {},
    ...modalProps
}) => {
    const { getFieldDecorator, validateFields, getFieldsValue } = form
    const isData = isEmptyObject(item)
    const handleOk = () => {
        validateFields((errors) => {
            if (errors) return
            const values = getFieldsValue()
            const data = {
                userManage: {
                    eid,
                    ...values,
                    uid: +item.key,
                    sex: +values.sex,
                    state: +values.state
                },
                business: {
                    eid,
                    ...values,
                    id: +item.key,
                    uid: +item.uid,
                    eName: item.eName,
                    time: item.time || getTime()
                },
                visit: {
                    eid,
                    ...values,
                    id: +item.key,
                    uid: +item.uid,
                    time: item.time || getTime(),
                    result: +values.result,
                },
                contract: {
                    eid,
                    ...values,
                    id: +item.key,
                    uid: +item.uid,
                    state: +values.state,
                    time: item.time || getTime(),
                }
            }[type]

            if (type !== 'userManage') {
                const address = data.address
                if (address) {
                    data.address = data.address.join(' ')
                }
                if (isData) {
                    delete data.emp.id
                    delete data.emp.uid
                    delete data.emp.eName
                }
            }

            isData ? onCreate(data) : onOk(data)
        })
    }

    const modalOpts = {
        ...modalProps,
        onOk: handleOk
    }

    return (
        <Modal {...modalOpts}>
            <Form>
                {
                    formData.map((data) => {
                        const selectVal = data.selectVal
                        let content = null
                        let selectKeys = null
                        selectKeys = data.type === 'select' && Object.keys(selectVal)

                        content = {
                            input: <Input disabled={isData ? false : data.disabled} />,
                            number: <InputNumber min={data.min} max={data.max} />,
                            area: <TextArea autosize={{ minRows: 2, maxRows: 6 }} />,
                            address: <Cascader size="large" options={city} />,
                            select: (
                                <Select>
                                    {
                                        selectKeys &&
                                        selectKeys.map(key => (
                                            <Option key={key} value={key}>
                                                {selectVal[key]}
                                            </Option>
                                        ))
                                    }
                                </Select>
                            )
                        }[data.type]

                        return (
                            <FormItem
                                key={data.id}
                                label={data.label}
                                hasFeedback
                                {...formItemLayout}
                            >
                                {
                                    getFieldDecorator(data.key, {
                                        initialValue: isData ? '' : initFunc(data, item),
                                        rules: data.rules
                                    })(
                                        content
                                    )
                                }
                            </FormItem>
                        )
                    })
                }
            </Form>
        </Modal>
    )
}


const Index = Form.create()(editModal)

editModal.propTypes = {
    eid: PropTypes.any,
    onOk: PropTypes.func,
    type: PropTypes.string,
    item: PropTypes.object,
    form: PropTypes.object,
    onCreate: PropTypes.func,
    formData: PropTypes.array,
}

export default Index
