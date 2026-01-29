const { v4: uuid } = require("uuid");
const { doctors, waitingList } = require("../data/store");

// Priority rules
const PRIORITY = {
  EMERGENCY: 1,
  PAID: 2,
  FOLLOW_UP: 3,
  ONLINE: 4,
  WALK_IN: 5
};

// ---------------- BOOK TOKEN ----------------
function bookToken({ doctorId, slotId, patientType }) {
  const doctor = doctors[doctorId];
  if (!doctor) return { message: "Doctor not found" };

  const slot = doctor.slots[slotId];
  if (!slot) return { message: "Slot not found" };

  const priority = PRIORITY[patientType];

  const token = {
    tokenId: uuid(),
    patientType,
    priority,
    status: "BOOKED"
  };

  // Slot has space
  if (slot.tokens.length < slot.max) {
    slot.tokens.push(token);
    return { message: "Token booked", token };
  }

  // Slot full → try reallocation
  slot.tokens.sort((a, b) => b.priority - a.priority);
  const lowest = slot.tokens[0];

  if (priority < lowest.priority) {
    slot.tokens.shift();
    slot.tokens.push(token);

    if (!waitingList[slotId]) waitingList[slotId] = [];
    waitingList[slotId].push(lowest);

    return { message: "Token reallocated", token };
  }

  // Add to waiting list
  if (!waitingList[slotId]) waitingList[slotId] = [];
  waitingList[slotId].push(token);

  return { message: "Added to waiting list" };
}

// ---------------- CANCEL TOKEN ----------------
function cancelToken({ doctorId, slotId, tokenId }) {
  const doctor = doctors[doctorId];
  if (!doctor) return { message: "Doctor not found" };

  const slot = doctor.slots[slotId];
  if (!slot) return { message: "Slot not found" };

  slot.tokens = slot.tokens.filter(t => t.tokenId !== tokenId);

  if (waitingList[slotId]?.length) {
    waitingList[slotId].sort((a, b) => a.priority - b.priority);
    const nextToken = waitingList[slotId].shift();
    slot.tokens.push(nextToken);
  }

  return { message: "Token cancelled" };
}

// ---------------- DOCTOR DELAY ----------------
function delayDoctor({ doctorId, slotId, delayMinutes }) {
  const doctor = doctors[doctorId];
  if (!doctor) return { message: "Doctor not found" };

  const slotKeys = Object.keys(doctor.slots);
  const index = slotKeys.indexOf(slotId);

  if (index === -1 || index === slotKeys.length - 1) {
    return { message: "No next slot available" };
  }

  const currentSlot = doctor.slots[slotId];
  const nextSlotId = slotKeys[index + 1];
  const nextSlot = doctor.slots[nextSlotId];

  // Move low priority first
  currentSlot.tokens.sort((a, b) => b.priority - a.priority);

  while (currentSlot.tokens.length && nextSlot.tokens.length < nextSlot.max) {
    nextSlot.tokens.push(currentSlot.tokens.shift());
  }

  // Overflow → waiting list
  if (currentSlot.tokens.length) {
    if (!waitingList[nextSlotId]) waitingList[nextSlotId] = [];
    waitingList[nextSlotId].push(...currentSlot.tokens);
    currentSlot.tokens = [];
  }

  return {
    message: `Doctor delayed by ${delayMinutes} minutes`,
    from: slotId,
    to: nextSlotId
  };
}

module.exports = {
  bookToken,
  cancelToken,
  delayDoctor
};
