const {
    bookToken,
    cancelToken,
    delayDoctor
  } = require("../services/tokenService");
  
  const { doctors, waitingList } = require("../data/store");
  
  exports.book = (req, res) => {
    res.json(bookToken(req.body));
  };
  
  exports.cancel = (req, res) => {
    res.json(cancelToken(req.body));
  };
  
  exports.delay = (req, res) => {
    res.json(delayDoctor(req.body));
  };
  
  exports.schedule = (req, res) => {
    const { doctorId } = req.params;
  
    if (!doctors[doctorId]) {
      return res.status(404).json({ message: "Doctor not found" });
    }
  
    res.json({
      doctor: doctors[doctorId],
      waitingList
    });
  };
  