declare module "conventional-changelog-angular" {
  declare async function createPreset(): Promise<{
    parser: Record<string, unknown>;
    writer: Record<string, unknown>;
    whatBump: () => Record<string, unknown>;
    mergePattern?: string;
    mergeCorrespondence?: string[];
  }>;
  export default createPreset;
}
