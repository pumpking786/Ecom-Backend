class MeController {
  meProfile = (req, res) => {
    const { email, name, role, id } = req.user;

    res.json({
      status: true,
      result: { email, name, role, id },
      msg: "Profile fetched successfully",
    });
  };
}
module.exports = MeController;
