const express = require('express');

const router = express.Router();

const db = require('../config/db');

const generatePDF = require('../utils/generatePDF');



/*
==================================================
PROFESSIONAL MULTI-ROW EOD SAVE API
==================================================
*/

router.post('/eod', (req, res) => {

    const {
        employee_id,
        department,
        report_date,
        tasks
    } = req.body;



    /*
    ==========================================
    SAVE MAIN REPORT
    ==========================================
    */

    const reportSql = `
        INSERT INTO eod_reports_new
        (
            employee_id,
            department,
            report_date
        )
        VALUES (?, ?, ?)
    `;

    db.query(
        reportSql,
        [
            employee_id,
            department,
            report_date
        ],
        (err, reportResult) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    message: 'Report Save Failed'
                });

            }



            const eodReportId =
                reportResult.insertId;



            /*
            ==========================================
            GET EMPLOYEE DETAILS
            ==========================================
            */

            const employeeSql = `
                SELECT employee_code, name
                FROM employees
                WHERE id = ?
            `;

            db.query(
                employeeSql,
                [employee_id],
                (empErr, empResult) => {

                    if (empErr) {

                        console.log(empErr);

                        return res.status(500).json({
                            message:
                                'Employee Fetch Failed'
                        });

                    }



                    /*
                    ==========================================
                    EMPLOYEE DETAILS
                    ==========================================
                    */

                    const employeeCode =
                        empResult[0].employee_code;

                    const employeeName =
                        empResult[0].name;



                    /*
                    ==========================================
                    PREPARE TASK VALUES
                    ==========================================
                    */

                    const taskValues = tasks.map((task) => [

                        eodReportId,
                        task.work_plan,
                        task.client,
                        task.status

                    ]);



                    /*
                    ==========================================
                    SAVE TASKS
                    ==========================================
                    */

                    const taskSql = `
                        INSERT INTO eod_tasks
                        (
                            eod_report_id,
                            work_plan,
                            client,
                            status
                        )
                        VALUES ?
                    `;

                    db.query(
                        taskSql,
                        [taskValues],
                        async (taskErr) => {

                            if (taskErr) {

                                console.log(taskErr);

                                return res.status(500).json({
                                    message:
                                        'Task Save Failed'
                                });

                            }



                            /*
                            ==========================================
                            GENERATE PDF
                            ==========================================
                            */

                            await generatePDF(
                                employeeCode,
                                employeeName,
                                department,
                                report_date,
                                tasks
                            );



                            /*
                            ==========================================
                            SUCCESS RESPONSE
                            ==========================================
                            */

                            res.status(201).json({
                                message:
                                    'Professional EOD + PDF Saved Successfully'
                            });

                        }
                    );

                }
            );

        }
    );

});



/*
==================================================
GET ALL PROFESSIONAL EOD REPORTS
==================================================
*/

router.get('/eod', (req, res) => {

    const sql = `

        SELECT

            eod_reports_new.id,
            employees.employee_code,
            employees.name,
            eod_reports_new.department,
            eod_reports_new.report_date,
            eod_tasks.work_plan,
            eod_tasks.client,
            eod_tasks.status

        FROM eod_reports_new

        JOIN employees
        ON employees.id = eod_reports_new.employee_id

        JOIN eod_tasks
        ON eod_tasks.eod_report_id = eod_reports_new.id

        ORDER BY eod_reports_new.id DESC

    `;

    db.query(sql, (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                message: 'Fetch Failed'
            });

        }

        res.status(200).json(result);

    });

});


/*
==================================================
EOD SUMMARY REPORTS
==================================================
*/

router.get('/eod-summary', (req, res) => {

    const sql = `

        SELECT

            eod_reports_new.id AS report_id,

            employees.employee_code,

            employees.name,

            eod_reports_new.department,

            eod_reports_new.report_date,

            COUNT(eod_tasks.id) AS task_count

        FROM eod_reports_new

        JOIN employees
        ON employees.id = eod_reports_new.employee_id

        LEFT JOIN eod_tasks
        ON eod_tasks.eod_report_id = eod_reports_new.id

        GROUP BY
            eod_reports_new.id,
            employees.employee_code,
            employees.name,
            eod_reports_new.department,
            eod_reports_new.report_date

        ORDER BY eod_reports_new.id DESC

    `;

    db.query(sql, (err, result) => {

        if (err) {

            console.log(err);

            return res.status(500).json({
                message: 'Summary Fetch Failed'
            });

        }

        res.status(200).json(result);

    });

});

module.exports = router;