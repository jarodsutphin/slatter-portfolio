-- Run this in the Supabase SQL editor for your project

CREATE TABLE IF NOT EXISTS projects (
  id               uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  slug             text        UNIQUE NOT NULL,
  client           text        NOT NULL,
  project_name     text        NOT NULL,
  blurb            text        DEFAULT '',
  category         text        NOT NULL DEFAULT 'print',
  grid_image_url   text        DEFAULT '',
  full_image_urls  text[]      DEFAULT '{}',
  sort_order       integer     DEFAULT 99,
  created_at       timestamptz DEFAULT now(),
  updated_at       timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Public can read all projects
CREATE POLICY "public_read"  ON projects FOR SELECT             USING (true);
-- Allow writes via anon key (password gate is enforced in the admin UI)
CREATE POLICY "anon_write"   ON projects FOR INSERT  WITH CHECK (true);
CREATE POLICY "anon_update"  ON projects FOR UPDATE  USING (true) WITH CHECK (true);
CREATE POLICY "anon_delete"  ON projects FOR DELETE  USING (true);

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;
CREATE TRIGGER set_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- -------------------------------------------------------
-- Seed existing 15 projects (image paths are root-relative
-- and map to the existing /images/ folder on the site)
-- -------------------------------------------------------
INSERT INTO projects (slug, client, project_name, blurb, category, grid_image_url, full_image_urls, sort_order) VALUES
('ackland',
 'Ackland Art Museum',
 '60th Anniversary Event Invitation Package',
 'A gold-foiled, hand-embossed invitation suite marking six decades of the Ackland Art Museum at UNC Chapel Hill, wrapped in a custom vellum pocket.',
 'print', '/images/grid/ackland.jpg', ARRAY['/images/full/ackland.jpg'], 1),

('chancellor',
 'The University of North Carolina at Chapel Hill',
 'Chancellor Installation Ceremony Invitation Package',
 'A custom die-cut folder and embossed invitation suite for the installation of the University''s Eleventh Chancellor, Dr. Carol Folt.',
 'print', '/images/grid/chancellor.jpg', ARRAY['/images/full/chancellor.jpg'], 2),

('financial-report',
 'The University of North Carolina at Chapel Hill',
 'Comprehensive Annual Financial Report',
 'A 100+ page annual financial report for UNC Chapel Hill, built around custom data visualizations and a soft-touch cover.',
 'print', '/images/grid/financial-report.jpg', ARRAY['/images/full/financial-report.jpg'], 3),

('leviticus',
 'Chapel Hill Bible Church',
 'Women''s Ministry Leviticus Bible Study Guide',
 'A 200+ page study guide through the book of Leviticus, illustrated and diagrammed to make dense theological material approachable.',
 'print', '/images/grid/leviticus.jpg', ARRAY['/images/full/leviticus.jpg'], 4),

('briefcase-coach',
 'Briefcase Coach',
 'Corporate Outplacement Marketing Brochure',
 'A tri-fold marketing brochure for an executive outplacement coaching firm, translated for both print and digital distribution.',
 'print', '/images/grid/briefcase-coach.jpg', ARRAY['/images/full/briefcase-coach.jpg'], 5),

('uva-directmail',
 'University of Virginia Office of Admissions',
 'Prospective Student Direct Mail',
 'A direct mail campaign welcoming admitted students to UVA, built around bold type and a poster insert made for a dorm-room wall.',
 'print', '/images/grid/uva-directmail.jpg', ARRAY['/images/full/uva-directmail.jpg'], 6),

('geological-newsletter',
 'The University of North Carolina at Chapel Hill',
 'Department of Geological Sciences Alumni Newsletter',
 'A print-and-digital alumni newsletter for the UNC Department of Geological Sciences, featuring faculty research, student highlights, and a new masthead identity.',
 'print', '/images/grid/geological-newsletter.jpg', ARRAY['/images/full/geological-newsletter.jpg'], 7),

('wonderkid',
 'Wonderkid',
 'Book Cover Design',
 'A cover design for a debut middle-grade novel, combining hand-lettering with layered illustration to convey both whimsy and emotional weight.',
 'print', '/images/grid/wonderkid.jpg', ARRAY['/images/full/wonderkid.jpg'], 8),

('ada-diabetes',
 'American Diabetes Association',
 'Supplemental Graphics for Juvenile Diabetes Educational Video Series',
 'A series of illustrated diagrams and motion-ready graphics created to accompany a 12-part educational video series on juvenile diabetes management for school-age children.',
 'illustration', '/images/grid/ada-diabetes.jpg', ARRAY['/images/full/ada-diabetes.jpg'], 9),

('vintage-church',
 'Vintage Church',
 '20th Anniversary Event Branding + Promotion',
 'A full event identity system for Vintage Church''s 20th Anniversary, spanning illustrated sermon art, print collateral, and a social media campaign.',
 'illustration', '/images/grid/vintage-church.jpg', ARRAY['/images/full/vintage-church.jpg'], 10),

('hemlock-inn',
 'Hemlock Inn',
 'Logo + Branding',
 'A brand identity for a family-owned mountain inn in the North Carolina highlands, rooted in woodcut illustration and a warm, timeworn color palette.',
 'branding', '/images/grid/hemlock-inn.jpg', ARRAY['/images/full/hemlock-inn.jpg'], 11),

('nug-sprout',
 'Nug + Sprout',
 'Logo + Branding',
 'A playful, illustrated brand identity for a children''s wellness company, built on a hand-drawn mark and a bright, vegetable-inspired color system.',
 'branding', '/images/grid/nug-sprout.jpg', ARRAY['/images/full/nug-sprout.jpg'], 12),

('st-pauls',
 'St. Paul''s Episcopal Church',
 'Logo + Branding',
 'A brand identity refresh for a historic Episcopal congregation, balancing reverence for tradition with a contemporary typographic presence.',
 'branding', '/images/grid/st-pauls.jpg', ARRAY['/images/full/st-pauls.jpg'], 13),

('nc-live',
 'NC LIVE',
 '2023–26 Strategic Plan',
 'An interactive digital strategic plan for NC LIVE, North Carolina''s statewide library consortium, designed for web-first consumption with a clear visual hierarchy and printable companion.',
 'digital', '/images/grid/nc-live.jpg', ARRAY['/images/full/nc-live.jpg'], 14),

('fafsa-vcac',
 'Virginia College Advising Corps',
 'FAF$A Now Social Media Campaign',
 'A social media campaign kit for Virginia College Advising Corps encouraging first-generation college students to complete the FAFSA, built around bold graphics and a student-first visual voice.',
 'digital', '/images/grid/fafsa-vcac.jpg', ARRAY['/images/full/fafsa-vcac.jpg'], 15)
ON CONFLICT (slug) DO NOTHING;

-- -------------------------------------------------------
-- Storage: in the Supabase dashboard go to Storage and:
-- 1. Create a bucket named  project-images  (check "Public bucket")
-- 2. Under Policies add:
--    INSERT  for role anon  WITH CHECK (true)
--    SELECT  for role anon  USING (true)
-- -------------------------------------------------------
