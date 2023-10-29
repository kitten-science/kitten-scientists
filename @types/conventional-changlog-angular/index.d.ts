declare module "conventional-changelog-angular" {
  declare function createPreset(): {
    parserOpts: Record<string, unknown>;
    writerOpts: Record<string, unknown>;
    recommendedBumpOpts: Record<string, unknown>;
    conventionalChangelog: Record<string, unknown>;
  };
  export default createPreset;
}
