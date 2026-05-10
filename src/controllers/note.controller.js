const noteService = require('../services/note.service');
const { sendSuccess } = require('../utils/response.util');

const getNotes = async (req, res, next) => {
  try {
    const notes = await noteService.getNotes(req.params.tripId, req.user.id);
    return sendSuccess(res, notes, 'Notes retrieved');
  } catch (err) { next(err); }
};

const createNote = async (req, res, next) => {
  try {
    const note = await noteService.createNote(req.params.tripId, req.user.id, req.body);
    return sendSuccess(res, note, 'Note created', 201);
  } catch (err) { next(err); }
};

const deleteNote = async (req, res, next) => {
  try {
    await noteService.deleteNote(req.params.id, req.user.id);
    return sendSuccess(res, null, 'Note deleted');
  } catch (err) { next(err); }
};

module.exports = { getNotes, createNote, deleteNote };
