const { runPHPCode } = require('../utils/sandbox');

exports.executePHP = async (req, res) => {
  try {
    const { code } = req.body;
    const result = await runPHPCode(code);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, output: error.message });
  }
};
