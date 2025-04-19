# v2.0.0-beta.10

The 10th beta has arrived. Additionally, the project has had it's 10 year anniversary. Congratulations to us!

Sadly, we've had a bit of a rough ride since the beta 9 release. Not only did it introduce a lot of new problems, the game itself was updated soon after, breaking almost everything.

We've invested a lot of time to address issues at their core, instead of adding more hacks. The code base has received [~80K changes since beta 9](https://github.com/kitten-science/kitten-scientists/compare/v2.0.0-beta.9...v2.0.0-beta.10). Read on to learn why.

## Notable Changes

1.  Full Game API Support

    When the original Kitten Scientists 1.5 was ported from raw JavaScript to TypeScript, we only described those parts of the game that we actively used already. While that still required thousands of lines of code, it was only a fraction of the functionality that the game actually exposes.

    This has been a pain for a while, because it makes innovation harder, if you never see the full capabilities during development. It was also clear for a long time already that certain code in the script is problematic. We don't need to go into details, because it was exactly some of that code which caused the script to break during the recent game update.

    Thus, we described the _entire_ game API in TypeScript now. In itself, this wouldn't be very exciting to users, but it enabled several of the further changes below.

1.  Reduced DOM Searches

    Some parts of Kitten Scientists really just search the actual game user interface for a button in the HTML structure of the current page, and then try to click on that button.

    Not only that, the button is looked for during every iteration to look into the "data model" associated with it, to read metadata of the game state through it.

    That's a complicated way of saying: We take a lot of steps to do something that could be done in one.

    Remember that Kitten Scientists is more than 10 years old today. These things were not possible back then, the game was very different, and this approach worked well enough for all that time.

1.  All Policies are supported

    Noteworthy, but the title pretty much says it all already. I'm sure there will be more policies in the future, and we will need to add those as well, but we're good again for the time being.

1.  Improved Challenges Support

    The unique effects of some challenges are not always properly considered by the script. We've found several of those cases, and were able to support them from now on.

    We are aware of more issues with challenges, which we will try to address for the next release.

1.  UI Regression Recovery & _Ineffective_ States

    Users were rightfully frustrated with the state of the user interface they were left with in the beta 9 release. Combined with the new default settings, users had a hard time seeing any of this as an improvement.

    It's very hard to recover a failed user interface change, after it left a bad impression. For the time being, we'll try to at least get the concepts consistent, so that they _can_ make sense.

    Sadly, it became clear, that the underlying UI framework of Kitten Scientists would not scale to allow for our new ideas to really apply consistently everywhere. This required so much new code to resolve, that the UI could now have new problems. That being said, we addressed several issues.

    1.  Panel Legibility

        We introduced the _inactive_ state to try to draw focus to those UI elements that currently have an impact on game play, and give visual feedback when you toggle sections on and off.

        Thanks to users who actively provided feedback early on after the release, we were able to refine the behavior. Let us know if it's still not right.

    1.  Auto-Prompt for Required Values

        As the new default settings are empty, there is a lot of potential to miss entering a required value.

        Now, when you enable an option, you will often be instantly prompted to enter the required value. Additionally, if the configuration is still incomplete, we now actively signal this through the UI.

    1.  _Ineffective_ States

        There was already a minimal approach of this in beta 9, but it required a lot of additional effort to make it properly useful. Allowing any setting in the UI to signal up to the root element, that it is currently ineffective, was a nice idea, but our code base didn't really allow for things like that.

        With all the new UI framework code, hopefully, we got the concept more consistent now. We know that it will require more work, because it's really not obvious how to implement this for _all_ settings. Stay tuned.

    1.  Highlight next best Unicorn Building

        When you use the **Automate Build Order** automation in the Religion section, you might have wondered for a long time: _"Which one does it actually want to build right now?"_

        You should now see a small animated indicator in the Kitten Scientists UI next to the option that is up next.

1.  More Import Options in State Management

    The import process in the **State Management** section can now detect even more inputs than before. You can paste an entire backup in there, and _all_ presets from the backup are important.

    The backup functionality was initially only intended to provide _some_ way to extract all your settings out of the browser. We've now extended the backups to include the labels and times of your stored settings entries, so that you can have those restored as well.

    The previous backups should import just fine, but they will get an auto-generated label, so that you don't get prompted for every single entry.

1.  Removed Experimental Extensions from Repository

    Experiments like Kitten Analysts, and Kitten Engineers are fun, but they produce a lot of noise in the repository and regularly cause problems that have an impact on Kitten Scientists development.

    All of these projects have been removed from the repository. Now it's all about Kitten Scientists again.

    The other projects still live on, in the Kitten Science GitHub organization.

1.  Improved Developer Logs

    When you open the developer tools in your browser, you can read the JavaScript console. Kitten Scientists also write messages to this console. This can be very helpful to locate the source of issues.

    However, the way it was previously implemented, all log messages would point to a single source code location as their origin, because all log messages were written by a helper construct.

    This was resolved by rewriting every single location that logs a message. Totally worth it though.

_Enjoy the anniversary beta release!_

**`auto-generated changelog goes here`**

# v2.0.0-beta.9

Another year of KS development finally concludes today. Beta 9 is ready and it's a big one.

