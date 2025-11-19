-- ============================================
-- Law Planet - Seed Data
-- Sample data for demonstration
-- ============================================

-- Note: Run this AFTER creating actual users through the signup flow
-- Replace the UUIDs below with actual user IDs from your auth.users table

-- Sample News Articles
INSERT INTO news_articles (title, summary, content, category, tag, published_on) VALUES
(
  'Supreme Court Clarifies Guidelines on Anticipatory Bail in Financial Fraud Cases',
  'The Supreme Court has issued comprehensive guidelines on granting anticipatory bail in cases involving financial fraud and economic offenses.',
  'In a landmark judgment, the Supreme Court has clarified the legal position on anticipatory bail in financial fraud cases. The court emphasized that while economic offenses are serious, the right to liberty cannot be denied arbitrarily. The bench laid down specific parameters for lower courts to consider when evaluating anticipatory bail applications in such matters.',
  'Supreme Court',
  'SC Judgment',
  '2025-01-15'
),
(
  'High Court Rules on Child Custody in Interstate Disputes',
  'Delhi High Court sets precedent in determining child custody when parents reside in different states.',
  'The Delhi High Court has delivered an important judgment addressing the complex issue of child custody in cases where parents live in different states. The court ruled that the best interest of the child remains paramount, and proximity to educational institutions and extended family should be considered. The judgment provides clarity on jurisdictional issues in such disputes.',
  'High Court',
  'Family Law',
  '2025-01-10'
),
(
  'New Consumer Protection Rules for E-Commerce Platforms',
  'Government notifies stricter consumer protection norms for online marketplaces and delivery platforms.',
  'The Ministry of Consumer Affairs has introduced new rules strengthening consumer protection in e-commerce transactions. The rules mandate clear disclosure of country of origin, stricter return and refund policies, and grievance redressal mechanisms. E-commerce platforms must now ensure transparency in pricing and product descriptions.',
  'Policy',
  'Consumer Law',
  '2025-01-08'
),
(
  'Supreme Court on Right to Privacy in Digital Age',
  'Landmark ruling expands scope of privacy rights in the context of digital surveillance and data protection.',
  'The Supreme Court has reaffirmed and expanded the right to privacy in the digital age. The court held that unrestricted surveillance violates constitutional rights and mandated that data collection by both government and private entities must follow strict protocols. This judgment has significant implications for data protection legislation in India.',
  'Supreme Court',
  'SC Judgment',
  '2025-01-05'
),
(
  'Labour Law Reforms: New Code Comes Into Effect',
  'Four labour codes consolidating 29 central laws become operational across India.',
  'The new labour codes covering wages, industrial relations, social security, and occupational safety have come into effect. These reforms aim to simplify compliance, enhance ease of doing business, and provide better social security to workers. Employers and employees need to understand the new provisions to ensure compliance.',
  'Parliament',
  'Labour Law',
  '2025-01-03'
);

-- You can add more seed data here after user registration
-- Example for lawyer details (use actual user IDs after signup):

-- INSERT INTO profiles (id, full_name, role, phone) VALUES
-- ('actual-uuid-here', 'Adv. Ramesh Verma', 'lawyer', '+91-9876543210');

-- INSERT INTO lawyer_details (id, bar_council_id, court_level, specialization, experience_years, education, district, state, languages, bio, is_verified, is_active) VALUES
-- ('actual-uuid-here', 'D/12345/2010', 'High Court', 'Criminal', 12, 'LLB - Delhi University, LLM - NLSIU Bangalore', 'New Delhi', 'Delhi', ARRAY['Hindi', 'English'], 'Senior Criminal lawyer with extensive experience in handling major criminal matters and appeals. Available for consultation and court representation.', true, true);
