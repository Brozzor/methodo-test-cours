import Subject from './subject.entities.js';
import {describe, expect, it, jest} from '@jest/globals';
import SubjectService from "./subject.service.js";

describe('SubjectService', () => {

    const mockSubjects = [
        new Subject("42@email.com", "42", 'jacky', 'michel', 42, "4200a8f5185294c4fee1b41e"),
        new Subject("subject1@example.com", "password",'rabby', 'toto', 30, "661fa8f5185294c4fee1b41e"),
        new Subject("subject2@example.com", "password",'petepas', 'lordi', 31, "001fa8f5185294c4fee1b41e"),
        new Subject("subject3@example.com", "password",'maxime', 'pasla', 32, "111fa8f5185294c4fee1b41e")
    ];

    const mockSubjectRepository = {
        getById: jest.fn((id) => mockSubjects[0]),
        getByEmail: jest.fn((email) => mockSubjects[0]),
        getAll: jest.fn(() => mockSubjects),
        deleteById: jest.fn((id) => undefined),
        deleteAll: jest.fn(() => undefined),
        create: jest.fn((subject) => new Subject(subject.email, subject.password, subject.firstname, subject.lastname, subject.age, "661fa8f5185294c4fee1b41e")),
        update: jest.fn((subject) => subject),
    };

    const subjectService = new SubjectService(mockSubjectRepository);

    describe('addSubject', () => {
        it('nominal case - should add a new subject to the subjects array', async () => {
            // GIVEN
            const subject = new Subject('test@example.com', 'password123', 'jacky', 'michel', 42);
            const customMockSubjectRepository = {
                getByEmail: jest.fn(() => undefined),
                create: jest.fn((subject) => new Subject(subject.email, subject.password, subject.firstname, subject.lastname, subject.age, "661fa8f5185294c4fee1b41e"))
            }
            const customSubjectService = new SubjectService(customMockSubjectRepository);

            // WHEN
            const res = await customSubjectService.addSubject(subject);

            // THEN
            expect(res.email).toBe(subject.email);
            expect(res.password).toBe(subject.password);
            expect(res.age).toBe(subject.age);
            expect(res._id).toBeDefined();
        });

        it('functional error - should throw an error if a subject with the same email already exists', async () => {
            // GIVEN
            const existingSubject = {...mockSubjects[0]};

            // WHEN + THEN
            await expect(subjectService.addSubject(existingSubject)).rejects.toThrow('Subject already exists');
        });
    });

    describe('getSubjects', () => {
        it('nominal case - should return an empty array if there are no subjects in the database', () => {
            // GIVEN
            const customMockSubjectRepository = {
                getAll: jest.fn(() => [])
            }
            const customSubjectService = new SubjectService(customMockSubjectRepository);

            // WHEN
            const res = customSubjectService.getSubjects();

            // THEN
            expect(res).toEqual([]);
        });

        it('nominal case - should return an array of all subjects in the database', () => {
            expect(subjectService.getSubjects().length).toEqual(4);
        });
    });

    describe('getSubjectById', () => {
        it('functional error - should throw an error if the subject is not found', async () => {
            // GIVEN
            const customMockSubjectRepository = {
                getById: jest.fn(() => undefined)
            }
            const customSubjectService = new SubjectService(customMockSubjectRepository);

            // WHEN - THEN
            await expect(customSubjectService.getSubjectById("0")).rejects.toThrow('Subject does not exists');
        });

        it('nominal case - should return the correct subject if the subject is found', async () => {
            const res = await subjectService.getSubjectById(mockSubjects[0]._id);
            expect(res).toEqual(mockSubjects[0]);
        });
    });

    describe('login', () => {
        it('functional error - should throw an error if the email is not found', async () => {
            // GIVEN
            const customMockSubjectRepository = {
                getByEmail: jest.fn(() => undefined)
            }
            const customSubjectService = new SubjectService(customMockSubjectRepository);

            // WHEN
            try {
                await customSubjectService.login('name@a.com', '123456');

            // THEN
            } catch (error) {
                expect(error.message).toBe('Invalid Login');
            }
        });

        it('functional error - should throw an error if the password is incorrect', async () => {
            try {
                await subjectService.login(mockSubjects[0].email, "wrong password");
            } catch (error) {
                expect(error.message).toBe('Invalid Login');
            }
        });

        it('nominal case - should return nothing', async () => {
            const res = await subjectService.login(mockSubjects[0].email, mockSubjects[0].password);
            expect(res).toBe(mockSubjects[0]);
        });
    });

    // TODO updateSubject & deleteSubjectById
});