[Last year, there was a lot of talk about settings profiles](https://github.com/kitten-science/kitten-scientists/releases/tag/v2.0.0-beta.8), and how we imagine them to play a major role in the future of KS. This did not come true.

We also imagined that we would make big strides with "Kitten Engineers", which would finally resolve some long-standing pain points with KS. Kitten Engineers _did happen_, but it was a complete failure, in regards to the original plans. If you were hoping for any solutions in this area, you will be disappointed.

However, KS has improved core behaviors, and gives users a lot more control. We also changed the default settings of KS to incentivize exploration and experimentation, instead of giving the impressions that the default settings are a good default - they never were.

## Notable Changes

1.  New UI

    The user interface of KS has gone through several iterations in this release cycle. We know that UI changes are never something users really look forward to, unless the UI was horrible to begin with.

    We noticed that different themes make the KS UI layout very unpredictable, and often produces undesirable results. The verbose UI of KS often caused excessive line breaks, which caused confusing UI, or made it aesthetically unpleasing. We rewrote almost the entire UI code to use more modern layout options, and replace text with icons. We understand that this is a thin line to walk. Some of the UI changes are confusing. You will need some time to adjust.

    Sometimes trigger buttons will just be the regular old lightning icon, sometimes they display their trigger value next to them. There is no pattern when we do show the value and when not. It's mostly random, depending on what "feels right".

    Sometimes you have a limit value right next to a trigger, which is entirely different from a trigger that also displays its value. There are very subtle visual hints to help you distinguish the individual cases, but this is non-obvious to long-term users especially.

1.  Many sections now allow their individual items to be triggered by their own individual trigger, instead of just having a single trigger for the entire section.

    The triggers on the section itself still exist, but they are now the _default_ trigger for builds, unless the builds have their own trigger set. This is more confusing to explain than to experience. Just try out clicking on the new buttons, and let yourself be guided.

1.  The default settings are now complete garbage.

    While this sounds like a step backwards, we hope to encourage users to find the settings that are correct _for them_, instead of blindly enabling options with default settings, because they might _feel_ like a good idea. Make educated decisions. KS will perform your tasks, but it does not play the game for you.

1.  Experimental purchasing mechanics.

    While we are aware that this new approach has bugs, we still hope that it is an improvement over the previous purchasing algorithm. Ultimately, a lot of purchasing decisions in KS are deferred to a single component. This component makes decisions on purchasing that often felt not ideal. We tuned this behavior to allow more constructions, with more even distribution of spending the available budget.

    There are still a lot of known issues with this approach, but it seems to provide better results as-is in real gameplay. That's why this half-cooked change is now in the mainline stable build. We hope that most users will feel the benefits, and don't notice the edge case bugs.

1.  Eco Mode

    The "Limited" option in KS has always been confusing. We now renamed it to "Eco Mode" to make it more abstract, and prevent people from forming an idea of what the feature _should_ be. Forget everything you know about "Limited Mode". The new thinking is: Either you want to craft the thing as much and as fast as possible, or you want to take a more conservative approach, whatever that means.

    Until we solidify what Eco Mode actually is, we hope that users will feel more comfortable with the less descriptive option, that just provides an acceptable feeling of aggressive vs conservative investment.

1.  Kitten Analysts

    During this development cycle, an excessive amount of energy has been poured into Kitten Analysts, which contribute exactly zero to your KG gameplay as a regular user. So what is Kitten Analysts, if we invested so much time into something so useless?

    Kitten Analysts is the component that elevates Kitten Scientists from a single game extension to the actual Kitten Science framework we're aiming for long-term. Kitten Analysts only works in environments where you run the entire game directly on your own computer. If you're a bookmarklet, or a userscript user, Kitten Analysts will not and never will work for you. If you've previously used our "devcontainer" setup, Kitten Science is the replacement for that.

    Kitten Analysts provides a Prometheus exporter for game data, allowing you to track long-term progress, and compare strategies. Additionally, it contains a container-based background-play solution, which should allow you to have your game be played on a remote system while you're offline.

    We consider this work substantial for future development of KS, but we are aware that very few users will be able to benefit from this work directly. Feel free to reach out on GitHub if you want to get your own Kitten Science setup started. The documentation on this subject will be limited for quite some time, to also not confuse users with excessive information on edge cases.

## Features (76/+12 unlisted)

-   Auto-save settings (f897e2711052a3f873ba2dc8aabb01f69b0d1dcc)
-   Backport KA improvements from KE branch (fe715a68ccb663d257aece4fb3662fc8beea9084)
-   Configuration approach for KA connection (651615a9f5701caad7d7b320adc06db6209aafab)
-   Drop internally managed GitHub Action Workflow (50405bbaaf91810230be236dbd8213b56a5afff6)
-   Drop snapshots/schemata (765c3bce3038e4f3416cb0b0100ce7c58d2ff0d8)
-   Enable Chiral interaction in Kitten Science (8febf9e71a4fb95b295c731fe05b53eb5315be57)
-   Identify client type in metrics (34cd6027cb3244ecf3ac7e35f4eb97b386017098)
-   Improved location tracking (16915487bf60937d0ef7a6c30d87bb1e7dd08ae8)
-   Include pseudo resources in resource pool metrics (83115c9b2f549b4bfdd9ce8966e3decd27c447d8)
-   Integrate into KGNet in all injected contexts (f6382d584dbba294b3d52a3c7ef328b31b0d19b3)
-   Kitten Data and Analytics [#598](https://github.com/kitten-science/kitten-scientists/pull/598) (1f22c6de6421d45fcf6b232a5be9ead67db12e56)
-   More versatile snapshot analyzer UI (96d105aef632b5cf556da824071b1d1d34711a7e)
-   Operators [#624](https://github.com/kitten-science/kitten-scientists/pull/624) (8d29d47a3c693be502d841e22530f22935699e13)
-   Protocol cleanup (5b0630f97f9d828b7a92ed0ce9c161f670091b0a)
-   Rebuild socket liveliness checks (4b61aa41f4ab56bd10ed039db365f7812ecd2a5e)
-   Remove automatic-releases action from repo (caee3c15619d2db13af2d6b51a7bafb4b870505b)
-   Remove commit validator CI action from repo (13d63fda11dac9202d8286241dce55de04ff3a44)
-   Remove randomness from purchasing strategy (866afc4ff15c58ea1b418075be1a5d0c1f8d6c23)
-   Track game instances through telemetry GUID (346ccd210a3fe98edc81cc5a2b18041977686ed2)
-   Track technologies (adc6b9c3d15916c373af9c0f38eb45fa1fb1791d)
-   Update savegames in KGNet (a181e2a20f8b3837cfe97a48b9682dd0b5b2db74)
-   Validation (5a555d7e8b05ac6a82c82e3ff2fac862ff24587a)
-   **api**: Add array object of Game type [#544](https://github.com/kitten-science/kitten-scientists/pull/544) (b7f5308a9f12b5949584556d12e8227b23f1ca2d)
-   **api**: Tracked the latest KG [#551](https://github.com/kitten-science/kitten-scientists/pull/551) (c4fd7e7425f5582d4f35ff00e1d381bbe5eda94d)
-   **bonfire**: Add option to turn on reactors (82ad54457c736e40ddb56f7f3c23f82e6c814dd8)
-   **container**: Make it easier to run Kitten Science (11e1bb4c5c9605929d246792e6a3d5756127e435)
-   **core**: Ability to `.unload()` KS (fa3568a80faea64018f93fed361c0ce3df385693)
-   **core**: Auto-load auto-saved settings (6f2f6fd6552decb8faf40a81c3f7f9fccad8b065)
-   **core**: Backport improved typedefs from KE branch (9a8db48a129ab0ae0ac6a3a01957b03362291ec0)
-   **core**: Entirely remove `index` documents (e2de2fb4422f7dc6a00265e99cd1e3343474f207)
-   **core**: Establish neutral default settings (6bef8bbc9a75460e8fbce7015339f3b2ec3d09d8)
-   **core**: Implement new bulk purchase strategy [#591](https://github.com/kitten-science/kitten-scientists/pull/591) (9f8a25fa1062843983dc93539c9faca007b7dd3e)
-   **core**: Individual triggers for build items [#744](https://github.com/kitten-science/kitten-scientists/pull/744) (5766d344a5a1c5e9c8ad0544a61d14ab78dd8e38)
-   **core**: Lift state loader restrictions (515b1622da93d1996c1e9fa8a5016f3fd9f016a9)
-   **core**: Unload existing KS instances on load (16486f91bd20034eea3f009e883953700b416f45)
-   **devcontainer**: Alternate repo selection (90e713fe529d121d12c202a45d10d614fb9d5efe)
-   **i18n**: Additional options translate (97d006bea4078708bc927253ef2b2c99fa298077)
-   **i18n**: Elect leader (bf01cb38e2f45b8a74bc288a0d242cf698f0f2fa)
-   **i18n**: Elect Leader traits and job [#518](https://github.com/kitten-science/kitten-scientists/pull/518) (ffce853ad5f90891dc0f04b245fe3b34cf15e563)
-   **i18n**: Ignore overheat (ccf8c6fc97152197b98dd3028b2feb64f4c34a37)
-   **i18n**: Internals (b6781c1829767a8df407a0495112072ed88807a7)
-   **i18n**: Locale-native percentage rendering (714636955ada21a3a95d1d880e829f018fd0c0f4)
-   **i18n**: Log Filter KG log [#518](https://github.com/kitten-science/kitten-scientists/pull/518) (27ba92c878d20558d35a65aa6e48d04289ade94f)
-   **i18n**: Migrate to full locale specifier (824483258e43b69d7f5273efb68769befec890d2)
-   **i18n**: Move translations into subfolder (7dea5159ce4e692f4db6ec6f7f2c5a26c5f4ce8c)
-   **i18n**: New Crowdin translations by GitHub Action [#695](https://github.com/kitten-science/kitten-scientists/pull/695) (b3d0f670da33a1ec5da788f6fb0abb53d23545a1)
    <sup>10 similar commits not listed: fd594222711d42a11e7678b396d8bc43fde20786, 3d5d302ded4f968f9975e60d78aa836bc0e3d27d, fa3cd1ac3bb7f4c7011f828dd5e8b7e05d1e7069, b066dbbebe6e20a078c30b41caf7226f0c7b7b38, f546789ee426ad08dcc0bb164db5613899dee0b6, 9855897575a53dd2630777b31b1ea351e91a73e6, 705859c793c831e9b9317ee01b2a56c172314e06, 32c50d8b52a28d0e6c688d9d3010f66680e11555, 7ab4315b054d65efec753aae8a9ac6bf67c4b926, 963f8832a31db38a315f522cb668f9fc8928220a</sup>
-   **i18n**: New Crowdin updates (#582) (f78a6978c5e4dda675e56c86b32d44594d806f40)
-   **i18n**: State Management: Compress data (21bc0a53868554b96c884533d282881f91506d25)
-   **i18n**: Store current input prompt (717e5fe6a628ac06e70c9a1a7fcbd75167ba3919)
-   **i18n**: Time to Load stored state [#518](https://github.com/kitten-science/kitten-scientists/pull/518) (9c34d3b8557baa4ee8de0a0ee9958010e4171323)
-   **i18n**: Update l10n data (97418e2718b0392c5e0d708c44d4990604e47d6e)
-   **i18n**: Update translation files (d1bdba0faf4d61c41706f07a7fdf3228a5f5f5e8)
-   **i18n**: Update translations (77387507032fe0073921b7e3c85a1ef280a70e54)
    <sup>2 similar commits not listed: d6fcef5d19164add07de14b163365777fb5b39be, b28b66dc12fb3b20b52f3187b815f1712d4e236d</sup>
-   **religion**: Bulk process Ziggurats resources [#590](https://github.com/kitten-science/kitten-scientists/pull/590) (c208990fade93f50429078e98341694bc83f275b)
-   **science**: Individual triggers for technologies [#781](https://github.com/kitten-science/kitten-scientists/pull/781) (a58bbaabd0e64a0cadf9d85f3455a1821d8c0e1e)
-   **settings**: Execute validateGame on Crafts [#551](https://github.com/kitten-science/kitten-scientists/pull/551) (3e63daf4b047718698f0b0455cad741b7cf1ddcd)
-   **time**: Active Heat Transfer (dcd1ea454474699ca65467aef848140e8949111f)
-   **time**: Active Heat Transfer to Get temporalFlux (2953e93a824306ca18fb7058cadaf49d7fe2c510)
-   **time**: Remove Chrono Furnace automation [#777](https://github.com/kitten-science/kitten-scientists/pull/777) (6b65326207546fd4249ec47ca50237c4043e0761)
-   **ui**: Add cycle symbols to planets (2411eef7c1abdab5079dc4437004e56cbdfa38a9)
-   **ui**: Align upgrade selections (93d2edde3d2a7498eba6c97f3807a834847f3aae)
-   **ui**: Beta 9 Polish [#792](https://github.com/kitten-science/kitten-scientists/pull/792) (934d4820d2e2ec90341a2978a1ae51277e297533)
-   **ui**: Dialogs [#756](https://github.com/kitten-science/kitten-scientists/pull/756) (abceaa53f9aacf80dcfca78b4dfd74039be74232)
-   **ui**: Dim inactive sections (c5ebc53916e3115cf6bc0a4ad04bfdc31e2de1ed)
-   **ui**: Hide "observe sky" area (9e0f896a9f71a1116fdd8a025219a3fef23c588f)
-   **ui**: Hide building category selection (584fff922a3eab0fbcf6eb97e9bc6f761684e652)
-   **ui**: Implement more consistent UI [#716](https://github.com/kitten-science/kitten-scientists/pull/716) (8102d108831d9b4a49986a4453bbfb1758ee40cb)
-   **ui**: Move version into Internals section (1f7a70004d46bec37280cd8f8dbe202fa5583cb0)
-   **ui**: Only IW displays exclusive resources [#551](https://github.com/kitten-science/kitten-scientists/pull/551) (ca9c15aa6465bec6a7a8d3a69011872c0af016a3)
-   **ui**: Overhaul state management, entire UI [#685](https://github.com/kitten-science/kitten-scientists/pull/685) (1a0b90443597f5e5768de6cc2b2cefcae3252b65)
-   **ui**: Rebuild l10n for numeric values (73d73fc615c78201240525859616faf430c9d60b)
-   **ui**: Rename states/games in state management (3f7f2ddd255289bd2652caea1b3dfc924aa23628)
-   **ui**: Shown in the fourth column [#545](https://github.com/kitten-science/kitten-scientists/pull/545) (bd1892e29f85aec4552251c65348adf975675a71)
-   **ui**: Sort upgrades in auto-reset UI (60ec7b09e67956c2fb90a079b0081b9926d37c59)
-   **village**: Leader can join any job [#551](https://github.com/kitten-science/kitten-scientists/pull/551) (7c5f8e9c69094b574f442ff835a9715ea535508a)
-   **workshop**: New crafting mechanics [#785](https://github.com/kitten-science/kitten-scientists/pull/785) (ef29b9ae4552796c9f5d6a95f3c5bd08de4615bb)

## Bug Fixes (74/+2 unlisted)

-   beta8 release info missing (dcb8a477f48c1c788659f34db57a1faaa20767d8)
-   Breaking changes [#529](https://github.com/kitten-science/kitten-scientists/pull/529) (1b6765ad0384affb7a6483af94633b408e779b51)
-   Changelog preset integration (ce74fccd98758155a7ab404cf37a9385c5c20bc4)
-   Deprecations (33bf180b029a53c4851ae6633b9cec12a6559c23)
-   Devcontainer regressions (813808980072372f2d4879c57b0d22c9fcf1e856)
-   GitHub Actions tests [#364](https://github.com/kitten-science/kitten-scientists/pull/364) (147419f66247728cdd3ff2b2e87a537fcf8fbf30)
-   Import `core` only as type (f53f6d9805655850da84c7abe9dda461dbb14bbe)
-   Import paths [#595](https://github.com/kitten-science/kitten-scientists/pull/595) (0b536c29108922d3a3a838d2f5738c1001712fd7)
-   Lint [#600](https://github.com/kitten-science/kitten-scientists/pull/600) (978c6f90b03dcce4fab9e25afcbc4d3732bed09d)
-   Long save labels (84468785b296393623d2e90f2fb7f6522c3f7c76)
-   Networking in compose (638db65a980052e18b6a5e62f9d51d87126f663e)
-   Redundant type information (802422c0591392522c7d3beafd49eb3f9f997bcc)
-   Redundant type params [#606](https://github.com/kitten-science/kitten-scientists/pull/606) (3d8b731da44cb88947d83754bd96105c9eaf7c1e)
-   Release version determination (034915002385fd80b941f820c5518af95bbd72b2)
-   Save data handover unstable (a81238f06fe89eaf6e682d2f0ba6476d52cd0666)
-   Semver ranges (9ad1122384d83ae2fc61353b28b30170346782cb)
-   Sourcemaps no longer aligned (a7a59fa0c0cbbe1a004722e944494e100efb9481)
-   Unnecessary expression [#465](https://github.com/kitten-science/kitten-scientists/pull/465) (86f98f3e1686f82f69978d9a66daf393963e81b4)
-   Update import order [#586](https://github.com/kitten-science/kitten-scientists/pull/586) (ecbd7ed57c4cf22ea296c60215dbf6032619df49)
-   Version not bumped (c943d042a52299b02abd85d1f5ac00db5198beb4)
-   **api**: Remove expectations from loader input (9834b9c855928f728eb164621c6a26ed82c112da)
-   **bonfire**: Deprecated method usage (73dc5a93014bfbf8914b4bbb9b1eff247d3ad17e)
-   **bonfire**: Upgraded buildings are unlimited by default (7608f65e41361779cb32b7029c319e4ec1872edb)
-   **ci**: Host KS bookmarklet directly (a92e33eeee950ac530c6e5ba7e2d0535badab901)
-   **container**: Containers don't shutdown cleanly (cb62d99d61622fc694c6532f84b4d7a03544c2c8)
-   **core**: Catch errors during script constructions (539b262debcb883d9cb820f26098575e009feca6)
-   **core**: CSS not unloaded during `.unload()` (316649738b8a3aa0b565953b1bdc4c9253fe6a1d)
-   **core**: Import treated as destructive action (80026b1147c2b7a423963c1aad7ebff6efe578a2)
-   **core**: Inconsistent trigger handling [#631](https://github.com/kitten-science/kitten-scientists/pull/631) (9860bf2386316ac9ee0ed32a06150918abedf4e7)
-   **core**: Invalid userscript metablock (3041a48e5abfb1217f56c2085f9e932dfa89a0a1)
-   **core**: Load auto-save on UI construction (e33174e58bcf78c2e3baccb50f57464065bdc0f8)
-   **core**: Max value defaults to infinity (8bdd540bbded497059992841bc4762899d092bae)
-   **core**: Savegame manager not unloaded (824267ca105e05442308737fa4cab151cec79c13)
-   **core**: Subsection trigger handling (fc26e23957eed757622e9debadba2d63297c4330)
-   **i18n**: Enable/Enabled inconsistencies in log messages (eefc674035ad1c3980fa50b47eee4d116048dd8f)
-   **i18n**: HTML entities in translation file (972af2a04af7b7706da951964fe671aff3db2676)
-   **i18n**: Slightly better wording (ec757a7b927dc2fe14d1e4dde8f957c7bac0a11a)
-   **i18n**: Typo (fa0fc926b592cfa18f1fa3c57d92e1185ac23f43)
    <sup>2 similar commits not listed: 0b1ae1553235c2dfd6617e3c6ab719c30598bfac, 39a15cb862363dc0e3129512ac32fc14f68a2c1d</sup>
-   **i18n**: Typo in literal (2fdc473e5acef484e0e2992992342f643d2aaf83)
-   **log**: KG log messages not hidden from the log (d2cb601378f09c6742e66ade483b7e00f8416184)
-   **religion**: Opinionated trigger default values (1ea22edfd2d05e5a98c7ec76e15fecfd4bc77429)
-   **religion**: Order of the Sun items not built (bb34d6b2eceedea19b79775c623e33edfb1709fa)
-   **religion**: Trigger values are not handled correctly (b4158aae0526564ab425728b6ecef15db828172e)
-   **religion**: Triggers always parsed as percentage (cb2eea5c7426f33c101a6fc572608202b30cbd3b)
-   **schema**: Missing `gatherCatnip` property (9fdf79e98938b2b06e6fa7fba3faebcb1cebabd4)
-   **settings**: avoid sharing references with engine [#561](https://github.com/kitten-science/kitten-scientists/pull/561) (41329ddb4f2dfb6fdc098bc0b8d0bb3f5f5d0a23)
-   **settings**: ksColumn Setting load [#545](https://github.com/kitten-science/kitten-scientists/pull/545) (69a802e57fbf306fc2c75c539e874a131552778d)
-   **time**: daysPerSeason increases the number of temporalParadox days (dbe6027dc6232bde518e0e549be72a72e242ec58)
-   **time**: Ensure that the Temporal Flux obtained each time the Combust TC is greater than the time required for Heat Transfer (c4deee288f30022da1a59152a8600d6e8811ede8)
-   **time**: Maximum amount of time allowed to be skipped during active HeatTransfer (e979be01026136286d6e89e76d4bbbf86654d1c6)
-   **time**: Reserve 10 days for TemporalFlux (68c2ed2afd1aae25954d83039db3aea9b78b7755)
-   **time**: Save activeHeatTransferStatus (2e56f37463896f89f40f0ae90acb8613924d5cc5)
-   **time**: Skip to the beginning of the Cycle (59501a80b1af13c41e74549176bd12c96f69bb7f)
-   **trade**: Traded Blackcoin amount not normalized as expected (7c719c6b821dbd555bd0494f8031c16c1ff4e8b9)
-   **ui**: Best unicorn UI is inconsistent (a4e50d8f4a7c463b52dd132259adc704f0fd6f72)
-   **ui**: Buttons trigger their action twice (92cb2a7cc70bbb4f3907003dcf720c048d5d3ae2)
-   **ui**: Delete redundant #ksColumn [#545](https://github.com/kitten-science/kitten-scientists/pull/545) (d922f6261c1f85f9211718bb94269704bef22335)
-   **ui**: Footer links layout (7d83c029555d10bf1d6e58700213f91885a472aa)
-   **ui**: Game translation button conflict (a2bd179a6753e97bc277afb0f4ba1238cedc6ea2)
-   **ui**: Move upgrade settings (3babc6b6a2d05a49cdbc58700ab565bc444bd952)
-   **ui**: Partially revert 714636955ada21a3a95d1d880e829f018fd0c0f4 (978893e1bd22156748b91cd69c872c1373e6a533)
-   **ui**: Read-only elements sometimes not rendered correctly (dd7da4792f0fc8392843dc963553c7fff095a9a4)
-   **ui**: Require only 1 label input on import (8f22a2cc0f70d1af1b48a18b84e4a7626928cac4)
-   **ui**: Revert setting a fixed font-size for KS (2e27dc4b109db42d9d87ae12a21cd5db552a2252)
-   **ui**: Section without checkbox are dimmed (44f81cb52bbaf56b0207e7e58bc53e7e1ec31a38)
-   **ui**: Tempus Fugit toggle has wrong status message (5a7984a0a857b90cc286bc1401c9de8e780aadb2)
-   **ui**: Triggers not behaving as expected (8b3576ef9dfda53b3a4ac98dd7fe50dc81dd59db)
-   **ui**: Typos, layout regressions (045c328f40b0401ec17c33b3624f447e7d354a68)
-   **ui**: Weird transition when collapsing panels (fd6978c68398f769d77b02b9bb40ab414dfe270c)
-   **village**: Leader election is broken (f03f3e9438bcb3ad15e4539e693194d5f911f93b)
-   **village**: Leader election still broken (631ab1e239904d652a327e904df3c74fb123b79b)
-   **workshop**: Eco mode not enabled by default (0f761034c7ee715c9e6959a78f21abb929528460)
-   **workshop**: Excessive crafts (cdd28793a9f4ec2dc06d74611c412a1f69b5058c)
-   **workshop**: Trigger not evaluated correctly (55c380c3e6113b9d7192e8da30dc2b86c6391398)

## Documentation (24)

-   Add example compose file to run KS DNA (4282ecc7ea84853c75a84328559e4f0c47bb23b5)
-   Add pointer towards development docs (06560df101058ae3fc7ee9b811900736ddbdcf37)
-   Add revision dates (e749ab13fa0480b37efe347f51c39bf3da2a854f)
-   Add status badges (f8174230a496f8a8082b852058185e3328dcc66a)
-   Beta 9 updates (99e964ff4c84e3326958426792db27e7a882c8bc)
-   Clarify version bump process (c2cc4d156bd43a9ebce18e30b8614aebcc8100a2)
-   Clean up installation instructions (7aa560d8b6a7a7cc0430cda79c1585c8c6381a3b)
-   Clean up installation split (469d4bda6d3d94a44aa068c6f0f8eda118fffcb5)
-   Clean up start page (58ad609d9de74cbce334432f7b3361b98062924a)
-   Explain section triggers (a5a257a630cdfbdae73cba009db6179548bda5ef)
-   Fix broken links, add version banner (9870b7ae7df610227f55bbea4cc3a51278f1c8d5)
-   Fix deployment pipeline (6652217cfc64d8b2302e7dc19036440736c52d13)
-   Fix site name (824905199cf10bb05f2c0d07ee7c8c114c91ecec)
-   Hint at more science (04a5e0158127c2a6c8510a3f24f4582474781918)
-   Prepare for versioned documentation [#687](https://github.com/kitten-science/kitten-scientists/pull/687) (351e67688cb4bd4a2aa34a8b170ff364f1556ad2)
-   Restructure installation (2ba7aa1f3ee45e0a9ec7c430edb7df2b1c8dfe05)
-   Restructure main areas (80e5c194ea04a6e02829d6cbcc815022f1f2b643)
-   Set correct versions in beta.8 docs (57cef651754ff1d4967b179eeb92dd3826209457)
-   Slightly clearer layout (6ff60f2a5d50015d9202e39f2d74b73d58ff97d0)
-   Store beta.8 documentation [#687](https://github.com/kitten-science/kitten-scientists/pull/687) (2c31666ccd524f940fee46218c76802d7d71c1bc)
-   Update CHANGELOG (55d8c9800142a24e21a8a2f67e3e10934ce22c54)
-   Update Grafana dashboard (271bb244e4510d30a26284ea973f83dc2b51cb0d)
-   Use revised version of beta8 docs (942fa64cc4b5810b7d494328e53a824984c74b95)
-   **time**: Active Heat Transfer document (9c891fcb0a1e2738d11ccb3cbfd63ddc65069d31)

## Code Refactoring (13/+1 unlisted)

-   Extract user script loader into discrete component (95ce4b9057ab465f6f9b564295d6a44d06f93eb9)
-   Improve type safety [#586](https://github.com/kitten-science/kitten-scientists/pull/586) (fa7ef994d986f0df1cd2d1f0c609fe3adf8f32c5)
-   Unify singular/plural naming for data structures [#544](https://github.com/kitten-science/kitten-scientists/pull/544) (072186a5dbe9c015e6e89dd1541e397cab0e8512)
-   **settings**: Use loops to replace lengthy code [#544](https://github.com/kitten-science/kitten-scientists/pull/544) (9c15af0d9fafb79c8cd2c6081c2f9a049a38421d)
-   **ui**: Build TranslatedString using `` [#551](https://github.com/kitten-science/kitten-scientists/pull/551) (52af0e118f9b38efd71152ee304577e90dd5f0a1)
-   **ui**: Optimize array generation [#544](https://github.com/kitten-science/kitten-scientists/pull/544) (06d7bb3e1014e55897c9d04129581f626e37cee6)
-   **ui**: Replace br with span [#545](https://github.com/kitten-science/kitten-scientists/pull/545) (7aa64bbafcadbc69ab7d5a0ec0f7e9af773ffe06)
-   **ui**: Resource control excludes some resources [#544](https://github.com/kitten-science/kitten-scientists/pull/544) (bce673e677af8070ccc53e3ccad1ca668ef77eb6)
-   **ui**: Sequence(Same as KG) of KG items in Chinese language [#551](https://github.com/kitten-science/kitten-scientists/pull/551) (7e88f0ee6312c73aee6a4f7a0396a274262df8e2)
-   **ui**: Use .load instead of localStorage [#545](https://github.com/kitten-science/kitten-scientists/pull/545) (b7e11a6d4d7699c92713ab9ad5d75e877669153c)
-   **ui**: Use KG array as index and directly use KG label [#544](https://github.com/kitten-science/kitten-scientists/pull/544) (6498b79012563f9901244ffb3f8635dc96ced525)
-   **ui**: Use loops to replace lengthy code [#544](https://github.com/kitten-science/kitten-scientists/pull/544) (0a8021fbe96b419feab079d14b8ca3b8e3903542)
    <sup>1 similar commit not listed: 7ccecdfa0045fb5e09781afb19b6e3902e6eea39</sup>
-   **ui**: Use the Array build in types [#544](https://github.com/kitten-science/kitten-scientists/pull/544) (a32070d9ad02005958f1f91747f8ba56e2fd1a88)

## Performance Improvements (1)

-   Reduce `render()` calls (95fb41c400588422a268b5bbb545c426128ce7aa)

## Continuous Integration (62)

-   Add release pipeline (c7dbe4f0c7dee221ee911c52a3a294950aef233a)
-   Allow manual QA (5221114743405e7a857f937ff1c5e570d4f8ab87)
-   Attest SBOM (e002a011e3cb93149e59757633e0994aea140210)
-   Bump commit validation (172ee659cdad960f454503ae4f7f170be627fe33)
-   Cleanup releases (d8ad51a885f4ffe1a464773e274abf8642421a44)
-   Consolidate changelog settings (090979d17ecf8df48c35f2e2d8683da068e8929a)
-   Consolidate QA jobs (859541b309ba319b03560bc82becf700116bec1a)
-   Create publishing artifacts for OCI (5761d089a3ea5701a4e3fea0c19396e6a82ede46)
-   Disable Renovate automerge (5b5694f4bf8bafd779ff2ce621fee86b843a4480)
-   Do less work on dependency upgrades (ebce51e709804bf1f03490f200e5890a8e5b5bf7)
-   Don't mark release as pre-release (e80f799ea1d00d7a6297f9287c5c77389e69e158)
-   Don't publish development builds for dependency upgrades (529bacacaeae741a09d5c70f184dc4c00dd92237)
-   Dry-run pre-releases (beafef0fb8ed4a90caa4f4873a8acb0e3e42b852)
-   Dry-run releases (b4d205962b2527b9fd90cd0cb269730b49ab3a4e)
-   Ensure redirects exist in stable (e7a530670e70ecf961ca1beaaaf2c5ecc73afdeb)
-   Fix action version (bb0db9b9e37b8ca6b2a223ca17cfc289129a38b9)
-   Fix bookmarklet cache settings (808d02d2ac23f3d3c58429747a6bbfe8f94d227e)
-   Fix bookmarklet content-type (c0cc4e3064b33e2a1a642d9802810aa6383821aa)
-   Fix container build (7a09af57be11ab0a402787176d6acbc4b69b4ba7)
-   Fix invalid release info path (b667e77810781c5b7fcbdad04a5a8a6388f65824)
-   Fix missing permissions for nightly builds (c5c40754413a5b70050e90719ba76c30e35edb4b)
-   Fix NodeJS versions (f69eed3be2d89c48c8068a880351e9c122a62639)
-   Fix pre-release concurrency (796fb79df2668ed745700998fea709c17f48811c)
-   Fix QA check not running (a56ace8756c7641b0b4d36e1b0fbb0c649c1fa30)
-   Fix QA not running (3dbcad4b65fd543bf66559cdf20b651e69d2be04)
-   Fix release channel for stable build (f54001192fe82aa6507c073ebc1c4359ed5881c4)
-   Fix Renovate automerge behavior (2e24b9341fcca672bd88a966ff567ef01a9ef1e4)
-   Fix script locations (61c4f9a491703cdb4b035666158e5a020f02676e)
-   Fix unmaintained versions (074358229cd965ae654780c0c7d9b418161778c8)
-   Improved preview tags (f06bb97f77dbff829a46deef572e3049a06feaca)
-   New pre-release pipeline (7f2c95702865b44a82739df5b7eda07ed2e8bdac)
-   Only create development release on-demand (7cff99e538bfa1f80640a212c68bca371a7141e2)
-   Override release tag (71306f3bb8b0cd6ec474b27efb87c5407ed2e691)
-   Publish Devcontainer (d890b6e2bdecdc56a4dcc9213fef04bef0cef04e)
-   Publish into beta.9 distribution (25b03d6884946a5dd27e53210415dc8448fadbae)
-   Publish minified scripts (551060a543b621d13d6970c3ecb3ca33bacb0589)
-   Push containers (f3305b3da8df22af924beb3536e6075ac8a5d49f)
-   Rebuild nightly, add more containers (c3bc3316f30f92c076d23f3b84c83314916465bc)
-   Reduce active workflows (5c3a80fc9a90aafe81faea9f85d0577b9f5a4d7b)
-   Reduce build complexity for OCI (061baa6a1bfe957aad4cdd8255f714b3c86873cd)
-   Reduce cache time for unstable builds (bbc9e71e94d3285aa063cf867d1deadb9a58bd6d)
-   Release experiment (d832c337493edc73602e2f2854fc6baaeb5e0ed6)
-   Release info not generated nightly (dc0ac5c876ac200abe536505a9e7e23ee1f503bd)
-   Remove redundant attestation (f17f5b7ff0765d0c6c4b68cd4a2b459305e23bb9)
-   Remove SBOMs (8d8b6642c6597244031d645b6ac5fd500a431a2b)
-   Remove useless CodeQL BS (d730bf94f1edbeb9346470aad9cd5c3a22ff2d50)
-   Skip QA for Renovate PR (0545d9d8647dfcf8dffa62c3986f4da1c05fc500)
-   Sync Crowdin on-demand (354a36db0d28298252b01a3ff64802bb1a252194)
-   Try attestation (e4e75550224f4ac82af202f3d75fb11b85e076f2)
-   Try external label manager (73319d95a5306d33def2a399c7c89efd1c454eeb)
-   Try upgrading devDeps less often (1020145921a5161fc53265ba6b236b3c2c1dbeff)
-   Update release contents (06a8dcbf90d4d2047e820281f5bde9f91554bb0d)
-   Update validation (e20d9cee603a500363d560c5e15042ed8a0da000)
-   Upload `release-info.json` properly (bc8f6a3bf2763fd4f9af569fa4ff25f74ebbc855)
-   Use new parameter names (0c64d3430d8fa1821c08ded6acda9703e243c488)
-   Use tagged release (8d989a0c37603e9573b396f9f0edfb9a05ee5f04)
-   Use upstream action (795e3af7c2b5244e4b334fc80a359f1bd19506fc)
-   Use upstream commit validator (bd8c4e1c22ba5c960ac9c42c09248feaebf0eacf)
-   Validate commit message first (9a229566441207b5a981fb9074fa2cc5c7b1925f)
-   **i18n**: Add Crowdin pipeline (b484d65f6785c9de0230f51bc3fe976f1d770c9f)
-   **i18n**: Fix missing permissions (6bdf5e60ba7cb06d91d1131c15098b617f107a7f)
-   **i18n**: Fix pipeline not triggering checks (6f51a66230f5f91a5df0b913798523f8e04a9198)

## Chores (15)

-   Align container base images (24bc233de2572ffbae792bf9b23f0608f29d9370)
-   Align Node typedef versions (7327f658fbf9899665195f5b4a59e9135715c0d9)
-   Bump version v2.0.0-beta.9 (d2649c62c1bd008c1caf58539fd1ac615f7b5385)
-   Don't maintain dependencies in `contrib` (f6b34ad2922ffdf5819f9eb3bb4d305aa1f9f797)
-   Don't track changes to example savegames (3ec2e81748ae81bf0dbd9eb50a1dab236378b274)
-   Fix prettier lint [#466](https://github.com/kitten-science/kitten-scientists/pull/466) (583d032b9d2e453d7f2cf1c2651d66066b033efc)
-   Fix tsconfig again [#480](https://github.com/kitten-science/kitten-scientists/pull/480) (59625bcb071a0ddbcb5d009ad338f0e97793dbe0)
-   gitattributes not set correctly (4806698335312ef6cc5b72f8c7d3e15f8e93fc87)
-   Remove redundant dependency `uuid` (84b46c801b522cd54c1991c50c18da5ae8abe719)
-   Update container build context (71cd74618afb777b47e34f32e66f01364b2f048b)
-   Update Renovate preset (4449319466717dafff3bfc9763c2fc093a7e1093)
-   **i18n**: Delete untranslated locales (67d3c489720ed451f2953f481b00da8611c74a9f)
-   **i18n**: Update Crowdin configuration file (3a258e3d72b2dfee14bb72fa779efc5d705d769e)
-   **i18n**: Update translation (570bf3ae0bd6ba84c7262992967772ab5c88c1b8)
-   **i18n**: Update translations (67678857b114b42296ac12933acf9a4d15df3842)

## Dependency Changes

<details>
<summary>Bug Fixes (25/+32 unlisted)</summary>

-   **deps**: update dependency @actions/core to v1.11.0 [#686](https://github.com/kitten-science/kitten-scientists/pull/686) (87f3770f8dce377ceb45ddb6a9b78a4e78d57987)
    <sup>1 similar commit not listed: 9450706fd4638b074c961d08aa7c8db4b35996b9</sup>
-   **deps**: update dependency @actions/github to v6 [#364](https://github.com/kitten-science/kitten-scientists/pull/364) (22efb93a0e285029f8c7478b4794d6ec24ae291c)
-   **deps**: update dependency @octokit/rest to v20.1.1 [#526](https://github.com/kitten-science/kitten-scientists/pull/526) (2d0aa2cf935c49d2eb00ddcb1f262db42002e48b)
-   **deps**: update dependency @oliversalzburg/js-utils to v0.0.28 [#471](https://github.com/kitten-science/kitten-scientists/pull/471) (59cf18eef641220741f329e0ba079b43bb65e561)
-   **deps**: update dependency @oliversalzburg/js-utils to v0.0.28-dev.57 [#455](https://github.com/kitten-science/kitten-scientists/pull/455) (c07f4b9f7a2315445f662f2c50837eeefb686b3b)
-   **deps**: update dependency @oliversalzburg/js-utils to v0.0.29 [#527](https://github.com/kitten-science/kitten-scientists/pull/527) (df53cd88ff2d664601ccbf795f4deab54a6614eb)
    <sup>12 similar commits not listed: afda6c4b4bfb45b3ad06ce18038084de82e1f237, 98024586cd9252cbdc77caff135f5d6e10fba43e, 7fc78860cd872a6563f09136c2db21bef7e56c35, b7ab8bb3c23b37788533396d0153cdc32ebadc9f, 8c4577422ca83facb82c6ab10b5c7fc1832b2c73, e1a1624b9b79f3502001b5d14360d97534ceca51, d9fb4e1de3fb5fb82883efbbe7b4fb14c7c8a0ac, 0f26bcc4b9e04baef456e1529074669e942521ac, 97ff165aae9c458033c7d516f7b3793799fe1756, 07ba21835c7e2a5ed82eef7c68fbbe3e790c4b07, 9e9091b9efcb300abab889b1a66a6a0252600f3c, df791f08c1342c83813c45c6c9b02c04e6c0b84c</sup>
-   **deps**: update dependency @shoelace-style/shoelace to v2.13.1 [#470](https://github.com/kitten-science/kitten-scientists/pull/470) (a6d817d0f4f6219e61a5366dead908ab08e02be3)
    <sup>3 similar commits not listed: 396da1b45d3e31c76f2c35bfe1245703ac01b964, 10e31d7d662fcf7854a67675cccd9a4ae0e39fe2, eca3ed4abbe35a89269307e3afae573fbe51b14e</sup>
-   **deps**: update dependency ajv to v8.13.0 [#521](https://github.com/kitten-science/kitten-scientists/pull/521) (9cff101a1474a12399c1966574fee53a4014544a)
    <sup>3 similar commits not listed: ab81a7aee3e246beccf364a4702c7f85ae7d342c, cf36aa0f35b5a43804a1ab181634b2750e1f1dff, 4380cb847c59a443816415d4702a114ea382ebe3</sup>
-   **deps**: update dependency conventional-changelog-angular to v8 [#528](https://github.com/kitten-science/kitten-scientists/pull/528) (affadb9b7f1ae4d1b9c27bdae348a729c84e0231)
-   **deps**: update dependency conventional-commits-parser to v6 [#529](https://github.com/kitten-science/kitten-scientists/pull/529) (f76e4bf8dd79f4b4eea63565ae2ed09410c5c2eb)
-   **deps**: update dependency date-fns to v3.1.0 [#454](https://github.com/kitten-science/kitten-scientists/pull/454) (f7bd8fde726625c58dcc83dfd83deadc03a9f40c)
    <sup>4 similar commits not listed: f4346247ba40b5a3dfc102fd26c4f926c9a8a5cd, 4e0a72384128b6b90fdab2625aed553bbe1f7efc, da0dc93f56056b1733ded0d5e8600881a025bfe3, 74da60468e74d08c867176a78c9d1e33e5d516ff</sup>
-   **deps**: update dependency date-fns to v4 [#654](https://github.com/kitten-science/kitten-scientists/pull/654) (db76247d561dc082f24ae7f5a1013f0557222454)
-   **deps**: update dependency date-fns to v4.1.0 [#658](https://github.com/kitten-science/kitten-scientists/pull/658) (201852e8f44b7ea27ec475b0a4f5ca9ba927c47d)
-   **deps**: update dependency globby to v14.0.1 [#486](https://github.com/kitten-science/kitten-scientists/pull/486) (3a1af7594ed80fd5a3a950cf772fd3e5e04b29e2)
-   **deps**: update dependency jsdom to v24.1.3 [#616](https://github.com/kitten-science/kitten-scientists/pull/616) (3fc8541343073ebbd9944f941fbfaa336c433d95)
-   **deps**: update dependency jsdom to v25 [#618](https://github.com/kitten-science/kitten-scientists/pull/618) (58f26cffa0bef47cac0b3bb6c7b9001981dbda6e)
-   **deps**: update dependency jsdom to v25.0.1 [#668](https://github.com/kitten-science/kitten-scientists/pull/668) (095b00e5c74cee1785ce8b7d9f69ebe1b69ad125)
-   **deps**: update dependency koa-router to v13 [#642](https://github.com/kitten-science/kitten-scientists/pull/642) (d10a9113fc4b70e9fcbbbcdad78165389fce3f03)
-   **deps**: update dependency lit to v3.1.1 [#459](https://github.com/kitten-science/kitten-scientists/pull/459) (73e37eb0c52c3d8978aa1a925736fa0dce50decc)
-   **deps**: update dependency lit-html to v3.1.1 [#460](https://github.com/kitten-science/kitten-scientists/pull/460) (280128d802aabcfdcda0bec74bb8af704b243bb6)
-   **deps**: update dependency semver to v7.6.0 [#482](https://github.com/kitten-science/kitten-scientists/pull/482) (24866fc15464646a3999e9488bcede7a2a58dde1)
    <sup>2 similar commits not listed: e90e292e7153692e055207a8e27d5be3ed1abfd2, f513f730a9c96a121d6c4b57421fe67c09c3b2d6</sup>
-   **deps**: update dependency tslib to v2.6.3 [#576](https://github.com/kitten-science/kitten-scientists/pull/576) (a7bb9b75f2caaa92ee3e3d1dddec4339bed5d94c)
    <sup>4 similar commits not listed: 0e86cd3adfb0d6bea4e93aace66f54d5844a4311, e805c73fd93ff0e73c02b21b4eef8e3b4cdf0bf0, 2d11be48eda2d5b6a4bb7b8028e32cbd47b7bcc1, 2c64f27b454087feb07b97524556fe6485fe3dff</sup>
-   **deps**: update dependency yaml to v2.4.1 [#496](https://github.com/kitten-science/kitten-scientists/pull/496) (c2107cbc71f3fd52368fc3dea16bc4d032488ca3)
    <sup>1 similar commit not listed: 4d7abdd1461d4787e868a0fdc517c98a24a37cb0</sup>
-   **deps**: update lit to v3.1.2 [#478](https://github.com/kitten-science/kitten-scientists/pull/478) (52892cd829f7888cde6acd9b76d3d252b1cdc374)
    <sup>2 similar commits not listed: b6e1cdc7f4cc0fa17116a3364b090bb7812212da, 38a19dd91c422a8dd5b0ac18a11d94356078caaf</sup>
-   **deps**: update octokit monorepo [#509](https://github.com/kitten-science/kitten-scientists/pull/509) (58ec49340a1510453c71cb4da30e30f150e71cac)
</details>

<details>
<summary>Chores (98/+540 unlisted)</summary>

-   **deps**: Bump express from 4.19.1 to 4.19.2 [#507](https://github.com/kitten-science/kitten-scientists/pull/507) (77d0ec16374df9769b6320fc4bf6219308e0079c)
    <sup>1 similar commit not listed: b78d04380748dbbb4310dda4da7e6bbf5e3750cc</sup>
-   **deps**: lock file maintenance [#453](https://github.com/kitten-science/kitten-scientists/pull/453) (4e4bb5fceb257444641e012f12b2e69c509a2581)
    <sup>45 similar commits not listed: e03c425ba8df2a2cdf6ef2632b412e9c2638b91f, 266e35df8934814c02223ad91f0ec13e95af2cc1, 314602d08717247634ff65dca7d039a6f0931625, 3ae2d406d32be5eb38f7a425b9c55c983169464c, e88faa03dbed22127130879957fb9f69a9224a5c, f047993f99dfcff515cdd85db25eca2471c581f6, 402bbe0b117c24b800f449996fe36f9735b46c93, 091042d901e6219e1777ba6802a77df7f624846f, ccc9df167f437cb005b47b463a0ecd14b7a9d8bb, 630b777ae50b9142b9869423306ee962d27bc0fe, c6765ee8b1e3ea586376ae795734f695457547a9, e8ddfff563cae45494877ab18e88360a72827672, 30d808841c33055a81e6094930fefa9c047be532, c5211b26b1cc7f120dc00d87aac311769570f40a, 73301dc5b8020d98f09aa3caa1f42c09e3a88c44, 89faad4cc0facf8c7d483e3a49e4af890626bcb3, 58ed08c5a5fbc2a2c6d434fd913368e7b08b53aa, 911f5a428a739afab881a32e19e20952bdf3718a, 3fb44a8ed6c6ddd0c9826c1552a2d74dab2f63f2, b349f172aaffd5679827899c86c3cf56297a60b2, 8533e936b4b45478d2fb345dcf1196fe569c452d, 333d01009a9bd3f1c88ec03fa6b04d12764ae613, ed1535a240233016218184233c2f1b89b4ec1128, c8b246ced5901010925199058581c6e9112885e4, aa1bf129005920c6ac9b2a3f55d369685da9807e, cc98b0e27c201dd23edb528dff4e3d0e94e48a06, 18731d6379850e5d3d3730c0371110fa698f6bd0, 7d37c74b85123e48b2b0f50495bbe6365f498b50, e0888c987055263569ae3e08ee61f6a3c85a910f, 329ef332f06ecf1121b23d6def3be73c7b237757, 10a7b827872ba055912a539fafbed9028cc74779, 11275e1e3fd8edb0cbdabe60a83acc35e01d6714, 03f810ffad19f42dd30a3cd027b7aa6d0b714a24, 439f9cf3ff3f70eda4401795f1872d8ed9f8c811, 0e688faa1a714972deeb392591a977cb59e4cc57, fe79f2d5b6d559af9a961c1c7e5f835d8c3a5cff, f2481852a405351fb72295346b0dd4f607eef115, bcd1a5a8bf483be2eb691f0a7e0e6c53efa2acbd, 8be0dc9c153bfbf631b555006267c80aa3ec7dfa, 91471219c6c1a712e0a40118f3750aeb77b6631b, 31a34af8d8750a690fb74afeb6103721314e0b4e, 0f16e4795e9cdbdcded95a066c8d61395d5a9e5f, 169e3e68b83515702322f9f432557ae3f2e9a354, 9e18a9f80deb67a9edc4c52212c7c05a3876a521, 8a06a5edce390d663329aa743b38fc11876018c2</sup>
-   **deps**: lock file maintenance (#783) [#783](https://github.com/kitten-science/kitten-scientists/pull/783) (930c77775d9e1e01bc2fb1b2d88e975c992e6d6d)
    <sup>7 similar commits not listed: f739b98206a884d526a890a3c91e1ae7691d2385, 567d6fd96cb2f7cbe78cfdb0f4828eeebc1b13f7, 612b5a1cce7a9c11f524a9404a4d4e31cc497dd2, 4880dfc7004721892c4fd4b0b57ea7a26aa53338, acecc45e791bdbb90eec6867eab779beb23b98c4, 35b24ed5b60c1b2a36b7b0381b3ad961d94b8265, 8c079a36828c96deb1d39fc9ef52b00861a745c5</sup>
-   **deps**: pin actions/attest-sbom action to aaa2d0a [#571](https://github.com/kitten-science/kitten-scientists/pull/571) (8ceff2bf80c89bf0d3296fa9f50130ddbd79055e)
-   **deps**: pin dependencies (9f0d45b35b09035328440af93f66b54cab766508)
    <sup>1 similar commit not listed: 8d2fa730933cb6ed94507b4df3c52e1e2076cd3f</sup>
-   **deps**: pin docker.io/library/node docker tag to 54b7a9a (7979110c8918b549be8037651eeccbcc0b37a98e)
-   **deps**: pin oliversalzburg/action-automatic-semantic-releases action to 950f324 [#554](https://github.com/kitten-science/kitten-scientists/pull/554) (b2d1641384f4bf5589f91b436ba8ae1de8585ecc)
-   **deps**: pin oliversalzburg/action-commit-validator action to d2d4feb [#553](https://github.com/kitten-science/kitten-scientists/pull/553) (900b385c400c2d73bd2835bef6f52f69b4991e4a)
-   **deps**: update actions/attest-build-provenance action to v1.1.2 [#568](https://github.com/kitten-science/kitten-scientists/pull/568) (67b86997c73474d972d3c383baf678a561598279)
-   **deps**: update actions/attest-sbom digest to 3d6693d (5b938a793350e4a01dbb39c72f826a3ddb34b135)
    <sup>6 similar commits not listed: 90870e459318f3076bae9a31bc035f19d94491b9, 2ee7861d6de489591b2e1012f248864a80728d5f, daf7b9bf7b18a5fae95df6ddf1f409f4559ba8b1, 8b053d3c2f9942199218049b7af65c3c741e0e1e, 653047660ae3017681e1dc79eec9acb991e2d88c, 80a45329c18fb24bbe8427eaad3741b55d9c3d65</sup>
-   **deps**: update actions/cache digest to 1bd1e32 (11b8a1746feed76f309cbf9b791bd7734ebc29a4)
    <sup>3 similar commits not listed: d45292e90908386dfa597688b157b16be5aa5cdb, f938b9fc2d52da543a6fde64b9c591dedc015ddc, af79dd58e8fcf967aabb96a16bc023251c0ac033</sup>
-   **deps**: update actions/checkout digest to 0ad4b8f (dad4b54e6a0defc3aa71a2e8772741e6bf045434)
    <sup>7 similar commits not listed: 9d36f00762ddbc59f63caebd03643c592722fdab, de0ae75d56be0abc2e8c64a5dc1b9d534cfc50a5, c5c4299ce512139a2e61aee24f85451ad9a9b4dc, 3ef93c99dc1eac63e6a45b1b7bf03c919912158b, ffd138f4bc270e400042fca4e34e78ceef5415de, ea46c044dea3cb30b544d925b9f061d12ecb5b7c, cbb9fb93d5cfe8ecb96895e1230f280c5a7e2980</sup>
-   **deps**: update actions/setup-node digest to 0a44ba7 [#661](https://github.com/kitten-science/kitten-scientists/pull/661) (fe337a0715b91d70b980b8720b406f9e52ab349d)
    <sup>3 similar commits not listed: f2d53ff2720ec1280738d4d2453da6534786b363, f2b8d158d3967dfd1dd2ee098a6d86805fc3cf47, c745ca69f93e86ddf8254cf416a97626a90ca614</sup>
-   **deps**: update actions/setup-python digest to 0b93645 [#753](https://github.com/kitten-science/kitten-scientists/pull/753) (7207c62f11cab9a64073e828368d129aae65ccf5)
    <sup>3 similar commits not listed: b2f631f8d4b5c60a5af71a8c6a31b241af06e3d2, 63741b12d4434585f7cc8a0becb479225c7f6214, d534193779cf019b3f2b747a7b6deaf1ebd3c064</sup>
-   **deps**: update anchore/sbom-action digest to 1ca97d9 [#742](https://github.com/kitten-science/kitten-scientists/pull/742) (ca11ab63896da0917f1e00fe7769c2ea1a4de287)
    <sup>5 similar commits not listed: 55d3a29c41baf76482a4260eb5b35db4213471ff, 1cc884a7236f1d3b11f5f7dd5f6aef4f33a2e1ec, 005936e8ae6cc1c0432051af53eeb602be308ab0, 673c83c07496970f03b3ce5308b1fde46dd6a143, 2870423e5aaaa6ac3b2494361d54a03c0a4b1500</sup>
-   **deps**: update aws-actions/configure-aws-credentials action to v4.0.2 [#483](https://github.com/kitten-science/kitten-scientists/pull/483) (e41534176a710dbbb32505e027a2079764083e66)
-   **deps**: update babel monorepo to v7.24.1 (6fbded9517e1ba6041bd7d2551cc9d6dc3d876d6)
    <sup>2 similar commits not listed: 94e2a34110d541e83543c8150f3dd548d8da0476, f6164458b10a6e43de36b3ed3219bf3261323b49</sup>
-   **deps**: update crowdin/github-action digest to 2d540f1 [#759](https://github.com/kitten-science/kitten-scientists/pull/759) (9739869fbf04117a9e87038264719589d5c6852c)
    <sup>1 similar commit not listed: c42569489b5fbc42c567dfdaa4649428f9212d70</sup>
-   **deps**: update dependency @babel/core to v7.23.7 (2a8728fb962052d9201ddab64691c5d5a8c18e66)
    <sup>5 similar commits not listed: 664b0be206156dd69006e299d4597e6d647ef9ca, b39ddd90750946297569218b784fe7777a595861, 0767f92afdba182fccfd030c1f71890ceef4da51, d24056d31f87feb64828e59c4c2cb9dc316bcf42, 8df42c903a9fb3c2176ad76f63922871a2b6cd92</sup>
-   **deps**: update dependency @babel/eslint-parser to v7.23.10 (79f3fdd8ff00cc2180f8c829f6fff8a1635dc570)
    <sup>2 similar commits not listed: 33bbfa8acaa556a42061cc29589043a2c1113e9c, 5c071e51e1f801fb9425c91227eacd6743c49b59</sup>
-   **deps**: update dependency @kie/mock-github to v2.0.1 (44ca5d1ac77fc141880c847bf059925c034f2e73)
-   **deps**: update dependency @octokit/types to v12.5.0 (723555428814c8962ed62e6d7d7c60b04454f47a)
    <sup>1 similar commit not listed: dee61f463961bcff67f0fc64e3171c035a781c52</sup>
-   **deps**: update dependency @octokit/types to v13 (a1184a2e079401dd09dff191caba12a8f173a33b)
-   **deps**: update dependency @octokit/types to v13.5.0 (425fecffc9f24e24a431d05fa8735047a77774a5)
-   **deps**: update dependency @types/chai to v4.3.12 (aa4c6fd009b45125f1130b2cc584f26b0db28ea8)
    <sup>8 similar commits not listed: debc188183743236d703e347a247c3de18490cbc, 3470d8ca75f598f618f28ecd57947db1015c859a, d0a311a4f8ce053c266017886a4ce88eecc8f5aa, c34a67a7da5727d2e51b5cf5fb2242b3def3f851, 5c6f5dad616c8ac01d98ef149b8646ae72013894, 8bd9ab7b046b7e27af166753797afcac92607a52, 365e023813fb2a2b1002ecaaae185d3a5f4faca2, e2de8e8c181e169cc1377e70df8520dbfd55f349</sup>
-   **deps**: update dependency @types/chai to v5 [#673](https://github.com/kitten-science/kitten-scientists/pull/673) (cd96a9ee8d6e1b64652768bb0c024ffcc488c780)
-   **deps**: update dependency @types/chai to v5.0.1 [#762](https://github.com/kitten-science/kitten-scientists/pull/762) (4e3fd50e7e808a9c478fa735a10bdb873cff28b8)
-   **deps**: update dependency @types/conventional-commits-parser to v5 (93e2ec9fd2e28b64acc637f66e614a56fa23bf42)
-   **deps**: update dependency @types/eslint to v8.56.1 (79207e9ddb10d9ebf2cf0a6353f92969a9b993d8)
    <sup>8 similar commits not listed: fceff5d115338cb8a5f2b5272b74e62d9dd8c246, acd9d254d31b27317e46e85086f0ee338bf0a211, ceb1023a9d5e46a573715b18df3e0f57921fec1b, d4122fd13259e60d43c320c2fce6bde1c96630df, f3a4f5a53dd8841741c823a0ad914ce35c313868, bfbc39617c5a8dff3c0a840e7291c4e9370e33d5, b9ddc557606a195a2363f0a297eb13ca16c714bc, bdbf1e057615409a5437171161cdc8bdc3ee2f74</sup>
-   **deps**: update dependency @types/eslint to v9 (68b4f7c3dba9c70f1cb60cb691b15271e94c52d8)
-   **deps**: update dependency @types/eslint to v9.6.1 (22beafc874017d4a7f6f708ad853c89a0882187b)
-   **deps**: update dependency @types/jquery to v3.5.30 [#538](https://github.com/kitten-science/kitten-scientists/pull/538) (f0df9b2c0db727de57cd54791d621fcc84ea17b7)
    <sup>2 similar commits not listed: 3a42c7b9581caa5e1e0b053521d04856c3c83b55, 2db39ba5d24ee6f63f93197096bf5b82840759a1</sup>
-   **deps**: update dependency @types/mocha to v10.0.10 (b9225fb16c3684884b266fde6c6bad2257cbd4be)
    <sup>3 similar commits not listed: 8bd26591ef62274d01f3bb64838142d11dd293fc, ffeb51fee2dab35e64f13079aea42994751296bf, dc7d1ceba71068b31872eaa92176c88011d438bd</sup>
-   **deps**: update dependency @types/node to v20.10.6 (788995eafe2d5c3c10e0432b2ec2fb686d2c0861)
    <sup>78 similar commits not listed: dafe1486c68af7f4de868ea32261c141e8472154, 45ea5672b6645d7933cce89dd97cd9e446d19153, 6aff264ceeac0b0e421489ce29e8f77c5c7e07bc, 89da29f3c2668d8d92aa1ce6a202fa32311ed4b5, d2b44f5c7f701aa6191a38e572a78882eb2e95aa, d22c6374f83f7e6989198666923a1eb671f6e2a9, 1c96fd202048318438dfe917d2d6da399cfe6af2, 6efa27af661cab5bae2e80e89d68535d3d26bf0e, e2040650e4505bce51c69840bff131918d2b8ecb, de2fc3fc583f89ddfb46f82edf8d857bf510b80a, 0d099dcac1c336290029d772d123d6792bc02dbe, b3f6c219f07004251cd4343256710272821ba9df, aef0476d5560723fde429f903dc91f57c31d8764, 5fc50100bb6a8c5dc5f4dbae550fc7602403214a, 531921f2f5b4f71c4e8b8608a6522c56b3175629, 02aee714d2a4e1950d7f4cea4837e9343000f481, 3aa97431e6cb4455c1ec775cd358ae26ca73bfab, fbbd806b426dd28ee63c422bc00c684c9265dbe3, 02e8d45206d0f21246c144d5c5fb1670e4df7a8f, 0c0b3a7071f55759e43de06f9a65c714c7d34505, e55e48fdec784ef95aa5931bc90edc473ac58275, b24da12011be10a1242fd76856421acf3cf39813, 8a268eee32505ec8654f36fb7441ac24ecde8989, e42c35e09cc62fcf5e403ca74696328cc28dd2be, 16fa2f6d5d52e57b922c91feef4e32fe928a7f75, d37113814d8a3aec1cec60ed2cc2dcff4f2a9191, 60580708af9524e9d564c13dec72953144cb6b3f, 7b66115de67462d83c72891242d43f52d5ff96c3, bc9f74dafde8228a4d4c9b2dd335b898add17f7e, 1780bdb68390d831292fcb2acb6657bb31226c57, e923d0c02cf93d8736c7819a378291f0c30c470f, c164c81362fa2359a85bdc383d03b1259b73382e, 2c90118904c01bc59bcc7722cc9082e9e39beb04, 4b2e89b3c0cb7d42acdb419cea6af2cf6e3be7c7, a344c93f25031b3859527aa380742e1c70c4f607, fbac42caa3d540ebce0e7b1db4a33d04622c5347, 7302b2cbab09a5483aae36d956a0a09c4e226375, 7db2782c04198c6b42bc660212dee9e83c209afd, a14c424b8c81875b4b6b0748bc5f5c1930c572d7, 3328dc40d284fd43587da1599d0d9c9af57bf057, c082c35bf3941670fa49cb06b5db15420cf5c59e, eb14a082c1110f8629ae2db01547cb561fa78098, 852f32bc796122088a7f42597c360ef18041cca7, 9f42a38951ae9ef5ccbb38283b4f49e676db5351, d130c4e9d461aa40d17eb93b8e94a48cdfb756c1, 10e760d7441510662c2fe42742dd80a4f1ea1ed0, 634b35d8f0ed9175615a78eedf2c300ff929e508, 3d50aebdc2e610af89d5125870f77c9be1e65c49, bc52d579b43e47857afcafc389e5d8c50ec756c8, 866b85222ddb4f9fa8874aef9d790a78b75126c2, 0ce41a6c880cd56bec54646ed2e72a1a70435a95, 62216c0c4fe97fc13d494e1e71d8bf716bc63bff, c0e62ce14d050b9947850cc4c36f567b6a750a2f, 914c94cf8a5a4b250b4b8319a810b8281443370b, 07762cc4a26dcd5de93d2fd0d061774c0f0813ec, 34e20e84c9ee5be126158118fd55902be323bc1f, bfd0a713f234e3217427e086d8698da3e7ce709f, a266f31379a717ab30464066c50c2993c66bef0c, 0418c849cd6e5b2dc54d18c80bf64c25490f170a, d0873f0c250ee6d4e838fa82c9de759a98af6ac2, bea580b1a9b928fc625f0a3dc62bebfa98446f4a, de62e87097b262d8709d69233679f1bb3197e43d, 28405aa81ab2e0bd189423efe3f3722cb276ba26, 337addf04884b00321bed7f3c7f2fa4b7ae4ba1b, d5d0fe61f16ac4e6c8df07e5e6a6ac3d30d2c595, 4c209a0c2b541136f50b987139750dc658e56332, b92131e451a4cfe6076fbbb18396dee07285112b, 1df22622b70a9bff9fa7b446bcb0667e8523772a, a87bdb5bed64eff4c15cdc8c3d4c81e9138991c2, 16857b67837151f65658bfe250bd68f27c71201f, 1ded86338ec68640a7cfef05242909dc145fa35f, d1323188cb5d0e9af932a0ccd0444f338147f416, e059bf854e1489a32886b24dd19ad68090c2ed56, e6f461c7ae424cbec12fabe7385b5f9e2fa55212, a355302aa64135b12f15d1082441dc5d7be25901, 2672b7fbab903a59d45006ee443da21f1cb16f1e, a4ef976f1444c1fa2dd15f7651077c568c2453d3, 09a37982b38b8f3747c50bf3810586a0d2507e7b</sup>
-   **deps**: update dependency @types/semver to v7.5.7 (8e024e28ec3e498a744bcf941eb82ce220b0916d)
    <sup>1 similar commit not listed: df1d2c89135946a82ed2a1a135cfe762fd5da789</sup>
-   **deps**: update dependency @types/web to v0.0.131 (087f97db8a313a9f39f73804c072e5f549691cdb)
    <sup>56 similar commits not listed: 23377b57128a4bb9ae85d10251235fe7494f3d5b, 13b9fc0ebe7390fa59ad369b625665eac91f3cdf, 999c43313df1df069445b00e6d39840aa5a35d3a, 6a9ca0f4a9a7e9523da960f8296f65f8fd75f28e, 67ceee85de0535205193574eb9e4737e57b71e9b, 4a0bb636a51e234da2d2144924b1d9c441774ca8, 2a5c9e178c900942553f455671f2f9fa9de5b2dd, f5ebaad72f9830675cc705d4f56e6d23d79b49c8, b12ecd73176a5a19d10bc6447fa341605178b7a3, 276813c70e0f8a12b74ec34095ac2948ae0705c4, cdbf7985469670cc8950f164303e143a88f40bc9, 2e1b027eec06f54bb937f9776dc1f7b18397e134, 4d7f05981a93783f6b3b842e515012b49ba13b54, 27014f3e8c2b00629b678a9c92925686a9f743dc, d40c6ffd5f0a72965af8955cdc399d88a80f3739, bf81794ec9318c64bb9572d631aa765985dc98ca, e9a83ca03831f95c09bb33272580df3bce01adbe, d45f3fc8d9daca226dc12c0ca234a1e495f56f36, 4e8c19ffde92ddc0d15a29968fbacac60928fd50, 713878f057a5b00f4fc2d347aec21eafdf037095, ae07b5b7f2c56d1026fb2dcd1f8713c229989122, eb794f7b9d9724770e1e68209ef2fd897eb51a8a, 686d83b5bb66914a24012aa99870d2c20c543fef, e5ef2a810109c48a6827ddc68f5e245d54895ab3, 1488c8d0b8bdb07e97a04ca142caad6dbd293ed4, c1b5d62d10b7a9933020b9dccf34c181da70511e, e23ff553685bb9784b4c588e56a31b5064bafe6b, 67b988b7dd154ef36c2bc7e63e445cea7b828d58, c18a9025ff9d53328b842196b9411db45b032729, 5b6853abfad2021c6589fe7d562ab5cac6a61264, c70ab255133765199c8ebf947211833390f28245, 71502131b61aeb70eaf0813b35a0e06c38c0fcc9, d90540e223b4193c57361fb600d3d2a83d11fbcd, afffca9a76cf5c34a655f095cb4652be0438a98d, dd3b45685190bb99efe6a20ebbb6a145712a547f, 0f2eac859811b8bb9d46f85400df7c964958a1b8, b74fb0ecdf0b9b981fe31bf967b03d574d564897, b3b7a6e7379c514497a79edf5711562516a579da, 07fbbf4483fc1abb3510f8890e269dc47b180f65, 3b843eb9084817d8c2a4ecd1574f88f82655f43e, 1bbc47a10e20d7abe16b083e14b9b9302dbf3faf, c09a27f712e178252836221af4dd3f7d97f3fc10, 438316bee39e6c21d53ef2f42406f2c2cece90d7, ceb7efb6c66169118e15f6de5988091fafe05481, 98e6f828c0e873f9e7cc6e454011cea6d86e2b0b, 3afc3c4ceb3ad5962620d12d287c4eeed4f09130, d58dfb58205100b6338c14760cc206a84fe4356d, 42796d1379afc8ee91184209fa3124e4a386247a, 9a8c5a91d1318cadfcaeba5036360c16e3c80b9f, a7d78c2107fdd843fb32655922906f647a9417d7, aa99baaf3b46e87e330b61804e1bbf67a7265c3b, 6a1fb7380acabec6e44f020e361f6eeadec8b5c6, 1808ccc700e8d501f482d5417a5c7e435247bbf7, ffbb0b066af5adacdb2a2b63964cd0607903f9aa, 4bbf5f4f519b67f583e24f23d912006c51871e27, f1653efdd0297cd9f5101b1d11ca27b1c297b742</sup>
-   **deps**: update dependency @types/ws to v8.5.13 [#773](https://github.com/kitten-science/kitten-scientists/pull/773) (62512705817111a9a4fe8355fe7eabd8fec25232)
-   **deps**: update dependency c8 to v10 (479ad0db1be4ddc2799ebfc270f201a2743d1d57)
-   **deps**: update dependency c8 to v10.1.0 (25184a5f960fd21a4654e5b88b82163fff185b72)
    <sup>2 similar commits not listed: 76bcba1c121313480e022322e0626562fa9488bc, 25b51b0b86f6bc5fa9b6955cfbf3f5e3346935ac</sup>
-   **deps**: update dependency c8 to v9 (04765f9d8fdd121cc830f38a4bab736e9668f56c)
-   **deps**: update dependency c8 to v9.1.0 (947dd0fc550234f60db6b6b0324318758b25cea8)
-   **deps**: update dependency chai to v5 (a6c35353edcc6b24e06a61da394729139657a812)
-   **deps**: update dependency chai to v5.0.3 (714724fe3a92d981d698ab68b42931ac796468e5)
    <sup>3 similar commits not listed: 38c90227b023bc0d6ec2c674323146b53946d487, 96b34304409f9fe7c21a8be8ac67b23380884250, 9bd7238104134e44e1b72e84c095a37bbaf3d53b</sup>
-   **deps**: update dependency esbuild to v0.23.1 (691237d2dc4a50ad65ce3b5c163f711b9f711302)
    <sup>1 similar commit not listed: a1064c89056df7387428bd9fd514ab848a9d2375</sup>
-   **deps**: update dependency esbuild to v0.24.1 (#848) [#848](https://github.com/kitten-science/kitten-scientists/pull/848) (e61922aef9f8ce0dea31ddef05fddc832aa26c8c)
-   **deps**: update dependency esbuild to v0.24.2 (10ad065766fde73e606de4b2ffbaf16b81f079c7)
-   **deps**: update dependency eslint to v8.57.0 (aa20b878b2a0fae1f909c821b1cc3ed445d79db8)
-   **deps**: update dependency eslint-plugin-jsdoc to v46.10.1 (d84ba19f0b907486a41a7fd8b6418eec77deb54d)
-   **deps**: update dependency eslint-plugin-jsdoc to v47 (02a48cbb7eda8745af01a75bf879f5eac86702e5)
-   **deps**: update dependency eslint-plugin-jsdoc to v47.0.2 (65e62f18a610a5240f6216d17034f7c771e3e337)
-   **deps**: update dependency eslint-plugin-jsdoc to v48 (d8812b6d8aa164a8eabc282bad2b3f01b1b44d92)
-   **deps**: update dependency eslint-plugin-jsdoc to v48.0.3 (48c6164e753e26b3c90e44ebc61ed26c953d3e33)
    <sup>12 similar commits not listed: 5505efe26690e0a6e318e47f2df62a4d40fcc885, 244a1d8bc22c2c28beeb8ec90ee9c318e65cbb67, 540f3e8f4acbecfeca83cf5d888c4500fd4c2df6, 73a33154fded153dffbd0df53a0a3c922f2f98ae, 1018b3076a6c32e04f8af016e7c59695e98c7d1a, 6ab0b80ae27ae7dabe34adec5861e94e085cd822, cbdff8f65e3439d31ed65d8caaeb619c7741124a, e5f5c4901c829d990956e9dd358ff012db9684b6, 48e1c2c02f63cd5539a7d01c5a81e42c178f447f, e344af79e02a4cbf20aab02a90435e57ccc6865c, 29b1adf564c47a997b093eb3862d89c119016b4b, b2cb72b0904ea978e7a00e26c99b0c34fe7caa01</sup>
-   **deps**: update dependency json-schema-to-ts to v3.0.1 (f18c4d644129e5abb1208b4e0a78ae03b2912d2c)
    <sup>1 similar commit not listed: f159c6872869dd68707c3f9813a8f38096206f62</sup>
-   **deps**: update dependency lint-staged to v15.2.1 (c2cc60176ef8a7f4e8d08588728637d85f6e018a)
    <sup>9 similar commits not listed: 8138db487b3897d5b9e84352c505bf8d3f586b76, 23e57260fda1beb56cb1a6d9793fbb5d0b98bcf3, 3532ec24d6f45b2d8876fb1bf4d20f7fef217c65, 1724ed59250423f50d21d1a5b5363092490835cd, dbbd897779b927a877e5fdaf192f0121ee03d0a8, 0bb0814b13009712a54cff67089f0c8920118bf8, 2e10cc845f066da0fdcb3eebc9f0dd04dce72b33, afa90cbb271dd8818a13c3064e6938a2e90a4ed4, 4f99ebbaeddfbadf180c5e32af5ae48b62d9394a</sup>
-   **deps**: update dependency mkdocs-git-revision-date-localized-plugin to v1.3.0 [#746](https://github.com/kitten-science/kitten-scientists/pull/746) (b2900dfea35aa079f66dbb5ed601b0abe3254eeb)
-   **deps**: update dependency mkdocs-material to v9.5.40 [#712](https://github.com/kitten-science/kitten-scientists/pull/712) (1ce8c373bf2bddd87faa32ab06b0286f767c238e)
    <sup>8 similar commits not listed: 520d47cc7a92913a419574689600d8d45fc92d44, eaf59b9064bffbcda2447132bacddaeaa90b34a2, 6e74d2caeed4e69636c5a5a8ba2957ca13ddf8ae, d17468c1abd8bb30f4d2e63e33fa3cde150a7f21, 645ed0eb6913522f967eb161c22dc2cd2cfb80c3, 72235cad21aa7eed60ec5c9294e4b81f64196872, 0291df32278c8c6ab63aa720bb730f82dfa386cf, 2709437c2e44c5bc0a4783735a71b3d5aadf10f8</sup>
-   **deps**: update dependency mocha to v10.3.0 (75ac1031a98959f314b7c374be02eeac8babf7a7)
    <sup>8 similar commits not listed: be1a0f59b6e86149353918b676092c0fb78cf5b4, a25e124f12071761e42b9494ef808e29c84f8aef, 5c86c9d93e67081ddd4b5460c9029cb848526af1, 0f44707d16d57fe5ec5999c08d3ab84ac12d1dc6, cca7db5b8825f7de5d3fa0e18879142f10bd4e42, ee223f5ed73fb95e990411e346ec148d63ea8def, e0c18f8192df9aa7b4ec2174fa2d2874a8bfed35, f34c3ec3a2145c477556c2854f48185b2acb81aa</sup>
-   **deps**: update dependency mocha to v11 (eda2b192edbb4b4e133d0fbf3c8e6be54b92be07)
-   **deps**: update dependency node to v20.18.0 [#691](https://github.com/kitten-science/kitten-scientists/pull/691) (d74219929fc892a48dfab1b04b3273376b599db4)
-   **deps**: update dependency node to v22 [#766](https://github.com/kitten-science/kitten-scientists/pull/766) (249bf2e65970b1c671bb889c6c4961b00abf716b)
-   **deps**: update dependency node to v22.8.0 [#628](https://github.com/kitten-science/kitten-scientists/pull/628) (d6d1f8a851c6d545ca2a36f87b627e2ec961cff4)
-   **deps**: update dependency node-scripts-docs to v1.0.3 (7cd140f2aaba420e3143fd678bdaa9241ab50492)
    <sup>1 similar commit not listed: 7b6563b1483f2f45169b5af119764b08d72ee794</sup>
-   **deps**: update dependency prettier to v3.2.1 (7f93de34728a8f2083d3c87cb1bc1da9cd3e8fd9)
    <sup>6 similar commits not listed: 8ac06ed9c673fbfadee338a01fad9ed50471803e, 9f6331cfbbab433e45ad853d7fd8b6abdff11fb5, 915f5d82937c173d2535b8367985726df10c7694, df29861849554ba8d71bd211e7fd6539d94280c4, 6bc07d8d4b8ce35831068995b47368cf1d83f10f, 14268019dc3d9280d97f64b931735a9c6d788d01</sup>
-   **deps**: update dependency prettier-plugin-organize-imports to v4 (afb3a83fe9743f007092ca5b287b1863b715f633)
-   **deps**: update dependency prettier-plugin-organize-imports to v4.1.0 [#664](https://github.com/kitten-science/kitten-scientists/pull/664) (2b0d2f82a07ffe12c604bef7b1d043fb0ad56d5f)
-   **deps**: update dependency python to v3.12.7 [#688](https://github.com/kitten-science/kitten-scientists/pull/688) (7d396e0abcec21b5d7149d27e2985dbb24a06b1a)
    <sup>2 similar commits not listed: db695619ba9ea5654971be99c58ed152582cfb71, bc6f799b2d50f1784735c2b779141085b27fdafb</sup>
-   **deps**: update dependency typescript to v5.4.2 (01e555e1b4a7dc16c41e651874c85827d35f3386)
    <sup>9 similar commits not listed: 8e06454ed652e06bc3ea080addbe629dca495b8d, b34ee84ca4ad580473b8038cd5d2e240c172f6be, afbe0534aa026f3b677e72c9b266457322f46839, 5132a66632ddcf0e6aac81262d743f70ba66af08, df4aaaca7789e792e2ae954e01338883e275f891, c62309a488b3fedcdcc7b985ab00e9bb8c579f89, c6d5529bb07ca378eff0b2adcc82c37e2dd45750, 7ad3e5c9456eb0dec47cd8c0430de128d5e6a225, 3c4cfb37fa7e2d74474dcafeb582b2cabea116c6</sup>
-   **deps**: update dependency typescript-eslint to v8.0.0-alpha.33 (b1e0952bd8f8f6f8e0d884c73d8829461a4848d8)
    <sup>16 similar commits not listed: 630ea4df80514562784f16a77f15fb6872d00771, 40d34ea6b36dad705bec41ad4d69d7bddc7e9542, 23d0fb1fa5fa2c4b0661552e48666ba0fa197e31, 8d041d076db8f50fcab9bcc30fdb34604467598f, 1c14e7823f8e0b77105a68e9d8044c60b4d357f7, 08704d7ffcac68f32c710ce9584c9ce42e40b086, ce0e787d0cc2b6c175584dc15309b66bcd88c7fb, 5957e210a01c8ae89966cb372cea0cc44dcf827f, 771814532e9846cc7e24db2a7cb5bcc2a23c61af, 7c7bf27447da386f499f037b861992390efe2838, cb3ce0b28d0884376e3920ec6077c38df5aed9a4, 1661f1e3a2e12e34eb8e7f95def6bfed644c8595, b51082cb90a9dd156b1f9468cc8ecf65ee9c668e, 90aef51bc7fd40e102905255ddea151fdfef3895, c7256dba621ed2a471c7a9e506ffc5c19ad9e446, b284503651dec863cf29f826487028c271ad9f70</sup>
-   **deps**: update dependency typescript-eslint to v8.10.0 [#727](https://github.com/kitten-science/kitten-scientists/pull/727) (944b04c50cd5a200f4fd149882b027ef8ad51303)
    <sup>13 similar commits not listed: d17ecd476ce7d31a51677eb6e47cefd063eac072, a2210143f9cef40b8af7f6395e615ad38b6590f2, bfe88be1fb115ed539dbaf4a8c3b0ffebbf1bf28, 894f8434898ce7ca4dfb3e0d95b79909fe7c594e, b7d065760f6861d25463802f7129f206fe4efece, e0a0c429d880b51048705e451b8b6ed961d6c120, 1f941de8804c63b7ef0577f422015222ad6a31d4, f845d58e895cb5641e77722cd86ea6834ad58de8, 08b8a34484aa3c1650b6714ff6c237e69fea88c3, d6af5fb28f8776afcf307d40093a4642db67fc4c, 885613b5f7ed05a587a9601b9121497f6dfc4876, af65245ae9a15cd041954f0474111a4bbc5fd675, 3a6a714303610184149059c2117845d5a9900ebf</sup>
-   **deps**: update dependency ubuntu to v24 [#678](https://github.com/kitten-science/kitten-scientists/pull/678) (3e89c03377467950f1d3b5897a6bcc00ebab4f68)
-   **deps**: update dependency vite to v5.0.11 (3ce8b2f9b72e68d4adddc45e7c7c31a2551df894)
    <sup>38 similar commits not listed: 7f67146e90f70d020bc7c8d918f6c92d5b284b63, 9aeffa76a64e288dc63e7bf5a6601b2d0156cd48, 797b88ba103055b0087068ccce08f2eef205e95a, d2aaac81ca13a4b060dfa5a5636ff497401b0339, 7520367281a354e5b5637f321836ac2cfa778aa4, cfa95906b2a5d0d5b484a04db752f786f30f80e4, 5afe737db9251b5772d9e6473110eb888583cdc4, 54a8e230be772b0f073106a00855b4687f52cfb9, 2bea9dca0fcd8aca2bbb0fa80205577a68764783, cc8b8a4182f599f97b9f634c234281ae82c0f8c7, 06793e75ad9ec657856169e021f265c417853611, 7505e593bd830d91bf0cb1ed12a6dc8c4964eab9, 00a67b714b6d36acbaa637b64fc7621c945da366, 617c88635ae9b86d0244d8edab92c10d02955c94, 52582c9580b9adc086f307ddc741f5c429fd355b, cd0bc35c153557177c9006c1a56b56298d32df70, 13cc97435ef4ff6b143ed34ebb91037eb1dba4c0, 0d2ffb858c410756006f03ddd5cf1bf272c371a0, e9f663562109a0037d7e1c475d85946ac6d3da6b, d426cad45a1e16250fcba2eb96d747c37717e36e, bebb31fe29065bfd5818f837cb65f23db01977e2, 35ccd0a0b73fd83e7f8bda3665c62e74a9d43622, 71173864f081417eccb992d6cb72e4f7d0c8c5b8, 303bfadcfe4deddb1fb5154bb43334db3c46d407, 493d64aa2e934be5ccafda19cab6e0f100afdc80, 46bab20c85d4cc92f0d00c366b215738f585df2a, 66a1ebe75f439938c9f66d11462ef22dd17d32af, 458f571fea4fd9b34303030acbefca34fdb95626, 8ce27f1898e7f24c4c15e095f49edc35c331e149, d8407609cef212e234550d861c6c30cdff3437fb, 778d47f061ffa41fb5e56795c40579ac247877c3, 50b140c1b595657bf9ab0127c3e51e1d1d3535ca, 34625f4a24e6b11dadfbcc97b46ba5dc6ee22299, 4e5f8559a461a379a6a059953b7e464076f68695, 8cdf81a80f3b6e788250cf96083738522a9e42bf, 2bed7516e0556432c45c724be8684af1f7fd872d, 0319a4587a89e7ddc0ee3008f3d0b4cd500c262a, e3d0caf2eecb316aa24b14202260a74f073927ff</sup>
-   **deps**: update dependency vite to v6 (c12cf48d9bbba3914af4ffb7e7ab86da57e85fd4)
-   **deps**: update dependency vite to v6.0.1 (a9adc52878b6110a1c944d4abddc62af84f3c192)
    <sup>4 similar commits not listed: d1c6851fa5e0dfa61f2cfc21ed14b7e7414fdfbc, 025d4fe5a5bd77a94897bac2b294b561876b2620, bfb6ac7dad4963146fca759ec2ee312905b3e251, e7028e604a16e97649adbc174dcb165fff225919</sup>
-   **deps**: update dependency vite-plugin-html to v3.2.1 (d8e104fe4dd421ce352f171661d58fee3894243e)
    <sup>1 similar commit not listed: a4a8fae86217d9327b3c768ffc6036e95ae4803d</sup>
-   **deps**: update docker.io/library/node docker tag to v20.17.0 (8224089a034ba71363aee6ec00bd3b451ddaa472)
    <sup>1 similar commit not listed: d2eb54920e0558321df26581fe06ade157f32d6c</sup>
-   **deps**: update docker.io/library/node:20.15.1-bookworm docker digest to 6326b52 (229497782821a6ddc7f3cc0d6e361d43f672b06d)
    <sup>2 similar commits not listed: 23bdbc956050f2016b11c2db15c21a8736d9815a, 3271c8f4da0b93031cb2e33c6306baf236e43956</sup>
-   **deps**: update eslint (69bbd0d5947b886701468cf6ca058e9f6a7fe1ba)
    <sup>8 similar commits not listed: 9d2386a47c12aa54dfd96fbf191dfc8925588474, 1db4d8fecbd9eba32394f3f331c606f128f3d2b4, 6df3ecfd2d42dcffed8b93b9f5d6d6fe8cf68d2b, 20ffdaa918928bd922595f007908af031e9ddece, 122c2936256928dc33431af975258d704c0420ca, 9cb8cd4bd9d472997a9f628f5af5dbd8687785af, bfaae4078aa4224e57a3032d6e6d56dbbc6ea477, bf212578a3219265d734373a9342c7d061d07e00</sup>
-   **deps**: update eslint (#793) [#793](https://github.com/kitten-science/kitten-scientists/pull/793) (65e2c8b04b221a80a88567cf67ae09ad4b97d359)
-   **deps**: update eslint to v6.16.0 (b8a4945664188dac66744fb42ac1759c7d382cda)
    <sup>6 similar commits not listed: 7470e4acc7470094ba93200a5286420c98b09f81, a07ff4d017f4ec1a3d8294dd4d727f66240df5eb, 8ee1b13fb0f2da0ff205ecdbdc174c4decc12597, 2e4064228f31bd6c10b6301eac6cdbef0bcb630a, efcc3d889ce11fbe256a5c606ff698bd25d94d7b, 1e90a9faa58157fced17be39322d1eb9d353b7be</sup>
-   **deps**: update eslint to v7 (82a66225c28f8441782e0aec6844fb6d59e436a7)
-   **deps**: update eslint to v7.0.2 (f1058ec8019573b6a31aa315e3478ce964cdfb6d)
    <sup>17 similar commits not listed: 39bf0b4184b8c498b36814f99db82cb171e011aa, 7b4087fc40a07e3cb6bb1bdeda80bc183e5f47fb, f8334924faf01f519eb3af92ebd271d3905c433c, ceaedccfbbfc3ae03a4ebd61c3c3d471525ede08, bc6f8dd954b7b21c9f4aea610d73d644bad4c8b4, 6fcf1c017539f210c8d9726f3e93ff50aa6d96ce, 2531320bb5d70bca80f44f82c381e3cc22d1b6c3, 960adf8c8bd7e86f037f562482eff92dce3643d7, 1ef7879759460445f5ec8e42861c4b49b59adaf5, cc8b9acb0c64b186e82faeab9d7999a5b51ad154, b028af051bbfd37e17f6268c30547deb0e0771ad, fc7695f34319a3a222b31f7fb901789eac772b93, be9208d43a6a897925d35f5ed884dcf58b077cbd, f18eb5426e52e9887c87d23628d4d5a1218119a8, c458f29d02b2755722480cd172b088a72a19a2e3, 7e4763eb7b13b39af2f8a68ebcde2273bd83a7d9, fdbfa0289ce7e95c817b8d5c3a4a94a2a90f90d0</sup>
-   **deps**: update eslint to v9.15.0 (#791) [#791](https://github.com/kitten-science/kitten-scientists/pull/791) (6345c7c7379332b634b4e540b31760a46489ba1b)
-   **deps**: update eslint to v9.16.0 (91feceac4a07b0f10609af2866c9a42afa2ebb48)
    <sup>6 similar commits not listed: df3470d334ee8b776717e612b0f717dd2921cee8, 5b029f74d61d37c30c1e3100500ac6a422a1efc9, 6f8c556703f12b785da5b296d14c2de04a20ad9f, 33c39ed799075fec68aa6eba02f541a67be534a8, afb7dcde5a76fb82fdd7adaf5cc8e0c7c3c847f9, 53a1ba2831b5fb2f5201cf1bee80635909fcac08</sup>
-   **deps**: update github/codeql-action digest to 05963f4 (e5284c3bdc505a26ce1cc1d44a5b957f02d1706c)
    <sup>16 similar commits not listed: 791fcd61b7cf28cd5aa3e021e0daf9e1b2a65d15, 4f596c93a2c88df0ef78da29640a7c54bd9a8b7e, dafb26272da964808dbded13e57c8644bba0d10d, 5c6974d905fb8810199bc9999d5824cc8eafda05, 9ed862db50942475401dc854a3db01afb2caa9c7, 36d4c71d1e65843d6bac76e65c97b03088921717, 02dc62333a2a4d7dfc3c06675117a879387e11d0, 22a19b4a46135eeac59f560aef0062544bbdce3b, c5279645371de8cdf39489f7c00751519cbb3833, 527aefbcca8fd2524268e6b9a5b4c31869186ed8, ca55e4e005eb5c0a94c36710d0899f435c04c2ec, 6ba9f946309d6fcbbe407d8d4f0d10a69f0e59ad, e58a6ece31cc8ec656f82543672052ae22060a56, 28d63162f7f4f2bc51a8371a7a3b7fc18742c75d, 3f27fa83569c9537fa4b9c3a4bd00a5dae7d84bb, 56b9969c743968413977e4ffe0ec5ec264b485c6</sup>
-   **deps**: update node docker tag to v20.17.0 (c0bcfcb28ae4e96c49b31d54e407d48d53ef8918)
    <sup>1 similar commit not listed: e92c9f12ba6ba2fd2c4b99923d542dac09017967</sup>
-   **deps**: update node.js [#725](https://github.com/kitten-science/kitten-scientists/pull/725) (191866eb62f73b7b5fbe52f30abe13ab76263ab6)
-   **deps**: update node.js to 02cd220 (3497398cf795e26a4ed9bdb0603757feeb5f49ef)
    <sup>36 similar commits not listed: 728219da2652cfa9bd5e6d83adf6aa616f4c0bff, f40f98c3f368fdd8f1ab618303309fa5e6a0c8d4, 4d2171756e62c75d7ba5ddec1245bb03cf1bd994, ab263bd27c6497da6124d23d3b0f72c96ec58974, 921b9af24fd8e1b35153e7f074090606e891d95b, 88d8ffae585cff52b237f885f423f6062c4b9783, 38d9de32c17d86b31364176828db2298deef77b5, a1439aa57ad517b283e1efeabda21699e8f76969, 2cb1832316517303297892e1049334a3a7bf9890, 1b281aa2124e0b092ec0acad5de9d9f39a690579, 167bc11fb0fe88b94132422637bca53b6f0ea33a, 87fa0904734f012b69d8df406a306fc3f5b78282, 30be90f62b20f47953240582c674b02ca50acf4a, f3b954a7999127c61f422596b38291431f3dc4f4, 07827f4aca859dbaab80903c5a12ee9144fc46d5, ed7adaaf08acf59703f2c5ba2bd3269a100a25ad, 627c0f27e6b556103782bc983cc2b528ae510dcf, 7a6aa2236daae0b221f468c968c9efa1f381641f, eec0df4b0385464d616a4bbad840e6b2226c4c02, 8ea17b18e7dce0425e4cfd78bb3c33588a711510, bbc7435d0f38ddde2d9c7086601dbc3b37a7d972, ce79b130402c52e8b0b4fed18ce72d4e5b2acb9c, 27e48ff59c17f48f973108c9a4f8f1c64716cf32, 71569569a1fc6472f7268427eeea8f615d02f6b9, a7ee3710cfb3fa8e28ab0c70d9de6a75a29afc3f, ff8a52de8f4df432484019631fbc2d3ba812bff8, dc09a66b1eac5d54a5785f921ec2fe05ddb8cc7a, 511c4df9d33572735418c83f1d1ac65df0e0f3d8, 41acbb6f973a8915f764556189718d85099e32f7, 61c04113ddf6311ea0abd3cbc23d6d1d185b0023, 6d4a997774bdfbfbe7e2879abcec4f0e17af45b1, 2d765ecfd8b6d88234636ab4b75dc6b612f854b8, 44a6e2bab1a61d190bac618883b4bda5da1d39e8, c917f45330744b181e86bb6ee723692b1a2fdd3d, 5c8799954863482b5a0ee66034fec5042291c949, 994e320b56f171a9097f8ea44013c7e4995e382c</sup>
-   **deps**: update node.js to f496dba (#784) [#784](https://github.com/kitten-science/kitten-scientists/pull/784) (15c602057fef191173187c59a1c1c574f1d5b863)
-   **deps**: update node.js to f7354aa (af65198cc39a63839746891a562998d3b7669f34)
    <sup>1 similar commit not listed: 43c327100d2e9b491eb52bf0274aad27441db8b4</sup>
-   **deps**: update node.js to v20.11.0 [#462](https://github.com/kitten-science/kitten-scientists/pull/462) (00114665f92a45912105dd6266771cdc65af8c12)
    <sup>24 similar commits not listed: 8542f6060fa5e9d6baf1efa5f2f0e27183a3e2ee, ea7a973742bea2a42345530d3262f1898b3a1b34, 8c899bcbdf463fddd62bdca5a3861852a2ea3b25, c5ac8c9c874c21c9ae3ad3775b704449a050e7f8, 88018b70176c0e55daed98050da08bf85d79246c, 48c0ba29d3e60780acb8b216b6f9cc1a32c2a4c0, 0c8ebaa4c2d9735515b07733f66b470f89c19e77, ec80103a14b35cb6e9230ec79b59f2dfaf903022, 4ed5fb24a8a9a6eb86dbc9068b962470b3c6de43, b78edcb413a25afcbb4bcee280be6f386abb38b5, 07c67e602df9b56780a75d0c62a12fb85be34f28, 50adce272584c8e21aef2d85bc7a028b60e398da, f57095ca3932330d60776ec3a2ea84bd76c143e3, 5de4075407f86dd5c91805adae5519f6a5c1744c, c1f78faf0449fe4ed428a7ec3bfd48731d2db406, 01d4641e427a5aeb5e77a7bdbcbdf0c0de63dfbf, 479574360a6a95b370777d295b85c10c86017537, 3279d65456c858edbad34076957fdb58b5dd8c6e, d669b455c72762101004638f494d111b24864a7f, 72bf200371ab7abde22ea2a2b27cea117d37f43b, 215d3bcf59a29255d01b64ed067eb0059e28a6cb, 7b73ec3a156a2f0570f94617057579d9e77a6032, 216f5d708262ecce594d14dcb0f27b709a45a521, 33bb3975d4bfa54c0d33c701a43facffffcae94f</sup>
-   **deps**: update oliversalzburg/action-automatic-semantic-releases action to v0.0.12 [#562](https://github.com/kitten-science/kitten-scientists/pull/562) (f941688af6dd2bfe61a104ca5694ba52ccf2b8eb)
    <sup>23 similar commits not listed: da33e0e6a92f4703669717bb55df62a9d88650b6, 95f6b95f1acc31e679ad909b156ed3beab73d164, fe218eca5c8b2d10bab9ee43b0831cdd6f7d6a10, 59853f91c3cef5845137a3949f60e19a0304edde, d9d85a3b3bbc82fb50306801549ac56d1afd6ef5, 088b53a143e1413c6f28788cc6f964daeafb64cf, a70472fab91d57f59439a7afa05aea3af0b6fb8a, f2d908bc28dbba91ec4c55f5b057121b12ff5201, 1da840c5783bc7371e79cfe9ae60c8b66aa7cd9e, 0c84080ef73661237d6013b622cfdc350529b527, 54bfd0f0f7b9eaa5e03453ef6ced1ec7c5d4df1f, 0c12b3043c850c4f093674a9cbb3a2d6874ece5f, 22431fc1475ef07e8a65a112044c99a95c1a795b, 0402e30d789596e801e2feb22b192a5cf11c5b2e, 27bae885fbe5fa38419fa25eedbcbb6aaae2bba4, 13af7a0347ef04e19fb683bcb687e98ff4f7786b, 3a8aa3c34012159b07babe2f58e1e038e47beffe, dc1805ed7e3da24ce8582845624a2ff50647d93e, 76ec877a4d434cbc7cb0ce0c498c47724482c6d9, 21b7d17a48b34bfdf13b4f04a6ec868fad92a766, 44a0851e8913d13c14da705452e8ca951fe998d2, 4d08ce64419e4b5028d32c955c00d45c97b18469, 656860ced4ca253cab510ac72ae124552588398d</sup>
-   **deps**: update oliversalzburg/action-commit-validator action to v0.0.10 [#572](https://github.com/kitten-science/kitten-scientists/pull/572) (e5ebd2ddb92cf3dc987502128336be99b184a65b)
    <sup>3 similar commits not listed: bd06f6ce905ddb1fc0176d421eee8676402b14d1, 87fa5f5c9604bc99c2e42c728086d780340fa4e2, 7e81088ce0f4a62d4ba1b0708d16c39b4666ccde</sup>
-   **deps**: update oliversalzburg/action-commit-validator action to v1 [#837](https://github.com/kitten-science/kitten-scientists/pull/837) (67f189ebef1ca5611713ad5f06c019a3430561db)
-   **deps**: update oliversalzburg/action-label-manager action to v0.0.12 [#552](https://github.com/kitten-science/kitten-scientists/pull/552) (1835b35532037a68bf10e2ae26538d45c122f532)
    <sup>4 similar commits not listed: a0f89da00e577519ac1a858abd6bd0945ea42c24, 2eaff7ce3fb25694bca61044c7c28c3b5b4b3c28, 36c506f574e23d0792e4806bf7ee558f07fd3637, fe99b5ddef4db4d414601cb9820d5db8f1b63fae</sup>
-   **deps**: update oliversalzburg/action-label-manager action to v1 [#838](https://github.com/kitten-science/kitten-scientists/pull/838) (5a3ef7964315963f048ec559b4dadd8ec5eec9a9)
-   **deps**: update prettier [#466](https://github.com/kitten-science/kitten-scientists/pull/466) (f44bffe19e37e33b034ee547681e86a4b1545d4e)
-   **deps**: update yarn to v4.1.0 [#474](https://github.com/kitten-science/kitten-scientists/pull/474) (91349cbaedb0a093eb1252817718b512ad900fbb)
    <sup>10 similar commits not listed: a1afd1e59d24f1d2792d76af6373af27370d80b0, bef12b22f07066aced77e1b1e6edc8cfc20c7fd4, 0f55f797eed9cfa8ce472ca93101e8bb04abf09a, ae137a8f94d3e7f80ff34f5f2572c4c91f2a94e8, 100de609d4c6e81487ef0e098cc89d21a65616f2, 6c0746679657e46dadda93c40cf1298fd1f8f21d, 0fc01a380db84e0a81b18eec7734c96f9271cc60, fc50cce0f9b1a252c9f91982f92e99fbcf1e4f88, a9cfe73be26f4b83303200b30c67f665081899d2, 4830c16743a2f0f779fed10734f76cb2b5efa639</sup>
-   **deps**: Upgrade to ESLint@9 [#581](https://github.com/kitten-science/kitten-scientists/pull/581) (7b6fa5293de8b217a1175f8c5c5cc9c822b5e59e)
</details>

## Commits without convention (2/+1 unlisted)

-   Revert "chore(deps): update eslint to v9.15.0 (#791)" (6e072167d9d28814840773452d8e521bb291a935)
-   Update Crowdin configuration file (8f5fd3a938a1162daedf135293e163fba99d07ef)
    <sup>1 similar commit not listed: efc0e4c7920e41429770b0141ac8682bdcc19dab</sup>

# v2.0.0-beta.8

## Notable Changes

-   Kitten Scientists now has a new home at <https://kitten-science.com>.
-   You should now see upgrade notifications in the game log, when new KS versions are available.
-   There is now rudimentary support for Kitten Scientists to be loaded into Kittens Game Mobile. Stay tuned for future development.
-   The foundation for Setting Profiles has been established.
    We now have a way to express KS configurations in external markup files. This concept is going to be expanded in future releases to allow sharing of KS settings.
-   KS can now automatically gather catnip.
-   We can now upgrade warehouses to spaceports.
-   All KG internal log messages can now be hidden from the log; allowing you full control over the log through only KS filters. This is especially helpful in auto-reset setups.
-   KS now `export`s its code as a JS module, which can then be used in other projects. This will allow us to expand the KS functionality universe into completely new projects.

This release also includes a lot more minor changes, but it mostly lays the foundation for settings profiles, which will start to play a more major role in upcoming releases.

## Features

-   Use `podman` instead of `docker` for development ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/89a052c9ede211123dd22dfcb822c3a08f06a595))
-   Update to new kittensgame location ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/727d64720dbab1d29c7f15a96fa6957d06776642))
-   Use global `game` export, `gamePage` is deprecated. ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/6286fd86ab64984da7cea7029cca1c9fd0cd84ff))
-   **ui**: Allow injecting into options page ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/c6e8813f5e049d5a5866be4605abb9cb1604017c))
-   Provide inital set of state schemas [#416](https://github.com/kitten-science/kitten-scientists/pull/416) ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/3f141937e572cd0698382598aeb9a5c61d515ca0))
-   **core**: Fully define state baseline schema ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/91523855f42cd19ea7cb7471096f0ac18eb01742))
-   **core**: Add absolute zero baseline [#417](https://github.com/kitten-science/kitten-scientists/pull/417) ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/6f639c28a7e10988774a1f28b71ef8f45a27840b))
-   **core**: Implement settings profile resolver ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/ffa8d7053ff71f1cf12249a8389919b468949235))
-   Validate fetched data [#421](https://github.com/kitten-science/kitten-scientists/pull/421) ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/0e5360509df783de6b827ec4bc6b1a047ffad2e0))
-   Move release info to kitten-science.com ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/a7686c3fcd7a5ab63148f0014f0f36866c93980e))
-   **devcontainer**: Auto-reload on file change ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/1ac762a512479f0945ef6c89671972b5b8f57bd6))
-   **core**: Allow users to load `data:` URLs ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/41ce7b665bb795fd28bc798205b98524331d0291))
-   **core**: Mark exported states as profiles ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/0f7d34785c0b5047e4071b05ce2c3f80ee060653))
-   **ui**: State mangement is stable ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/2b7823047dbab3b7632e4e3a95b39e2ff0dafaf1))
-   Set `updateURL` to stable URL ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/0ebcd3b84501e2e776dcfeda4f5812e3e1f223eb))
-   Optimize import [#441](https://github.com/kitten-science/kitten-scientists/pull/441) ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/572bae5e0b7894dd46179bb50cf9fe77990be61c))
-   **ui**: Show upgrade info in game log ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/0ae6f360cee4837c6093d01f2c2e45b277cefa4a))
-   **bonfire**: Gather catnip ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/91e1ef7e532af69e35011e60140599ea77ce1247))
-   **bonfire**: Upgrade warehouses to spaceports [#445](https://github.com/kitten-science/kitten-scientists/pull/445) ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/458d0f395c6163474ac2abad70c79ffde30ad4d4))
-   **ui**: Filter all KG log entries ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/bd33d7ed0e4e32b6acea9a98a38a046bfec14cac))
-   **api**: Export KS internals ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/b3bbe9739200aee3bb52fb45dd59674b61663c83))
-   KS snapshot analyzer ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/1fef750baf94253f7748c1d699dd6290073c6173))

## Bug Fixes

-   **deps**: update dependency globby to v13 [#374](https://github.com/kitten-science/kitten-scientists/pull/374) ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/12f240a6e3b1ea7b4b9cf7f9e9ca8c68f714d3e5))
-   Import statement [#374](https://github.com/kitten-science/kitten-scientists/pull/374) ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/3830ec40155de8919eee2ca46102c05987856d65))
-   **deps**: update dependency conventional-changelog-angular to v7 [#373](https://github.com/kitten-science/kitten-scientists/pull/373) ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/024117c78d4b1cfe8f3611624759d8a521adc808))
-   No longer aligned with module API [#373](https://github.com/kitten-science/kitten-scientists/pull/373) ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/c0dba3b907aadbb9d7533121bd370812601b7345))
-   Invalid script location ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/aaa5ec04b057a0622a083ef31c5e97d78fb4da3e))
-   Options are not awaited ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/909d85cc8299785a8e830707b39a5c4df8156b32))
-   Read file as UTF8 ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/4b3e1208773622a04c8cd77f7cdfe8e83d3ccf08))
-   **deps**: update dependency yaml to v2.3.4 [#391](https://github.com/kitten-science/kitten-scientists/pull/391) ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/40ec920a2118a7afd9a92c7e3a8c911c44a8f2ff))
-   **deps**: update dependency @oliversalzburg/js-utils to v0.0.7 [#397](https://github.com/kitten-science/kitten-scientists/pull/397) ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/20ead0cd387fa0feaabc44f2b697887b3f73713a))
-   Import paths [#397](https://github.com/kitten-science/kitten-scientists/pull/397) ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/11fc74b89926bd400fdbc699509c25b9d3214480))
-   **deps**: update dependency @oliversalzburg/js-utils to v0.0.13 [#399](https://github.com/kitten-science/kitten-scientists/pull/399) ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/8eca26e8efa0add5d52f97a3f4d6050975669ca6))
-   **deps**: update dependency globby to v14 [#400](https://github.com/kitten-science/kitten-scientists/pull/400) ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/297a578bff3412312899d86b24f609fd1d68009a))
-   **trade**: Season selection is ignored [#410](https://github.com/kitten-science/kitten-scientists/pull/410) ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/fcf194743684622924a1eb52ee7e87e1623bd181))
-   **deps**: update dependency @oliversalzburg/js-utils to v0.0.18 [#401](https://github.com/kitten-science/kitten-scientists/pull/401) ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/2397ee0c2c320308cf373de6a2be86c097585ca9))
-   **religion**: Unicorns are sacrificed too slowly [#411](https://github.com/kitten-science/kitten-scientists/pull/411) ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/b7a54b0298972dbd21e6feb1178da0274487b4f8))
-   **ui**: Handle missing UI injection point ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/46b526255c36f15bced6565283ce7eae973484d5))
-   **core**: Inconsistent engine state after savegame load ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/b2e074b5777eef435acfbb3c76da4e47cbd9a273))
-   **ui**: Unsafe game page detection ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/379d8c7389887f90574805ccbbeae5aa3cf32be5))
-   **time**: Unavailable features crash KS ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/f156d5b5d7f61cc9e194d30dec6ff05422939c99))
-   **deps**: update dependency @oliversalzburg/js-utils to v0.0.20 [#412](https://github.com/kitten-science/kitten-scientists/pull/412) ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/f51ecd3ecdfb2326c9829d6da8d5d7889098b7ee))
-   Import paths [#412](https://github.com/kitten-science/kitten-scientists/pull/412) ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/607c40306a4891d53557f73ffca52b538eb7fb5e))
-   Use new public URLs ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/f8d24bcaaf43e319c831927507790e91513216d4))
-   **deps**: update dependency @oliversalzburg/js-utils to v0.0.23 [#420](https://github.com/kitten-science/kitten-scientists/pull/420) ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/a81dee02d37a246303a00cd6aaaf5d302b35fe94))
-   **core**: State merging order invalid ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/80b52ef844e3b423c76d1085f19d2420d78a9792))
-   Switched preset file names ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/66f74419141514facd445aac89ec60582096ec42))
-   **workshop**: Consume is always applied ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/a0f01623d67479ad6b8b48857f6054f36af6229c))
-   Root script called in foreach ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/f6acb858e03cd2f29fa9f7efe73ab6c6d395594d))
-   Typo in update URL ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/bab93bf85aa7d46c3c28e8b9f93720016b6a1501))
-   **deps**: update dependency @oliversalzburg/js-utils to v0.0.24 [#428](https://github.com/kitten-science/kitten-scientists/pull/428) ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/f19d248a15b7885989288a0a529539f65c64ec5f))
-   **time**: Cryochamber repairs ignore resource control [#413](https://github.com/kitten-science/kitten-scientists/pull/413) ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/af37656ae2fcdee96dc878101758630f720d8c1e))
-   **deps**: update dependency date-fns to v3.0.5 [#446](https://github.com/kitten-science/kitten-scientists/pull/446) ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/44d4b91daaa1e9a8242c27242eb0ee16e6ebe812))
-   **deps**: update dependency date-fns to v3.0.6 [#450](https://github.com/kitten-science/kitten-scientists/pull/450) ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/abba43d9234d7dff41c35056fbd4d34cedf81418))
-   Schema URL in snapshots ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/3830b0105d3a2145a31c1c3ba8618f5c6a39de78))

## Documentation

-   Remove custom mkdocs-material ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/45cd494c70c409ca9c2079d5bc39288fd658e2c3))
-   Add CHANGELOG ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/8f31c2ccf14e93ddea5cd8e83a51b04c7ce961ae))
-   Add SR ASAP preset ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/d9c68209d56fc45638610de56b1c0acf0de9397a))
-   Stable URLs ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/1302ccf52f881c688b64730a5789ce90629a011e))
-   Use official site ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/f5b95c59d63d590122d8f7e17f6a0607cf8b09be))
-   What is Kitten Engineers? ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/db54c46915849f8e10d76d38f7d627d49deff47a))
-   **installation**: Clean up URLs ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/fd05a7b0c134ab2b4e766db7d13d42004f6f02de))
-   **time**: Add time section ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/aea1bbbd55703f449a2c962d1e7626f369850626))
-   Update repository scripts ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/13c1151cfeb00dae094e459c2c3c296d1c9b4378))

## Styles

-   Require `prettier` code style checks to pass during lint ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/88ecb9ab410e50090861e4b9f0b035cefb2be4db))
-   Fix code style ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/88e6db372b51d99f9c6c9481939e729c82722e4f))
-   Fix prettier complaints ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/7fe1a393bb168347101c073d13ef3545e54ee35b))

## Code Refactoring

-   Use common tooling from external library ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/82ea3fe5933f8a793f0c2cdc66d7fdcec7c429a2))
-   Clean up existing state management code [#416](https://github.com/kitten-science/kitten-scientists/pull/416) ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/7933d81571898cb1a1f8107cb3a0631b17c135aa))
-   **core**: Move state loaders parts upstream ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/88854534b6b2fbdb4df46ea7daf97e4d2db5a113))
-   Use `working-draft` schema version ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/7ba9bbd73717ce696d09da1f09eab32e5c0f80b1))
-   Switch IDs to public schema store ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/c163ee4277bb78b40a0b732dc60885eca0c99a19))
-   Inline sub-schemas ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/0459c7f1c36739c298171d51806fc7d103122f7e))
-   **ui**: Explainers now enforce i18n ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/04de271de163366dfd63cf44cf1dc1064ca50360))

## Continuous Integration

-   Try using internal release action ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/49eb041342e190d15b845d33774433a9e3ed56b9))
-   Move remaining pipelines to internal release action ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/0921699e95c6d02a1e8f6f60c8248805b5ce5c15))
-   Test all branches ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/10305e4015cdb0d6771c99b0e433a09ccb94e3e7))
-   Use shared configuration preset for renovate ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/435af1454901bf9701ad00cee3b8f754da9d331c))
-   Maintain pipeline NodeJS version ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/eaa4074527f823ed7a989f4a2977f38f4d68edc8))
-   Looking for release-info bug ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/b19ea5370869cee26309536a2daf5550ccc27212))
-   Create stable public paths ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/58fe50808aa159727d6fbd0918db365f9944a765))
-   Try to upload to KS website ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/52c85dacb5c03469c43a7b36ba6538b61e7017db))
-   Fix ARN ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/5e544dab50145d174f26b813d79af69e84cf2042))
-   Fix caching ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/ecfe4252aa520761f962b560e757872781a47a6a))
-   Set schema content type ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/4bd94af1a19f70af69c84f2feb2c52df29ce2dc3))
-   Move website deployment ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/fce21f8a9ac8805d29fd5dda8a4f6755bab7bdcc))
-   Update release info on push ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/aa6b15a88ef7fb48c3395e87663adc7a075d40e2))
-   Update release info after release ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/ac6a8ce2cf09ac9835f56bfec2eec46e748e52ab))
-   Change website origin ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/d2770de671d76ebeb0950c31ddb9fd33fa32b5cc))
-   Allow easier action invocation ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/a36ad9e2e0dac520170e2478a12be490a111a583))
-   Fix unpinned OS ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/5947617a0381d5807c8390a21559a6b2b30dc842))
-   Only check PR commits ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/598952b42e3c71966d2c5d2d020d9e5673ef25a7))

## Chores

-   **deps**: update squidfunk/mkdocs-material docker digest to 772e14e [#382](https://github.com/kitten-science/kitten-scientists/pull/382) ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/7c6f18368225c9d4e21cc3fac847b129ff4f0a37))
-   **deps**: update yarn to v4.0.1 [#384](https://github.com/kitten-science/kitten-scientists/pull/384) ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/7bd46c553ae0ce8cc8c2058250ca2f20be81af3a))
-   **deps**: lock file maintenance [#385](https://github.com/kitten-science/kitten-scientists/pull/385) ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/17dfb4c4bdae62a8e1634b9d24f2d58695cec40d))
-   **deps**: update typescript-eslint monorepo to v6.9.1 [#386](https://github.com/kitten-science/kitten-scientists/pull/386) ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/5879c38fab7aa214b86082e6b0a92c7dbde6a3d1))
-   **deps**: update dependency @types/node to v20.8.10 [#387](https://github.com/kitten-science/kitten-scientists/pull/387) ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/97476a978955a0fa361cc0b15cf1ec883fe6a49b))
-   **deps**: pin node.js to 5f21943 [#388](https://github.com/kitten-science/kitten-scientists/pull/388) ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/1bb3ec0b9e425c819816281ccf7329b5a128b7d1))
-   **deps**: update dependency eslint to v8.53.0 ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/0e2fa0e50bf905f99cf9c0af15c324de9a619967))
-   **deps**: lock file maintenance [#396](https://github.com/kitten-science/kitten-scientists/pull/396) ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/7b04e9013d9d6747e9958425c34cfa331cefef7f))
-   **deps**: update squidfunk/mkdocs-material docker digest to f486dc9 [#395](https://github.com/kitten-science/kitten-scientists/pull/395) ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/b46a655f3f1c744b8f176e2a1f966b48e1759142))
-   **deps**: update eslint to v6.10.0 ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/775837f621afcce8ca9d23b04559193cc35f2250))
-   **deps**: update dependency @types/jquery to v3.5.26 ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/462f1c2beb87947ec934e827ae360fe71736244b))
-   **deps**: update dependency @types/babel\_\_core to v7.20.4 ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/b8966e7a9fd11e917d9dd928c9eedf2f3062e5df))
-   **deps**: update dependency @types/conventional-commits-parser to v3.0.6 ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/b5eb77f4b36cabcea08b31dd026c897e99a89382))
-   **deps**: update dependency @types/dojo to v1.9.47 ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/d0f12282d85ed9e79bfa7ce758590f4f1cc7fcb5))
-   **deps**: update dependency @types/eslint to v8.44.7 ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/881719019c2a9b0d91faa727f9b69acadb351524))
-   **deps**: update node.js to v20.9.0 [#398](https://github.com/kitten-science/kitten-scientists/pull/398) ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/cb512b3a9739f51dd0ae68959df543b97082f85b))
-   **deps**: update dependency @types/mocha to v10.0.4 ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/68c69653a98e5ec59a48334a0bed809233346735))
-   Update editorconfig ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/310d0d3e8f99e16d991c49b1777a169255af8b33))
-   Consistent line endings ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/ccfedbac6d2b33817fd45ad4fd2b80d8574fd3be))
-   **deps**: update dependency @octokit/types to v12.2.0 ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/f2b88d5674bee395f79addba3930680a0322c9b9))
-   **deps**: update dependency @types/chai to v4.3.10 ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/5adc119994db4a23f2057a07bebb5cfda2098be0))
-   **deps**: update dependency @types/jquery to v3.5.27 ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/6812c77cb22818be7f26144fa83fe667426c9d05))
-   **deps**: update dependency @types/semver to v7.5.5 ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/545a2fc2b2fec070ed985a1cceae8ea159291c7d))
-   **deps**: update dependency @types/node to v20.9.0 ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/3076b203355db49105de1846e098324e1b95b4a5))
-   **deps**: update babel monorepo to v7.23.3 ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/ea0996e7082cef80f53ebff949e0d3b4d1487d71))
-   **deps**: update dependency @babel/eslint-parser to v7.23.3 ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/3de2ab765f31af7d652d445fa0a6081c9b0b4457))
-   **deps**: update dependency prettier-plugin-organize-imports to v3.2.4 ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/a28ecef9f0f714fed0b789016e6a5738bc3a1e44))
-   **deps**: update dependency eslint-plugin-jsdoc to v46.9.0 ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/e9846e06942fe6e066ad1186bc6e0c8127786a99))
-   **deps**: update dependency lint-staged to v15.1.0 ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/07c1e4ec9f5675712e5541d7cbbf178eb93fb261))
-   **deps**: update dependency @octokit/types to v12.3.0 ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/f290e5686ac7ac8410671217fb68e644d84dd129))
-   **deps**: lock file maintenance [#402](https://github.com/kitten-science/kitten-scientists/pull/402) ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/7900b483d9c47a46330c44ef976f830034789dc5))
-   **deps**: lock file maintenance [#403](https://github.com/kitten-science/kitten-scientists/pull/403) ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/88eaed1ec0c72d29631ab78b24c03e0d0889a197))
-   **deps**: update dependency prettier to v3.1.0 [#404](https://github.com/kitten-science/kitten-scientists/pull/404) ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/d178195c066cd310482b2a6d8225eba3a0669b39))
-   **deps**: update eslint to v6.11.0 [#405](https://github.com/kitten-science/kitten-scientists/pull/405) ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/42fbeadefa662c8c85487f572ed1075174c318d9))
-   Fix lint ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/9c927f8bbd864faaa545351844130a09c33c3979))
-   **deps**: update yarn to v4.0.2 [#406](https://github.com/kitten-science/kitten-scientists/pull/406) ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/9cd354c9e46645a0f0d88bb0cc08d70f883adf02))
-   **deps**: update github/codeql-action digest to 689fdc5 [#407](https://github.com/kitten-science/kitten-scientists/pull/407) ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/b6905274ea459fc0dde439a19555e5394155eb4b))
-   **deps**: update github/codeql-action digest to 66b90a5 [#408](https://github.com/kitten-science/kitten-scientists/pull/408) ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/6dd3a9796f2ae7b125084c9f93707499b6441e81))
-   **deps**: update dependency vite to v5 ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/97334b5d2cd441e52d5bc6d94de2b933437a975c))
-   **deps**: update dependency @types/node to v20.9.1 ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/e90eea3872a8e463a9cffa83903854dca2821f60))
-   **deps**: update dependency eslint to v8.54.0 ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/341db77f58ff3f4144655277b5ee75067f58d4a4))
-   **deps**: update squidfunk/mkdocs-material docker digest to 2c57e4d [#409](https://github.com/kitten-science/kitten-scientists/pull/409) ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/c1ac1f77d9d7e92226be0afc610cbbd4f24b2751))
-   **deps**: update dependency @types/node to v20.9.2 ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/0ab913bc496661ec6fa225a9e0f00d7d9d5f40fc))
-   **deps**: lock file maintenance [#415](https://github.com/kitten-science/kitten-scientists/pull/415) ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/7e8f66b0c1c7c011e9180cc5d7187778b1ca260c))
-   **deps**: update dependency typescript to v5.3.2 ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/0b5974c4b74e034229b50e1e4aef9830f959dcac))
-   **deps**: update eslint to v6.12.0 ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/05a42ccf7104c074e5ec8f823f5f167e80f22d06))
-   **deps**: update dependency @types/babel\_\_core to v7.20.5 ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/e4db0689b6f383e4409b91a0b5d092c27fc6e473))
-   **deps**: update dependency @types/chai to v4.3.11 ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/99ff34c7f61da8dd8d0891b93069a8fde17ba858))
-   **deps**: update dependency @types/dojo to v1.9.48 ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/af24654bbd9180a021584b4cf9a257179f270073))
-   **deps**: update dependency @types/jquery to v3.5.28 ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/aa588dae3cbc6eb354834c0e81d78f888d389f50))
-   **deps**: update dependency @types/mocha to v10.0.5 ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/62546f4c4a16d9e78cde652ed4d55c0dc75ff168))
-   **deps**: update dependency @types/node to v20.9.3 ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/afbfe8473af19daabf03b8fd0d084cf44ada8d7e))
-   **deps**: update dependency @types/semver to v7.5.6 ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/d266f304ea7c4d4e6e3a458051444e2b09258e95))
-   **deps**: update dependency node-scripts-docs to v1.0.1 ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/1e33a9d68609cb44bf155e9872a15449bf8080da))
-   **deps**: update dependency vite to v5.0.2 ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/e30ddccc684138c20804513d908be327ff53fc9b))
-   **deps**: update dependency @types/jquery to v3.5.29 ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/8ef19271360030dddc117a37b3c0871d2868fb48))
-   **deps**: update dependency @types/mocha to v10.0.6 ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/bddfa99cafe43bde2350cf6047ad5c9a2658c826))
-   **deps**: update dependency @types/node to v20.9.4 ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/5f210050011a9c48593102dc445b2b1476b66b09))
-   **deps**: update node.js to 146bbe4 [#419](https://github.com/kitten-science/kitten-scientists/pull/419) ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/88794c396b7f783142eec8d6e32e3f3037937f2f))
-   **deps**: update node.js to v20.10.0 [#424](https://github.com/kitten-science/kitten-scientists/pull/424) ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/d4af10711f555cc56bba6081af102a4ef5fe6e3e))
-   **deps**: update node.js to v20.10.0 [#423](https://github.com/kitten-science/kitten-scientists/pull/423) ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/bb9a175879c72edd4ab57eaa7e7aaa2186830056))
-   **deps**: update github/codeql-action digest to 407ffaf [#422](https://github.com/kitten-science/kitten-scientists/pull/422) ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/f57a5f77d5aa51f92a4959a0ed7bea988ffc3b2d))
-   **deps**: update dependency @types/node to v20.9.5 ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/e0a746fe87d51914a2a383cbe6941e5c234b1732))
-   **deps**: update dependency @types/web to v0.0.120 ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/6055bf71ba0a05aab2518af0fe3d413def08108f))
-   **deps**: update dependency @types/node to v20.10.0 ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/c43ff7f295ef4b066b00738e090679ae90aa1120))
-   **deps**: update dependency @types/web to v0.0.121 ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/3f63348d896d66460653c49bb9c8067b9a478020))
-   **deps**: update dependency @types/web to v0.0.122 ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/0b5a9f23f7ed4b37696f6f33c3e356bc5c71fe41))
-   **deps**: lock file maintenance [#425](https://github.com/kitten-science/kitten-scientists/pull/425) ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/3ac914b96eb8f9aeddfd17b094b7986e8954083e))
-   **deps**: update eslint to v6.13.0 ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/9aff23c965a4941a96c62abbb24d75a8c41afd27))
-   **deps**: update dependency @types/web to v0.0.123 ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/bcebe8f889880653dbf132d07759a9e3aada4d0e))
-   **deps**: update eslint to v6.13.1 ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/118364e8f4ac19cdf6a29744e9e519b88c92281c))
-   **deps**: update dependency vite to v5.0.3 ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/ecf764330001aa532c533d65230bb6c2d7795769))
-   **deps**: update dependency @babel/core to v7.23.5 ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/eabafc496ec051a4408167393873ec6cca823bd3))
-   **deps**: update dependency vite to v5.0.4 ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/124df7f637e2d238be7cab27b8616855824e9e28))
-   **deps**: update dependency @types/node to v20.10.1 ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/791f72d49b032e9aabebb90d10dee6ba51217596))
-   **deps**: update dependency @types/eslint to v8.44.8 ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/852d42d2407951d6a80810f23bf26724324b1f78))
-   **deps**: update dependency @types/node to v20.10.2 ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/a4bcb1d7a4acacaaeebfe3b2a2fa8063ad123a35))
-   **deps**: update dependency eslint to v8.55.0 ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/def6debfeff0077f6f325c76017cfb24a5c50b88))
-   **deps**: update dependency @types/web to v0.0.124 ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/6bc3ccf0e0aeeffb509865a338db2515a733ed55))
-   **deps**: update dependency @types/web to v0.0.125 ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/3fa94aa50de33fc00ecde2ab0835fbc1e7d780e7))
-   **deps**: update dependency @types/node to v20.10.3 ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/4c52e0476eda2c26399fd9b6246883f614798e43))
-   **deps**: update dependency lint-staged to v15.2.0 ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/66149162cd0bab1f76bdca879fbbb495856b76a7))
-   **deps**: lock file maintenance [#426](https://github.com/kitten-science/kitten-scientists/pull/426) ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/51208a971572d24b6c3d3e8289befde1722dd0a9))
-   **deps**: update dependency vite to v5.0.5 ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/dd784d773287b3cf0a9e0d7c764ef4d837142df1))
-   **deps**: update eslint to v6.13.2 ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/6237ba5dbccad3a35ea162369a259dafe7589dee))
-   **deps**: update dependency @octokit/types to v12.4.0 ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/3c8d9e1fa0c66bc6808fc057a260877865a1aa17))
-   Cleanup ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/49a0e8e5b1203c9c829964247a100ad1e8017525))
-   Add script shortcuts ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/ec32ad914974528b3c2a0ef72734c89288826956))
-   **deps**: update dependency vite to v5.0.6 ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/71ff0d9363b9e3e908cb2137bea2f5ddea722c4b))
-   **deps**: update actions/setup-python action to v5 [#429](https://github.com/kitten-science/kitten-scientists/pull/429) ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/0a08d710688b57c8051eb396cbb61339ef3a05f2))
-   **deps**: update dependency typescript to v5.3.3 ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/283f4e2647a693175b342fca0eb256634936e8fa))
-   **deps**: update dependency @types/web to v0.0.130 ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/ec5b4f8496f9eee747ba7667e423e6dbbc472787))
-   Update engineers label ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/42dd1f8a045dfca1cb238e0caffa858dd2af00d9))
-   **i18n**: Update translations ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/e9912dad29a3a6f51296ad3115edf48817491686))
-   **deps**: update github/codeql-action digest to 012739e [#449](https://github.com/kitten-science/kitten-scientists/pull/449) ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/98f5b7a9944ef33e5d46e246292607a7284bb695))
-   **i18n**: Update translations ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/97b01fcc4d9b098d9d1fae9abd9f506b62257c3c))
-   **deps**: lock file maintenance [#452](https://github.com/kitten-science/kitten-scientists/pull/452) ([renovate[bot]](https://github.com/kitten-science/kitten-scientists/commit/c33c839d6996ee420aed7e9f9f98524c3f5fd7ef))

## Commits

-   6dd2644: New translations en.json (French) (Oliver Salzburg) [#393](https://github.com/kitten-science/kitten-scientists/pull/393)
-   54c0d82: Add UserScript API for testing (Oliver Salzburg) [#421](https://github.com/kitten-science/kitten-scientists/pull/421)
-   c64edac: New translations en.json (Romanian) (Oliver Salzburg) [#427](https://github.com/kitten-science/kitten-scientists/pull/427)
-   6108d38: New translations en.json (French) (Oliver Salzburg) [#427](https://github.com/kitten-science/kitten-scientists/pull/427)
-   7b8e711: New translations en.json (Spanish) (Oliver Salzburg) [#427](https://github.com/kitten-science/kitten-scientists/pull/427)
-   5cd03bd: New translations en.json (Afrikaans) (Oliver Salzburg) [#427](https://github.com/kitten-science/kitten-scientists/pull/427)
-   337cc94: New translations en.json (Arabic) (Oliver Salzburg) [#427](https://github.com/kitten-science/kitten-scientists/pull/427)
-   22f241c: New translations en.json (Catalan) (Oliver Salzburg) [#427](https://github.com/kitten-science/kitten-scientists/pull/427)
-   2935f9a: New translations en.json (Czech) (Oliver Salzburg) [#427](https://github.com/kitten-science/kitten-scientists/pull/427)
-   625ae5c: New translations en.json (Danish) (Oliver Salzburg) [#427](https://github.com/kitten-science/kitten-scientists/pull/427)
-   be063b5: New translations en.json (German) (Oliver Salzburg) [#427](https://github.com/kitten-science/kitten-scientists/pull/427)
-   cb02ad7: New translations en.json (Greek) (Oliver Salzburg) [#427](https://github.com/kitten-science/kitten-scientists/pull/427)
-   9218c67: New translations en.json (Finnish) (Oliver Salzburg) [#427](https://github.com/kitten-science/kitten-scientists/pull/427)
-   5f0eab2: New translations en.json (Hebrew) (Oliver Salzburg) [#427](https://github.com/kitten-science/kitten-scientists/pull/427)
-   0a07b1a: New translations en.json (Hungarian) (Oliver Salzburg) [#427](https://github.com/kitten-science/kitten-scientists/pull/427)
-   6572cc4: New translations en.json (Italian) (Oliver Salzburg) [#427](https://github.com/kitten-science/kitten-scientists/pull/427)
-   0d2e61d: New translations en.json (Japanese) (Oliver Salzburg) [#427](https://github.com/kitten-science/kitten-scientists/pull/427)
-   791e7d5: New translations en.json (Korean) (Oliver Salzburg) [#427](https://github.com/kitten-science/kitten-scientists/pull/427)
-   4ae8bab: New translations en.json (Dutch) (Oliver Salzburg) [#427](https://github.com/kitten-science/kitten-scientists/pull/427)
-   9ca903b: New translations en.json (Norwegian) (Oliver Salzburg) [#427](https://github.com/kitten-science/kitten-scientists/pull/427)
-   0becf99: New translations en.json (Polish) (Oliver Salzburg) [#427](https://github.com/kitten-science/kitten-scientists/pull/427)
-   4009b8c: New translations en.json (Portuguese) (Oliver Salzburg) [#427](https://github.com/kitten-science/kitten-scientists/pull/427)
-   edf61bc: New translations en.json (Russian) (Oliver Salzburg) [#427](https://github.com/kitten-science/kitten-scientists/pull/427)
-   d08c422: New translations en.json (Serbian (Cyrillic)) (Oliver Salzburg) [#427](https://github.com/kitten-science/kitten-scientists/pull/427)
-   a19950e: New translations en.json (Swedish) (Oliver Salzburg) [#427](https://github.com/kitten-science/kitten-scientists/pull/427)
-   b716ad2: New translations en.json (Turkish) (Oliver Salzburg) [#427](https://github.com/kitten-science/kitten-scientists/pull/427)
-   fba3b36: New translations en.json (Ukrainian) (Oliver Salzburg) [#427](https://github.com/kitten-science/kitten-scientists/pull/427)
-   e51a036: New translations en.json (Chinese Simplified) (Oliver Salzburg) [#427](https://github.com/kitten-science/kitten-scientists/pull/427)
-   5cc36a3: New translations en.json (Vietnamese) (Oliver Salzburg) [#427](https://github.com/kitten-science/kitten-scientists/pull/427)
-   70297d9: New translations en.json (German) (Oliver Salzburg) [#427](https://github.com/kitten-science/kitten-scientists/pull/427)
-   b3f5aab: Update dependency @types/node to v20.10.4 (renovate[bot])
-   b41556d: Update dependency vite to v5.0.7 (renovate[bot])
-   37e5eaa: Update dependency @types/web to v0.0.126 (renovate[bot])
-   d8456d0: Update github/codeql-action digest to c0d1daa (renovate[bot]) [#430](https://github.com/kitten-science/kitten-scientists/pull/430)
-   3b2837a: Update dependency @oliversalzburg/js-utils to v0.0.26 (renovate[bot]) [#431](https://github.com/kitten-science/kitten-scientists/pull/431)
-   a8e366b: Update dependency prettier to v3.1.1 (renovate[bot])
-   8456820: Update dependency @oliversalzburg/js-utils to v0.0.27 (renovate[bot]) [#433](https://github.com/kitten-science/kitten-scientists/pull/433)
-   592228c: Lock file maintenance (renovate[bot]) [#434](https://github.com/kitten-science/kitten-scientists/pull/434)
-   748119f: Update dependency @types/web to v0.0.127 (renovate[bot])
-   89ff2e6: Update dependency @babel/core to v7.23.6 (renovate[bot])
-   af2ead2: Update eslint to v6.14.0 (renovate[bot])
-   7cf56eb: Update dependency vite to v5.0.8 (renovate[bot])
-   591c291: Update github/codeql-action digest to 305f654 (renovate[bot]) [#436](https://github.com/kitten-science/kitten-scientists/pull/436)
-   6e24232: Update dependency @types/eslint to v8.44.9 (renovate[bot])
-   9c17bd4: Update dependency eslint-plugin-jsdoc to v46.9.1 (renovate[bot])
-   9a46aeb: Update github/codeql-action action to v3 (renovate[bot]) [#437](https://github.com/kitten-science/kitten-scientists/pull/437)
-   2237502: Update dependency vite to v5.0.9 (renovate[bot])
-   c7d3055: Update dependency vite to v5.0.10 (renovate[bot])
-   a85eba1: Update dependency eslint to v8.56.0 (renovate[bot])
-   ad87d31: Update dependency @types/web to v0.0.128 (renovate[bot])
-   2435afb: Lock file maintenance (renovate[bot]) [#440](https://github.com/kitten-science/kitten-scientists/pull/440)
-   c89fe88: Update dependency @types/node to v20.10.5 (renovate[bot])
-   7112bc2: Update eslint to v6.15.0 (renovate[bot])
-   5f16359: Update dependency json-schema-to-ts to v2.12.0 (renovate[bot])
-   9ea21df: Update Node.js to c454cb8 (renovate[bot]) [#443](https://github.com/kitten-science/kitten-scientists/pull/443)
-   a218cb4: Update dependency @types/eslint to v8.56.0 (renovate[bot])
-   4e580bc: Update dependency @types/web to v0.0.129 (renovate[bot])
-   e0d0df9: Update Node.js to 8d0f16f (renovate[bot]) [#444](https://github.com/kitten-science/kitten-scientists/pull/444)
-   9eebbd9: Update actions/setup-node digest to b39b52d (renovate[bot]) [#442](https://github.com/kitten-science/kitten-scientists/pull/442)
-   a582a36: Update dependency json-schema-to-ts to v3 (renovate[bot])
-   bb11357: Update dependency date-fns to v3 (renovate[bot]) [#441](https://github.com/kitten-science/kitten-scientists/pull/441)

# v2.0.0-beta.7

## Notable Changes

-   Several issues in the **Reset Timeline** automation have been fixed. Please review [the documentation](https://kitten-science.github.io/kitten-scientists/sections/time-control/#time-skip) to make sure the new behavior aligns with your expectations.
-   You can now require certain upgrades to have been researched before a reset is triggered.
-   It's now possible to ignore the overheating of your chrono heat capacity, if you have enough TC to spare and want to progress faster.
-   You can now _update_ a stored state in the State Management, by clicking the "Sync" icon next to it.
-   If you have multiple free kittens, they will now all be assigned in the same frame.

## Features

-   **core**: Update stored states ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/d5053edbec3b849f54e591a38e1640d5af00b2bb))
-   **religion**: Sacrifice unicorns for tears [#181](https://github.com/kitten-science/kitten-scientists/pull/181) ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/8dbb160939777f04360961b07983cb528c92c61a))
-   **core**: Allow users to override the loader timeout ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/94e347ee90601e140a82363f549b68015e6e387b))
-   **time**: Adjust default reset automation settings [#186](https://github.com/kitten-science/kitten-scientists/pull/186) ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/aab01ded23bd21e53bdbe8188ad272931cd03cdd))
-   **time**: Require upgrades to be researched for reset [#186](https://github.com/kitten-science/kitten-scientists/pull/186) ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/bb8784dd9072a088c764976e040f1e8e0f6f07bc))
-   **time**: Reduce cancellation options [#186](https://github.com/kitten-science/kitten-scientists/pull/186) ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/5c6c34dc1cd317dbece31b2125f7629b1c2726bf))
-   **village**: Assign all free kittens in a single frame [#186](https://github.com/kitten-science/kitten-scientists/pull/186) ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/944bbf7fc4e0133fd0932158bed5c8e094e16ab5))
-   **time**: Allow ignoring overheating for time skip [#189](https://github.com/kitten-science/kitten-scientists/pull/189) ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/a4d01b6e50c77d66485919aa7ee65bd53917523a))

## Bug Fixes

-   **core**: Invalid version check ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/806bbd96412e5cb6d458264cc0853a175b618a42))
-   **i18n**: Assume English language in code checks ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/a53553b0594e6af0a734d7a5712bb6bfbe6e75bc))
-   **time**: Excessive, false log messages for cryochamber fixes ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/05b2ca2c9d012a21aed69597552017ba63d28672))
-   **village**: Remove excessive debug messages ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/7a112777ea1be5887e16d028ef8aeb0fa2d1ef01))
-   **ui**: Some UI elements are not rendered correctly ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/273866f5201f3da99e9342016a8abbeabab4e966))
-   **time**: Staged buildings not handled correctly [#186](https://github.com/kitten-science/kitten-scientists/pull/186) ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/c139c4b1439f9a52bc742c7167ec35eb23324f70))
-   **time**: Invalid button reference access [#186](https://github.com/kitten-science/kitten-scientists/pull/186) ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/c197177fd371766d06fafa8a795585c00a911270))
-   **ui**: Missing temporal press in reset settings [#186](https://github.com/kitten-science/kitten-scientists/pull/186) ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/78e3d83a579578e90e5160670613ddccf5a59456))
-   **core**: Stopping the engine isn't reliable [#186](https://github.com/kitten-science/kitten-scientists/pull/186) ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/f4a588028b13f7562e4d0c2d531c7ee3d997f4f1))
-   **time**: Cancelling auto-reset not reliable [#186](https://github.com/kitten-science/kitten-scientists/pull/186) ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/2854cfe79d0a1b1843e5f375d3a20180d95bc314))
-   **time**: Use proper resource name in checklist [#186](https://github.com/kitten-science/kitten-scientists/pull/186) ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/141a3ba6e1abb85443ee785149e3b32862920aa2))

## Documentation

-   Clarify release variants ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/cf38511a84bc53d343bdd2fa54a438cceb949791))
-   Clarify consume rate ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/e9d229adbc2159077b3607869a321c7fa093e5f3))
-   Point to up-to-date KS version [#178](https://github.com/kitten-science/kitten-scientists/pull/178) ([Zirak](https://github.com/kitten-science/kitten-scientists/commit/7a773a55249c40c9a319c74cc06ebad8cb62d790))
-   Add log filters ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/6cdc70ba1744ba861583a2c9c77b4c6e41828b2c))
-   Fix typo ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/1adc3e4d3678961099d2f32e56759a89242cb478))
-   Fix more typos ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/8a0f2c24bfc8bbe74c6980b1b1f150795441d97b))
-   Request loader method ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/6e124c2baa662c405492004f6781f1f646fd1744))
-   More useful content in bug report template ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/390088999b37f6acb9ce91f0200dcff9fd9c047d))
-   Add more labels ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/bd0ee80cae5511749fde3a3255db425b5909c136))
-   Fix userscript name not updated ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/43ccd7408f15b58fd835259aebc9621f5ec9e323))
-   Fix script links ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/8ab1a40fc9bb4dcd865565c30ac921d2618bbc2e))
-   Add Time Control [#186](https://github.com/kitten-science/kitten-scientists/pull/186) ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/c9c147308eaec42b1db5560a8d072f840b50e13a))

## Code Refactoring

-   Rename `userscript` to `kitten-scientists` [#184](https://github.com/kitten-science/kitten-scientists/pull/184) ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/fa5fe7fa1f0ad549530a2450f2e0f4d116cb2d34))

## Continuous Integration

-   Fix emojis always being a problem 😂 ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/811543e91c53a2abde915dd67e28ce9a29a68a78))

## Chores

-   Bump version ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/18e42dca3011cea4d7d72c769a5892b33c01856e))
-   **i18n**: Introduce new string literal ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/3f2d05a55326757a86311a2a81ef87c2cf628dbb))
-   **i18n**: New Crowdin updates (#188) [#188](https://github.com/kitten-science/kitten-scientists/pull/188) ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/6a40345e1255709bd74bcd67d3b0ee04c5270991))

## Commits

-   817f6c6: New translations en.json (Chinese Simplified) (Oliver Salzburg) [#180](https://github.com/kitten-science/kitten-scientists/pull/180)
-   98fe1e3: New translations en.json (Romanian) (Oliver Salzburg) [#180](https://github.com/kitten-science/kitten-scientists/pull/180)
-   1c5fc8a: New translations en.json (French) (Oliver Salzburg) [#180](https://github.com/kitten-science/kitten-scientists/pull/180)
-   27c7bf7: New translations en.json (Spanish) (Oliver Salzburg) [#180](https://github.com/kitten-science/kitten-scientists/pull/180)
-   6955f12: New translations en.json (Afrikaans) (Oliver Salzburg) [#180](https://github.com/kitten-science/kitten-scientists/pull/180)
-   642a9b6: New translations en.json (Arabic) (Oliver Salzburg) [#180](https://github.com/kitten-science/kitten-scientists/pull/180)
-   b998279: New translations en.json (Catalan) (Oliver Salzburg) [#180](https://github.com/kitten-science/kitten-scientists/pull/180)
-   d82469e: New translations en.json (Czech) (Oliver Salzburg) [#180](https://github.com/kitten-science/kitten-scientists/pull/180)
-   38dbb03: New translations en.json (Danish) (Oliver Salzburg) [#180](https://github.com/kitten-science/kitten-scientists/pull/180)
-   c09ac53: New translations en.json (German) (Oliver Salzburg) [#180](https://github.com/kitten-science/kitten-scientists/pull/180)
-   782d57c: New translations en.json (Greek) (Oliver Salzburg) [#180](https://github.com/kitten-science/kitten-scientists/pull/180)
-   bc2379a: New translations en.json (Finnish) (Oliver Salzburg) [#180](https://github.com/kitten-science/kitten-scientists/pull/180)
-   8b594c6: New translations en.json (Hebrew) (Oliver Salzburg) [#180](https://github.com/kitten-science/kitten-scientists/pull/180)
-   40e4732: New translations en.json (Hungarian) (Oliver Salzburg) [#180](https://github.com/kitten-science/kitten-scientists/pull/180)
-   385aeb2: New translations en.json (Italian) (Oliver Salzburg) [#180](https://github.com/kitten-science/kitten-scientists/pull/180)
-   4285808: New translations en.json (Japanese) (Oliver Salzburg) [#180](https://github.com/kitten-science/kitten-scientists/pull/180)
-   c5688d5: New translations en.json (Korean) (Oliver Salzburg) [#180](https://github.com/kitten-science/kitten-scientists/pull/180)
-   14c22d7: New translations en.json (Dutch) (Oliver Salzburg) [#180](https://github.com/kitten-science/kitten-scientists/pull/180)
-   06c8319: New translations en.json (Norwegian) (Oliver Salzburg) [#180](https://github.com/kitten-science/kitten-scientists/pull/180)
-   0ee287e: New translations en.json (Polish) (Oliver Salzburg) [#180](https://github.com/kitten-science/kitten-scientists/pull/180)
-   c9b5b3c: New translations en.json (Portuguese) (Oliver Salzburg) [#180](https://github.com/kitten-science/kitten-scientists/pull/180)
-   aad6a9d: New translations en.json (Russian) (Oliver Salzburg) [#180](https://github.com/kitten-science/kitten-scientists/pull/180)
-   f139ba2: New translations en.json (Serbian (Cyrillic)) (Oliver Salzburg) [#180](https://github.com/kitten-science/kitten-scientists/pull/180)
-   5b5e421: New translations en.json (Swedish) (Oliver Salzburg) [#180](https://github.com/kitten-science/kitten-scientists/pull/180)
-   0b91af6: New translations en.json (Turkish) (Oliver Salzburg) [#180](https://github.com/kitten-science/kitten-scientists/pull/180)
-   2404b75: New translations en.json (Ukrainian) (Oliver Salzburg) [#180](https://github.com/kitten-science/kitten-scientists/pull/180)
-   af49584: New translations en.json (Vietnamese) (Oliver Salzburg) [#180](https://github.com/kitten-science/kitten-scientists/pull/180)
-   New Crowdin updates (#182) [#182](https://github.com/kitten-science/kitten-scientists/pull/182) ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/c77916f3197255ef98cebe98051ca14c684870f6))

# v2.0.0-beta.6

## Notable Changes

Let's face it, beta5 crafting was a horrible step backwards, because it wasn't tested enough before release :(

This time around, there's been plenty of testing, and crafting should really, really behave as documented, and should be rather intuitive. Hopefully...

In case you were ever trying to use the _consume rate_ on resources, you might have noticed it to be inconsistent. It was previously only applied to _some_ resources, regardless of you settings in the UI. The behavior should now be as documented, and should apply to all resources.

Thanks to a new contributor on Crowdin, we now have a more complete Chinese translation :)

If you could help translate Kitten Scientists into another language you know, that would be really cool: https://crowdin.com/project/kitten-scientists

## Features

-   **workshop**: New crafting approach [#157](https://github.com/kitten-science/kitten-scientists/pull/157) ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/5115aefc70d3e7b7c8a66acc96b9569ed11b66c2))

## Bug Fixes

-   **religion**: Only try crafting BLS up to max [#158](https://github.com/kitten-science/kitten-scientists/pull/158) ([Zirak](https://github.com/kitten-science/kitten-scientists/commit/40ec6ca8bc1f0abcd07d4b9c3340d01aaf18adf7))
-   **workshop**: Consume rate not applied consistently ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/c51cc5bd298590a22ffb3f7c83cb45f3a1288210))
-   **workshop**: Excessive ship building ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/e1d96e2e55f8986b4b5bcc727f6fd35aa300d3d3))

## Documentation

-   Add home page ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/d6b95bc8e11dfa8b0fd35e8a3fcd3df44f3aa596))
-   Add placeholder to empty sections ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/b98643663821c56657ace6c943bf96242b0203ab))
-   Document language setting ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/e09e16736681ae4e26bde149aae4bdbc15bad701))
-   Add Space ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/39f3af2d0b344645437d3ea9cd9aded2150a1845))

## Styles

-   Cleanup ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/bab36ebd0960b458d947339881e02135cd459ef5))

## Chores

-   Bump version ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/b185f9cd1756fea73f6286265340f3f06fbaba77))
-   **deps-dev**: Bump vite from 4.1.1 to 4.1.4 [#173](https://github.com/kitten-science/kitten-scientists/pull/173) ([dependabot[bot]](https://github.com/kitten-science/kitten-scientists/commit/77d36d067794225c15b20a1ae7e7bcaa327b9eec))
-   **deps-dev**: Bump @babel/core from 7.20.12 to 7.21.0 [#172](https://github.com/kitten-science/kitten-scientists/pull/172) ([dependabot[bot]](https://github.com/kitten-science/kitten-scientists/commit/11399214a519183118dbc9be229b492c1d4b9ed6))
-   **deps-dev**: Bump eslint-plugin-jsdoc from 39.7.5 to 40.0.0 [#171](https://github.com/kitten-science/kitten-scientists/pull/171) ([dependabot[bot]](https://github.com/kitten-science/kitten-scientists/commit/3337608fe474811ab5cdfdaaf688d6689ed0855b))
-   **deps-dev**: Bump @types/node from 18.11.18 to 18.14.2 [#170](https://github.com/kitten-science/kitten-scientists/pull/170) ([dependabot[bot]](https://github.com/kitten-science/kitten-scientists/commit/ff9c825003db774928baeaabb27055b9e3867a7a))
-   **deps-dev**: Bump selenium-webdriver from 4.8.0 to 4.8.1 [#169](https://github.com/kitten-science/kitten-scientists/pull/169) ([dependabot[bot]](https://github.com/kitten-science/kitten-scientists/commit/bd1db600b3b083a34eed31706f3c753dfcff3fb3))
-   **deps-dev**: Bump json-schema-to-ts from 2.6.2 to 2.7.2 [#166](https://github.com/kitten-science/kitten-scientists/pull/166) ([dependabot[bot]](https://github.com/kitten-science/kitten-scientists/commit/9e1a436a1090d61ab6b1c05f3ca459e2dcf1db4b))
-   **deps-dev**: Bump eslint and @types/eslint [#167](https://github.com/kitten-science/kitten-scientists/pull/167) ([dependabot[bot]](https://github.com/kitten-science/kitten-scientists/commit/39d4459894c1227146d7e766e15a1239666aa480))
-   **deps-dev**: Bump @types/web from 0.0.90 to 0.0.93 [#168](https://github.com/kitten-science/kitten-scientists/pull/168) ([dependabot[bot]](https://github.com/kitten-science/kitten-scientists/commit/c91d76dcc59880af83ca9cb0508ce6649914b38d))
-   **deps-dev**: Bump prettier from 2.8.3 to 2.8.4 [#165](https://github.com/kitten-science/kitten-scientists/pull/165) ([dependabot[bot]](https://github.com/kitten-science/kitten-scientists/commit/ef9b7a0b4467b882dc2c21e656176920b0002e9d))
-   **deps-dev**: Bump @typescript-eslint/eslint-plugin [#161](https://github.com/kitten-science/kitten-scientists/pull/161) ([dependabot[bot]](https://github.com/kitten-science/kitten-scientists/commit/9838ce82194bc70cd50da37f07bd279c05ec9cc8))
-   **deps-dev**: Bump lint-staged from 13.1.0 to 13.1.2 [#164](https://github.com/kitten-science/kitten-scientists/pull/164) ([dependabot[bot]](https://github.com/kitten-science/kitten-scientists/commit/f222a1c2f5e89f327647c38f71dfe3b8f3491e38))
-   **deps-dev**: Bump chromedriver from 109.0.0 to 110.0.0 [#162](https://github.com/kitten-science/kitten-scientists/pull/162) ([dependabot[bot]](https://github.com/kitten-science/kitten-scientists/commit/63c24b053062254ff669d01e5195219b64ed6c41))
-   **deps**: Bump actions/checkout from 2 to 3 [#160](https://github.com/kitten-science/kitten-scientists/pull/160) ([dependabot[bot]](https://github.com/kitten-science/kitten-scientists/commit/aabe40f642f1c69594d677c2a331e598a19d58b2))
-   Update ESLint parser ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/c233bf55f945957f435e5d86191d6b9aaa4153a9))

## Commits

-   06c4d6d: New translations en.json (Chinese Simplified) (Oliver Salzburg)
-   df3f06c: New translations en.json (Chinese Simplified) (Oliver Salzburg)

# v2.0.0-beta.5

## Notable Changes

One of the highlights of the release is the **Internals** panel. It finally gives convenient access to KS internal `interval`, which defines how often KS automates the game. Users have been wanting to adjust this for years and it's not finally a fully supported setting.

A lot of internals have been adjusted to no longer use hard-coded requirements. Previously, a lot of crafts and buildings had a single resource defined as their requirements to be built, and the trigger would only apply to that single resource. Now, actions should be performed based on _every_ resource that is required for the automation, and the hard-coded values have been removed entirely.

Otherwise, there have been a bunch of bug fixes, [the documentation](https://kitten-science.github.io/kitten-scientists/) has been growing, and a lot of good additions have been made to the core to make future development even easier.

There is now also an update-checker in the code. This doesn't update KS yet, or even notify you. It is currently being tested and hopefully will offer you convenient update paths in a future version.

## Features

-   **workshop**: Simplify resource crafting [#125](https://github.com/kitten-science/kitten-scientists/pull/125) ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/c9a19a2623af8727be8873d6b241a7d564b08c62))
-   **core**: Remove hardcoded build requirements [#126](https://github.com/kitten-science/kitten-scientists/pull/126) ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/2e84cb352339530fa67d78bba237825894209ea6))
-   **container**: Allow non-default branch selection ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/f728d8d275d98beda416a36893a292b36e55ef4e))
-   **core**: Remove redundant state fields [#129](https://github.com/kitten-science/kitten-scientists/pull/129) ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/9cafbb9843e6e498da7a8ec53b1e203325b3b181))
-   **ui**: Allow refresh callbacks ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/227172bc09a7351fa17073a0234d64fdafc53802))
-   **core**: Check for new versions on startup [#127](https://github.com/kitten-science/kitten-scientists/pull/127) ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/c538cad736a7ff73e62180f615f7549dcf86ba48))
-   **ui**: Add a panel for KS internals [#152](https://github.com/kitten-science/kitten-scientists/pull/152) ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/d005c1699ebe396a8a4cafa4e681537e86e07921))
-   **i18n**: Support any language [#153](https://github.com/kitten-science/kitten-scientists/pull/153) ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/2ed6606c6b50691064c7b484b8f130bc2c2c2f5b))

## Bug Fixes

-   **time**: Void cost ignored when time skipping ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/4655d5b9c40e23e60598633a18d3e14a931b15f9))
-   **time**: Options not restored ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/9b90e3bb65369890da48edd9a73180c32ddc7db7))
-   **ui**: Resources not sorted ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/a51ced0cd4436189c2fbad01fd640205595f44cc))
-   **container**: Improper cwd handling ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/ec708ff76c56732a0eb637337301b2da56f2ea8e))
-   **time**: Missing Temporal Press setting ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/e52074e8313ffb515e86e832907f921bcaa95c1c))
-   **ui**: Empty string as input not handled ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/a2ec36fd72dae58046665ac61f003ed415f5cfc9))
-   **ui**: Handle more empty text inputs ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/bc03770677f1fff3d084d999c30f26f20a9b7398))
-   **time**: Cryochambers are fixed for free [#150](https://github.com/kitten-science/kitten-scientists/pull/150) ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/917d4fbd0a9dcf2b56a449c471462999819a2edb))
-   **time**: Invalid time skips ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/9036a562c0ad41f55cb0845a2e178cbfadca51f0))
-   **time**: Cryochambers are not built [#151](https://github.com/kitten-science/kitten-scientists/pull/151) ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/3b8f60b8f5ac009e23f3ec052814632b518fdaf0))

## Documentation

-   Mention GitHub release ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/e1dd9bcd4a0576ddf1de4719f8b2d1da080eefbf))
-   Add Resource Control ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/0fde6dcaa4e3595342ec1046e78aec2dcbf825ea))
-   Add Trade ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/5860c20fadf2abdfa444876a98f6a305013965c1))
-   Add religion ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/cb86fa532b59d93ce1196829b4288b29cc4a7155))

## Styles

-   Fix some typos in code ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/c0b6e8802affc9247bfd49557dd8e29fc784b383))

## Code Refactoring

-   **bonfire**: Remove obsolete requirements ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/6c11005e0f3f3ef2b8bf6e4c84f844d59cbf0c7d))
-   **core**: Clean up scripts ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/7cc3b97d983f0daf0505e504220de02d4b42494b))
-   **ui**: Consistently accept options for construction ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/98b93d8b81310d584606220b930ed2ca7079a854))
-   Split different build outputs ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/c13585e0c4fc51cd7040aa8468792821a6230e26))
-   **ui**: Consistently handle child components [#153](https://github.com/kitten-science/kitten-scientists/pull/153) ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/edaabe84a894d4ae33132fa5c011d50f390c484f))

## Continuous Integration

-   Allow `deps` scopes ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/275ca9406d993221717db8dc515909c960e0ab57))
-   Fix label manager ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/38916a67381da03ac5ecf80cb78cf4397032e786))
-   Build full project ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/48f4a37e903854fc0588f9d66089a650a21eb935))
-   Fix invalid filename ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/d7fe93fd1d4e5839c7b82464d9fc9d6f52893436))
-   Support `i18n` scope ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/e91a744c672cf64d76cbc5ac30ba910ace1b605c))

## Chores

-   Bump version ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/1748edf633d8c4d3dc6e9601b552efe169cf48ef))
-   **deps-dev**: Bump @types/web from 0.0.86 to 0.0.90 [#145](https://github.com/kitten-science/kitten-scientists/pull/145) ([dependabot[bot]](https://github.com/kitten-science/kitten-scientists/commit/ca5a2301b060641a432e600f48fc3759a0a0e4fa))
-   **deps**: Bump http-cache-semantics from 4.1.0 to 4.1.1 [#147](https://github.com/kitten-science/kitten-scientists/pull/147) ([dependabot[bot]](https://github.com/kitten-science/kitten-scientists/commit/46674300468ce91df553dac888ac220a046a335b))
-   **deps-dev**: Bump eslint and @types/eslint [#148](https://github.com/kitten-science/kitten-scientists/pull/148) ([dependabot[bot]](https://github.com/kitten-science/kitten-scientists/commit/90a2cae37cbcb594f2460d5df3ff03861f059cc6))
-   **deps-dev**: Bump typescript from 4.9.4 to 4.9.5 [#146](https://github.com/kitten-science/kitten-scientists/pull/146) ([dependabot[bot]](https://github.com/kitten-science/kitten-scientists/commit/6c790e5f1e9ce9d527939f3863432d6fc9b7e25b))
-   **deps-dev**: Bump prettier from 2.8.1 to 2.8.3 [#140](https://github.com/kitten-science/kitten-scientists/pull/140) ([dependabot[bot]](https://github.com/kitten-science/kitten-scientists/commit/fd0f0057a4fc42b0b96a562302b4f198e7c47c2f))
-   **deps-dev**: Bump chromedriver from 108.0.0 to 109.0.0 [#141](https://github.com/kitten-science/kitten-scientists/pull/141) ([dependabot[bot]](https://github.com/kitten-science/kitten-scientists/commit/11c27a941e231854e358372e58f50964ca3d69f8))
-   **deps-dev**: Bump selenium-webdriver from 4.7.1 to 4.8.0 ([dependabot[bot]](https://github.com/kitten-science/kitten-scientists/commit/165c3839daab765f65dbaf34c17f848d91c5f52b))
-   **deps-dev**: Bump prettier-plugin-organize-imports [#139](https://github.com/kitten-science/kitten-scientists/pull/139) ([dependabot[bot]](https://github.com/kitten-science/kitten-scientists/commit/3bbfab34b864dd992975497090326f6d7fd66546))
-   **deps-dev**: Bump eslint-plugin-jsdoc from 39.6.4 to 39.7.5 [#143](https://github.com/kitten-science/kitten-scientists/pull/143) ([dependabot[bot]](https://github.com/kitten-science/kitten-scientists/commit/62945127039dd851e2cee739a87163145f0a722f))
-   **deps-dev**: Bump @babel/core and @types/babel\_\_core [#137](https://github.com/kitten-science/kitten-scientists/pull/137) ([dependabot[bot]](https://github.com/kitten-science/kitten-scientists/commit/e872bacb28ad2cd3422aa65199cf2ead24781622))
-   **deps-dev**: Bump vite from 4.0.3 to 4.1.1 [#149](https://github.com/kitten-science/kitten-scientists/pull/149) ([dependabot[bot]](https://github.com/kitten-science/kitten-scientists/commit/8d2542e4ce81dc581a5c69a0df9908c24a1ea57a))
-   **deps-dev**: Bump @typescript-eslint/parser from 5.47.1 to 5.50.0 [#138](https://github.com/kitten-science/kitten-scientists/pull/138) ([dependabot[bot]](https://github.com/kitten-science/kitten-scientists/commit/c069bea5a5e918179abe887fa11dbb1186a233f6))
-   **deps**: Bump tslib from 2.4.1 to 2.5.0 [#142](https://github.com/kitten-science/kitten-scientists/pull/142) ([dependabot[bot]](https://github.com/kitten-science/kitten-scientists/commit/018071dfc83c47a8400cf8ea258cd45bb97c563b))
-   **deps-dev**: Bump @typescript-eslint/eslint-plugin [#136](https://github.com/kitten-science/kitten-scientists/pull/136) ([dependabot[bot]](https://github.com/kitten-science/kitten-scientists/commit/1c32a2e6689a8d86c4896e60df9b3cee88491dce))
-   **deps-dev**: Bump node-scripts-docs from 0.0.14 to 0.1.0 [#144](https://github.com/kitten-science/kitten-scientists/pull/144) ([dependabot[bot]](https://github.com/kitten-science/kitten-scientists/commit/5fbb59d6559d2c042757a9ac9ebbe6a76b9f1ce9))
-   Remove savegame ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/dd0649a17bc7a63e9031e313f4275e52144cc523))
-   **i18n**: New translations en.json (Hebrew) (#154) [#154](https://github.com/kitten-science/kitten-scientists/pull/154) ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/85db026a08a48e9e3c7436fcdb56aaef37f8fc5e))

# v2.0.0-beta.4

## Notable Changes

Beta 4 mostly stabilizes and cleans up Beta 3. It fixes some bugs, removes a lot of obsolete code, and prepares for a more complete user experience. We now also finally support **all** resources in the game.

This release removes a lot of code for features that are no longer supported:

-   Legacy options imports. **Importing options from KS 1.5 is no longer supported. If you need to do this in the future, load them with beta.3, and then upgrade KS.**
-   Development features to load savegames and settings as part of the build process have been removed. The new state management is far more intuitive.

We have a full translation into Hebrew now, but it can't be used yet, as we're tied to the language of the game, and KG does not support Hebrew. We will enable better language selection in a future update.

This release also puts a lot of pieces in place to enable better update flows in the future, especially for bookmarklet users.

## Breaking Changes

-   Remove legacy options import support ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/ff88dc75654115122b0aa85fa58224f9a705c393))

## Features

-   **i18n**: Hebrew language updates (#123) [#123](https://github.com/kitten-science/kitten-scientists/pull/123) ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/2be1e35f7a53ea29e5981c574f94e07dc43f80ac))
-   **core**: Retain meta behavior on state change ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/0118f1502087b3db37608bc148168e461f10b22f))
-   Enable Hebrew language ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/e2df54317bdc1cbabbc7eff3141dcf44278ac33f))
-   **core**: Remove support for development savegames ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/6378b02049d8259494fdeed24bf74276d6f6f784))
-   **core**: Remove obsolete `KS_SETTINGS` ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/b756e672d56892235cebb242fe439c6a34d1d7c8))
-   Remove legacy options import support ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/ff88dc75654115122b0aa85fa58224f9a705c393))
-   **core**: Add missing resources ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/66a04490bab19767118ce1c0d6f22df9b3481f2f))
-   **core**: Record release channel in script ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/8e662fc94d87f122d3bb2ec77f7969ebbbe87c6a))

## Bug Fixes

-   **religion**: Missing safety checks ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/ea98427f475d4769f8c7e3703c598ef0599c40fc))
-   **workshop**: Resources crafted without workshop ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/839896504df8f971c92a32984d9930df4ce2942d))

