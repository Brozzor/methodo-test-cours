import express from 'express';

class SubjectRouter {
  constructor(subjectController) {
    this.subjectController = subjectController;
  }

  getRouter() {
    const router = express.Router();
    router.route('/:id').get(this.subjectController.getSubjectById);
    router.route('/:id').delete(this.subjectController.deleteSubjectById);
    router.route('/').get(this.subjectController.getSubjects);
    router.route('/').post(this.subjectController.createSubject);
    router.route('/').put(this.subjectController.updateSubject);
    router.route('/').delete(this.subjectController.deleteSubjects);
    return router;
  }
}

export default SubjectRouter;
