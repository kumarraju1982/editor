import "dotenv/config";
import { createApp } from "./app";
import { loadConfig } from "./config/env";

const config = loadConfig();
const app = createApp();

app.listen(config.PORT, () => {
  console.log(`3D BUILDING service running on http://localhost:${config.PORT}`);
});
