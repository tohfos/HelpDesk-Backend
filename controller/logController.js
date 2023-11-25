const logModel = require('../models/logsModel');

const logController = {

    getAllLogs: async (req, res) => {
        try {
            const logs = await logModel.find();
            console.log(logs);
            res.status(200).json(logs);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
};

module.exports = logController;