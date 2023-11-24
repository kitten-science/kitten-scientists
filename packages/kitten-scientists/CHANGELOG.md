# v2.0.0-beta.8

_in progress_

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
