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
      database: "el_jardin_ordering",
    });

    const hashed = await bcrypt.hash(password, 10);

    await db.execute(
      "INSERT INTO users (email, password) VALUES (?, ?)",
      [email, hashed]
    );

    return NextResponse.json({ message: "User created!" });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