## Documentation

-   Update organization logo ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/b73c9306e3684d834b2880a3bb70a77870504f56))
-   Add icon to userscript ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/9cf6fc709a9644abe8a9fcf9c10b468d145289b2))
-   Add Village ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/4e2e3b089949cf168881326497dc86cd9e68162b))
-   Add Science ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/61828f3b76c0b8c2d61f59e935705746abd28259))
-   Add missing commit scope ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/4da91c2cb4ea1fc730eee2fa11740f2ff9dd297b))

## Code Refactoring

-   Distinct name for GitHub action workspaces ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/161ce858e18b2fb174466226139c84c5c23e2cdd))
-   **core**: Centralize version handling ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/9e7e181b96362ba6dd39e011821224f62ba0d69f))

## Continuous Integration

-   Several commit validation fixes ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/4dafa6076280f98494fc717ded2563bb3e6a7ab0))
-   Generate release info [#124](https://github.com/kitten-science/kitten-scientists/pull/124) ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/41afa3e9c043523bc21ba27c0a4ab770b3fc7a62))
-   Use publish date for release info ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/70726fadec2d6d38d2488cef391d6e2679b986d2))
-   Add missing version prefix on releases ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/1bff3088e101063081d274602c9fc674a5889001))
-   Extract version number from pre-releases ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/1bcc797074484dd37cd33381149d5e96f9f38590))
-   Allow `build` scope ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/bc7056ae66295f61c54053639d3f5f14bb78494f))

