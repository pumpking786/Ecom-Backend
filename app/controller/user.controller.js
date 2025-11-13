class UserController {
  userProfile = (req, res) => {
    const { email, name, role } = req.user;

    res.json({
      status: true,
      result: { email, name, role },
      msg: "Profile fetched successfully",
    });
  };
}
module.exports = UserController;
