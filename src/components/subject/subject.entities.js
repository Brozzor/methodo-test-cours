class Subject {
  constructor(email, password,firstname,lastname, age, _id = null) {
    if (_id) {
      this._id = _id;
    }
    this.email = email;
    this.firstname = firstname;
    this.lastname = lastname;
    this.password = password;
    this.age = age;
  }

  toJSON() {
    return {
      id: this._id,
      email: this.email,
      firstname: this.firstname,
      lastname: this.lastname,
      age: this.age || null,
    };
  }

  static fromDocument(doc) {
    return new Subject(doc.email, doc.password,doc.firstname, doc.lastname, doc.age, doc._id);
  }
}

export default Subject;
