const doctors = {
    d1: {
      doctorId: "d1",
      name: "Dr A",
      slots: {
        "9-10": {
          max: 2,
          tokens: []
        },
        "10-11": {
          max: 2,
          tokens: []
        }
      }
    }
  };
  
  const waitingList = {};
  
  module.exports = {
    doctors,
    waitingList
  };
  