import { Spin } from "antd";
import React from "react";

const Loading = ({ children, isLoading }) => {
    if (isLoading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <Spin size="large" />
            </div>
        );
    }
    return children;
};

export default Loading;
