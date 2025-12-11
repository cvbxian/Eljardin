// src/app/api/auth/login/route.js
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import mysql from "mysql2/promise";

export async function POST(req) {
  const { email, password } = await req.json();

  try {
    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "el_jardin",
    });

    const [rows] = await db.execute(
      "SELECT * FROM users WHERE email=?",
      [email]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    const match = await bcrypt.compare(password, rows[0].password);

    if (!match) {
      return NextResponse.json({ error: "Wrong password" }, { status: 401 });
    }

    return NextResponse.json({
      message: "Login successful",
      user: { id: rows[0].id, email: rows[0].email },
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