## Chores

-   Bump version ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/1c7ac7c4dfd6ef45d25d2c53ac6311e3b34309e6))
-   Update organization logo source file ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/91a5561e3bf687c145293e2a36378663225fbeb9))

# v2.0.0-beta.3

## Notable Changes

-   **State Management**
    You can now save and restore entire sets of KS settings easily, through an entirely new panel in KS. Please refer to <https://kitten-science.github.io/kitten-scientists/sections/state-management/> for a full documentation of this new feature.
-   **Full Internationalization Support**
    We can now translate KS into any language, so that it is properly translated, just like the game itself is. We also use Crowdin for the translation effort, just like the game itself. Please help out [translating KS](https://crowdin.com/project/kitten-scientists) if you can 😊
    For the time being, a **German** translation has been added to KS.
-   **Optimized Blackcoin Trading**
    Thanks to contributions my @acmihal, the blackcoin trading behavior should now be a lot more ideal by default. You can now configure the buying and selling thresholds for this automation, but he has also taken care to pick good, sane defaults, that should outperform the previous behavior. Thanks!

-   Religion
    You should also see a reworked Religion section that now offers more control over alicorns, tears, and TCs:
    ![image](https://user-images.githubusercontent.com/1658949/212490405-1e8c8b27-de98-4ef0-a5f7-0efa4659bfa9.png)

-   Documentation
    While still far from complete, [the documentation](https://kitten-science.github.io/kitten-scientists/sections/overview/) has been extended considerably since the last release. Please let us know if any part of the documentation is missing any information or needs to be improved ASAP, so that we can prioritize efforts.

-   Random Fact
    KS has more than 700 individual settings now.

## Features

-   **ui**: Add list tools to space missions ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/7f6ea1bb0a138b1e3836d7fd9648c45812a41faf))
-   **ui**: Allow more emphasis for hover ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/52dd6fc259faefda1cda3defa721f4d9a516e4de))
-   **religion**: Sacrifice alicorns automatically ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/8c85263cf6fe9c7f5e76a3ddbc2d1460dbc235b1))
-   **time**: Added kitten population as a criteria for autoreset [#116](https://github.com/kitten-science/kitten-scientists/pull/116) ([Andrew Mihal](https://github.com/kitten-science/kitten-scientists/commit/9ba104c0dd82658ee1afc822a1441d0cccf25631))
-   **state**: Add state management [#110](https://github.com/kitten-science/kitten-scientists/pull/110) ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/04c31ce7ca39df12452bc0b4c05be04501b735fe))
-   **i18n**: Support German language ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/be9702f41e1d6d79a3a892d17d0b682e671af630))
-   **bonfire**: Turn on magnetos ([Andrew Mihal](https://github.com/kitten-science/kitten-scientists/commit/8312463237be383c477a27574de9065ff4a1c074))
-   **trade**: Blackcoin trading buy/sell thresholds ([Andrew Mihal](https://github.com/kitten-science/kitten-scientists/commit/853ba01268fdcfe98739eef5a95313fc74834198))

## Bug Fixes

-   **ui**: Incomplete log filter UI refactor ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/cddfa68bc80bb98a87db5c93229878b4cb04db7d))
-   **village**: Promote kittens not persistent ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/c3b8693d8bcf293f410b584a4c7b8df6007754bc))
-   **religion**: Buildings locked in invalid state ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/540fc3a49967bac2025026b1ffc7cf4694d5fbef))
-   Missing alicorns settings entry ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/b6fa0141d5dfc81fb9d84cc6a12007ce3382cec5))
-   **village**: Make hunt trigger persistent [#115](https://github.com/kitten-science/kitten-scientists/pull/115) ([Andrew Mihal](https://github.com/kitten-science/kitten-scientists/commit/231ee4652e7d8818219a19414f6ca409df423387))
-   Missing `kittens` resource ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/78923f9db3b9ab0ce4270321257ab9588a649631))
-   Add missing BLS resource ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/ab43eba9e6dee812073ef3cdd31aee1cdb977077))
-   **i18n**: Unordered translation files ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/c43662411269852f3cfd1b96c9d7eebc5f87a52e))
-   **core**: Only use EN for literal validation ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/37e8f0172963d028231da3973e2d00bf0d6ddc84))

