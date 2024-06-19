/** @type { import("drizzle-kit").Config } */
export default {
    schema: "./schema.ts",
    dialect: 'postgresql',
    dbCredentials: {
      url: "postgresql://mock%20master_owner:vP4LlnBFUdX8@ep-patient-butterfly-a187sbtr.ap-southeast-1.aws.neon.tech/mock%20master?sslmode=require",
    }
  };