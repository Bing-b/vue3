import ExcelJS from 'exceljs';

interface ExcelParamsType {
  tableName: string; // 表名
  headerColumns: Array<{ title: string; key: string; width?: number }>; // 表头
  tableData: Array<{ [key: string]: any }>; // 表数据
  mergeRules?: any; // 合并单元格规则
}

// 基础表格样式配置
const excelBaseStyle = {
  font: {
    size: 10,
    bold: true,
    color: { argb: 'ffffff' },
  },
  alignment: { vertical: 'middle', horizontal: 'center' },
  fill: {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'a6a6a6' },
  },
  border: {
    top: { style: 'thin', color: { argb: '9e9e9e' } },
    left: { style: 'thin', color: { argb: '9e9e9e' } },
    bottom: { style: 'thin', color: { argb: '9e9e9e' } },
    right: { style: 'thin', color: { argb: '9e9e9e' } },
  },
};

/**
 * 构建生成excel相关数据
 * @param options: {tableName：工作表名 headerColumns: 表头配置 tableData: 表的数据内容}
 * @returns
 */

const createExcel = (options: ExcelParamsType) => {
  const { tableName, headerColumns, tableData } = options;

  // 创建工作簿
  const workbook = new ExcelJS.Workbook();

  // 配置工作簿属性
  workbook.creator = 'admin';
  workbook.created = new Date();

  // 添加工作表
  const worksheet = workbook.addWorksheet('sheet1');

  if (headerColumns.length > 0) {
    // 设置列头
    const columnsData = headerColumns.map((column) => {
      const width = column?.width ? column.width / 10 : 20;
      return {
        header: column.title,
        key: column.key,
        width,
      };
    });

    worksheet.columns = columnsData;

    let rowIndex = 1; // 默认行索引

    if (tableName !== '') {
      rowIndex += 1;
      // 设置表头样式
      const headerRow = worksheet.getRow(1);
      headerRow.height = 30; // 设置表头行的高度
      headerRow.getCell(1).value = `${tableName}`; // 添加表头标题
      // headerRow.getCell(1).style = excelBaseStyle as Partial<ExcelJS.Style>; // 设置表头单元格样式

      // 合并单元格
      worksheet.mergeCells(`A1:${String.fromCharCode(64 + columnsData.length)}1`);
    }

    // 设置表头样式
    const headerRow2 = worksheet.getRow(rowIndex); // 表头第二行

    // 设置表头内容和样式
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < columnsData.length; i++) {
      const cell = headerRow2.getCell(i + 1);
      cell.value = columnsData[i].header; // 添加表头内容
      cell.style = excelBaseStyle as Partial<ExcelJS.Style>; // 设置表头单元格样式
    }
  }

  // 设置行数据
  if (tableData.length > 0) {
    // 将传入的数据格式化为exceljs可使用的数据格式
    const data = [] as Array<{ [key: string]: any }>;
    tableData.forEach((table) => {
      data.push(table);
    });

    // 添加行
    if (data) worksheet.addRows(data);

    // 获取每列数据，依次对齐
    worksheet.columns.forEach((column) => {
      column.alignment = excelBaseStyle.alignment as Partial<ExcelJS.Alignment>;
    });

    // 设置每行的边框
    const dataLength = data.length as number;
    const tableRows = worksheet.getRows(2, dataLength + 1);
    tableRows!.forEach((row) => {
      row.eachCell({ includeEmpty: true }, (cell) => {
        cell.border = excelBaseStyle.border as Partial<ExcelJS.Borders>;
      });
    });

    // if (Object.prototype.hasOwnProperty.call(tableData.at(0), 'name')) {
    //   const rowMap = new Map();

    //   tableData.forEach((i, index) => {
    //     if (!rowMap.has(i.name)) {
    //       rowMap.set(i.name, []);
    //     }
    //     rowMap.get(i.name).push(index);
    //   });

    //   // eslint-disable-next-line @typescript-eslint/no-unused-vars
    //   for (const [key, val] of rowMap) {
    //     if (val.length > 1) {
    //       let mergeCellsIndex = '';
    //       if (val.length > 2) {
    //         mergeCellsIndex = [`A${val[0] + 2}`, `A${val[val.length - 1] + 2}`].join(':');
    //       } else {
    //         mergeCellsIndex = val.map((i: string) => `A${i + 2}`).join(':');
    //       }
    //       worksheet.mergeCells(mergeCellsIndex); // 参数接收起始点合并的单元格索引
    //     }
    //   }
    // }

    // if (Object.prototype.hasOwnProperty.call(tableData.at(1), 'func')) {
    //   const rowMap = new Map();

    //   tableData.forEach((i, index) => {
    //     if (!rowMap.has(i.name)) {
    //       rowMap.set(i.name, []);
    //     }
    //     rowMap.get(i.name).push(index);
    //   });

    //   // eslint-disable-next-line @typescript-eslint/no-unused-vars
    //   for (const [key, val] of rowMap) {
    //     if (val.length > 1) {
    //       let mergeCellsIndex = '';
    //       if (val.length > 2) {
    //         mergeCellsIndex = [`B${val[0] + 2}`, `B${val[val.length - 1] + 2}`].join(':');
    //       } else {
    //         mergeCellsIndex = val.map((i: string) => `B${i + 2}`).join(':');
    //       }
    //       worksheet.mergeCells(mergeCellsIndex); // 参数接收起始点合并的单元格索引
    //     }
    //   }
    // }

    if (tableData.some((row) => 'name' in row) && tableData.some((row) => 'func' in row)) {
      const rowMap = new Map<string, number[][]>(); // 存储每列的合并索引

      tableData.forEach((row, index) => {
        ['name', 'func'].forEach((key) => {
          if (key in row) {
            const value = row[key];
            if (!rowMap.has(key)) {
              rowMap.set(key, []);
            }
            const groups = rowMap.get(key);
            const lastGroup = groups?.[groups.length - 1];

            if (lastGroup && tableData[lastGroup[lastGroup.length - 1]][key] === value) {
              // 当前值与上组最后值相同，归入该组
              lastGroup.push(index);
            } else {
              // 新增分组
              groups?.push([index]);
            }
          }
        });
      });

      // 遍历每列的合并索引
      for (const [columnKey, groups] of rowMap.entries()) {
        groups.forEach((group) => {
          if (group.length > 1) {
            const startRow = group[0] + 2; // Excel 行号从 1 开始 + header 行
            const endRow = group[group.length - 1] + 2;

            // 假设 `name` 和 `func` 分别对应列 A 和 B，可以动态处理
            const columnIndex = columnKey === 'name' ? 'A' : 'B';
            const mergeCellsIndex = `${columnIndex}${startRow}:${columnIndex}${endRow}`;

            worksheet.mergeCells(mergeCellsIndex); // 执行单元格合并
          }
        });
      }
    }
  }

  return workbook.xlsx.writeBuffer();
};

/**
 * 生成单表xlsx文件，并导出
 * @param options: {tableName：工作表名 headerColumns: 表头配置 tableData: 表的数据内容}
 */
export const exportExcle = (options: ExcelParamsType) => {
  createExcel(options).then((res) => {
    const eleLink = document.createElement('a');
    eleLink.download = 'data.xlsx';
    eleLink.style.display = 'none';
    const blob = new Blob([res], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
    });
    eleLink.href = URL.createObjectURL(blob);
    document.body.appendChild(eleLink);
    eleLink.click();
    document.body.removeChild(eleLink);
  });
};
