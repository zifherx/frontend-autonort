import { Workbook } from "exceljs";
import { saveAs } from "file-saver";

const propertiesSheet = {
    properties: {
        tabColor: { argb: "FFC0000" },
    },
    views: [
        {
            showGridLines: false,
            width: 30,
            height: 150,
        },
    ],
    pageSetup: {
        paperSize: 9,
        orientation: "portrait",
    },
};

export async function createExcelTable(nombre_de_pestana, cabecera, contentTable, rangoFiltros, nombre_archivo) {
    // Creación del Libro
    const workBook = new Workbook();

    // Creación de Pestaña
    const workSheet = workBook.addWorksheet(nombre_de_pestana, propertiesSheet);

    // Headers
    workSheet.columns = cabecera;

    // Contenido
    workSheet.addRows(contentTable);

    // FILTROS
    workSheet.autoFilter = rangoFiltros;

    // ESTILOS
    workSheet.eachRow((row, rowNumber) => {
        row.eachCell((cell, cellNumber) => {
            if (rowNumber === 1) {
                // cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "002060" } };
                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "D50000" } };
                cell.font = { name: "Arial", family: 5, size: 12, bold: true, color: { argb: "ffffff" } };
                cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true, shrinkToFit: true };
                cell.border = {
                    top: { style: "medium", color: { argb: "ffffff" } },
                    left: { style: "medium", color: { argb: "ffffff" } },
                    bottom: { style: "medium", color: { argb: "ffffff" } },
                    right: { style: "medium", color: { argb: "ffffff" } },
                };
            }

            cell.border = {
                top: { style: "thin", color: { argb: "000000" } },
                left: { style: "thin", color: { argb: "000000" } },
                bottom: { style: "thin", color: { argb: "000000" } },
                right: { style: "thin", color: { argb: "000000" } },
            };

            cell.alignment = { vertical: "middle", horizontal: "center", wrapText: true, shrinkToFit: true };
        });
        row.commit();
    });

    // workSheet.eachColumnKey((column, columNumber) => {

    // })

    const excelFile = await workBook.xlsx.writeBuffer();
    const blobFile = new Blob([excelFile], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

    saveAs(blobFile, nombre_archivo);
}
