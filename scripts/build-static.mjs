// Cross-platform `STATIC_EXPORT=1 next build` → static site in ./out
import { spawnSync } from "node:child_process";

const r = spawnSync("npx", ["next", "build", "--webpack"], {
  stdio: "inherit",
  shell: true,
  env: { ...process.env, STATIC_EXPORT: "1" },
});
process.exit(r.status ?? 1);
