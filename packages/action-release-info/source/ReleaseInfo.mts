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

export type ReleaseInfo = {
  /**
   * The latest stable release.
   */
  stable: ReleaseMeta;

  /**
   * The nightly build.
   */
  nightly: ReleaseMeta;

  /**
   * The development build.
   */
  dev: ReleaseMeta;
};
