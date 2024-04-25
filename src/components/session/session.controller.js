import Session from './session.entities.js';
import e from "express";

class SessionController {
  constructor(sessionService) {
    this.sessionService = sessionService;
  }

  createSession = async (req, res) => {
    try {
      const { subject } = req.body;

      // If subject is not provided
      if (!subject) throw new Error('Subject is required');

      // Check if a session already exist
      const sessions = this.sessionService.getSessions();
      const subjectSessions = sessions.filter((session) => session.subject === subject);
      for (let subjectSession of subjectSessions) {
        let hasEndSession = subjectSession.times.filter((time) => time.type === 'end');
        if (hasEndSession.length === 0) throw new Error('Session already in progress');
      }

      // Create a new session
      const session = new Session([], subject);
      const createdSession = await this.sessionService.createSession(session);

      // Return the created session
      return res.status(201).json(createdSession.toJSON());
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  };

  updateSession = async (req, res) => {
    this.sessionService.updateSession(new Session(req.body.email, req.body.password, req.body.age, req.body.id))
        .then(createdSession => res.status(200).send(createdSession.toJSON()))
        .catch(err => res.status(404).send(err.message))
  };

  addBreak = async (req, res) => {
    
  };

  addEndBreak = async (req, res) => {
     
      };

    addEnd = async (req, res) => {
        
        };

  getSessions = async (_, res) => {
    const sessions = await this.sessionService.getSessions();
    const sessionsJSON = sessions.map(session => session.toJSON());
    res.status(200).send(sessionsJSON);
  };

  getSessionById = async (req, res) => {
    const { id } = req.params;
    this.sessionService.getSessionById(id)
        .then(createdSession => res.status(200).send(createdSession))
        .catch(err => res.status(404).send(err.message))
  };

  // FIXME just a promise & no check on id path
  deleteSessionById = (req, res) => {
    const { id } = req.params;
    res.status(200).send(this.sessionService.deleteSessionById(id));
  };

  // just a promise
  deleteSessions = (_, res) => res.status(200).send(this.sessionService.deleteSessions());
}

export default SessionController;
