import { Spin } from 'antd'
import React from 'react'
const Loading = ({ children, isLoading, delay = 1000 }) => {
    return (
        <Spin spinning={isLoading} delay={delay}>
            {children}
        </Spin>
    )
}
export default Loading