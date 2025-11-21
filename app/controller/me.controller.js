class MeController {
  meProfile = (req, res) => {
    const { email, name, role } = req.me;

    res.json({
      status: true,
      result: { email, name, role },
      msg: "Profile fetched successfully",
    });
  };
}
module.exports = MeController;
