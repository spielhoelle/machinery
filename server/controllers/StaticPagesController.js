const generate = require('../../helpers/generate');

exports.generateStaticPages = async (req, res, next) => {
  const user = req.user;
  try {
    var result = generate();
    res.json(200, {
      code: 200,
      message: `Pages created`,
    });
  } catch (err) {
    res.json(404, {
      code: 404,
      message: `Post not found for '${user.name}' or Error: ${err}`
    });
    next(false);
    return;
  }
};
