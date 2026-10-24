-- Seed content for the new CMS collections (posts, tools, services).
-- Applied manually to remote D1 — mirrors what scripts/seed.ts inserts locally.
-- Idempotent-ish: only run once on an empty set of tables.

INSERT INTO `posts` (`title`, `slug`, `excerpt`, `content`, `published_date`, `featured`, `published`)
VALUES (
  'Hello World',
  'hello-world',
  'First entry — what this site is and what I plan to write about.',
  '{"root":{"type":"root","format":"","indent":0,"version":1,"direction":"ltr","children":[{"type":"paragraph","format":"","indent":0,"version":1,"direction":"ltr","children":[{"type":"text","text":"This is the first post on the site. Writing about design engineering, creative tech, and the process of building things lives here.","version":1,"detail":0,"format":0,"mode":"normal","style":""}]}]}}',
  strftime('%Y-%m-%dT%H:%M:%fZ', 'now'),
  true,
  true
);

INSERT INTO `posts_tags` (`_order`, `_parent_id`, `id`, `tag`) VALUES
  (0, (SELECT `id` FROM `posts` WHERE `slug` = 'hello-world'), 'pt-hello-1', 'meta'),
  (1, (SELECT `id` FROM `posts` WHERE `slug` = 'hello-world'), 'pt-hello-2', 'process');

INSERT INTO `tools` (`name`, `category`, `description`, `url`, `order`, `published`) VALUES
  ('Figma', 'design', 'Interface design and prototyping.', 'https://figma.com', 1, true),
  ('VS Code', 'development', 'Primary editor.', 'https://code.visualstudio.com', 2, true),
  ('Linear', 'software', 'Issue tracking and project planning.', 'https://linear.app', 3, true),
  ('Cloudflare Workers', 'development', 'Edge compute — hosts this site.', 'https://workers.cloudflare.com', 4, true);

INSERT INTO `services` (`title`, `slug`, `key`, `summary`, `price_label`, `order`, `published`) VALUES
  ('Design Engineering Sprint', 'design-engineering-sprint', 'design_engineering', 'A focused sprint to design and build a key flow, feature, or surface.', 'from £5k', 1, true),
  ('Consultancy & Advisory', 'consultancy-advisory', 'consultancy', 'Embedded design-engineering advisory for product and brand teams.', 'POA', 2, true),
  ('Full Production Build', 'full-production-build', 'full_production', 'End-to-end design and engineering of a site or product surface.', 'from £25k', 3, true);

INSERT INTO `services_deliverables` (`_order`, `_parent_id`, `id`, `item`) VALUES
  (0, (SELECT `id` FROM `services` WHERE `slug` = 'design-engineering-sprint'), 'sd-sprint-1', 'Scoped sprint plan and milestones'),
  (1, (SELECT `id` FROM `services` WHERE `slug` = 'design-engineering-sprint'), 'sd-sprint-2', 'Production-ready front-end implementation'),
  (2, (SELECT `id` FROM `services` WHERE `slug` = 'design-engineering-sprint'), 'sd-sprint-3', 'Handoff docs and Loom walkthrough'),
  (0, (SELECT `id` FROM `services` WHERE `slug` = 'consultancy-advisory'), 'sd-advisory-1', 'Weekly advisory sessions'),
  (1, (SELECT `id` FROM `services` WHERE `slug` = 'consultancy-advisory'), 'sd-advisory-2', 'Architecture and design-system reviews'),
  (2, (SELECT `id` FROM `services` WHERE `slug` = 'consultancy-advisory'), 'sd-advisory-3', 'Async support between sessions'),
  (0, (SELECT `id` FROM `services` WHERE `slug` = 'full-production-build'), 'sd-build-1', 'Discovery and creative direction'),
  (1, (SELECT `id` FROM `services` WHERE `slug` = 'full-production-build'), 'sd-build-2', 'Design system and component library'),
  (2, (SELECT `id` FROM `services` WHERE `slug` = 'full-production-build'), 'sd-build-3', 'Production build, deployment, and launch');
