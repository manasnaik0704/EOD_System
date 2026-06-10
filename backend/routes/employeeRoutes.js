const express = require('express');

const router = express.Router();

const db = require('../config/db');



/*
==================================================
GET ALL EMPLOYEES
==================================================
*/

router.get('/employees', (req, res) => {

    const sql = `
        SELECT *
        FROM employees
        ORDER BY id DESC
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
ADD EMPLOYEE
==================================================
*/

router.post('/employees', (req, res) => {

    const {
        employee_code,
        name,
        department
    } = req.body;



    console.log(req.body);



    const email =
        `${name.toLowerCase()}@eod.com`;

    const password = '123456';

    const role = 'employee';



    const sql = `
        INSERT INTO employees
        (
            employee_code,
            name,
            email,
            password,
            department,
            role
        )
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            employee_code,
            name,
            email,
            password,
            department,
            role
        ],
        (err, result) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    message: 'Employee Add Failed'
                });

            }

            res.status(201).json({
                message:
                    'Employee Added Successfully'
            });

        }
    );

});



/*
==================================================
DELETE EMPLOYEE
==================================================
*/

router.delete('/employees/:id', (req, res) => {

    const employeeId = req.params.id;

    const sql = `
        DELETE FROM employees
        WHERE id = ?
    `;

    db.query(
        sql,
        [employeeId],
        (err) => {

            if (err) {

                console.log(err);

                return res.status(500).json({
                    message: 'Delete Failed'
                });

            }

            res.status(200).json({
                message:
                    'Employee Deleted Successfully'
            });

        }
    );

});



module.exports = router;