const noteRepo = require('../repositories/note.repository');
const tripRepo = require('../repositories/trip.repository');

const getNotes = async (tripId, userId) => {
  const trip = await tripRepo.findByIdAndUser(tripId, userId);
  if (!trip) { const err = new Error('Trip not found.'); err.statusCode = 404; throw err; }
  return noteRepo.findByTrip(tripId);
};

const createNote = async (tripId, userId, data) => {
  const trip = await tripRepo.findByIdAndUser(tripId, userId);
  if (!trip) { const err = new Error('Trip not found.'); err.statusCode = 404; throw err; }
  return noteRepo.create({ tripId, ...data });
};

const deleteNote = async (noteId, userId) => {
  const note = await noteRepo.findByIdWithTrip(noteId);
  if (!note || note.trip.userId !== userId) {
    const err = new Error('Note not found.'); err.statusCode = 404; throw err;
  }
  return noteRepo.remove(noteId);
};

module.exports = { getNotes, createNote, deleteNote };
