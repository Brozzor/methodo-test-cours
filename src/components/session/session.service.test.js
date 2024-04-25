import Session from './session.entities';
import { describe, expect, it, jest } from '@jest/globals';
import SessionService from "./session.service.js";

describe('SessionService', () => {

    const mockSessions = [
        new Session([
            { type: 'start', date: '2024-04-19T09:15:00.000Z' },
            { type: 'start-break', date: '2024-04-19T09:40:00.000Z' },
            { type: 'end-break', date: '2024-04-19T09:50:00.000Z' },
            { type: 'end', date: '2024-04-19T10:05:00.000Z' }
        ], '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6', 'a1b2c3d4-e5f6-g7h8-i9j0-k1l2m3n4o5'),
        new Session([
            { type: 'start', date: '2024-04-20T10:20:00.000Z' },
            { type: 'start-break', date: '2024-04-20T10:35:00.000Z' },
            { type: 'end-break', date: '2024-04-20T10:55:00.000Z' },
            { type: 'start-break', date: '2024-04-20T11:05:00.000Z' },
            { type: 'end-break', date: '2024-04-20T11:20:00.000Z' },
            { type: 'end', date: '2024-04-20T11:40:00.000Z' }
        ], 'b1c2d3e4-f5g6-h7i8-j9k0-l1m2n3o4p5q', 'm1n2o3p4-q5r6-s7t8-u9v0-w1x2y3z4a5b'),
        new Session([
            { type: 'start', date: '2024-04-21T11:30:00.000Z' },
            { type: 'start-break', date: '2024-04-21T11:45:00.000Z' },
            { type: 'end-break', date: '2024-04-21T12:00:00.000Z' },
            { type: 'end', date: '2024-04-21T12:15:00.000Z' }
        ], 'c1d2e3f4-g5h6-i7j8-k9l0-m1n2o3p4q5', 'd1e2f3g4-h5i6-j7k8-l9m0-n1o2p3q4r5'),
        new Session([
            { type: 'start', date: '2024-04-22T12:30:00.000Z' },
            { type: 'start-break', date: '2024-04-22T12:45:00.000Z' },
            { type: 'end-break', date: '2024-04-22T13:05:00.000Z' },
            { type: 'end', date: '2024-04-22T13:20:00.000Z' }
        ], 'e1f2g3h4-i5j6-k7l8-m9n0-o1p2q3r4s5', 'f1g2h3i4-j5k6-l7m8-n9o0-p1q2r3s4t5')
    ];

    const mockSessionRepository = {
        getById: jest.fn((id) => mockSessions[0]),
        getAll: jest.fn(() => mockSessions),
        deleteById: jest.fn((id) => undefined),
        deleteAll: jest.fn(() => undefined),
        create: jest.fn((session) => new Session(session.times, session.subject, 'ca9052a3-6875-4740-bb0e-ad1edb9ca72f')),
        update: jest.fn((session) => session),
    };

    const sessionService = new SessionService(mockSessionRepository);

    describe('addSession', () => {
        it('nominal case - should add a new session to the sessions array', async () => {
            const session = new Session([], 'g1h2i3j4-k5l6-m7n8-o9p0-q1r2s3t4');
            const customMockSessionRepository = {
                create: jest.fn((session) => new Session(session.times, session.subject, 'ca9052a3-6875-4740-bb0e-ad1edb9ca72f')),
                getById: jest.fn((id) => mockSessions.find(s => s._id === id))
            }
            const customSessionService = new SessionService(customMockSessionRepository);

            // WHEN
            const res = await customSessionService.addSession(session);

            // THEN
            expect(res._id).toBeDefined();
        });

        it('functional error - should throw an error if a subject is not provided', async () => {
            // GIVEN
            const session = new Session([], '');

            // WHEN + THEN
            await expect(await sessionService.addSession(session)).rejects.toThrow('Subject is required');
        });

        it('functional error - should throw an error if a session with the same subject have a session in progress', async () => {
            // Create two sessions with the same subject
            const session = new Session([], 'g1h2i3j4-k5l6-m7n8-o9p0-q1r2s3t4');
            const session2 = new Session([], 'g1h2i3j4-k5l6-m7n8-o9p0-q1r2s3t4');

            // Add the first session
            await sessionService.addSession(session);

            // WHEN + THEN
            await expect(sessionService.addSession(session2)).rejects.toThrow('Session already in progress');
        });
    });

    describe('addBreak', () => {
        it('nominal case - should add a break to the session', async () => {
            const session = new Session([
                { type: 'start', date: '2024-04-23T13:30:00.000Z' },
            ], 'g1h2i3j4-k5l6-m7n8-o9p0-q1r2s3t4');

            const customMockSessionRepository = {
                createBreak: jest.fn((session) => {
                    session.times.push({ type: 'start-break', date: '2024-04-23T13:45:00.000Z' });
                    return session;
                })
            }

            const customSessionService = new SessionService(customMockSessionRepository);

            // WHEN
            const res = await customSessionService.addBreak(session);

            // THEN
            expect(res.times.length).toBe(2);
        });

        it('functional error - should throw an error if the session is not found', async () => {
            // GIVEN
            const customMockSessionRepository = {
                createBreak: jest.fn((session) => {
                    session.times.push({ type: 'start-break', date: '2024-04-23T13:45:00.000Z' });
                    return session;
                }),
                getById: jest.fn((id) => undefined)
            }

            const customSessionService = new SessionService(customMockSessionRepository);

            // WHEN + THEN
            await expect(customSessionService.addBreak(mockSessions[0]._id)).rejects.toThrow('Session does not exists');
        });

        it('functional error - should throw an error if the session is not in progress', async () => {
            const session = new Session([
                { type: 'start', date: '2024-04-23T13:30:00.000Z' },
                { type: 'start-break', date: '2024-04-23T13:45:00.000Z' },
            ], 'g1h2i3j4-k5l6-m7n8-o9p0-q1r2s3t4');

            // GIVEN
            const customMockSessionRepository = {
                createBreak: jest.fn((session) => {
                    session.times.push({ type: 'start-break', date: '2024-04-23T13:45:00.000Z' });
                    return session;
                }),
                getById: jest.fn((id) => session)
            }

            const customSessionService = new SessionService(customMockSessionRepository);

            // WHEN + THEN
            await expect(customSessionService.addBreak(mockSessions[0]._id)).rejects.toThrow('Session is not in progress');
        });
    });

    describe('addEndBreak', () => {
        it('nominal case - should end the break', async () => {
            const session = new Session([
                { type: 'start', date: '2024-04-23T13:30:00.000Z' },
                { type: 'start-break', date: '2024-04-23T13:45:00.000Z' },
            ], 'g1h2i3j4-k5l6-m7n8-o9p0-q1r2s3t4');

            const customMockSessionRepository = {
                createEndBreak: jest.fn((session) => {
                    session.times.push({ type: 'end-break', date: '2024-04-23T14:05:00.000Z' });
                    return session;
                })
            }

            const customSessionService = new SessionService(customMockSessionRepository);

            // WHEN
            const res = await customSessionService.addEndBreak(session);

            // THEN
            expect(res.times.length).toBe(3);
        });

        it('functional error - should throw an error if the session is not found', async () => {
            // GIVEN
            const customMockSessionRepository = {
                createEndBreak: jest.fn((session) => {
                    session.times.push({ type: 'end-break', date: '2024-04-23T14:05:00.000Z' });
                    return session;
                }),
                getById: jest.fn((id) => undefined)
            }

            const customSessionService = new SessionService(customMockSessionRepository);

            // WHEN + THEN
            await expect(customSessionService.addEndBreak(mockSessions[0]._id)).rejects.toThrow('Session does not exists');
        });

        it('functional error - should throw an error if the session is not in break', async () => {
            const session = new Session([
                { type: 'start', date: '2024-04-23T13:30:00.000Z' },
            ], 'g1h2i3j4-k5l6-m7n8-o9p0-q1r2s3t4');

            // GIVEN
            const customMockSessionRepository = {
                createEndBreak: jest.fn((session) => {
                    session.times.push({ type: 'end-break', date: '2024-04-23T14:05:00.000Z' });
                    return session;
                }),
                getById: jest.fn((id) => session)
            }

            const customSessionService = new SessionService(customMockSessionRepository);

            // WHEN + THEN
            await expect(customSessionService.addEndBreak(mockSessions[0]._id)).rejects.toThrow('Session is not in break');
        });
    });

    describe('addEnd', () => {
        it('nominal case - should end the session', async () => {
            const session = new Session([
                { type: 'start', date: '2024-04-23T13:30:00.000Z' },
            ], 'g1h2i3j4-k5l6-m7n8-o9p0-q1r2s3t4');

            const customMockSessionRepository = {
                createEnd: jest.fn((session) => {
                    session.times.push({ type: 'end', date: '2024-04-23T18:45:00.000Z' });
                    return session;
                })
            }

            const customSessionService = new SessionService(customMockSessionRepository);

            // WHEN
            const res = await customSessionService.addEnd(session);

            // THEN
            expect(res.times.length).toBe(2);
        });

        it('functional error - should throw an error if the session is not found', async () => {
            // GIVEN
            const customMockSessionRepository = {
                createEnd: jest.fn((session) => {
                    session.times.push({ type: 'end', date: '2024-04-23T18:45:00.000Z' });
                    return session;
                }),
                getById: jest.fn((id) => undefined)
            }

            const customSessionService = new SessionService(customMockSessionRepository);

            // WHEN + THEN
            await expect(customSessionService.addEnd(mockSessions[0]._id)).rejects.toThrow('Session does not exists');
        });

        it('functional error - should throw an error if the session is not in progress (break)', async () => {
            const session = new Session([
                { type: 'start', date: '2024-04-23T13:30:00.000Z' },
                { type: 'start-break', date: '2024-04-23T13:45:00.000Z' },
            ], 'g1h2i3j4-k5l6-m7n8-o9p0-q1r2s3t4');

            // GIVEN
            const customMockSessionRepository = {
                createEnd: jest.fn((session) => {
                    session.times.push({ type: 'end', date: '2024-04-23T18:45:00.000Z' });
                    return session;
                }),
                getById: jest.fn((id) => session)
            }

            const customSessionService = new SessionService(customMockSessionRepository);

            // WHEN + THEN
            await expect(customSessionService.addEnd(mockSessions[0]._id)).rejects.toThrow('Session is not in progress');
        });

        it('nominal case - should end the session', async () => {
        });
    });

    describe('getSessions', () => {
        it('nominal case - should return an empty array if there are no sessions in the database', async () => {
            // GIVEN
            const customMockSessionRepository = {
                getAll: jest.fn(() => [])
            }
            const customSessionService = new SessionService(customMockSessionRepository);

            // WHEN
            const res = await customSessionService.getSessions();

            // THEN
            expect(res).toEqual([]);
        });

        it('nominal case - should return an array of all sessions in the database', async () => {
            const res = await sessionService.getSessions();
            expect(res).toEqual(mockSessions);
        });

        it('functional error - should throw an error if the session is not found', async () => {
            // GIVEN
            const customMockSessionRepository = {
                getById: jest.fn(() => undefined)
            }

            const customSessionService = new SessionService(customMockSessionRepository);

            // WHEN + THEN
            await expect(customSessionService.getSessionById("0")).rejects.toThrow('Session does not exists');
        });
    });

    describe('getSessionById', () => {
        it('nominal case - should return the session with the given id', async () => {
            const res = await sessionService.getSessionById(mockSessions[0]._id);
            expect(res).toEqual(mockSessions[0]);
        });

        it('functional error - should throw an error if the session is not found', async () => {
            // GIVEN
            const customMockSessionRepository = {
                getById: jest.fn(() => undefined)
            }

            const customSessionService = new SessionService(customMockSessionRepository);

            // WHEN + THEN
            await expect(customSessionService.getSessionById("0")).rejects.toThrow('Session does not exists');
        });

        it('functional error - should throw an error if the session id is not provided', async () => {
            // GIVEN
            const customMockSessionRepository = {
                getById: jest.fn(() => undefined)
            }

            const customSessionService = new SessionService(customMockSessionRepository);

            // WHEN + THEN
            await expect(customSessionService.getSessionById("")).rejects.toThrow('Session id is required');
        });
    });
});
