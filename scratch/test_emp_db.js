const URL = "https://vrevoheydazzyjyplwjj.supabase.co/rest/v1";
const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZyZXZvaGV5ZGF6enlqeXBsd2pqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwNzA2NDQsImV4cCI6MjA5NTY0NjY0NH0.R7lx56YDn7amWpX89g6Em2b3TwP6zPbJ7DeYWIS_jZE";

const headers = {
  "apikey": KEY,
  "Authorization": `Bearer ${KEY}`,
  "Content-Type": "application/json"
};

async function test() {
  try {
    const res = await fetch(`${URL}/employees?select=*`, { headers });
    console.log("Status:", res.status);
    console.log("Body:", await res.text());
  } catch (err) {
    console.error(err);
  }
}
test();