## Documentation

-   Fix `README` not updated ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/26a0991fe9dccfc7cfc0bcdabf6273b59d00c552))
-   Complete repository scripts reference ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/cf2e4bc3ff35a076f30b01d3815312732ae118c3))
-   Add Bonfire ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/c2ca8ea583d5b2745da2814c026248a10a3c67c8))
-   Build mkdocs-material locally ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/3fec8e8d97e00593b0aa7a476f3f750a68a826db))
-   Fix incomplete edit history ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/2062f6ae2f86be1126a817de1602cc6fade6cb94))
-   Add commit standards ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/a35a746838e091398e776308d128227ce891aefe))
-   Add contributing guide ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/171110b8782c8aae4083115c7eaabcd005f20bcc))
-   Trim down README ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/b4a0cc81b7569d79bce69811bc5b0741728014a9))
-   Pull request guidelines ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/b010f95cdbb4b5fbed20ba1bd43489bb2c127a0f))
-   Remove container info from README ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/6a83571c8bbdb47000c522cec98480ff5d3c7a48))
-   Point users directly to latest release ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/ba5a0be7f3d21bed8aad397903ed6d46fa987c67))
-   Add missing link ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/e5f29c3f50992f15580e4db3ced385e25daff285))
-   Point users to translation website ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/63a214f447ddc62cbc61f20d1302869cbed0b71d))
-   Clean up index ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/b69780b3651129f23d76c2e0ad22a4677fb78207))

