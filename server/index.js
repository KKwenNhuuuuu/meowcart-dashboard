import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { shopifyFetch } from "./shopify.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "MeowCart API server is running" });
});

app.get("/api/productcount", async (req, res) => {
  try {
    const GET_PRODUCT_COUNT_QUERY = `
      query GetProductCount {
        productsCount{
          count
          precision
        }
      }
    `;
    const data = await shopifyFetch(GET_PRODUCT_COUNT_QUERY);

    res.json({
      success: true,
      data: data.productsCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/api/activeproducts/count", async (req, res) => {
  try {
    const GET_ACTIVE_PRODUCT_COUNT_QUERY = `
      query GetActiveProductCount {
        productsCount(query: "status:active") {
          count
          precision
        }
      }
    `;
    const data = await shopifyFetch(GET_ACTIVE_PRODUCT_COUNT_QUERY);

    res.json({
      success: true,
      data: data.productsCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/api/draftproducts/count", async (req, res) => {
  try {
    const GET_DRAFT_PRODUCT_COUNT_QUERY = `
      query GetDraftProductCount {
        productsCount(query: "status:draft") {
          count
          precision
        }
      }
    `;
    const data = await shopifyFetch(GET_DRAFT_PRODUCT_COUNT_QUERY);

    res.json({
      success: true,
      data: data.productsCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

function getDate30DaysAgo() {
  const date = new Date();
  date.setDate(date.getDate() - 30);
  return date.toISOString().split("T")[0];
}

function getDate14DaysAgo() {
  const date = new Date();
  date.setDate(date.getDate() - 14);
  return date.toISOString().split("T")[0];
}

app.get("/api/orders/last30days/count", async (req, res) => {
  try {
    const date30DaysAgo = getDate30DaysAgo();

    const GET_ORDERS_LAST_30_DAYS_COUNT_QUERY = `
      query GetOrdersLast30DaysCount($query: String!) {
        ordersCount(query: $query) {
          count
          precision
        }
      }
    `;

    const variables = {
      query: `created_at:>=${date30DaysAgo}`
    };

    const data = await shopifyFetch(GET_ORDERS_LAST_30_DAYS_COUNT_QUERY, variables);

    res.json({
      success: true,
      data: data.ordersCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/api/orders/last30days/revenue", async (req, res) => {
  try {
    const date30DaysAgo = getDate30DaysAgo();

    const GET_ORDERS_LAST_30_DAYS_REVENUE_QUERY = `
      query GetOrdersRevenue($query: String!, $cursor: String) {
        orders(first: 50, after: $cursor, query: $query) {
          nodes {
            currentTotalPriceSet {
              shopMoney {
                amount
              }
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    `;

    let totalRevenue = 0;
    let cursor = null;
    let hasNextPage = true;

    while (hasNextPage) {
      const variables = {
        query: `created_at:>=${date30DaysAgo}`,
        cursor,
      };

      const data = await shopifyFetch(GET_ORDERS_LAST_30_DAYS_REVENUE_QUERY, variables);

      data.orders.nodes.forEach((order) => {
        totalRevenue += parseFloat(order.currentTotalPriceSet.shopMoney.amount);
      });

      hasNextPage = data.orders.pageInfo.hasNextPage;
      cursor = data.orders.pageInfo.endCursor;
    }

    res.json({
      success: true,
      data: { totalRevenue },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/api/inventory/lowstock", async (req, res) => {
  try {
    const GET_LOW_STOCK_PRODUCTS_QUERY = `
      query GetLowStockProducts($first: Int!, $cursor: String) {
        products(first: $first, after: $cursor, query: "inventory_total:<5") {
          edges {
            node {
              id
              title
              totalInventory
              status
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    `;

    let cursor = null;
    let hasNextPage = true;
    const allProducts = [];

    while (hasNextPage) {
      const variables = {
        first: 50, 
        cursor,
      };

      const data = await shopifyFetch(GET_LOW_STOCK_PRODUCTS_QUERY, variables);

      data.products.edges.forEach((edge) => {
        allProducts.push(edge.node);
      });

      hasNextPage = data.products.pageInfo.hasNextPage;
      cursor = data.products.pageInfo.endCursor;
    }

    res.json({
      success: true,
      data: allProducts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/api/order/last14days", async (req, res) => {
  try {
    const date14DaysAgo = getDate14DaysAgo(); 
    const today = new Date();
    today.setHours(0, 0, 0, 0); 

    const revenuelist14Days = [];
    let currentDate = new Date(date14DaysAgo);
    currentDate.setHours(0, 0, 0, 0);

    while (currentDate <= today) {
      const dateStr = currentDate.toISOString().split("T")[0]; 

      const GET_ORDERS_BY_DATE_QUERY = `
        query GetOrdersRevenue($query: String!, $cursor: String) {
          orders(first: 50, after: $cursor, query: $query) {
            nodes {
              currentTotalPriceSet {
                shopMoney {
                  amount
                }
              }
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
      `;

      let totalRevenue = 0;
      let cursor = null;
      let hasNextPage = true;

      while (hasNextPage) {
        const variables = {
          query: `created_at:${dateStr}`, 
          cursor,
        };

        const data = await shopifyFetch(GET_ORDERS_BY_DATE_QUERY, variables);

        data.orders.nodes.forEach((order) => {
          totalRevenue += parseFloat(order.currentTotalPriceSet.shopMoney.amount);
        });

        hasNextPage = data.orders.pageInfo.hasNextPage;
        cursor = data.orders.pageInfo.endCursor;
      }

      revenuelist14Days.push({
        date: dateStr,
        revenue: totalRevenue,
      });

  
      currentDate.setDate(currentDate.getDate() + 1);
    }

    res.json({
      success: true,
      data: { revenuelist14Days },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
