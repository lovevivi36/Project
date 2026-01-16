import * as XLSX from 'xlsx';
import type { Task } from '@/types/task';

/**
 * 导出任务列表到 Excel
 * @param tasks 任务列表
 * @param columns 要导出的列（可选）
 */
export const exportTasksToExcel = (tasks: Task[], columns?: string[]) => {
  // 默认导出所有列
  const enabledColumns = columns || ['title', 'subtasks', 'priority', 'status', 'dueDate', 'createdAt'];

  // 列配置映射
  const columnConfig: Record<string, string> = {
    title: '任务标题',
    subtasks: '子任务',
    priority: '优先级',
    status: '状态',
    dueDate: '截止日期',
    createdAt: '创建日期',
  };

  // 构建表头
  const headers = enabledColumns.map((key) => columnConfig[key]);

  // 构建数据行
  const rows: (string | number)[][] = [];

  // 辅助函数：获取单元格值
  const getCellValue = (task: Task, col: string, isSubtask: boolean, subtaskTitle?: string): string | number => {
    switch (col) {
      case 'title':
        return task.title;
      case 'subtasks':
        return isSubtask && subtaskTitle ? subtaskTitle : '-';
      case 'priority':
        return task.priority;
      case 'status':
        return task.completed ? '已完成' : '进行中';
      case 'dueDate':
        return task.dueDate ? new Date(task.dueDate).toLocaleDateString('zh-CN') : '-';
      case 'createdAt':
        return new Date(task.createdAt).toLocaleDateString('zh-CN');
      default:
        return '';
    }
  };

  tasks.forEach((task) => {
    const hasSubtasks = task.subtasks && task.subtasks.length > 0;

    if (hasSubtasks) {
      // 有子任务：每个子任务占一行，主任务信息重复
      task.subtasks?.forEach((subtask) => {
        const row: (string | number)[] = [];
        enabledColumns.forEach((col) => {
          if (col === 'subtasks') {
            // 子任务列显示子任务标题
            row.push(subtask.title);
          } else if (col === 'priority' || col === 'status' || col === 'dueDate' || col === 'createdAt') {
            // 其他列显示子任务自己的信息
            row.push(getCellValue(subtask, col, true));
          } else {
            // 标题列显示主任务标题
            row.push(getCellValue(task, col, false));
          }
        });
        rows.push(row);
      });
    } else {
      // 无子任务的普通任务
      const row: (string | number)[] = [];
      enabledColumns.forEach((col) => {
        row.push(getCellValue(task, col, false));
      });
      rows.push(row);
    }
  });

  // 创建工作表
  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);

  // 设置列宽
  const colWidths = enabledColumns.map((col) => {
    switch (col) {
      case 'title':
        return { wch: 30 };
      case 'subtasks':
        return { wch: 30 };
      case 'priority':
        return { wch: 10 };
      case 'status':
        return { wch: 10 };
      case 'dueDate':
        return { wch: 15 };
      case 'createdAt':
        return { wch: 15 };
      default:
        return { wch: 15 };
    }
  });
  worksheet['!cols'] = colWidths;

  // 创建工作簿
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'DopaList任务列表');

  // 生成文件名
  const fileName = `DopaList_任务列表_${new Date().toLocaleDateString('zh-CN').replace(/\//g, '-')}.xlsx`;

  // 导出文件
  XLSX.writeFile(workbook, fileName);
};
