import { createRequire as __createRequire } from 'node:module';
import { fileURLToPath as __fileURLToPath } from 'node:url';
import { dirname as __dirname_ } from 'node:path';
const require = __createRequire(import.meta.url);
const __filename = __fileURLToPath(import.meta.url);
const __dirname = __dirname_(__filename);
import {
  fetchMetricDetailOrExit,
  fetchMetricListOrExit,
  formatErrorJson
} from "./chunk-NELCIT4M.js";
import {
  indent_default
} from "./chunk-A3NYPUKZ.js";
import {
  formatTable
} from "./chunk-L2BKVTHL.js";
import {
  getScope
} from "./chunk-3FMFPD7F.js";
import {
  validateJsonOutput
} from "./chunk-XPKWKPWA.js";
import {
  schemaSubcommand
} from "./chunk-IS2HEMF4.js";
import "./chunk-4YZKA4FN.js";
import {
  require_pluralize
} from "./chunk-7S7GE4BN.js";
import "./chunk-U3WLEFHU.js";
import "./chunk-CO5D46AG.js";
import {
  getFlagsSpecification,
  parseArguments,
  printError
} from "./chunk-A4NVECX5.js";
import {
  output_manager_default
} from "./chunk-ZQKJVHXY.js";
import "./chunk-S7KYDPEM.js";
import {
  __toESM
} from "./chunk-TZ2YI2VH.js";

// src/commands/metrics/schema.ts
var import_pluralize = __toESM(require_pluralize(), 1);
async function schema(client, telemetry) {
  let parsedArgs;
  const flagsSpecification = getFlagsSpecification(schemaSubcommand.options);
  try {
    parsedArgs = parseArguments(client.argv.slice(2), flagsSpecification);
  } catch (err) {
    printError(err);
    return 1;
  }
  const flags = parsedArgs.flags;
  const formatResult = validateJsonOutput(flags);
  if (!formatResult.valid) {
    output_manager_default.error(formatResult.error);
    return 1;
  }
  const jsonOutput = formatResult.jsonOutput;
  const metric = flags["--metric"];
  telemetry.trackCliOptionMetric(metric);
  telemetry.trackCliOptionFormat(flags["--format"]);
  const { team } = await getScope(client);
  if (!team) {
    const message = "The metrics schema API request was not authorized. Run `vercel login` to authenticate and `vercel switch` to select a team, then try again.";
    if (jsonOutput) {
      client.stdout.write(formatErrorJson("SCHEMA_UNAUTHORIZED", message));
    } else {
      output_manager_default.error(message);
    }
    return 1;
  }
  if (metric) {
    const detailOrExitCode = await fetchMetricDetailOrExit(
      client,
      team.id,
      metric,
      jsonOutput
    );
    if (typeof detailOrExitCode === "number") {
      return detailOrExitCode;
    }
    if (jsonOutput) {
      client.stdout.write(JSON.stringify(detailOrExitCode, null, 2));
      return 0;
    }
    output_manager_default.log(`Metric: ${metric}`);
    const metricsTable = formatMetricsTable(detailOrExitCode);
    if (metricsTable) {
      output_manager_default.print(metricsTable);
      output_manager_default.print("\n");
    }
    return 0;
  }
  const metricsOrExitCode = await fetchMetricListOrExit(
    client,
    team.id,
    jsonOutput
  );
  if (typeof metricsOrExitCode === "number") {
    return metricsOrExitCode;
  }
  if (jsonOutput) {
    client.stdout.write(JSON.stringify(metricsOrExitCode, null, 2));
  } else {
    output_manager_default.log(`${(0, import_pluralize.default)("Metric", metricsOrExitCode.length, true)} found`);
    output_manager_default.print(formatMetricListTable(metricsOrExitCode));
    output_manager_default.print("\n");
  }
  return 0;
}
function formatMetricListTable(metrics) {
  return indent_default(
    formatTable(
      ["Metric", "Description"],
      ["l", "l"],
      [{ rows: metrics.map((metric) => [metric.id, metric.description]) }]
    ),
    1
  );
}
function formatMetricsTable(metrics) {
  if (metrics.length === 0) {
    return null;
  }
  return indent_default(
    formatTable(
      ["Metric", "Description", "Dimensions", "Unit", "Aggregations"],
      ["l", "l", "l", "l", "l"],
      [
        {
          rows: metrics.map((metric) => [
            metric.id,
            metric.description,
            metric.dimensions.map((dimension) => dimension.name).join(", ") || "\u2014",
            metric.unit,
            metric.aggregations.map(
              (aggregation) => aggregation === metric.defaultAggregation ? `${aggregation} (default)` : aggregation
            ).join(", ")
          ])
        }
      ]
    ),
    1
  );
}
export {
  schema as default
};
