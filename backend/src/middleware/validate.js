// Terima objek { body, query, params } berisi zod schema, validasi bagian yang ada,
// lalu timpa req.<part> dengan hasil parse (sudah ke-coerce & trim).
module.exports = (schemas) => (req, res, next) => {
  try {
    for (const part of ['body', 'query', 'params']) {
      if (schemas[part]) {
        req[part] = schemas[part].parse(req[part]);
      }
    }
    next();
  } catch (err) {
    next(err);
  }
};
