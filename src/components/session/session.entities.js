class Session {
    constructor(times, subject, _id = null) {
      if (_id) {
        this._id = _id;
      }
      this.times = times;
      this.subject = subject;
    }
  
    toJSON() {
      return {
        id: this._id, // objectId
        times: this.times, // array of event objects
        subject: this.subject // objectId
      };
    }
  
    static fromDocument(doc) {
      return new Session(doc.times, doc.subject, doc._id);
    }
  }
  
  export default Session;
  