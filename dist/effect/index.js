"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/effect/index.ts
var index_exports = {};
__export(index_exports, {
  default: () => index_default
});
module.exports = __toCommonJS(index_exports);
var import_plugins6 = require("@oxlint/plugins");

// src/effect/rules/no-manual-effect-error-tag.ts
var import_plugins = require("@oxlint/plugins");

// src/effect/shared/tagged-values.ts
var equalityOperators = /* @__PURE__ */ new Set(["==", "===", "!=", "!=="]);
var broadEffectCatchMethods = /* @__PURE__ */ new Set(["catch", "catchAll", "catchIf"]);
var isStringLiteral = (node) => node?.type === "Literal" && typeof node.value === "string";
var isTagMember = (node) => node?.type === "MemberExpression" && (!node.computed && node.property.type === "Identifier" && node.property.name === "_tag" || node.computed && isStringLiteral(node.property) && node.property.value === "_tag");
var tagMemberFromComparison = (node) => {
  if (!equalityOperators.has(node.operator)) return void 0;
  if (isTagMember(node.left) && isStringLiteral(node.right)) return node.left;
  if (isTagMember(node.right) && isStringLiteral(node.left)) return node.right;
  return void 0;
};
var isBroadEffectCatchCall = (node) => node?.type === "CallExpression" && node.callee.type === "MemberExpression" && node.callee.object.type === "Identifier" && node.callee.object.name === "Effect" && !node.callee.computed && node.callee.property.type === "Identifier" && broadEffectCatchMethods.has(node.callee.property.name);
var isInsideBroadEffectHandler = (node) => {
  let current = node.parent;
  while (current !== null && current !== void 0) {
    if (current.type === "ArrowFunctionExpression" || current.type === "FunctionExpression") {
      return isBroadEffectCatchCall(current.parent) && current.parent.arguments.includes(current);
    }
    current = current.parent;
  }
  return false;
};
var isReasonTagMember = (node) => node.object.type === "MemberExpression" && (!node.object.computed && node.object.property.type === "Identifier" && node.object.property.name === "reason" || node.object.computed && isStringLiteral(node.object.property) && node.object.property.value === "reason");
var propertyName = (property) => {
  if (!property.computed && property.key.type === "Identifier") {
    return property.key.name;
  }
  if (property.key.type === "Literal" && typeof property.key.value === "string") {
    return property.key.value;
  }
  return void 0;
};
var isMatchPatternObject = (node) => {
  const call = node.parent;
  if (call?.type !== "CallExpression" || !call.arguments.includes(node)) {
    return false;
  }
  const callee = call.callee;
  return callee.type === "MemberExpression" && callee.object.type === "Identifier" && callee.object.name === "Match" && !callee.computed && callee.property.type === "Identifier" && (callee.property.name === "when" || callee.property.name === "not");
};

// src/effect/rules/no-manual-effect-error-tag.ts
var noManualEffectErrorTagRule = (0, import_plugins.defineRule)({
  meta: {
    type: "problem",
    docs: {
      description: "Use Effect tagged error handlers instead of manually branching on `_tag` in a catch handler."
    },
    messages: {
      tag: "Use Effect.catchTag or Effect.catchTags instead of manually discriminating a tagged error in a broad Effect catch handler.",
      reason: "Use Effect.catchReason or Effect.catchReasons instead of manually discriminating a tagged `reason` in a broad Effect catch handler."
    }
  },
  createOnce(context) {
    return {
      BinaryExpression(node) {
        const tagMember = tagMemberFromComparison(node);
        if (tagMember === void 0 || !isInsideBroadEffectHandler(node)) {
          return;
        }
        context.report({
          node,
          messageId: isReasonTagMember(tagMember) ? "reason" : "tag"
        });
      },
      SwitchStatement(node) {
        if (!isTagMember(node.discriminant) || !isInsideBroadEffectHandler(node)) {
          return;
        }
        context.report({
          node,
          messageId: isReasonTagMember(node.discriminant) ? "reason" : "tag"
        });
      }
    };
  }
});

// src/effect/rules/no-manual-tag-comparison.ts
var import_plugins2 = require("@oxlint/plugins");
var noManualTagComparisonRule = (0, import_plugins2.defineRule)({
  meta: {
    type: "problem",
    docs: {
      description: "Use Effect Match or Predicate helpers instead of manually branching on `_tag`."
    },
    messages: {
      manualComparison: "Use Match.tag/Match.tags for tagged-value branching, or Predicate.isTagged for a simple reusable predicate.",
      manualSwitch: "Use Match.value(value).pipe(Match.tag/Match.tags/Match.tagsExhaustive) or the tagged enum `$match` helper instead of switching on `_tag`."
    }
  },
  createOnce(context) {
    return {
      BinaryExpression(node) {
        if (tagMemberFromComparison(node) === void 0 || isInsideBroadEffectHandler(node)) {
          return;
        }
        context.report({ node, messageId: "manualComparison" });
      },
      SwitchStatement(node) {
        if (!isTagMember(node.discriminant) || isInsideBroadEffectHandler(node)) {
          return;
        }
        context.report({ node, messageId: "manualSwitch" });
      }
    };
  }
});

