const checkToken = (req, res, next) => {
  const header = req.headers["authorization"];
  console.debug("Inside checkToken:");
  console.debug("Type of header:", typeof header);

  try {
    console.debug("Inside checkToken, Header", header);
    const token =
      req.cookies.token || req.headers["authorization"]?.split(" ")[1];
    req.token = token;
    console.debug("Inside checkToken, Token", token);
    console.debug(
      "Inside checkToken, Header",
      req.headers["authorization"]?.split(" ")[1],
    );
    next();
  } catch (error) {
    console.error("Inside checkToken, invalid header");
    return res.sendStatus(403);
  }
};

export default checkToken;
