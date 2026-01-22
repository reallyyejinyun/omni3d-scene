import React, { memo } from 'react';
import { Pagination as AntPagination } from 'antd';

interface PaginationProps {
    current: number;
    size: number;
    total: number;
    onChange: (current: number, size: number) => void;
    className?: string;
}
/**
 * 分页组件
 * @param param0 
 * @returns 
 */
const Pagination: React.FC<PaginationProps> = ({ current, size, total, onChange, className = '' }) => {
    return (
        <div className={`flex items-center justify-center py-4 ${className}`}>
            <AntPagination
                current={current}
                pageSize={size}
                total={total}
                onChange={onChange}
                showSizeChanger
                showTotal={(total) => `共 ${total} 项`}
                className="custom-pagination"
            />
        </div>
    );
};

export default memo(Pagination);