// src/effect/rules/no-manual-tagged-construction.ts
var import_plugins3 = require("@oxlint/plugins");
var noManualTaggedConstructionRule = (0, import_plugins3.defineRule)({
  meta: {
    type: "problem",
    docs: {
      description: "Construct tagged values with their existing Effect constructor instead of writing `_tag` manually."
    },
    messages: {
      manualConstruction: "Use the existing Schema tagged `.make`, tagged class/error constructor, or Data.taggedEnum variant constructor instead of writing a literal `_tag` object."
    }
  },
  createOnce(context) {
    return {
      ObjectExpression(node) {
        if (isMatchPatternObject(node)) return;
        const tag = node.properties.find(
          (property) => property.type === "Property" && propertyName(property) === "_tag" && isStringLiteral(property.value)
        );
        if (tag !== void 0) {
          context.report({ node: tag, messageId: "manualConstruction" });
        }
      }
    };
  }
});

// src/effect/rules/no-service-constructor-imports.ts
var import_plugins4 = require("@oxlint/plugins");
var SERVICE_CONSTRUCTOR_NAME = /^make[A-Z]/u;
var TEST_FILE = /\.(?:test|spec)\.[cm]?[jt]sx?$/u;
function isProjectLocalImport(source) {
  return source.startsWith("./") || source.startsWith("../");
}
function getImportedName(specifier) {
  if (specifier.imported.type === "Identifier") return specifier.imported.name;
  return specifier.imported.value;
}
var noServiceConstructorImportsRule = (0, import_plugins4.defineRule)({
  meta: {
    type: "problem",
    docs: {
      description: "Disallow project-local make<CapabilityName> imports outside test and spec files."
    },
    messages: {
      serviceConstructorImport: 'Do not import Effect service constructor "{{name}}" into runtime code. Import the owning Layer, yield the contextual service, and allow its requirements to propagate to the composition root.'
    }
  },
  create(context) {
    const isTestFile = TEST_FILE.test(context.filename.replaceAll("\\", "/"));
    return {
      ImportDeclaration(node) {
        if (isTestFile || !isProjectLocalImport(node.source.value)) return;
        for (const specifier of node.specifiers) {
          if (specifier.type !== "ImportSpecifier") continue;
          const importedName = getImportedName(specifier);
          if (!SERVICE_CONSTRUCTOR_NAME.test(importedName)) continue;
          context.report({
            node: specifier,
            messageId: "serviceConstructorImport",
            data: { name: importedName }
          });
        }
      }
    };
  }
});

// src/effect/rules/prefer-effect-match.ts
var import_plugins5 = require("@oxlint/plugins");
var equalityOperators2 = /* @__PURE__ */ new Set(["==", "===", "!=", "!=="]);
var preferEffectMatchRule = (0, import_plugins5.defineRule)({
  meta: {
    type: "problem",
    docs: {
      description: "Use Match from Effect for chained literal ternaries over the same value."
    },
    messages: {
      preferMatch: "Use Match from Effect instead of a chained literal ternary."
    }
  },
  createOnce(context) {
    const isLiteral = (node) => node.type === "Literal" || node.type === "TemplateLiteral" && node.expressions.length === 0;
    const comparedValue = (node) => {
      if (node.type !== "BinaryExpression" || !equalityOperators2.has(node.operator)) {
        return void 0;
      }
      if (isLiteral(node.left)) return context.sourceCode.getText(node.right);
      if (isLiteral(node.right)) return context.sourceCode.getText(node.left);
      return void 0;
    };
    return {
      ConditionalExpression(node) {
        if (node.parent?.type === "ConditionalExpression") return;
        const value = comparedValue(node.test);
        if (value === void 0) return;
        let alternate = node.alternate;
        let literalChecks = 1;
        while (alternate.type === "ConditionalExpression") {
          if (comparedValue(alternate.test) !== value) return;
          literalChecks += 1;
          alternate = alternate.alternate;
        }
        if (literalChecks > 1) {
          context.report({ node, messageId: "preferMatch" });
        }
      }
    };
  }
});

// src/effect/index.ts
var antiSlopEffectPlugin = (0, import_plugins6.eslintCompatPlugin)({
  meta: { name: "anti-slop-effect" },
  rules: {
    "no-manual-effect-error-tag": noManualEffectErrorTagRule,
    "no-manual-tag-comparison": noManualTagComparisonRule,
    "no-manual-tagged-construction": noManualTaggedConstructionRule,
    "no-service-constructor-imports": noServiceConstructorImportsRule,
    "prefer-effect-match": preferEffectMatchRule
  }
});
var index_default = antiSlopEffectPlugin;
