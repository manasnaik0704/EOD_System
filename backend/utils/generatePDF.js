const PDFDocument = require('pdfkit');

const fs = require('fs');

const path = require('path');



async function generatePDF(
    employeeCode,
    employeeName,
    department,
    reportDate,
    tasks
) {

    try {

        /*
        ==========================================
        CREATE REPORTS FOLDER
        ==========================================
        */

        const reportsFolder = path.join(
            __dirname,
            '../reports'
        );

        if (!fs.existsSync(reportsFolder)) {

            fs.mkdirSync(
                reportsFolder,
                { recursive: true }
            );

        }



        /*
        ==========================================
        DATE WISE FOLDER
        ==========================================
        */

        const dateFolder = path.join(
            reportsFolder,
            reportDate
        );

        if (!fs.existsSync(dateFolder)) {

            fs.mkdirSync(
                dateFolder,
                { recursive: true }
            );

        }



        /*
        ==========================================
        FILE NAME
        ==========================================
        */

        const fileName =
            `${employeeCode}_${employeeName}_EOD.pdf`;

        const filePath = path.join(
            dateFolder,
            fileName
        );



        /*
        ==========================================
        CREATE PDF
        ==========================================
        */

        const doc = new PDFDocument({
            margin: 30,
            size: 'A4'
        });

        doc.pipe(
            fs.createWriteStream(filePath)
        );



        /*
        ==========================================
        TITLE
        ==========================================
        */

        doc
            .fontSize(26)
            .text(
                'EOD REPORT',
                {
                    align: 'center',
                    underline: true
                }
            );

        doc.moveDown(2);



        /*
        ==========================================
        EMPLOYEE DETAILS
        ==========================================
        */

        doc
            .fontSize(16)
            .text(
                `Employee ID: ${employeeCode}`
            );

        doc.text(
            `Name: ${employeeName}`
        );

        doc.text(
            `Department: ${department}`
        );

        doc.text(
            `Date: ${reportDate}`
        );

        doc.moveDown(2);



        /*
        ==========================================
        TABLE SETTINGS
        ==========================================
        */

        const tableTop = 220;

        const srX = 30;

        const workX = 90;

        const clientX = 330;

        const statusX = 470;

        const rowHeight = 40;



        /*
        ==========================================
        TABLE HEADER BOXES
        ==========================================
        */

        doc.rect(
            srX,
            tableTop,
            60,
            rowHeight
        ).stroke();

        doc.rect(
            workX,
            tableTop,
            240,
            rowHeight
        ).stroke();

        doc.rect(
            clientX,
            tableTop,
            140,
            rowHeight
        ).stroke();

        doc.rect(
            statusX,
            tableTop,
            120,
            rowHeight
        ).stroke();



        /*
        ==========================================
        TABLE HEADER TEXT
        ==========================================
        */

        doc
            .fontSize(13)
            .text(
                'Sr. No.',
                srX + 10,
                tableTop + 12
            );

        doc.text(
            'Work Plan',
            workX + 70,
            tableTop + 12
        );

        doc.text(
            'Client / Required For',
            clientX + 10,
            tableTop + 12
        );

        doc.text(
            'Remarks / Status',
            statusX + 10,
            tableTop + 12
        );



        /*
        ==========================================
        TASK ROWS
        ==========================================
        */

        let currentY =
            tableTop + rowHeight;



        tasks.forEach((task, index) => {

            /*
            ======================================
            ROW BOXES
            ======================================
            */

            doc.rect(
                srX,
                currentY,
                60,
                rowHeight
            ).stroke();

            doc.rect(
                workX,
                currentY,
                240,
                rowHeight
            ).stroke();

            doc.rect(
                clientX,
                currentY,
                140,
                rowHeight
            ).stroke();

            doc.rect(
                statusX,
                currentY,
                120,
                rowHeight
            ).stroke();



            /*
            ======================================
            ROW TEXT
            ======================================
            */

            doc
                .fontSize(12)
                .text(
                    `${index + 1}`,
                    srX + 20,
                    currentY + 12
                );



            doc.text(
                task.work_plan,
                workX + 10,
                currentY + 10,
                {
                    width: 220
                }
            );



            doc.text(
                task.client,
                clientX + 10,
                currentY + 12,
                {
                    width: 120
                }
            );



            doc.text(
                task.status,
                statusX + 20,
                currentY + 12
            );



            currentY += rowHeight;

        });



        /*
        ==========================================
        SAVE PDF
        ==========================================
        */

        doc.end();



        console.log(
            'PDF GENERATED SUCCESSFULLY'
        );

        console.log(filePath);

    } catch (error) {

        console.log(error);

    }

}



module.exports = generatePDF;