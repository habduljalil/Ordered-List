const ResponseDto = require("./response.dto");
// This middleware inspects the router stack to determine if the requested path matches any defined routes.
// If it finds a match but the HTTP method is not allowed, it returns a 405 Method Not Allowed response with the allowed methods.
// If no route matches, it returns a 404 Not Found response. This ensures that clients receive accurate feedback 
// about why their request failed, improving the API's usability and adherence to RESTful principles.
function createFallback(orderedListRoutes) {
  return (req, res) => {
    try {
      const allowed = [];

      // inspect router stack to see if any route matches the path
      orderedListRoutes.stack.forEach((layer) => {
        if (!layer.route) return;

        const routePath = layer.route.path;
        const paths = Array.isArray(routePath) ? routePath : [routePath];

        for (const p of paths) {
          let matches = false;

          if (typeof p === 'string') {
            // convert param-style paths like /lists/:id/items to a regex
            const pattern = '^' + p.replace(/:[^/]+/g, '[^/]+') + '/?$';
            const re = new RegExp(pattern);
            matches = re.test(req.path);
          } else if (p instanceof RegExp) {
            matches = p.test(req.path);
          }

          if (matches) {
            const methods = Object.keys(layer.route.methods || {}).map((m) => m.toUpperCase());
            methods.forEach((m) => {
              if (!allowed.includes(m)) allowed.push(m);
            });
            break;
          }
        }
      });

      if (allowed.length > 0 && !allowed.includes(req.method)) {
        res.setHeader('Allow', allowed.join(', '));
        return res.status(405).json(ResponseDto.error(`Method ${req.method} not allowed. Allowed: ${allowed.join(', ')}`, 405));
      }

      return res.status(404).json(ResponseDto.error('API endpoint not found', 404));
    } catch (e) {
      return res.status(404).json(ResponseDto.error('API endpoint not found', 404));
    }
  };
}

module.exports = createFallback;
