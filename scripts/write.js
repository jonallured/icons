"use strict";

const path = require("path");
const { transform } = require("@svgr/core");
const { upperFirst, camelCase } = require("lodash");
const { parse } = require("svg-parser");

const SVG_STYLE = {
  position: "absolute",
  top: "0",
  right: "0",
  bottom: "0",
  left: "0",
  width: "100%",
  height: "100%",
};

const getReactSource = ({ componentName, svgSource }) => {
  const svgAsJsx = transform.sync(svgSource, {
    expandProps: false,
    svgProps: { style: `{svgStyle}`, fill: "currentColor" },
    template: ({ jsx }) => jsx,
  });

  const [
    {
      properties: { viewBox },
    },
  ] = parse(svgSource).children;

  const [_, __, width, height] = viewBox.split(" ").map((n) => parseInt(n, 10));

  return `
import * as React from "react";
import { Box, BoxProps } from "./Box";

const ${componentName} = (props: BoxProps) => {
  const svgStyle: React.CSSProperties = {...${JSON.stringify(SVG_STYLE)}};
  return (
    <Box position="relative" width={${width}} height={${height}} {...props}>${svgAsJsx}</Box>
  );
};

${componentName}.displayName = '${componentName}';

export default ${componentName};
  `;
};

const getPackageJsonSource = ({ version }) => `{
  "name": "@artsy/icons",
  "version": "${version}",
  "peerDependencies": {
    "react": ">=16.2.0",
    "styled-components": "^4",
    "styled-system": "^5"
  },
  "main": "index.js",
  "types": "index.d.ts",
  "publishConfig": {
    "access": "public",
    "registry": "https://registry.npmjs.org"
  }
}`;

const getBoxSource = () => `
import styled from "styled-components";
import { FlexboxProps, LayoutProps, PositionProps, SpaceProps, ColorProps, flexbox, layout, position, space, color } from "styled-system";
export interface BoxProps extends FlexboxProps, LayoutProps, PositionProps, SpaceProps, Omit<ColorProps, "color"> {};
export const Box = styled.div<BoxProps>(flexbox, layout, position, space, color);
`;

const getIndexSource = ({ iconFiles }) => `
console.warn("For internal use only. Import from the individual files rather than from the index.");
export const ICONS = ${JSON.stringify(
  iconFiles.map(({ fileName, componentName }) => ({ fileName, componentName }))
)};

${iconFiles
  .map(
    ({ fileName, componentName }) =>
      `export { default as ${componentName} } from './${fileName}';`
  )
  .join("\n")}
`;

const write = ({ svgs, version }) => {
  const iconFiles = svgs.map((svg) => {
    const name = path.basename(svg.path).replace(".svg", "");
    const componentName = `${upperFirst(camelCase(name))}Icon`;
    const fileName = componentName;
    const source = getReactSource({ componentName, svgSource: svg.source });

    return { filepath: `${fileName}.tsx`, source, componentName, fileName };
  });

  return [
    { filepath: "package.json", source: getPackageJsonSource({ version }) },
    { filepath: "index.ts", source: getIndexSource({ iconFiles }) },
    { filepath: "Box.tsx", source: getBoxSource() },
    ...iconFiles,
  ];
};

module.exports = write;
