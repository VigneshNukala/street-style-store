function validatePassword(password) {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
}

function handleError(res, error, message = "Internal Server Error") {
  return res.status(500).json({ status: "error", message });
};

module.exports = { validatePassword, handleError };