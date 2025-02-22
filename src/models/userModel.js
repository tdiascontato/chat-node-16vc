import db from '../database/database.js';

class UserModel {
  static getAll() {
    return db.prepare('SELECT * FROM users').all();
  }

  static getById(id) {
    return db.prepare('SELECT * FROM users WHERE id = ?').get(id);
  }

  static create(user) {
    return db
      .prepare('INSERT INTO users (uid, name) VALUES (?, ?)')
      .run(user.uid, user.name);
  }

  static update(id, user) {
    return db
      .prepare('UPDATE users SET uid = ?, name = ? WHERE id = ?')
      .run(user.uid, user.name, id);
  }

  static delete(id) {
    return db.prepare('DELETE FROM users WHERE id = ?').run(id);
  }
}

export default UserModel;