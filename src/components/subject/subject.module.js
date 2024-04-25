import SubjectController from './subject.controller.js';
import SubjectService from './subject.service.js';
import SubjectRouter from './subject.router.js';
import SubjectRepository from "./subject.repository.js";

const subjectRepository = new SubjectRepository();
const subjectService = new SubjectService(subjectRepository);
const subjectController = new SubjectController(subjectService);
const subjectRouter = new SubjectRouter(subjectController);

export default {
  service: subjectService,
  controller: subjectController,
  router: subjectRouter.getRouter(),
  repository: subjectRepository
};
