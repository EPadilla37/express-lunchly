/** Customer for Lunchly */

const db = require("../db");
const Reservation = require("./reservation");

class Customer {
  constructor(data) {
    for (let key in data) {
      this[key] = data[key];
    }
  }

  static async all() {
    const results = await db.query(`
      SELECT id, first_name AS "firstName", last_name AS "lastName", phone, notes
      FROM customers
      ORDER BY last_name, first_name
    `);
    return results.rows.map(row => new Customer(row));
  }

  static async get(id) {
    const result = await db.query(`
      SELECT id, first_name AS "firstName", last_name AS "lastName", phone, notes
      FROM customers
      WHERE id = $1
    `, [id]);

    if (result.rows.length === 0) {
      const err = new Error(`No such customer: ${id}`);
      err.status = 404;
      throw err;
    }

    return new Customer(result.rows[0]);
  }

  async getReservations() {
    return await Reservation.getReservationsForCustomer(this.id);
  }

  async save() {
    if (this.id === undefined) {
      const result = await db.query(`
        INSERT INTO customers (first_name, last_name, phone, notes)
        VALUES ($1, $2, $3, $4)
        RETURNING id
      `, [this.firstName, this.lastName, this.phone, this.notes]);
      this.id = result.rows[0].id;
    } else {
      await db.query(`
        UPDATE customers
        SET first_name=$1, last_name=$2, phone=$3, notes=$4
        WHERE id=$5
      `, [this.firstName, this.lastName, this.phone, this.notes, this.id]);
    }
  }
}

module.exports = Customer;
