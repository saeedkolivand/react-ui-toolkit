import React, { useState } from 'react';
import classNames from 'classnames';
import { Button } from '../Button/Button';
import { Container } from '../../layout/Container/Container';
import { Icon } from '../Icon/Icon';
import { Select, Option } from '../Select/Select';

export type SortOrder = 'ascend' | 'descend' | null;

export interface ColumnType<T> {
  title: React.ReactNode;
  dataIndex: keyof T;
  key: string;
  render?: (text: any, record: T) => React.ReactNode;
  sorter?: (a: T, b: T) => number;
  width?: number | string;
  defaultSortOrder?: SortOrder;
}

export interface TablePagination {
  current: number;
  pageSize: number;
  total: number;
  onChange: (page: number) => void;
  showSizeChanger?: boolean;
  pageSizeOptions?: number[];
  onPageSizeChange?: (size: number) => void;
}

export interface TableProps<T> {
  dataSource: T[];
  columns: ColumnType<T>[];
  rowKey: keyof T;
  size?: 'small' | 'middle' | 'large';
  bordered?: boolean;
  loading?: boolean;
  pagination?: TablePagination | false;
  scroll?: {
    x?: number | string;
    y?: number | string;
  };
  onChange?: (params: {
    sorter?: { column: keyof T; order: SortOrder };
    pagination?: { current: number; pageSize: number };
  }) => void;
}

export function Table<T extends object>({
  dataSource,
  columns,
  rowKey,
  size = 'middle',
  bordered = false,
  loading = false,
  pagination,
  scroll,
  onChange,
}: TableProps<T>) {
  const [sortState, setSortState] = useState<{
    column: keyof T | null;
    order: SortOrder;
  }>(() => {
    const defaultSortColumn = columns.find(col => col.defaultSortOrder);
    return {
      column: defaultSortColumn?.dataIndex || null,
      order: defaultSortColumn?.defaultSortOrder || null,
    };
  });

  const tableClasses = classNames('w-full', {
    'border border-gray-200': bordered,
    'text-sm': size === 'small',
    'text-base': size === 'middle',
    'text-lg': size === 'large',
  });

  const handleSort = (column: ColumnType<T>) => {
    if (!column.sorter) return;

    let newOrder: SortOrder = 'ascend';
    if (sortState.column === column.dataIndex) {
      if (sortState.order === 'ascend') {
        newOrder = 'descend';
      } else if (sortState.order === 'descend') {
        newOrder = null;
      }
    }

    const newSortState = {
      column: newOrder ? column.dataIndex : null,
      order: newOrder,
    };

    setSortState(newSortState);
    onChange?.({
      sorter: newOrder
        ? {
            column: column.dataIndex,
            order: newOrder,
          }
        : undefined,
      pagination: pagination
        ? {
            current: pagination.current,
            pageSize: pagination.pageSize,
          }
        : undefined,
    });
  };

  const getSortedData = () => {
    if (!sortState.column || !sortState.order) return dataSource;

    const column = columns.find(col => col.dataIndex === sortState.column);
    if (!column?.sorter) return dataSource;

    return [...dataSource].sort((a, b) => {
      const result = column.sorter!(a, b);
      return sortState.order === 'ascend' ? result : -result;
    });
  };

  const renderSortIcon = (column: ColumnType<T>) => {
    if (!column.sorter) return null;

    const isActive = sortState.column === column.dataIndex;
    const isAscend = isActive && sortState.order === 'ascend';
    const isDescend = isActive && sortState.order === 'descend';

    return (
      <span className="ml-1 flex flex-col">
        <Icon
          name="chevronUp"
          className={classNames('h-3 w-3', {
            'text-primary-600': isAscend,
            'text-gray-400': !isAscend,
          })}
        />
        <Icon
          name="chevronDown"
          className={classNames('h-3 w-3 -mt-1', {
            'text-primary-600': isDescend,
            'text-gray-400': !isDescend,
          })}
        />
      </span>
    );
  };

  const renderHeader = () => (
    <thead>
      <tr className="bg-gray-50">
        {columns.map(column => (
          <th
            key={column.key}
            className={classNames(
              'px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
              {
                'cursor-pointer hover:bg-gray-100': column.sorter,
              }
            )}
            style={{ width: column.width }}
            onClick={() => handleSort(column)}
          >
            <div className="flex items-center">
              {column.title}
              {renderSortIcon(column)}
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );

  const renderBody = () => {
    const sortedData = getSortedData();
    const currentData = pagination
      ? sortedData.slice(
          (pagination.current - 1) * pagination.pageSize,
          pagination.current * pagination.pageSize
        )
      : sortedData;

    return (
      <tbody className="bg-white divide-y divide-gray-200">
        {currentData.map(record => (
          <tr key={String(record[rowKey])} className="hover:bg-gray-50">
            {columns.map(column => (
              <td key={column.key} className="px-4 py-2 whitespace-nowrap">
                {column.render
                  ? column.render(record[column.dataIndex], record)
                  : String(record[column.dataIndex])}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    );
  };

  const renderPagination = () => {
    if (!pagination) return null;

    const totalPages = Math.ceil(pagination.total / pagination.pageSize);
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
      <Container className="flex items-center justify-end gap-4 mt-4">
        <div className="flex items-center gap-2">
          {pagination.showSizeChanger && (
            <Select
              value={pagination.pageSize.toString()}
              onChange={e => {
                const value = e.target.value;
                if (value && pagination.onPageSizeChange) {
                  const newPageSize = parseInt(value, 10);
                  pagination.onPageSizeChange(newPageSize);
                  // Reset to first page when page size changes
                  pagination.onChange(1);
                }
              }}
              size="sm"
              className="w-20"
            >
              {(pagination.pageSizeOptions || [10, 20, 30, 40, 50]).map(size => (
                <Option key={size} value={size.toString()}>
                  {size}
                </Option>
              ))}
            </Select>
          )}
          <span className="text-sm text-gray-600">
            {(pagination.current - 1) * pagination.pageSize + 1}-
            {Math.min(pagination.current * pagination.pageSize, pagination.total)} of{' '}
            {pagination.total}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => pagination.onChange(pagination.current - 1)}
            disabled={pagination.current === 1}
            className="rounded-md"
          >
            ←
          </Button>
          <div className="flex items-center gap-1">
            {pages.map(page => (
              <Button
                key={page}
                variant={page === pagination.current ? 'primary' : 'outline'}
                size="sm"
                onClick={() => pagination.onChange(page)}
                className={classNames('min-w-[32px]', {
                  'z-10': page === pagination.current,
                })}
              >
                {page}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => pagination.onChange(pagination.current + 1)}
            disabled={pagination.current === totalPages}
            className="rounded-md"
          >
            →
          </Button>
        </div>
      </Container>
    );
  };

  return (
    <Container className="overflow-x-auto" style={{ maxWidth: scroll?.x }}>
      <table className={tableClasses}>
        {renderHeader()}
        {renderBody()}
      </table>
      {renderPagination()}
    </Container>
  );
}
