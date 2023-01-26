export type ReleaseMeta = {
  /**
   * The version string of the release.
   */
  version: string;

  /**
   * When was this release created?
   */
  date: string;

  url: {
    /**
     * A URL that points to the userscript.
     */
    default: string;

    /**
     * The same userscript, but minified.
     */
    minified: string;

    /**
     * Points to the GitHub release for this version.
     */
    release: string;
  };
};

export type TravelingReleaseChannel = "dev" | "nightly" | "stable";
export type ReleaseChannel = "fixed" | TravelingReleaseChannel;
export type ReleaseInfo = Record<TravelingReleaseChannel, ReleaseMeta>;
