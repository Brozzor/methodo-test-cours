import db from "../../mongo/db.js";
import {ObjectId} from "mongodb";
import Subject from "./subject.entities.js";

class SubjectRepository {
    constructor() {
        this.collection = db.collection("subjects");
    }

    async getById(id) {
        const query = this.createBsonId(id);
        return Subject.fromDocument(await this.collection.findOne(query));
    }

    async getByEmail(email) {
        let query = {email: email};
        const document = await this.collection.findOne(query);
        if (!document) {
            return undefined
        }
        return Subject.fromDocument(document);
    }

    getAll = async () => {
        const documents = await this.collection.find({}).toArray();
        return documents.map(doc => Subject.fromDocument(doc));
    };

    deleteAll = async () => await this.collection.deleteMany({});

    async create(document) {
        const res = await this.collection.insertOne(document);
        document.id = res.insertedId.toString()
        return document;
    };

    async update(document) {
        const filter = this.createBsonId(document._id);
        const updateDocument = {
            $set: {
                email: document.email,
                firstname: document.firstname,
                lastname: document.lastname,
                password: document.password,
                age: document.age
            }
        };
        await this.collection.updateOne(filter, updateDocument);
        return await this.getById(document._id);
    }


    async deleteById(id) {
        const query = this.createBsonId(id)
        return await this.collection.deleteOne(query);
    }

    createBsonId(id) {
        let query;
        try {
            query = {_id: new ObjectId(id)};
        } catch (err) {
            throw new Error('Invalid id');
        }
        return query;
    }
}

export default SubjectRepository;
