export async function POST(req) {
  console.log("Login attempt received");
  
  const { email, password } = await req.json();
  console.log("Email:", email);

  try {
    console.log("Attempting MySQL connection...");
    const db = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "el_jardin_ordering",
    });
    console.log("MySQL connected!");

    const [rows] = await db.execute(
      "SELECT * FROM users WHERE email=?",
      [email]
    );
    console.log("Query results:", rows.length);

    // ... rest of your code ...

  } catch (err) {
    console.error("FULL ERROR:", err);
    console.error("Error stack:", err.stack);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}