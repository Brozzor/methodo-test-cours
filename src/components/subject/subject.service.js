class SubjectService {
  constructor(repository) {
    this.repository = repository;
  }

  addSubject = async (subject) => {
    if (await this.repository.getByEmail(subject.email) == null) {
      return this.repository.create(subject);
    } else {
      throw new Error('Subject already exists');
    }
  };

  updateSubject = async (subject) => {
    await this.getSubjectById(subject._id); // Alternatively you can create with put if it does not exist
    return await this.repository.update(subject);
  };


  getSubjects = () => this.repository.getAll();

  getSubjectById = async (id) => {
    const subject = await this.repository.getById(id);
    if (subject) {
      return subject
    } else {
      throw new Error('Subject does not exists');
    }
  };

  // TODO throw if not founded using property "deletedCount" of return value
  deleteSubjectById = (id) => this.repository.deleteById(id);

  deleteSubjects = () => this.repository.deleteAll();

  login = (email, password) => {
    const subject = this.repository.getByEmail(email);
    if (!subject || subject.password !== password) {
      throw new Error('Invalid Login');
    } else {
      return subject;
    }
  };
}

export default SubjectService;
