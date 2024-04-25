import Subject from './subject.entities.js';
import e from "express";

class SubjectController {
  constructor(subjectService) {
    this.subjectService = subjectService;
  }

  createSubject = async (req, res) => {
    this.subjectService.addSubject(new Subject(req.body.email, req.body.password, req.body.age))
        .then(createdSubject => res.status(201).send(createdSubject.toJSON()))
        .catch(err => res.status(403).send(err.message))
  };

  updateSubject = async (req, res) => {
    this.subjectService.updateSubject(new Subject(req.body.email, req.body.password, req.body.age, req.body.id))
        .then(createdSubject => res.status(200).send(createdSubject.toJSON()))
        .catch(err => res.status(404).send(err.message))
  };

  getSubjects = async (_, res) => {
    const subjects = await this.subjectService.getSubjects();
    const subjectsJSON = subjects.map(subject => subject.toJSON());
    res.status(200).send(subjectsJSON);
  };

  getSubjectById = async (req, res) => {
    const { id } = req.params;
    this.subjectService.getSubjectById(id)
        .then(createdSubject => res.status(200).send(createdSubject))
        .catch(err => res.status(404).send(err.message))
  };

  // FIXME just a promise & no check on id path
  deleteSubjectById = (req, res) => {
    const { id } = req.params;
    res.status(200).send(this.subjectService.deleteSubjectById(id));
  };

  // just a promise
  deleteSubjects = (_, res) => res.status(200).send(this.subjectService.deleteSubjects());
}

export default SubjectController;
