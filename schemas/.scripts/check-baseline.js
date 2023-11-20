#!/usr/bin/env node

/**
 * This script ensures that a JSON schema draft sufficiently describes
 * a KS engine state "baseline". Meaning that it defines every single
 * setting possible.
 */

const { readFileSync } = require("node:fs");
const { argv } = require("node:process");

const assertions = new Map();

const internalAssert = (value, file, message) => {
  if (!value) {
    if (!assertions.has(file)) {
      assertions.set(file, []);
    }
    assertions.get(file).push(message);
  }
};

const checkSchemaProperties = (filename, schema, path) => {
  if (!schema.properties) {
    return;
  }

  for (const [property, schemaProperty] of Object.entries(schema.properties)) {
    if (Array.isArray(schema.required)) {
      internalAssert(
        schema.required.includes(property),
        filename,
        `${path}.properties.${property} is not required`,
      );
    }

    if ("$ref" in schemaProperty) {
      continue;
    }

    internalAssert(
      typeof schemaProperty.type === "string" || Array.isArray(schemaProperty.enum),
      filename,
      `${path}.properties.${property} has no type`,
    );

    internalAssert(
      typeof schemaProperty.description === "string",
      filename,
      `${path}.properties.${property} has no description`,
    );

    if (property === "trigger") {
      internalAssert(
        typeof schemaProperty.minimum === "number",
        filename,
        `${path}.properties.${property} does not set a minimum`,
      );

      internalAssert(
        typeof schemaProperty.minimum === "number",
        filename,
        `${path}.properties.${property} does not set a maximum`,
      );
    }

    if (schemaProperty.type === "object") {
      internalAssert(
        typeof schemaProperty.properties === "object",
        filename,
        `${path}.properties.${property} has no properties`,
      );

      internalAssert(
        typeof schemaProperty.additionalProperties === "boolean" &&
          schemaProperty.additionalProperties === false,
        filename,
        `${path}.properties.${property} allows additionalProperties`,
      );

      internalAssert(
        Array.isArray(schemaProperty.required),
        filename,
        `${path}.properties.${property} does not declare required properties`,
      );

      checkSchemaProperties(filename, schemaProperty, `${path}.properties.${property}`);
    }
  }
};

const checkSchemaRoot = (filename, schema) => {
  internalAssert(
    schema.$schema === "http://json-schema.org/draft-07/schema#",
    "Root schema does not match 'http://json-schema.org/draft-07/schema#'.",
  );
  internalAssert(typeof schema.$id === "string", "Root schema doesn't set a valid $id");
  internalAssert(
    schema.$id.endsWith(".schema.json"),
    "Root schema $id doesn't end with '.schema.json'",
  );
  checkSchemaProperties(filename, schema, "root");
};

const checkFile = filename => {
  const fileContent = readFileSync(filename, { encoding: "utf-8" });
  const fileBody = JSON.parse(fileContent);
  return checkSchemaRoot(filename, fileBody);
};

const targets = argv.slice(2);

for (const target of targets) {
  try {
    checkFile(target);
  } catch (error) {
    console.error(target, error);
  }
}

console.dir(assertions);
