import ExcelJS from 'exceljs';

interface ExcelParamsType {
  tableName: string,
  headerColumns: Array<{title: string, key: string, width?: number}>
  tableData: Array<{[key: string]: any}>
}

// 基础表格样式配置
const excelBaseStyle = {
  font: {
    size: 10,
    bold: true,
    color: { argb: 'ffffff' }
  },
  alignment: { vertical: 'middle', horizontal: 'center' },
  fill: {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: '808080' }
  },
  border: {
    top: { style: 'thin', color: { argb: '9e9e9e' } },
    left: { style: 'thin', color: { argb: '9e9e9e' } },
    bottom: { style: 'thin', color: { argb: '9e9e9e' } },
    right: { style: 'thin', color: { argb: '9e9e9e' } }
  }
};

/**
 * excel 构建excel
 * tableData: 表的数据内容
 * headerColumns: 表头配置
 * sheetName：工作表名
 */
const createExcel = async (options: ExcelParamsType) => {
  const { tableName,  headerColumns, tableData } = options

  // 创建工作簿
  const workbook = new ExcelJS.Workbook();

  // 配置工作簿属性
  workbook.creator = 'admin'
  workbook.created = new Date()

  // 添加工作表
  const worksheet = workbook.addWorksheet('sheet1')

  if (headerColumns.length > 0) {
    // 设置列头
    const columnsData = headerColumns.map((column) => {
      const width = column?.width ? column.width / 10: 20
      return {
        header: column.title,
        key: column.key,
        width: width
      }
    })


    worksheet.columns = columnsData

    let rowIndex = 1; // 默认行索引

    if(tableName !== '') {
      rowIndex +=1
      // 设置表头样式
      const headerRow = worksheet.getRow(1)
      headerRow.height = 30; // 设置表头行的高度
      headerRow.getCell(1).value = `${tableName}`; // 添加表头标题
      //headerRow.getCell(1).style = excelBaseStyle as Partial<ExcelJS.Style>; // 设置表头单元格样式
  
      // 合并单元格
      worksheet.mergeCells(`A1:${String.fromCharCode(64 + columnsData.length)}1`);

    }

    // 设置表头样式
    const headerRow2 = worksheet.getRow(rowIndex); // 表头第二行
    //headerRow.height = 20; // 设置表头行的高度

    // 设置表头内容和样式
    for (let i = 0; i < columnsData.length; i++) {
      const cell = headerRow2.getCell(i + rowIndex);
      cell.value = columnsData[i].header; // 添加表头内容
      cell.style = excelBaseStyle as Partial<ExcelJS.Style>; // 设置表头单元格样式
    }
  }


  // 设置行数据
  if (tableData.length > 0) {
    // 将传入的数据格式化为exceljs可使用的数据格式
    const data = [] as Array<{[key:string]:any}>
    tableData.forEach((table) => {
      data.push(table)
    })
    // 添加行
    if (data) worksheet.addRows(data)
    // 获取每列数据，依次对齐
    worksheet.columns.forEach((column) => {
      column.alignment = excelBaseStyle.alignment as Partial<ExcelJS.Alignment>
    })
    // 设置每行的边框
    const dataLength = data.length as number
    const tabeRows = worksheet.getRows(2, dataLength + 1)
    tabeRows.forEach((row) => {
      row.eachCell({ includeEmpty: true }, (cell) => {
        cell.border = excelBaseStyle.border as Partial<ExcelJS.Borders>
      })
    })
    
    const map = new Map();

    tableData.forEach((i, index) => {
      if (!map.has(i.user_id)) {
        map.set(i.user_id, []);
      }
      map.get(i.user_id).push(index);
    });
    
    for (const [key, val] of map) {
      if (val.length > 1) {
        const mergeCellsIndex = val.map(i => `A${i + 2}`).join(':');
        console.log(mergeCellsIndex);
        worksheet.mergeCells(mergeCellsIndex);
      }
    }
    

  //console.log(tableData)
  }

  return await workbook.xlsx.writeBuffer()
}


export const exportExcle = (options:ExcelParamsType) => {
  createExcel(options).then(res => {
    const eleLink = document.createElement('a');
    eleLink.download = 'data.xlsx';
    eleLink.style.display = 'none';
    const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    eleLink.href = URL.createObjectURL(blob);
    document.body.appendChild(eleLink);
    eleLink.click();
    document.body.removeChild(eleLink);
  });
}