## Code Refactoring

-   **core**: Bypass manager to load settings ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/6b8aad78797a62cbb3c59e5266fa2461c01d7eb2))
-   **ui**: More consistent component construction ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/f932d2cdc05989e40b4864069ed6a000e991f7dc))
-   **ui**: Move all icons to a central store ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/dceb59442e73518c7189fae2b39148fd17ff2e45))
-   **ui**: Improve nesting buttons in lists ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/e7b1f9263d611b2d4b2f18fb0284dd07dbcad58e))
-   **ui**: Migrate more components to options-based construction ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/9603601535efcdf2e830f32228fdddebebedba6b))
-   **i18n**: Split language files ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/35a0d68affb9638c1db8f4d03505ad3c76df30eb))

## Continuous Integration

-   Fix missing type-checks ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/3cf721134633602c9d94f039d378610a464c297c))
-   Validate commit messages in PRs [#121](https://github.com/kitten-science/kitten-scientists/pull/121) ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/df4972953d519330e0bc34b7c5558c2e758ab9b1))

## Chores

-   **i18n**: Remove some unused literals ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/c80efc69acc96a91a7a4103589bc5a0a6e5045fe))
-   **i18n**: New Crowdin updates (#120) [#120](https://github.com/kitten-science/kitten-scientists/pull/120) ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/82a3f77acaa7690cb5b7b255bfe225e2e01492c3))
-   **i18n**: New translations en.json (German) (#122) [#122](https://github.com/kitten-science/kitten-scientists/pull/122) ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/af166e89880b1a6b13474991b53dec4a308546aa))

# v2.0.0-beta.2

## Notable Changes

-   The UI has been drastically restructured and consolidated. It should feel a lot more consistent now.

## Features

-   **ui**: Generic text button component ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/f60d3afb8290c7db46394238b3d25bb6a59e1731))
-   **ui**: UI Iteration (#107) [#107](https://github.com/kitten-science/kitten-scientists/pull/107) ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/7240749b47e88cb0c8f1194556d23a7b7cf34682))
-   **village**: Fill farmer job first ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/b1c8e9feef86c487acba01628d4234ca6d29d749))
-   **religion**: Auto-refine tears and TCs [#108](https://github.com/kitten-science/kitten-scientists/pull/108) ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/0bc8a59c45b6a2b0d355b675e0be65fb81680f2c))
-   **core**: Use explicit controller types [#108](https://github.com/kitten-science/kitten-scientists/pull/108) ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/c3f824bacb7c0d6bcf2251829a0e304abac6adca))
-   **time**: Turn on Chrono Furnaces [#102](https://github.com/kitten-science/kitten-scientists/pull/102) ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/2cd466e4db9f630de62969327954485acc6e4329))
-   **ui**: Use regular label for Resource Control ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/a9554f4348b17d9f176e3567cc3245fd754ffafe))

## Bug Fixes

-   Compiler complaints about `setTimeout` ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/7be7404f4aac3e331eeac08f5f6941cd541d0b0b))
-   Compiler complaints about resources ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/24f1e282c1954cee25941e1fe31de3ff42119aa0))
-   **container**: Excessive browser caching ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/254e7753b1f582f17aeeb498330d02fc7d5f55ee))
-   **ui**: Layout issues with new `TextButton` ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/def9868635466bef9e614c1ea934803e5af5b08e))
-   **ui**: Excessive hover guides ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/b6cc621727db00b4f762805f2121409bd4ff5538))
-   **ui**: Don't attempt to inline floated elements ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/fa178d6606a60e449bcdcf71d2126bfd5f5436d1))
-   **container**: Cache-breaker not aggressive enough ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/246c4590df804125e30e9368567f09e2dd963066))
-   **ui**: DevPanel is hidden ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/0678cf979382643064f12b1bfc6127853060d6e0))
-   **ui**: Scrollbar overlays expando buttons ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/ce805d53f5ee411ae170494467e37e1459ffbacb))
-   Issue templates don't accept savegame file ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/7662be23aee0d7eb696225a964c6d0aec559821d))
-   **time**: Accelerate time goes below stock [#101](https://github.com/kitten-science/kitten-scientists/pull/101) ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/0c05f178e2d397fdee51179025b86d52ccfa0863))
-   **religion**: Settings sometimes stay locked ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/f7374de78205e5300c71d889a3eda12331c542c8))
-   **ui**: Wrong main section order after refactor ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/2f608413324d7230740462e8c439a72d649293d8))
-   **village**: Not all jobs/traits are assigned as leaders [#109](https://github.com/kitten-science/kitten-scientists/pull/109) ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/11504c4a3804e0a492f1a708c4e2c8bd53d6e33b))
-   **village**: Only farmers are assigned ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/6119838d43f781b9ae6d0e689d738a3c7c915824))

