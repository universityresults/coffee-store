const hello = async (req, res) => {
  res.json({req: req.method, msg:'helloo'})
};

export default hello;
