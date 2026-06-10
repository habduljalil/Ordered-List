// This middleware function logs details of each incoming HTTP request and its corresponding response.
function logger(req, res, next) {
  const start = Date.now();

  res.on("finish", () => {
    const duration = `${Date.now() - start}ms`;

    console.log(
      `\x1b[36m${req.method}\x1b[0m ` +
      `\x1b[33m${req.url}\x1b[0m ` +
      `Status: ${
        res.statusCode >= 400
          ? `\x1b[31m${res.statusCode}\x1b[0m`
          : `\x1b[32m${res.statusCode}\x1b[0m`
      } ` +
      `Duration: \x1b[35m${duration}\x1b[0m ` +
      `Date: ${new Date().toISOString()}`
    );
  });

  next();
}

module.exports = logger;
