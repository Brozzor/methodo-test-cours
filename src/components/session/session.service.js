class SessionService {
  constructor(repository) {
    this.repository = repository;
  }

  addSession = async (session) => {
    if (!session.subject) throw new Error('Subject is required');
    if (await this.repository.getById(session._id) == null) {
      return this.repository.create(session);
    } else {
      throw new Error('Session already exists');
    }
  };

  addBreak = async (session) => {
    console.log(session)
  }

  addEndBreak = async (session) => {

  }

  addEnd = async (session) => {

  }


  getSessions = () => this.repository.getAll();

  getSessionById = async (id) => {
    const session = await this.repository.getById(id);
    if (session) {
      return session
    } else {
      throw new Error('Session does not exists');
    }
  };
}

export default SessionService;
