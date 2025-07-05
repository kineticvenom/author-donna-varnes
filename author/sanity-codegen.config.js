// sanity-codegen.config.js
module.exports = {
  schemaPath: './studio/src/schemaTypes/index.ts', // adjust as needed
  outputPath: './nextjs-app/sanity.codegentypes.ts',
  dataset: 'production',
  projectId: '7llz646c', // ← your actual Sanity project ID
};
