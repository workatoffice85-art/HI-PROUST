const URL = "https://vrevoheydazzyjyplwjj.supabase.co/rest/v1";
const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZyZXZvaGV5ZGF6enlqeXBsd2pqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwNzA2NDQsImV4cCI6MjA5NTY0NjY0NH0.R7lx56YDn7amWpX89g6Em2b3TwP6zPbJ7DeYWIS_jZE";

const headers = {
  "apikey": KEY,
  "Authorization": `Bearer ${KEY}`,
  "Content-Type": "application/json",
  "Prefer": "return=representation"
};

async function test() {
  try {
    // 1. Insert or update key
    const res = await fetch(`${URL}/settings`, {
      method: "POST",
      headers,
      body: JSON.stringify({ key: "test_emp", value: "hello" })
    });
    console.log("Upsert Status:", res.status);
    console.log("Upsert Body:", await res.text());

    // 2. Fetch it back
    const resGet = await fetch(`${URL}/settings?key=eq.test_emp`, { headers: { "apikey": KEY, "Authorization": `Bearer ${KEY}` } });
    console.log("Get Status:", resGet.status);
    console.log("Get Body:", await resGet.json());
  } catch (err) {
    console.error(err);
  }
}
test();