## Documentation

-   Add section overview ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/db17fad5ddc0c85488b93a158dcda3d0746a66fc))
-   Fix prettier messing up abbreviations ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/28a366291b03805a2fbdbed27c1891fbbe401cb2))
-   Fix typos ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/9abf07e21e2adf5a6c08b68ca2107cf2b18760a1))
-   Add installation page ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/6ce9e57baf5d09aa75a89cac638fd741e23b89dd))
-   **installation**: Fix typos ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/eb8830b7b770cf88233b1dc523ded91e58870ce0))
-   Add "copy to clipboard" for code ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/25e4724e3a51786891ecddfa3cfd23db224d1aac))
-   **installation**: Fix latest stable name ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/0c2fde0dd3bf47ccc5bfbb690bb2a3043ee29bb2))
-   Include development guide ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/929858f536eba0f06c921c117b2fa9a7102dfc95))
-   Remove BrowserStack badge ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/09a1f6051983946b713022fe53244875bf3b8d80))
-   **development**: Slightly more guidance ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/a4e0dbdb3c0fe9590f884a1ab12acf26301c55c3))
-   Integrate `node-scripts-docs` ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/d5806f383037fd8899132d85a64c0af5111d9895))
-   Build scripts docs in docs workspace ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/4871f387c7b5f0e065da89fe1d5311e524fe72ea))
-   **devcontainer**: Basic guidance ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/efd49975a8de3f3cab80ceddd19761b5cacf9974))

