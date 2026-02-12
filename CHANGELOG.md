# [1.2.0-develop.2](https://github.com/Bedol/fuelion-tracker/compare/v1.2.0-develop.1...v1.2.0-develop.2) (2026-02-12)


### Bug Fixes

* **01-02:** simplify SliderThumbWithTooltip for Chakra v3 ([efe7abd](https://github.com/Bedol/fuelion-tracker/commit/efe7abdad3a5592fa07fe869977d56e980c931d8))
* **01-02:** update components to Chakra v3 API ([aa811f5](https://github.com/Bedol/fuelion-tracker/commit/aa811f54778429e84d1cd059c31f266ee08ba7d0))
* **01-02:** update NumberInput to Chakra v3 API ([bde0a30](https://github.com/Bedol/fuelion-tracker/commit/bde0a30ac7e4336cee334fa8c3d3f8a30c692664))
* **01-03:** update components for Chakra UI v3 API compatibility ([9e08918](https://github.com/Bedol/fuelion-tracker/commit/9e0891816465039de65d1c228ed44b1fa42c2299))
* **01:** revise plans based on checker feedback ([9f108d5](https://github.com/Bedol/fuelion-tracker/commit/9f108d5ab23d33276aee561419e1bcdcf3da7c01))
* **02-02:** use Chakra Button with colorPalette for empty state CTA ([ba10f02](https://github.com/Bedol/fuelion-tracker/commit/ba10f02b35507e86ff231e9019923bbbfa526144))
* **02-03:** rewrite VehicleForm with Chakra v3 compatible components ([6f52de4](https://github.com/Bedol/fuelion-tracker/commit/6f52de47c574798f03265ef1260bdad7db808573))
* **02-04:** add missing toaster component for notifications ([cb7c0b0](https://github.com/Bedol/fuelion-tracker/commit/cb7c0b02828ddec6f77e34f774e83b2ae9b00478))
* **02-04:** resolve Chakra v3 Toaster SSR and spacing prop issues ([7364f26](https://github.com/Bedol/fuelion-tracker/commit/7364f260da958aa00c220caecb84d801e69877ad))
* **02-04:** use Chakra v3 CardRoot and CardBody imports ([0873ba2](https://github.com/Bedol/fuelion-tracker/commit/0873ba293528ad0e98f83eccd783c1bfde29e3f0))
* **03-04:** remove nested anchor tags causing hydration error ([690604d](https://github.com/Bedol/fuelion-tracker/commit/690604d04484f1a81253ddf59d17b128c9b600f4))
* **03-04:** resolve Add Fueling button disabled cursor issue ([5ccb033](https://github.com/Bedol/fuelion-tracker/commit/5ccb0335990b09fdcd29c80eb4e68b1e820f358d))
* **03-04:** use vehicleId instead of id for navigation to prevent undefined ([54b7074](https://github.com/Bedol/fuelion-tracker/commit/54b70747f7df1ad4abb5f41b5d23660b027881f4))
* **03-05:** resolve layout prop and import path issues for fueling pages ([dfdd37e](https://github.com/Bedol/fuelion-tracker/commit/dfdd37e2f788ef27e19e5cbc1cc916c00617adf0))
* **03-05:** update Chakra UI v3 API incompatibilities ([0ef02f8](https://github.com/Bedol/fuelion-tracker/commit/0ef02f8415b5ca3d95da176b64bd7acdc8107e05))
* **03-06:** exclude invalid database fields from fueling creation ([055be42](https://github.com/Bedol/fuelion-tracker/commit/055be42e95918ff9342c4797b13f3e17a3061460))
* **03-07:** allow editing older fueling records with lower odometer values ([903b754](https://github.com/Bedol/fuelion-tracker/commit/903b75493c1059932558c559d131671775598381))
* **03-07:** handle 204 No Content response in delete fueling hook ([0f2b12b](https://github.com/Bedol/fuelion-tracker/commit/0f2b12b3dc56c351d034ba281fd1cb853ea71f78))
* **03-07:** remove invalid note field from fueling creation ([14f854a](https://github.com/Bedol/fuelion-tracker/commit/14f854ade016bf3069ac1838cbddb87e2696bf23))
* **03-07:** restore draft values on page refresh in create mode ([c656af7](https://github.com/Bedol/fuelion-tracker/commit/c656af70d39eaebaa11179196781f40714e433fb))
* **04-05:** correct consumption trend for year selection ([d335c78](https://github.com/Bedol/fuelion-tracker/commit/d335c78958121293ff3d6e509b05c6d316b2ad0b))
* **04-05:** correct monthly consumption aggregation ([4ed0194](https://github.com/Bedol/fuelion-tracker/commit/4ed01947bb5bba3f3d84252f00549e64bfd84ce9))
* **04-05:** normalize consumption interval dates ([dac361b](https://github.com/Bedol/fuelion-tracker/commit/dac361bb4cc8c215edb20f6909aa32a6cf3a73e8))
* **06-03:** parse fueling mutation error envelopes ([37860eb](https://github.com/Bedol/fuelion-tracker/commit/37860eb03140c830c472b8f4cb91605213a837f7))
* **06:** orchestrator corrections ([5838fa5](https://github.com/Bedol/fuelion-tracker/commit/5838fa59f6db04a0c21300aa7014658cd8ecc2ac))
* **06:** revise plans based on checker feedback ([72e1c1d](https://github.com/Bedol/fuelion-tracker/commit/72e1c1dc70c46229b8c8d33af83c590be108e259))
* **07-01:** limit recent activity to five fuelings ([13d46b7](https://github.com/Bedol/fuelion-tracker/commit/13d46b76e08e85e5b7070ff898f5491c57153adc))
* **08-03:** add dashboard distance fallback ([57e23c3](https://github.com/Bedol/fuelion-tracker/commit/57e23c38227b077d0b491b3a1f800f359dd4379d))
* **10:** orchestrator corrections ([634bbb3](https://github.com/Bedol/fuelion-tracker/commit/634bbb3c091c90dd1a13587595ac0070be0b355d))
* add cursor pointer to all buttons in FuelingForm for consistent UX ([0a0aa98](https://github.com/Bedol/fuelion-tracker/commit/0a0aa98f4a857c0be8323024749e1982456eb05e))
* add cursor pointer to IconButtons in FuelingListItem for proper click feedback ([14c5189](https://github.com/Bedol/fuelion-tracker/commit/14c51898c320bb0a3a376ef6e852a9a72d98069c))
* memoize initialValues to prevent infinite loop with enableReinitialize ([d04cf3b](https://github.com/Bedol/fuelion-tracker/commit/d04cf3bb023cc461a225f579d44fafbf5badbae2))
* **phase-01:** correct Prisma 7 datasources configuration ([f65ec9d](https://github.com/Bedol/fuelion-tracker/commit/f65ec9d8cf9376985c938bfd6ac8c0a71a17cc2d))
* **phase-01:** create placeholder statistics page for navigation ([6b70417](https://github.com/Bedol/fuelion-tracker/commit/6b704179d794bbe54ecd873bcdb31234bdbc23fc))
* **phase-01:** downgrade to Prisma 6 for compatibility ([17bf1f7](https://github.com/Bedol/fuelion-tracker/commit/17bf1f7936ec400e613786065ddb42d639ac0d63))
* **phase-01:** migrate to Prisma 7.x configuration (blocking issue) ([c144426](https://github.com/Bedol/fuelion-tracker/commit/c1444263593b1a5349456221c835abb91e380dd9))
* **phase-01:** persist locale preference in localStorage ([c799097](https://github.com/Bedol/fuelion-tracker/commit/c799097fecc9b28e02f9615e136f4c9decd3ee8b))
* **phase-01:** remove leftIcon prop, use icons as children (Chakra v3) ([0bae689](https://github.com/Bedol/fuelion-tracker/commit/0bae689cad18a075d64885c28de6e9007809b378))
* **phase-01:** use Avatar.Root compound component (Chakra v3) ([6b6a01a](https://github.com/Bedol/fuelion-tracker/commit/6b6a01a8ad79da6fb9e5ccb7ecb661465e22e351))
* **phase-01:** wrap Avatar in Button for Menu.Trigger compatibility ([da372c2](https://github.com/Bedol/fuelion-tracker/commit/da372c26331416d9cae04be08490af804f406dc9))
* prevent infinite re-render loop in FuelingForm by memoizing saveDraft function ([2a22896](https://github.com/Bedol/fuelion-tracker/commit/2a22896985aa321072f026cc9ab1b5de6453804f))
* remove Layout from fueling pages - use global Layout from _app instead ([d662e5b](https://github.com/Bedol/fuelion-tracker/commit/d662e5b0bfdcffd25f3494e669c1f7c592e46ea8))
* replace disabled placeholder Add Fueling button with working navigation buttons ([cc11224](https://github.com/Bedol/fuelion-tracker/commit/cc11224147f316e4823c1bcdd657fce1ecb6965e))
* **stype:** Fix formmating code ([60db1d1](https://github.com/Bedol/fuelion-tracker/commit/60db1d157a5c1e491b14696298f08909271ec955))
* **toaster:** add proper Chakra v3 toaster snippet with Toast component ([8492648](https://github.com/Bedol/fuelion-tracker/commit/8492648f8973ed65ddc4df3e7c49194a147e9507))
* **toaster:** use toaster.success() and toaster.error() API ([dad6e2a](https://github.com/Bedol/fuelion-tracker/commit/dad6e2a955c4e036fac628a992cf190b13a9d45c))
* update react-dom version to 19.2.4 and adjust VSCode settings for explicit formatting ([d4f73b0](https://github.com/Bedol/fuelion-tracker/commit/d4f73b0049e363defe8d1747117e7cb637af0296))
* **vehicles:** migrate VehicleForm to Chakra UI v3 API ([49a0459](https://github.com/Bedol/fuelion-tracker/commit/49a045903d5d36dedb07c908affbc39f62afe73b))


### Features

* **01-01:** create LocaleContext with translation support ([d16b1f8](https://github.com/Bedol/fuelion-tracker/commit/d16b1f86cfcfaab0c32c7971748ab115e97896ea))
* **01-01:** create Polish and English translation dictionaries ([0d31142](https://github.com/Bedol/fuelion-tracker/commit/0d31142b69fa51ca893c725a5e542b481308a74b))
* **01-01:** integrate LocaleProvider into app ([d4f34a6](https://github.com/Bedol/fuelion-tracker/commit/d4f34a6e89da06b8c3cd76a5d734d70e8acdef77))
* **01-02:** add custom pages and export authOptions ([3c0bdd3](https://github.com/Bedol/fuelion-tracker/commit/3c0bdd3cdac544ca3ff0686e465334c97d360f94))
* **01-02:** create branded sign-in page with i18n ([c02c124](https://github.com/Bedol/fuelion-tracker/commit/c02c1241d80327ad9a9e4f1dabe86cf60d9c7996))
* **01-02:** create index page with session protection ([a823b67](https://github.com/Bedol/fuelion-tracker/commit/a823b678cd6a35898a0299add01e3918fdfd01a3))
* **01-03:** create enhanced ErrorAlert component ([9e0fa73](https://github.com/Bedol/fuelion-tracker/commit/9e0fa7324faec21f34224dd70479d515d522fc25))
* **01-03:** create SkeletonLoader component with type variants ([29abdf6](https://github.com/Bedol/fuelion-tracker/commit/29abdf6103c999ed89df21307625b223aad6c2b3))
* **01-03:** integrate SkeletonLoader into index page loading state ([8e4fcc1](https://github.com/Bedol/fuelion-tracker/commit/8e4fcc16ca792357d5728e4fa05b92778d88ee56))
* **01-04:** create AuthenticatedLayout wrapper ([072db5b](https://github.com/Bedol/fuelion-tracker/commit/072db5bd963d03501449355caa113ca89c21224e))
* **01-04:** create responsive Navigation component ([ff0b8e1](https://github.com/Bedol/fuelion-tracker/commit/ff0b8e1d7c1bd9dd0327d4ceeee1698b62c665ba))
* **01-04:** update Layout.tsx to use responsive navigation ([a89fadf](https://github.com/Bedol/fuelion-tracker/commit/a89fadf9a5be863f91066f25f91f5caa806f5298))
* **02-01:** simplify Vehicle schema with direct fields ([0c4b448](https://github.com/Bedol/fuelion-tracker/commit/0c4b4487787739c4b152b8ae88e798049cd9364d))
* **02-02:** add empty state to vehicle list ([0d631be](https://github.com/Bedol/fuelion-tracker/commit/0d631beafc7d1664df9a57307cd187d775a90a2b))
* **02-02:** enhance VehicleCard with fuel type icons and better layout ([7acb9c7](https://github.com/Bedol/fuelion-tracker/commit/7acb9c73abda2375026ff318a40121e5f5451aa7))
* **02-03:** rebuild VehicleForm with complete fields and collapsible technical section ([c72b5e7](https://github.com/Bedol/fuelion-tracker/commit/c72b5e7cf32b35d5afa07d60cf2adf468db6a006))
* **02-03:** update create and edit pages to use enhanced VehicleForm ([a99752a](https://github.com/Bedol/fuelion-tracker/commit/a99752aeb19874b8585fc04e0d02cc416bea2ac4))
* **02-03:** update vehicle types to match simplified schema ([648a741](https://github.com/Bedol/fuelion-tracker/commit/648a741436c2a8a5b454c6c7a97431153bf34b21))
* **02-04:** create delete confirmation modal ([08d66f6](https://github.com/Bedol/fuelion-tracker/commit/08d66f6cf52f82a5e702d39b3da39a4951467844))
* **02-04:** create vehicle detail page ([e17a684](https://github.com/Bedol/fuelion-tracker/commit/e17a684e9740ad67174dbaf52556415e3acfc1dc))
* **03-01:** create fueling type definitions ([01c3d86](https://github.com/Bedol/fuelion-tracker/commit/01c3d8651904082f9a8a5f2c9e511aa87886a540))
* **03-02:** create data fetching hooks for fuelings ([5d0bcc3](https://github.com/Bedol/fuelion-tracker/commit/5d0bcc379c6836ad3dfa43531dfca0aec3e1ef89))
* **03-02:** create fueling draft persistence hook ([72bd81e](https://github.com/Bedol/fuelion-tracker/commit/72bd81e765b207378804dc9b6bddcff3de1545fe))
* **03-02:** create mutation hooks for fueling CRUD operations ([84b4521](https://github.com/Bedol/fuelion-tracker/commit/84b4521efd6efd405b63857f8003b7f8ec210b63))
* **03-03:** create FuelingDeleteModal and component barrel exports ([1253386](https://github.com/Bedol/fuelion-tracker/commit/12533867d9b79f1947a7c7ade223358101909ee6))
* **03-03:** create FuelingForm component with live calculation ([18b7956](https://github.com/Bedol/fuelion-tracker/commit/18b795636834f09724319b03daa73f29e14dab67))
* **03-03:** create FuelingList and FuelingListItem components with infinite scroll ([878ec27](https://github.com/Bedol/fuelion-tracker/commit/878ec27f9eee1710d7ca472646ff4df0d5357583))
* **03-04:** create API routes for fueling records ([ba3a5f2](https://github.com/Bedol/fuelion-tracker/commit/ba3a5f2034d69dd19a4bfc02d49d31775a2b76a0))
* **03-04:** create fueling list page ([b47b25f](https://github.com/Bedol/fuelion-tracker/commit/b47b25fdddc84c7df93761396d7d905914730d7c))
* **03-04:** create new and edit fueling pages ([e9fdf54](https://github.com/Bedol/fuelion-tracker/commit/e9fdf54b55edcc1057eb3809fb15b4cfff34df9f))
* **04-01:** add statistics types and aggregation helpers ([c4e599b](https://github.com/Bedol/fuelion-tracker/commit/c4e599b20e3b12ab9463703b4a5bfde6cb1a349a))
* **04-01:** add vehicle statistics api endpoint ([c48520c](https://github.com/Bedol/fuelion-tracker/commit/c48520c79399302f364d5ca41f2ec57cd8270278))
* **04-02:** add vehicle statistics query hook ([3250907](https://github.com/Bedol/fuelion-tracker/commit/32509071e93e54a92c42e067d1f867c8b75406e3))
* **04-03:** add statistics chart components ([12f44f4](https://github.com/Bedol/fuelion-tracker/commit/12f44f4d69defb3f9a54e31e212e89aa7398198b))
* **04-03:** add statistics summary and empty state components ([ef1cbcb](https://github.com/Bedol/fuelion-tracker/commit/ef1cbcb6d08d8949f558a6170014d5e1c4c0a663))
* **04-03:** compose statistics charts section ([e573c22](https://github.com/Bedol/fuelion-tracker/commit/e573c22be3806d4c741a39178a9f04e03fb72310))
* **04-04:** wire statistics page to data hook ([3d2cb1f](https://github.com/Bedol/fuelion-tracker/commit/3d2cb1f47e42ded59e540419ec415823fc84d439))
* **04-05:** add statistics year filtering ([f607292](https://github.com/Bedol/fuelion-tracker/commit/f6072923a3c9c983b07e75e191112cf140527a84))
* **05-01:** add dashboard aggregation endpoint ([0134034](https://github.com/Bedol/fuelion-tracker/commit/0134034fdaa635d7f6c23c93c78299e37cd103ea))
* **05-01:** add dashboard types and summary helper ([05f4830](https://github.com/Bedol/fuelion-tracker/commit/05f4830c9bc7da7474a8a90910e14d285a18ead4))
* **05-02:** add dashboard data hook ([f069dbc](https://github.com/Bedol/fuelion-tracker/commit/f069dbc6b5767b34fab8631a8ad5d9de8f86afd9))
* **05-02:** add recent activity list ([df31ff8](https://github.com/Bedol/fuelion-tracker/commit/df31ff8257183ffe1f046ed85e20a76f32e41aec))
* **05-02:** add vehicle summary card ([1a069e8](https://github.com/Bedol/fuelion-tracker/commit/1a069e8a7acf195bb284eaa3c9f9a7f2447b6b13))
* **05-03:** add dashboard translations ([ad6b763](https://github.com/Bedol/fuelion-tracker/commit/ad6b763d88cd208009bc96b8869f318e8c02b704))
* **05-03:** build dashboard layout and states ([55763d5](https://github.com/Bedol/fuelion-tracker/commit/55763d5074df35b42c79b315866eb1c61fdd2a62))
* **06-01:** add ownership guard helpers ([6b92db8](https://github.com/Bedol/fuelion-tracker/commit/6b92db85c198624ff886a2881d77125e687d3cc2))
* **06-01:** add shared auth and error helpers ([3d61a6e](https://github.com/Bedol/fuelion-tracker/commit/3d61a6eae17f4ae1e8afaebf40be9fbf91b55224))
* **06-02:** align vehicle statistics ownership guards ([0f65f93](https://github.com/Bedol/fuelion-tracker/commit/0f65f938787a11921e384490cc9a9b2a4b9409b8))
* **06-02:** enforce vehicle list create ownership ([d0af785](https://github.com/Bedol/fuelion-tracker/commit/d0af785428dca3949314fa7232cc06536c590e23))
* **06-02:** guard vehicle detail access by owner ([14696cd](https://github.com/Bedol/fuelion-tracker/commit/14696cdd8e45d135fad7b551b4db77f317efb594))
* **06-03:** enforce fueling detail ownership guards ([5755c54](https://github.com/Bedol/fuelion-tracker/commit/5755c5478700c9a6dba56ecb0e1626e251dc1dc0))
* **06-03:** guard fueling list and create by ownership ([24f3c56](https://github.com/Bedol/fuelion-tracker/commit/24f3c563d983e0478153abca6a5f1dafd1325b65))
* **07-01:** add dashboard refresh indicator and toast ([24c2686](https://github.com/Bedol/fuelion-tracker/commit/24c2686154228a3226b88d6dd00d01442dd83c27))
* **07-02:** add statistics action to vehicle header ([ccdce0a](https://github.com/Bedol/fuelion-tracker/commit/ccdce0a2542447096c6ca633ea412415fa6f4266))
* **07-02:** invalidate dashboard after fueling mutations ([cad4970](https://github.com/Bedol/fuelion-tracker/commit/cad497012e1e4989c236d78208d63a0b9cc41558))
* **08-01:** add rolling monthly cost metadata ([effd791](https://github.com/Bedol/fuelion-tracker/commit/effd79159dcd251ce848786b6182ebe3e9d3efae))
* **08-01:** refresh rolling costs chart rendering ([3bbea92](https://github.com/Bedol/fuelion-tracker/commit/3bbea92ffb75ea96191f11032840d776ab5ecfd1))
* **09-01:** guard vehicle list page with session ([9258655](https://github.com/Bedol/fuelion-tracker/commit/92586555c2ca3b6108db8a63f91790a830aea1ce))
* **09-01:** protect vehicle detail page with session ([d34817c](https://github.com/Bedol/fuelion-tracker/commit/d34817c063d3b441a18820f958b14aaa9b5e3e23))
* **09-02:** require session on vehicle create page ([e7bffaa](https://github.com/Bedol/fuelion-tracker/commit/e7bffaacf4d2b15de47edde10373ec323288ed56))
* **09-02:** require session on vehicle edit page ([5b372ac](https://github.com/Bedol/fuelion-tracker/commit/5b372ac71df97bac4ae9e907a5d726dcb7bbbe2c))
* **10-01:** guard last fueling by owner ([afb2a50](https://github.com/Bedol/fuelion-tracker/commit/afb2a505ea34f37c96f9a3d39b4906a2203b301f))
* **11-01:** add dashboard destination to shared navigation ([64956e7](https://github.com/Bedol/fuelion-tracker/commit/64956e7667ee6fc2f33e96fa01386d8fd1659b6b))
* **11-01:** add dashboard return actions on statistics pages ([2bed310](https://github.com/Bedol/fuelion-tracker/commit/2bed31057dd2825951bd896c733a018fb1dd4f35))
* **11-01:** localize dashboard navigation and stats cta copy ([b92b3b3](https://github.com/Bedol/fuelion-tracker/commit/b92b3b36888b7e3f450a0bbe410701a5e342daab))

# [1.2.0-develop.1](https://github.com/Bedol/fuelion-tracker/compare/v1.1.0...v1.2.0-develop.1) (2023-10-23)


### Features

* add air_conditioning switch ([df1fa78](https://github.com/Bedol/fuelion-tracker/commit/df1fa78b99fedf4dab1d1cc53a66f400b54ffe0b))
* add new components for layout ([ed53342](https://github.com/Bedol/fuelion-tracker/commit/ed53342bcc0394a79848185eaf380f82f9e97389))
* add slider with tooltip component ([bb96203](https://github.com/Bedol/fuelion-tracker/commit/bb962035daa0db9ae7490cf014a2aacbe17172c8))


### Reverts

* Revert "refacotr: rename column name from engine_power to engine_power_id" ([616d0cc](https://github.com/Bedol/fuelion-tracker/commit/616d0cc81005a3970662560c044c7dbd2a281427))

# [1.1.0](https://github.com/Bedol/fuelion-tracker/compare/v1.0.0...v1.1.0) (2023-03-06)


### Bug Fixes

* hydration error in Navigation component ([0931b67](https://github.com/Bedol/fuelion-tracker/commit/0931b6770ff8e29c231d6b9f8a2828b8ad9e61f6))
* hydration error in vehicles page ([d69813c](https://github.com/Bedol/fuelion-tracker/commit/d69813cb9e5717bba3a01d3b52bfc54ebd9483df))


### Features

* add VehicleCard and ChartsSection components ([8d4ee92](https://github.com/Bedol/fuelion-tracker/commit/8d4ee92909ae6a8944a3c0b4a201fcd15710971d))
* add VehicleCard and ChartsSection components ([f2dea56](https://github.com/Bedol/fuelion-tracker/commit/f2dea563e7a235c9b7295ad4559e76282ee7c3a9))
* add VehicleCard and ChartsSection components ([ffed103](https://github.com/Bedol/fuelion-tracker/commit/ffed1031983fcdc750be1aad339e16d8cecf471a))
* add VehicleCard and ChartsSection components ([71f4895](https://github.com/Bedol/fuelion-tracker/commit/71f4895347bacc8f9b73b73e5277caf785add1ac))

# 1.0.0 (2023-02-11)


### Bug Fixes

* api prisma query ([a5f10a9](https://github.com/Bedol/fuelion-tracker/commit/a5f10a9e5e19bcef85e97f1f0f429939b2f83973))
* create global PrismaClient instance ([454ba06](https://github.com/Bedol/fuelion-tracker/commit/454ba06b4fbbfd81043c5d88c7e2db9976408e2a))
* fix build project ([b95656c](https://github.com/Bedol/fuelion-tracker/commit/b95656c0bfe86ea88d2d7008dde976af14f1d09a))
* fix warning from eslit - unused variable ([9ec9dcf](https://github.com/Bedol/fuelion-tracker/commit/9ec9dcfe055e6bea42a5b8a51ade532e7e94dae7))
* handle sending fueling in form ([0b4f119](https://github.com/Bedol/fuelion-tracker/commit/0b4f1193a03065af3dd01c1f9413240058f31251))
* imports of PrismaPromise from prisma/client ([1c38888](https://github.com/Bedol/fuelion-tracker/commit/1c38888124b2a2e4c49303c1be44982e1ada361f))
* issue with type ([7506f8d](https://github.com/Bedol/fuelion-tracker/commit/7506f8d29dedbc69b6049cfda81261cfad0686bf))
* package.json build ([8a8d228](https://github.com/Bedol/fuelion-tracker/commit/8a8d228e71b948e8d7a688bba2555af78196b38b))
* remove unused commented elements ([272544d](https://github.com/Bedol/fuelion-tracker/commit/272544d70c3297efe66f974fa4c0018f083d54b3))
* types for fueling and vehicles apis ([0f8d4eb](https://github.com/Bedol/fuelion-tracker/commit/0f8d4eb162d73dc959539897ebecbca6b3d543a7))
* typo in config files names ([2e37092](https://github.com/Bedol/fuelion-tracker/commit/2e370920e72169ed7ed6ceb9d28488ca773b4929))


### Features

* add FetchDataErrorAlert component ([9f72148](https://github.com/Bedol/fuelion-tracker/commit/9f72148a5ff97417ba8b35f18f5e73d0f97a2f49))
* add links to Navigation ([0700916](https://github.com/Bedol/fuelion-tracker/commit/07009165734f30414080c37023f88dbbc1af4b03))
* add Loading component ([126b0fc](https://github.com/Bedol/fuelion-tracker/commit/126b0fc0b8f70300f9121eb9cb927a4e990aa148))
* add more inputs ([4f1215e](https://github.com/Bedol/fuelion-tracker/commit/4f1215ebecb17a02ad288e25d24817f074a06a5c))
* add new models to prisma schema ([e6e019b](https://github.com/Bedol/fuelion-tracker/commit/e6e019b53ced595cb88f535a633098329da2dc2d))
* add ReactQueryDevtools to App ([67eedac](https://github.com/Bedol/fuelion-tracker/commit/67eedacfe046a1ca032576d6c87a4e78e4daa192))
* allow to signin by google ([c1b5837](https://github.com/Bedol/fuelion-tracker/commit/c1b5837ff064f2d77f87ba188602bc730bca7aee))
* build form for handle create new vehicle ([fd924b7](https://github.com/Bedol/fuelion-tracker/commit/fd924b75d4707b41b72c9387bfd1dc7e98ab6c29))
* create Card component ([cb1a497](https://github.com/Bedol/fuelion-tracker/commit/cb1a497d465f89b1bc907b8681fbf6fcc8d9466c))
* create fueling in form WIP ([4dd4c54](https://github.com/Bedol/fuelion-tracker/commit/4dd4c54d6fd816e1112538ef9b9d63b73be67b84))
* create NumberInput component ([5da6e0e](https://github.com/Bedol/fuelion-tracker/commit/5da6e0ead54937b8f263cb27f8a4b258f41b1e99))
* create VehicleForm component ([b1e3771](https://github.com/Bedol/fuelion-tracker/commit/b1e3771b6f32a9defc74c17cf2be2b430ab9db68))
* replace a swr the react-query ([3614b45](https://github.com/Bedol/fuelion-tracker/commit/3614b45ba9a66b6a51f33b6a9cdac188eff5c952))
* update vehicle mileage when add new fueling ([05b592b](https://github.com/Bedol/fuelion-tracker/commit/05b592b86c5d18eeaf473eb8e80f522ea38d6f3e))
* use next-auth google provider ([7dd8c42](https://github.com/Bedol/fuelion-tracker/commit/7dd8c428fa862dafbce62314bfe38e5723688fa5))


### Reverts

* Revert "Install primereact" ([d5db13a](https://github.com/Bedol/fuelion-tracker/commit/d5db13af28b3135e5c4e94fa62cdced844622b3e))
* Revert "install primeicons" ([c2a5925](https://github.com/Bedol/fuelion-tracker/commit/c2a59253e493edc76f355636c368f2c63c94b116))

# 1.0.0-develop.1 (2023-02-11)


### Bug Fixes

* api prisma query ([a5f10a9](https://github.com/Bedol/fuelion-tracker/commit/a5f10a9e5e19bcef85e97f1f0f429939b2f83973))
* create global PrismaClient instance ([454ba06](https://github.com/Bedol/fuelion-tracker/commit/454ba06b4fbbfd81043c5d88c7e2db9976408e2a))
* fix build project ([b95656c](https://github.com/Bedol/fuelion-tracker/commit/b95656c0bfe86ea88d2d7008dde976af14f1d09a))
* fix warning from eslit - unused variable ([9ec9dcf](https://github.com/Bedol/fuelion-tracker/commit/9ec9dcfe055e6bea42a5b8a51ade532e7e94dae7))
* handle sending fueling in form ([0b4f119](https://github.com/Bedol/fuelion-tracker/commit/0b4f1193a03065af3dd01c1f9413240058f31251))
* imports of PrismaPromise from prisma/client ([1c38888](https://github.com/Bedol/fuelion-tracker/commit/1c38888124b2a2e4c49303c1be44982e1ada361f))
* issue with type ([7506f8d](https://github.com/Bedol/fuelion-tracker/commit/7506f8d29dedbc69b6049cfda81261cfad0686bf))
* package.json build ([8a8d228](https://github.com/Bedol/fuelion-tracker/commit/8a8d228e71b948e8d7a688bba2555af78196b38b))
* remove unused commented elements ([272544d](https://github.com/Bedol/fuelion-tracker/commit/272544d70c3297efe66f974fa4c0018f083d54b3))
* types for fueling and vehicles apis ([0f8d4eb](https://github.com/Bedol/fuelion-tracker/commit/0f8d4eb162d73dc959539897ebecbca6b3d543a7))
* typo in config files names ([2e37092](https://github.com/Bedol/fuelion-tracker/commit/2e370920e72169ed7ed6ceb9d28488ca773b4929))


### Features

* add FetchDataErrorAlert component ([9f72148](https://github.com/Bedol/fuelion-tracker/commit/9f72148a5ff97417ba8b35f18f5e73d0f97a2f49))
* add links to Navigation ([0700916](https://github.com/Bedol/fuelion-tracker/commit/07009165734f30414080c37023f88dbbc1af4b03))
* add Loading component ([126b0fc](https://github.com/Bedol/fuelion-tracker/commit/126b0fc0b8f70300f9121eb9cb927a4e990aa148))
* add more inputs ([4f1215e](https://github.com/Bedol/fuelion-tracker/commit/4f1215ebecb17a02ad288e25d24817f074a06a5c))
* add new models to prisma schema ([e6e019b](https://github.com/Bedol/fuelion-tracker/commit/e6e019b53ced595cb88f535a633098329da2dc2d))
* add ReactQueryDevtools to App ([67eedac](https://github.com/Bedol/fuelion-tracker/commit/67eedacfe046a1ca032576d6c87a4e78e4daa192))
* allow to signin by google ([c1b5837](https://github.com/Bedol/fuelion-tracker/commit/c1b5837ff064f2d77f87ba188602bc730bca7aee))
* build form for handle create new vehicle ([fd924b7](https://github.com/Bedol/fuelion-tracker/commit/fd924b75d4707b41b72c9387bfd1dc7e98ab6c29))
* create Card component ([cb1a497](https://github.com/Bedol/fuelion-tracker/commit/cb1a497d465f89b1bc907b8681fbf6fcc8d9466c))
* create fueling in form WIP ([4dd4c54](https://github.com/Bedol/fuelion-tracker/commit/4dd4c54d6fd816e1112538ef9b9d63b73be67b84))
* create NumberInput component ([5da6e0e](https://github.com/Bedol/fuelion-tracker/commit/5da6e0ead54937b8f263cb27f8a4b258f41b1e99))
* create VehicleForm component ([b1e3771](https://github.com/Bedol/fuelion-tracker/commit/b1e3771b6f32a9defc74c17cf2be2b430ab9db68))
* replace a swr the react-query ([3614b45](https://github.com/Bedol/fuelion-tracker/commit/3614b45ba9a66b6a51f33b6a9cdac188eff5c952))
* update vehicle mileage when add new fueling ([05b592b](https://github.com/Bedol/fuelion-tracker/commit/05b592b86c5d18eeaf473eb8e80f522ea38d6f3e))
* use next-auth google provider ([7dd8c42](https://github.com/Bedol/fuelion-tracker/commit/7dd8c428fa862dafbce62314bfe38e5723688fa5))


### Reverts

* Revert "Install primereact" ([d5db13a](https://github.com/Bedol/fuelion-tracker/commit/d5db13af28b3135e5c4e94fa62cdced844622b3e))
* Revert "install primeicons" ([c2a5925](https://github.com/Bedol/fuelion-tracker/commit/c2a59253e493edc76f355636c368f2c63c94b116))
