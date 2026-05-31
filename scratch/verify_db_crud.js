const URL = "https://vrevoheydazzyjyplwjj.supabase.co/rest/v1";
const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZyZXZvaGV5ZGF6enlqeXBsd2pqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwNzA2NDQsImV4cCI6MjA5NTY0NjY0NH0.R7lx56YDn7amWpX89g6Em2b3TwP6zPbJ7DeYWIS_jZE";

const headers = {
  "apikey": KEY,
  "Authorization": `Bearer ${KEY}`,
  "Content-Type": "application/json",
  "Prefer": "return=representation"
};

async function runTests() {
  console.log("=== STARTING HI PROUST DATABASE SCHEMA AUDIT & CRUD VALIDATION ===");

  try {
    // 1. Test connection and read products, categories, tables
    console.log("\n[1/7] Reading static menu items...");
    const productsRes = await fetch(`${URL}/products?select=*`, { headers });
    if (!productsRes.ok) throw new Error(`Failed to fetch products: ${productsRes.statusText}`);
    const products = await productsRes.json();
    console.log(`✓ successfully retrieved ${products.length} menu items from database.`);

    const categoriesRes = await fetch(`${URL}/categories?select=*`, { headers });
    if (!categoriesRes.ok) throw new Error(`Failed to fetch categories: ${categoriesRes.statusText}`);
    const categories = await categoriesRes.json();
    console.log(`✓ successfully retrieved ${categories.length} categories from database.`);

    const tablesRes = await fetch(`${URL}/tables?select=*`, { headers });
    if (!tablesRes.ok) throw new Error(`Failed to fetch physical tables: ${tablesRes.statusText}`);
    const tables = await tablesRes.json();
    console.log(`✓ successfully retrieved ${tables.length} dining tables from database.`);

    // 2. Customers CRUD Test
    console.log("\n[2/7] Testing Customers CRUD operations...");
    const testPhone = `+96659${Math.floor(Math.random() * 90000000 + 10000000)}`;
    const custName = "QA Tester " + Math.floor(Math.random() * 1000);
    
    // Create (Insert)
    console.log(`- Inserting test customer: ${custName} (${testPhone})...`);
    const custInsertRes = await fetch(`${URL}/customers`, {
      method: "POST",
      headers: { ...headers, "Prefer": "return=representation" },
      body: JSON.stringify({ name: custName, phone: testPhone })
    });
    if (!custInsertRes.ok) throw new Error(`Customer Insert failed: ${await custInsertRes.text()}`);
    const insertedCustArr = await custInsertRes.json();
    const insertedCust = insertedCustArr[0];
    console.log(`✓ Customer created successfully with ID: ${insertedCust.id}`);

    // Read
    console.log(`- Reading customer back by phone...`);
    const custReadRes = await fetch(`${URL}/customers?phone=eq.${encodeURIComponent(testPhone)}&select=*`, { headers });
    const readCustArr = await custReadRes.json();
    const readCust = readCustArr[0];
    if (!readCust) throw new Error(`Customer with phone ${testPhone} not found in database! Response: ${JSON.stringify(readCustArr)}`);
    if (readCust.name !== custName) throw new Error("Customer name mismatch on read!");
    console.log(`✓ Read success: customer name verified.`);

    // Update
    const updatedName = custName + " (Updated)";
    console.log(`- Updating customer name to: ${updatedName}...`);
    const custUpdateRes = await fetch(`${URL}/customers?id=eq.${insertedCust.id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ name: updatedName })
    });
    if (!custUpdateRes.ok) throw new Error("Customer Update failed");
    const updatedCust = (await custUpdateRes.json())[0];
    if (updatedCust.name !== updatedName) throw new Error("Customer name mismatch on update!");
    console.log(`✓ Update success: customer name updated.`);

    // 3. Orders & Order Items CRUD Test with Cascading & Relational Checks
    console.log("\n[3/7] Testing Orders & Order Items CRUD operations...");
    const orderId = `QA-${Math.floor(Math.random() * 90000 + 10000)}`;
    const selectedTable = tables[0];
    if (!selectedTable) throw new Error("No tables configured in database!");
    const firstProduct = products[0];
    if (!firstProduct) throw new Error("No products configured in database!");

    const orderPayload = {
      id: orderId,
      customer_id: insertedCust.id,
      table_id: selectedTable.id,
      status: "pending_payment",
      subtotal: Number(firstProduct.price),
      tax: Number((firstProduct.price * 0.15).toFixed(2)),
      total: Number((firstProduct.price * 1.15).toFixed(2)),
      notes: "QA verification test order",
      delivery_type: "dine-in",
      payment_method: null,
      pending_update: null,
      audit_log: JSON.stringify([{ user: "System QA", action: "Created QA test order" }])
    };

    console.log(`- Inserting test order: ${orderId}...`);
    const orderInsertRes = await fetch(`${URL}/orders`, {
      method: "POST",
      headers,
      body: JSON.stringify(orderPayload)
    });
    if (!orderInsertRes.ok) throw new Error(`Order insertion failed: ${await orderInsertRes.text()}`);
    const insertedOrder = (await orderInsertRes.json())[0];
    console.log(`✓ Order created successfully.`);

    // Insert Order Item
    const itemPayload = {
      order_id: orderId,
      product_id: firstProduct.id,
      quantity: 2,
      price: Number(firstProduct.price)
    };
    console.log(`- Inserting order item for order ${orderId}...`);
    const itemInsertRes = await fetch(`${URL}/order_items`, {
      method: "POST",
      headers,
      body: JSON.stringify(itemPayload)
    });
    if (!itemInsertRes.ok) throw new Error(`Order item insertion failed: ${await itemInsertRes.text()}`);
    console.log(`✓ Order item inserted successfully.`);

    // Read and verify join query
    console.log(`- Querying order details with customer and table relationships...`);
    const joinRes = await fetch(`${URL}/orders?id=eq.${orderId}&select=*,customers(*),tables(*),order_items(*)`, { headers });
    const orderDetails = (await joinRes.json())[0];
    if (!orderDetails || !orderDetails.customers || !orderDetails.tables || orderDetails.order_items.length === 0) {
      throw new Error("Relational query validation failed: missing joined records!");
    }
    console.log("✓ Relational query validated! Customer, Table, and Items joined successfully.");

    // Update order status
    console.log(`- Transitioning order status: pending_payment -> preparing...`);
    const statusUpdateRes = await fetch(`${URL}/orders?id=eq.${orderId}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ status: "preparing" })
    });
    if (!statusUpdateRes.ok) throw new Error("Order status update failed!");
    console.log("✓ Order status updated successfully.");

    // Verify Cascade on delete
    console.log(`- Testing Cascade delete on orders -> order_items...`);
    const orderDeleteRes = await fetch(`${URL}/orders?id=eq.${orderId}`, {
      method: "DELETE",
      headers
    });
    if (!orderDeleteRes.ok) throw new Error("Failed to delete order!");
    console.log("✓ Test order deleted successfully.");

    // Verify order items are cascaded and deleted
    const itemsCheckRes = await fetch(`${URL}/order_items?order_id=eq.${orderId}`, { headers });
    const remainingItems = await itemsCheckRes.json();
    if (remainingItems.length > 0) throw new Error("CASCADE delete failed: order_items still exist!");
    console.log("✓ Cascade delete validated successfully: order items cleaned automatically.");

    // Cleanup customer
    console.log(`- Cleaning up test customer...`);
    const custDeleteRes = await fetch(`${URL}/customers?id=eq.${insertedCust.id}`, {
      method: "DELETE",
      headers
    });
    if (!custDeleteRes.ok) throw new Error("Failed to delete customer!");
    console.log("✓ Test customer cleaned up successfully.");

    console.log("\n=== ALL DATABASE CRUD & SCHEMA CONSTRAINTS VERIFIED SUCCESSFULLY ===");
  } catch (error) {
    console.error("\n❌ DATABASE AUDIT FAILED:", error);
    process.exit(1);
  }
}

runTests();