## Code Refactoring

-   **ui**: Use single panel implementation ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/a0622cabc07d76a9bc494974cf2527ad14ee662d))

## Continuous Integration

-   Try different paths for label-manager ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/17509be45195c9c1c081c98f387aaa9278c5975b))

## Chores

-   Prepare documentation ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/ff4792155a63c8dfdc9ccc426b965c5e63c329f5))
-   Bump version ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/235acea013d35f42ed2b91c7423853c35e6a207b))
-   **deps-dev**: Bump @types/web from 0.0.84 to 0.0.86 [#98](https://github.com/kitten-science/kitten-scientists/pull/98) ([dependabot[bot]](https://github.com/kitten-science/kitten-scientists/commit/86e3d54e57a3cc46a9f40ec69e9e30de9c6ae294))
-   **deps-dev**: Bump @babel/core from 7.20.5 to 7.20.7 [#88](https://github.com/kitten-science/kitten-scientists/pull/88) ([dependabot[bot]](https://github.com/kitten-science/kitten-scientists/commit/62ce3ba144dbf7215355f2d930abd84cb71f958e))
-   **deps-dev**: Bump @typescript-eslint/eslint-plugin [#97](https://github.com/kitten-science/kitten-scientists/pull/97) ([dependabot[bot]](https://github.com/kitten-science/kitten-scientists/commit/f8f8c628ffd31e9ac6ae6a4b362850f7ebee7aa2))
-   **deps-dev**: Bump prettier-package-json from 2.7.0 to 2.8.0 [#93](https://github.com/kitten-science/kitten-scientists/pull/93) ([dependabot[bot]](https://github.com/kitten-science/kitten-scientists/commit/f0c12ed63143d28a10e151b2073c51cc23f358c9))
-   **deps-dev**: Bump @types/prettier from 2.7.1 to 2.7.2 [#95](https://github.com/kitten-science/kitten-scientists/pull/95) ([dependabot[bot]](https://github.com/kitten-science/kitten-scientists/commit/e8a015e4d9e0924695778c55cf154c51e8c55d03))
-   **deps-dev**: Bump @types/jquery from 3.5.14 to 3.5.16 [#92](https://github.com/kitten-science/kitten-scientists/pull/92) ([dependabot[bot]](https://github.com/kitten-science/kitten-scientists/commit/09539ef149ddf6e0788c87ff2cd7686305d13506))
-   **deps-dev**: Bump @types/node from 18.11.15 to 18.11.18 [#96](https://github.com/kitten-science/kitten-scientists/pull/96) ([dependabot[bot]](https://github.com/kitten-science/kitten-scientists/commit/f11fc3bdf55043f0247a6076c46318b1e3bc3029))
-   **deps-dev**: Bump selenium-webdriver from 4.7.0 to 4.7.1 [#89](https://github.com/kitten-science/kitten-scientists/pull/89) ([dependabot[bot]](https://github.com/kitten-science/kitten-scientists/commit/34cb1749c70c02df01bc99ed9a205db86ffb8240))
-   **deps-dev**: Bump @typescript-eslint/parser from 5.46.1 to 5.47.1 [#91](https://github.com/kitten-science/kitten-scientists/pull/91) ([dependabot[bot]](https://github.com/kitten-science/kitten-scientists/commit/15020a3d3ed4a76887f6886beb508af9fe91b0ad))
-   **deps-dev**: Bump eslint from 8.29.0 to 8.31.0 [#87](https://github.com/kitten-science/kitten-scientists/pull/87) ([dependabot[bot]](https://github.com/kitten-science/kitten-scientists/commit/d5e722cf0799353beaac6320bbe7695f4404a81f))
-   **deps-dev**: Bump vite from 4.0.1 to 4.0.3 [#90](https://github.com/kitten-science/kitten-scientists/pull/90) ([dependabot[bot]](https://github.com/kitten-science/kitten-scientists/commit/6bf02f270f819edddf3ab8a76206b140737afc78))
-   **deps**: Bump json5 from 2.2.1 to 2.2.3 [#100](https://github.com/kitten-science/kitten-scientists/pull/100) ([dependabot[bot]](https://github.com/kitten-science/kitten-scientists/commit/d6bb2bf802e0d88206b2459c8224dacb8bd9212a))
-   **deps**: Bump yaml from 2.1.3 to 2.2.1 [#94](https://github.com/kitten-science/kitten-scientists/pull/94) ([dependabot[bot]](https://github.com/kitten-science/kitten-scientists/commit/c69a8e71fca45c7f28415cc2a914b51e40abd672))
-   **container**: Add rebuild script to bypass cache ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/10b2b38b7361ac72b7df5da5057b757195a7b27e))
-   Fix some spelling errors ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/05f945ce5974e0c3fcab656880ee5c220e40b1b8))
-   Update labels ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/b06a25cb267962cf54bfba471fd060515a4d525f))

# v2.0.0-beta.1

## Beta Phase begins

The code base and the userscript have stabilized enough to finally begin extending functionality. We'll also start working on the documentation now.

The end of the alpha development phase marks a milestone in the history of the development of Kitten Scientists v2. Refactoring the script into 100+ modules, from a single very old, plain JavaScript file with 1000s of lines of code, was a massive undertaking.

In the process, and in the following months, many long-standing issues have been fixed, and Kitten Scientists are now performing better than ever before.

## Features

-   **ui**: Enable integer handling on `SettingTriggerListItem` component ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/e28ce2c1b896ffe1595a60e8196b887f3caaf8a8))
-   **village**: Promote kittens ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/d9c6526e6e50d8b8906d209075521608531f47a6))

## Bug Fixes

-   **ui**: Unable to set bcoin trading trigger ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/59e491264a479c8d5fb6c25a2a0f401e9e0d90de))
-   **ui**: Integer prompt shows value fraction ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/011def5ae5a83e8c35818b689915acfcf11b560a))

## Tests

-   Fix unstable wipe step ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/aa4aeebe12162a6f2fd9b8394735b5a10d0f4219))

## Continuous Integration

-   Add missing permissions ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/f180283f2e58f27eaa611f97dcce2f3ec61c3551))

## Chores

-   Bump version ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/adba83bcce3ed86f0060e1d775e6854de6894041))
-   Update labels ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/d3e0b522b4a7d6cba894ce92cdced2836cf2ac5d))
-   Prepare beta [#79](https://github.com/kitten-science/kitten-scientists/pull/79) ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/29e84f008621e1c028993873d7237ee25f33670b))
-   Prepare documentation [#79](https://github.com/kitten-science/kitten-scientists/pull/79) ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/b0d5d5a49d5e124d199e5eb425849c91c1e79a55))

# v2.0.0-alpha.12

## Notable Changes

The alpha.11 release wasn't published correctly. So this release is mostly meant to correct and replace alpha.11.

Please see <https://github.com/kitten-science/kitten-scientists/releases/tag/v2.0.0-alpha.11> for the major changes that came with alpha.11.

## Bug Fixes

-   Version tags are sometimes inaccurate ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/affbbdb84e7678dbe4dd42cf471e0a2407aedcc7))
-   **ui**: Don't put hover guides on expanded panels ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/6ccb9bf48e4db40dd78f48ea1dc8734deb400cc5))
-   **ui**: Hover guides on generic panels ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/199894a63cd6358633e3716ab0123f960e297aca))
-   **village**: Unhandled case when no leader is elected ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/9010109d7e13b00e994ff486c8850c90a2f55e56))
-   Broken build script ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/2dbd9e6a5864269ca5b47510d31e1d9202eb3a8b))

## Code Refactoring

-   **ui**: Add generic list item ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/9c14427c4b36c61ae2ebd46a9ae948e36fa17f3f))

## Continuous Integration

-   Don't use `latest` to determine semver changes ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/7a664a32c557de453e6ebb8990cfd3c023a93f81))

## Chores

-   Bump version ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/67df5d52fbf4a99210a3b256e0277253c53ece66))
-   Don't recommend PnP extension ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/d0d3b5c366358ec78e8fedd63fc088b17dbd7914))

# v2.0.0-alpha.11

## Notable Changes

-   **The modern save settings are now active!**
    When you load alpha.11 for the first time, your existing legacy settings (the way settings were stored in v1.5) are upgraded to the modern settings system. Your existing settings will be backed up in your browser's local storage as `cbc.kitten-scientists.backup`.  
     From there on out, your settings are saved with your Kittens Game settings and they are also synced through KGNet.

-   KS can now automatically elect a leader.
-   Several issues with time skipping, discovered by @petethered, were also fixed.

## What's Changed

-   feat(ui): Add support for radio groups by @oliversalzburg in https://github.com/kitten-science/kitten-scientists/pull/35
-   Add try-catch around bonfire upgrade button presses by @acmihal in https://github.com/kitten-science/kitten-scientists/pull/39
-   feat(core)!: Upgrade to modern settings by @oliversalzburg in https://github.com/kitten-science/kitten-scientists/pull/37
-   Fix multiple issues with time control by @oliversalzburg in https://github.com/kitten-science/kitten-scientists/pull/68

## New Contributors

-   @acmihal made their first contribution in https://github.com/kitten-science/kitten-scientists/pull/39

**Full Changelog**: https://github.com/kitten-science/kitten-scientists/compare/v2.0.0-alpha.10...v2.0.0-alpha.11

# v2.0.0-alpha.10

## Notable Changes

-   You can now copy & paste all KS settings easily through the UI.
-   The modern settings loader should be more robust.
-   There is no more "Options" section in the UI finally. All options have been merged into their respective tab sections.

Beyond the regular bug fixes, during this release cycle, a lot of time has been invested into creating the foundation work for automated browser tests, and the management of issues on this repository.

## Features

-   **workshop**: Include max in legacy settings ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/0f21120d87d5206600ddc9dc1aba023210489680))
-   Copy/paste settings through UI ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/14b804088ad9d749e8a8f4a284472304fa43b3f0))
-   Require version field in engine state ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/325d98a12e60a1afe3d94da44d4a11f7e46e97d9))
-   **api**: Expose settings encode/decode ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/aa1103b7b5d4e01d8ef7626990af5b695e507ab5))
-   **settings**: Safeguard top-level loaders ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/2862261a1b1e2eab8b217c53e7d31facb325ddb9))
-   **settings**: Safeguard more load operations ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/fed72a7de57dd9e3c874054bbc7e30b3809341f8))
-   **settings**: Safeguard all loader loops ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/543744a80b4a94cadb31c2925f23d8e340e3192c))
-   **ui**: Remove "Options" section ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/b287eed56ff6c00764a19b063f7cc4286efbb947))
-   **settings**: Safeguard scalar loaders ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/1fb23df4e5b8888258e2a3cddc91169ebb207b45))
-   Repository label manager [#26](https://github.com/kitten-science/kitten-scientists/pull/26) ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/ca45d3a39bf9a9157ac0505b893a43231c37555f))
-   **ui**: Log a message on settings import/export ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/e7215f4aacc067bd6d38f7222c36b77e40d65f8d))

## Bug Fixes

-   **ui**: Missing trigger button for time skip ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/cf75cc442a8653f7f1246d07fdca0034a1c98cb0))
-   Window size not set ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/9ee6efc69f81807388b584c21f59522a48a9ca8d))
-   **space**: Mission selection is ignored ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/5a03e74e8a21398b3043ffd172c8bcfaa99ef875))
-   **time**: Invalid values restored from legacy storage ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/7ada5eef615a16921499d5ab7acac5de3bbce81f))
-   **ui**: Generic titles on settings buttons ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/99e8d95e4f3112cf6fa7ed655152d517c1cbd322))
-   In-game template strings are not evaluated ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/545efe344bf8226ddf5e19c80aafc0ed1834fe80))
-   Unable to import savegames ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/9ab11b5bf179fd5194211edfae56add7482d8b17))
-   Broken trade seasons selection ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/babbd7250bd4a5e643926ecd5b138689fc55d232))
-   Missing nullish-coalesce on seasons ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/d98a6008a7d074b19ad185baa1826a87af55ef08))
-   **trade**: Embassies being built for undiscovered races ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/ae8b52e78afb162d35fef11a4c75b4c960422ddc))
-   **ui**: Season selection not working as intended ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/93a798321b1b877c21209ec38d811e6a1dde40a8))
-   **ui**: Enable/disable all on cycles has no effect ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/1a854e65336700126dc413cbf56a5da9ba3c9cc3))
-   Use correct game name ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/82ec62e5f7292113cf730bdaa240603cec7e51c4))
-   **trade**: Blackcoin trading setting not respected ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/619ac28094d98551162e8b5bd413753362e7213d))

## Documentation

-   Link to BrowserStack ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/74a3098d9d56893f3507e3517321a937bcd2793e))
-   Cleanup README ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/7c5558f3f48e89c8936feb3cfdf351a720d311f5))
-   Clean up contributors ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/9c54bd24c634e128359df6084c4d5ff712596992))
-   Create code of conduct ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/f85adb5f421a09bb4aa9f5fb445e12775b2cd3ab))
-   Update development guide ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/fe6238accb1c5f30d1c2f68535ae778fec0c4106))
-   Apply title case consistently ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/301cf2133bda52354f9e56df3e8a6ed8979bb6b8))
-   Clarify yarn ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/327fb3b976af5b6ae305d8950ea0540726c3b8a0))
-   Point to `bug_report.yml` on release ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/efc2eebc152ae0c1aef0af4e630615ebebd16097))

## Code Refactoring

-   Further clean up settings ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/e510324ef64c339edbdad7dbd1a9ee04ce5821bb))
-   Use common `IconButton` ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/bae4a8f1bc5698f83bd62394c5c058477c226cbf))

## Tests

-   Add a sample UI test ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/b3dd1ec780c321a85c2123c08a85c65489071b94))
-   Increase timeout ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/e7cc9ce0fdba22c2ab2e1de0b6be64349472df7f))
-   Fix BrowserStack config ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/29e417eff063f4d50a23fe6819269105816d1fd8))
-   Fix BS config yet again ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/35f86b14a735dfa0c27e71456f797479dfdc90f2))
-   Set a fixed resultion ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/1f213249dde7f550c7e217df575b136e362b99b2))
-   Fix local tests no longer working ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/0172b584cef0b187081ab3c490faa0bf5c3f41e0))
-   Signal results ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/d94ec4352a654c75aee7eefada409a3bf91f53ee))
-   Add reason ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/6839e381832e18f31e02f7393ff66e68a333d83f))
-   Fix excessive quotes ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/d63c9782ed8187fe6fea7d7c86820c2b8df135c4))
-   Enable debug options ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/e30f978fdabf402cf2961e0000e494429d2fae0d))
-   Set bools as strings ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/9fda39797951aeeb72eb66ad9d34cee72efeec49))
-   Update config ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/82356180ffc4ab19a83f0653c2abb5aa91d9e303))
-   Fix capabilities ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/c910ab4099018da00c7ea3364674b2866797f101))
-   Move credentials back into URL ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/0a980ba8d2b6bc0dafafefdafaa23697c3769d13))
-   Give better reason ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/4375af63321fe3bc626d855190bbe2338c472821))
-   Build catnip field ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/bcc92ef296b141a48206a587d24d5ab0338d787e))
-   Increase timeout ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/63a10901457c8d0eaf28f75b84ba4b105342f78b))

## Continuous Integration

-   Try running on BrowserStack ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/04562030092f7720d800cc4d65c27187b383a452))
-   Fix missing build name ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/c78239ad11219128b61dc931d6c436ea4d4782fe))
-   Try setting up tunnel ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/de6733562d3af8d8472f3a5ef9db2673b84bc907))
-   Run UI tests on push ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/5983eaffea8e7f4ce7949e5645e13e146b50eda6))
-   Add environment URL ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/fa9d0d18e0a845642ca0ee118cc856a39e592965))
-   Remove useless URL ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/05a3e3bd1cb8c63514a5da9713d393e8f3183d6d))

## Chores

-   Update version ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/f6c61913d430c14e8d6375bfffe4227cacd18861))
-   **deps**: Bump tslib from 2.4.0 to 2.4.1 [#4](https://github.com/kitten-science/kitten-scientists/pull/4) ([dependabot[bot]](https://github.com/kitten-science/kitten-scientists/commit/154b92009d1e33d342cb62f95eaa2caf297f744c))
-   **deps-dev**: Bump eslint-plugin-jsdoc from 39.3.14 to 39.4.0 [#5](https://github.com/kitten-science/kitten-scientists/pull/5) ([dependabot[bot]](https://github.com/kitten-science/kitten-scientists/commit/0e8284e4073b3d59f416fff430639720065daca8))
-   **deps-dev**: Bump @typescript-eslint/parser from 5.40.1 to 5.42.0 [#6](https://github.com/kitten-science/kitten-scientists/pull/6) ([dependabot[bot]](https://github.com/kitten-science/kitten-scientists/commit/87d488d1416ba5309088173bb15c0834be6a51c1))
-   **deps-dev**: Bump @babel/plugin-syntax-import-assertions [#7](https://github.com/kitten-science/kitten-scientists/pull/7) ([dependabot[bot]](https://github.com/kitten-science/kitten-scientists/commit/52b8cfd30c533c4f94bbb40bd80ae2f4b5e21116))
-   **deps-dev**: Bump vite from 3.1.8 to 3.2.2 [#8](https://github.com/kitten-science/kitten-scientists/pull/8) ([dependabot[bot]](https://github.com/kitten-science/kitten-scientists/commit/a87ae9576d18a2490fe45c896afca8702fbd5bb5))
-   **deps-dev**: Bump prettier-plugin-organize-imports [#29](https://github.com/kitten-science/kitten-scientists/pull/29) ([dependabot[bot]](https://github.com/kitten-science/kitten-scientists/commit/fe4f100f0d60b3b9d487ea42b62b2bcec3faadea))
-   **deps-dev**: Bump @types/node from 18.11.3 to 18.11.9 [#31](https://github.com/kitten-science/kitten-scientists/pull/31) ([dependabot[bot]](https://github.com/kitten-science/kitten-scientists/commit/a50512eba388eece248cf87c9c28953b4bed7e12))
-   Update Dependabot labels ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/5909d9d4badd1e73e515f2a22e81c33d51a0ef04))
-   Let Dependabot open more PRs ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/958c94efad89aaec6fdbb31b262615b3250c191e))
-   **deps-dev**: Bump @typescript-eslint/eslint-plugin [#27](https://github.com/kitten-science/kitten-scientists/pull/27) ([dependabot[bot]](https://github.com/kitten-science/kitten-scientists/commit/7af11accbe3e95607a556319179c7f855ef4e4ae))
-   **deps-dev**: Bump @babel/core and @types/babel\_\_core [#30](https://github.com/kitten-science/kitten-scientists/pull/30) ([dependabot[bot]](https://github.com/kitten-science/kitten-scientists/commit/44a5cde14bad05458e346d5c340175d42d82d7e7))
-   **deps-dev**: Bump @types/web from 0.0.75 to 0.0.80 [#32](https://github.com/kitten-science/kitten-scientists/pull/32) ([dependabot[bot]](https://github.com/kitten-science/kitten-scientists/commit/4c4827e68615b19b29f3c2d14f289ccdc7c92d21))
-   Update issue templates ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/83075281fcefa810c5fdf6199f6196ae9662eeaa))
-   Add issue config ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/d261756b9ff18154305f579a414f98b19c5e28ad))
-   Update issue templates ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/de412211c539005fcc3a7f87849549ac5d2017c4))
-   Use issue forms on GitHub ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/37366cf2593eade54400f65d65c0f210fe742133))
-   Bump version ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/d6790a9193da7328bafcdc7e1004ae94b57d08de))

# v2.0.0-alpha.9

Mostly a maintenance release after moving the repository.

## Features

-   **ui**: Show glyphs for cycles ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/467355cf59f4dc60b729c7f6266855ac21e90d7e))

## Bug Fixes

-   Incorrect log message for nested settings ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/09ec4860a3590d08d294b7af92ac7b928421a86b))

## Code Refactoring

-   Move blackcoin/autofeed into trade settings ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/d2fd689f5c38e1f37ce3317905f83993d643e7a7))
-   **time**: Move fix cryochambers into time section ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/260c966fe78022c9457fd0dc87ab06bf36b80f58))
-   Clean up "items" terminology ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/65da07d59d556dd5b8941d4e76a08704d0be55d2))

## Continuous Integration

-   Don't use `latest` ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/19a21203dd6eb7f08ee025274b7364829c080336))

## Chores

-   Bump version ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/95c4e768d83d848323b315d84d26ab05df4e3ec2))
-   Enable Dependabot ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/c5239ed37215f614bba84cb53d025c0a178209bd))
-   **deps-dev**: Bump eslint-plugin-jsdoc from 39.3.6 to 39.3.14 ([dependabot[bot]](https://github.com/kitten-science/kitten-scientists/commit/140c814ab404cbea0fb02f61b2ac624b6a89a329))
-   **deps-dev**: Bump @typescript-eslint/eslint-plugin ([dependabot[bot]](https://github.com/kitten-science/kitten-scientists/commit/5607a47c0a4b6096a70b0078555cde43befb7868))
-   **deps-dev**: Bump typescript from 4.8.3 to 4.8.4 ([dependabot[bot]](https://github.com/kitten-science/kitten-scientists/commit/db44151175c3d79ca3d97b58b48ab2591b18643d))
-   **deps-dev**: Bump prettier-package-json from 2.6.4 to 2.7.0 ([dependabot[bot]](https://github.com/kitten-science/kitten-scientists/commit/55ea82d722595bf5d465d48a39da204ee22c7c22))
-   **deps-dev**: Bump prettier-plugin-sh from 0.11.0 to 0.12.8 ([dependabot[bot]](https://github.com/kitten-science/kitten-scientists/commit/5a08ddd2f194114313932309dd35be3fe8f4f988))
-   **deps-dev**: Bump vite from 3.1.2 to 3.1.8 ([dependabot[bot]](https://github.com/kitten-science/kitten-scientists/commit/2bb0c51051e42a657b854b397b302f10e9d085f8))
-   **deps-dev**: Bump @babel/core from 7.19.1 to 7.19.6 ([dependabot[bot]](https://github.com/kitten-science/kitten-scientists/commit/3006774b6a9859dc85af4be79342d17962661160))
-   **deps-dev**: Bump eslint and @types/eslint ([dependabot[bot]](https://github.com/kitten-science/kitten-scientists/commit/21b0e63c3197fbc5976afce287fe070aa7d2ad79))
-   **deps-dev**: Bump @typescript-eslint/parser from 5.37.0 to 5.40.1 ([dependabot[bot]](https://github.com/kitten-science/kitten-scientists/commit/9f0b8d220d45d5ccbfb6f9a65b8af7ba7679a99f))
-   **deps-dev**: Bump @types/web from 0.0.73 to 0.0.75 ([dependabot[bot]](https://github.com/kitten-science/kitten-scientists/commit/1f22f98bfaf16fe6ab8a7e73561c193aa714d850))
-   Only run Dependabot monthly ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/0c83b550f7177960c3ab45cbf9718c7419c3ca80))
-   **deps-dev**: Bump @types/prettier from 2.7.0 to 2.7.1 [#1](https://github.com/kitten-science/kitten-scientists/pull/1) ([dependabot[bot]](https://github.com/kitten-science/kitten-scientists/commit/5bf01539ff2a5dd349807e1b844b5be7627c3426))
-   **deps-dev**: Bump @types/node from 16.11.59 to 18.11.3 [#2](https://github.com/kitten-science/kitten-scientists/pull/2) ([dependabot[bot]](https://github.com/kitten-science/kitten-scientists/commit/2049d71fa85a42ff22ab89c78bd1b1eaeee46fcb))
-   Update repository links ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/507590b7586d07abc995162ffbd216f5210a8c1f))
-   Clean up contributors script ([Oliver Salzburg](https://github.com/kitten-science/kitten-scientists/commit/420c29eb60a1f247c2071d36a401bcfa29be9acd))

_no prior releases recorded_
