const express = require("express");
const router = express.Router();
const dynamoDB = require("../config/db");

const TABLE_NAME = "info";
const INFO_ID = "unique_info_key"; 


router.post("/", async (req, res) => {
    const { data } = req.body;

    if (!data) {
        return res.status(400).json({ error: "El campo 'data' es obligatorio" });
    }
    try {
        const putParams = {
            TableName: TABLE_NAME,
            Item: { id: INFO_ID, data }
        };
        await dynamoDB.put(putParams).promise();

        res.status(201).json({ message: "Datos sobrescritos correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/", async (req, res) => {
    try {
        const params = {
            TableName: TABLE_NAME,
            Key: { id: INFO_ID }
        };
        const result = await dynamoDB.get(params).promise();
        if (!result.Item) {
            return res.status(404).json({ error: "No hay datos disponibles" });
        }

        res.json(result.Item.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
