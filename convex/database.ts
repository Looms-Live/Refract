import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// Query to get all business data schema information
export const getBusinessDataSchema = query({
  handler: async (ctx) => {
    return await ctx.db.query("business_data").collect();
  },
});

// Query to get customers
export const getCustomers = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const query = ctx.db.query("customers");
    if (args.limit) {
      return await query.take(args.limit);
    }
    return await query.collect();
  },
});

// Query to get orders with customer data
export const getOrdersWithCustomers = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const ordersQuery = ctx.db.query("orders");
    const orders = args.limit 
      ? await ordersQuery.take(args.limit)
      : await ordersQuery.collect();
    
    // Fetch customer data for each order
    const ordersWithCustomers = await Promise.all(
      orders.map(async (order) => {
        const customer = await ctx.db.get(order.customer_id);
        return {
          ...order,
          customer,
        };
      })
    );
    
    return ordersWithCustomers;
  },
});

// Mutation to add sample business data
export const addSampleData = mutation({
  handler: async (ctx) => {
    // Add schema information
    await ctx.db.insert("business_data", {
      table_name: "customers",
      column_name: "name",
      data_type: "string",
      sample_values: ["John Doe", "Jane Smith", "Bob Johnson"],
      description: "Customer full name",
    });
    
    await ctx.db.insert("business_data", {
      table_name: "customers",
      column_name: "email",
      data_type: "string",
      sample_values: ["john@example.com", "jane@company.com", "bob@business.org"],
      description: "Customer email address",
    });
    
    await ctx.db.insert("business_data", {
      table_name: "orders",
      column_name: "total_amount",
      data_type: "number",
      sample_values: ["199.99", "299.50", "150.00"],
      description: "Total order amount in USD",
    });
    
    await ctx.db.insert("business_data", {
      table_name: "orders",
      column_name: "status",
      data_type: "string",
      sample_values: ["pending", "completed", "cancelled"],
      description: "Current order status",
    });

    // Add sample customers
    const customer1 = await ctx.db.insert("customers", {
      name: "John Doe",
      email: "john@example.com",
      phone: "555-0123",
      company: "Tech Corp",
      city: "New York",
      state: "NY",
      created_at: Date.now() - 86400000 * 30, // 30 days ago
    });

    const customer2 = await ctx.db.insert("customers", {
      name: "Jane Smith",
      email: "jane@company.com",
      phone: "555-0456",
      company: "Design Studio",
      city: "Los Angeles",
      state: "CA",
      created_at: Date.now() - 86400000 * 15, // 15 days ago
    });

    const customer3 = await ctx.db.insert("customers", {
      name: "Bob Johnson",
      email: "bob@business.org",
      phone: "555-0789",
      company: "Consulting LLC",
      city: "Chicago",
      state: "IL",
      created_at: Date.now() - 86400000 * 7, // 7 days ago
    });

    // Add sample orders
    await ctx.db.insert("orders", {
      customer_id: customer1,
      order_date: Date.now() - 86400000 * 25,
      total_amount: 299.99,
      status: "completed",
      product_name: "Enterprise Software License",
      quantity: 1,
    });

    await ctx.db.insert("orders", {
      customer_id: customer2,
      order_date: Date.now() - 86400000 * 10,
      total_amount: 150.50,
      status: "pending",
      product_name: "Design Consultation",
      quantity: 2,
    });

    await ctx.db.insert("orders", {
      customer_id: customer3,
      order_date: Date.now() - 86400000 * 3,
      total_amount: 499.00,
      status: "completed",
      product_name: "Business Analysis Package",
      quantity: 1,
    });

    return { success: true, message: "Sample data added successfully" };
  },
});

// Mutation to add training data for Vanna
export const addTrainingData = mutation({
  args: {
    question: v.string(),
    sql: v.string(),
    explanation: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("training_data", {
      ...args,
      created_at: Date.now(),
    });
  },
});

// Query to get training data
export const getTrainingData = query({
  handler: async (ctx) => {
    return await ctx.db.query("training_data").collect();
  },
});

// Query to get all users
export const getUsers = query({
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});
