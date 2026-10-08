# Torino — Character in Motion

Design 6 is a custom headless direction for a future Hydrogen storefront. It is separate from Designs 1–5.

## Reference research

These are selected creative references, not an objective ranking of all Shopify stores.

| Reference | Verified basis | What this Torino concept takes from it |
|---|---|---|
| [Nour Hammour](https://nour-hammour.com/) | Listed in [Shopify’s Hydrogen showcase](https://hydrogen.shopify.dev/showcase). The live storefront was inspected, and [Shopify’s case study](https://www.shopify.com/enterprise/blog/headless-commerce-examples) describes its editorial lookbook commerce. | Leather presented as fashion, large campaign photography, and direct shopping from the story. |
| Patta x Tommy | The collaboration is in the [Hydrogen showcase](https://hydrogen.shopify.dev/showcase). [Shopify’s case study](https://www.shopify.com/enterprise/blog/headless-commerce-examples) documents animation, video and high-fidelity imagery in that campaign. This is a documented campaign reference, not a claim about a currently available campaign URL. | A campaign-led experience with transitions between scenes. |
| Lady Gaga | Shopify documents the Hydrogen storefront and its 3D album showcase and mood effects in [this article](https://www.shopify.com/news/lady-gaga-hydrogen). | Atmospheric art direction and motion around a focal product. Torino uses original 2D photographs; no 3D belt model or new video is fabricated. |

The photo aperture, scrubbed text, product chapters and horizontal rail are our original interpretation. Images, logos and code from these reference stores are not included.

## The scroll choreography

1. **The first impression:** a narrow fashion photograph expands into a full-screen composition. Oversized typography moves and fades; a Torino wordmark appears at the end of the scene.
2. **The small things:** individual words gain contrast with the scroll position.
3. **A closer look:** the original woven belt photo rotates and scales while the weave, stretch and finish chapters change. The product link remains available.
4. **Find your character:** normal vertical scrolling advances a horizontal collection gallery. Numbered controls and keyboard focus also navigate it.
5. **The Torino edit:** ordinary commerce cards and working product tabs provide a quick shopping path.
6. **The human touch:** artisan photography moves gently behind the brand story.
7. **Journal and fit:** content and size guidance conclude the experience.

No wheel interception or artificial scroll smoothing is used. The animation controller uses one scheduled animation frame per scroll update and cleans up its listeners when a scene is replaced. Mobile retains shorter pinned photo/product stories and uses a native swipe gallery. Short phone viewports use a normal product detail layout. Motion off and reduced-motion preferences remove pinning, restore all product chapters, and keep every collection accessible.

## What is delivered

- `index.html`, `app.js`, `data.js`, `styles.css`, `design6.css`, `motion.js`, and the original local assets: the fully working standalone presentation preview.
- `hydrogen-components/CharacterInMotion.tsx`: matching React scene markup with the captured product edit tabs.
- `hydrogen-components/useTorinoMotion.ts`: React integration with cleanup, content changes, a pause prop and reduced-motion support.
- `hydrogen-components/createTorinoMotion.js`: the same reusable scroll controller used in the preview.

The React component uses captured source content and prices; it is a migration component, not a complete connected Hydrogen application. JavaScript syntax and the standalone browser experience were checked. A complete Hydrogen build/typecheck has not been run because no Hydrogen app or Shopify storefront configuration is present in this workspace.

## Hydrogen implementation

Start from Shopify’s supported Hydrogen starter using the [official getting-started instructions](https://shopify.dev/docs/storefronts/headless/hydrogen/getting-started). The documented quickstart command is `npm create @shopify/hydrogen@latest -- --quickstart`.

Copy the four files in `hydrogen-components/` into the app’s components directory. Copy the original assets to `public/torino/assets/`. Include the base `styles.css` and then `design6.css` in the storefront stylesheet setup. Render `CharacterInMotion` inside the homepage layout. Match the header styling and 72px sticky offset to the actual Hydrogen shell. Connect the surrounding motion toggle to the component’s `paused` prop.

Replace the component’s captured product cards, source prices and editorial entries with real loader data from the Storefront API. Keep the public product/collection routes aligned with the migration map and create redirects for existing URLs. The preview’s legacy links are preserved for mapping; they should not be assumed to match Shopify handles before import.

Implement the actual cart, variant availability, checkout handoff, customer accounts, search, gift cards, policies and content pages using the linked Shopify store. Validate the build, route metadata, redirects, privacy/analytics integration, focus order, reduced-motion behavior, touch behavior and performance on real target devices before launch.

## Content and validation

All 402 captured source routes are retained in the standalone preview. Data and images come from the original Torino snapshot captured September 30, 2026. New editorial headlines are proposed creative copy. Live stock and current prices are not connected.

Checked in the browser at 1280px desktop and 402px mobile: hero expansion, product rotation and chapter changes, desktop rail navigation, mobile gallery selection, source product size 36 selection, sample bag add/remove, motion-off normal layout, and lack of horizontal page overflow. Local image references and source-data preservation were checked. No browser console errors were observed during these checks.
