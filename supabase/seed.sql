-- ========================================================
-- SAMPARKA - DEMONSTRATION SEED DATA
-- Clearly marked with is_demo = true and '[DEMO]' tags
-- Location Focus: Hubli-Dharwad, Karnataka
-- ========================================================

-- Demo Businesses (Retail, Hospitality, Industrial, Tech, Education)
-- Note: Replace with actual auth user IDs when seeding a fresh Supabase project
DO $$
DECLARE
  v_demo_user_id UUID := '00000000-0000-0000-0000-000000000001';
  v_biz_retail UUID := '11111111-1111-1111-1111-111111111111';
  v_biz_cafe UUID := '22222222-2222-2222-2222-222222222222';
  v_biz_industry UUID := '33333333-3333-3333-3333-333333333333';
  v_biz_tech UUID := '44444444-4444-4444-4444-444444444444';
BEGIN

  -- Insert Demo Profile
  INSERT INTO public.profiles (id, full_name, user_type, city, locality, is_admin)
  VALUES (v_demo_user_id, 'Samparka Demo Employer', 'employer', 'Hubli', 'Vidyanagar', true)
  ON CONFLICT (id) DO NOTHING;

  -- 1. Demo Retail Store
  INSERT INTO public.businesses (id, owner_id, business_name, description, category, city, locality, address, contact_phone, contact_email, verification_status)
  VALUES 
    (v_biz_retail, v_demo_user_id, 'Kamat Enterprises & Retail Store', 'Leading regional retail and consumer electronics distributor near Chennamma Circle, Hubli.', 'Retail & Shops', 'Hubli', 'Chennamma Circle', 'Near Chennamma Circle, PB Road, Hubli', '+91 98801 12345', 'info@kamatretail.demo', 'verified'),
    (v_biz_cafe, v_demo_user_id, 'Chai & Charcha Cafe', 'Popular artisan cafe and student hangout spot in the heart of Vidyanagar college hub.', 'Restaurants & Cafes', 'Hubli', 'Vidyanagar', 'Shirur Park Road, Vidyanagar, Hubli', '+91 98802 23456', 'contact@chaicharcha.demo', 'verified'),
    (v_biz_industry, v_demo_user_id, 'Hubli Precision Engineering Works', 'ISO-certified precision metal fabrication and automotive parts supplier in Gokul Road Industrial Estate.', 'Manufacturing & Industrial', 'Hubli', 'Gokul Road', 'Plot 42, KIADB Industrial Area, Gokul Road, Hubli', '+91 98803 34567', 'careers@hubliprecision.demo', 'verified'),
    (v_biz_tech, v_demo_user_id, 'Malnad Cloud Solutions', 'SaaS and IT services company located at Aryabhata Tech Park, Navanagar Hubli.', 'IT & Office', 'Hubli', 'Navanagar', 'Aryabhata Tech Park, Navanagar, Hubli', '+91 98804 45678', 'talent@malnadcloud.demo', 'verified')
  ON CONFLICT (id) DO NOTHING;

  -- Demo Jobs (Clearly identified as DEMO)
  INSERT INTO public.jobs (
    business_id, created_by, title, description, category, employment_type, experience_level,
    salary_min, salary_max, salary_period, city, locality, work_schedule, skills, openings, status, is_demo, published_at
  ) VALUES 
    (
      v_biz_retail, v_demo_user_id,
      'Retail Sales Executive & Counter Assistant [DEMO]',
      'Join our retail store at Chennamma Circle. Responsibilities include customer greeting, inventory tallying, billing on POS, and stock display. College students welcomed for flexible morning/evening shifts.',
      'Retail & Shops', 'part_time', 'no_experience_required',
      9000, 14000, 'month', 'Hubli', 'Chennamma Circle',
      '4 PM – 9 PM (Evening Shift)', ARRAY['Customer Service', 'POS Billing', 'Inventory Handling', 'Kannada & English Communication'],
      3, 'published', true, NOW() - INTERVAL '1 day'
    ),
    (
      v_biz_cafe, v_demo_user_id,
      'Cafe Barista & Front Desk Host [DEMO]',
      'We are looking for an energetic Barista & Host for our student cafe in Vidyanagar. Perfect opportunity for local college students looking to earn while studying. Training provided.',
      'Restaurants & Cafes', 'part_time', 'entry',
      8000, 12000, 'month', 'Hubli', 'Vidyanagar',
      'Flexible Shifts (Weekend & Evening available)', ARRAY['Beverage Preparation', 'Cashier', 'Customer Hospitality', 'Punctuality'],
      2, 'published', true, NOW() - INTERVAL '2 days'
    ),
    (
      v_biz_industry, v_demo_user_id,
      'Junior Machine Operator & Assembly Technician [DEMO]',
      'Mechanical assembly and quality checking on Gokul Road. Diploma/ITI in Mechanical or Electrical preferred. Full-time position with PF, ESI, and attendance bonus.',
      'Manufacturing & Industrial', 'full_time', 'entry',
      16000, 22000, 'month', 'Hubli', 'Gokul Road',
      'General Shift: 9:00 AM – 5:30 PM', ARRAY['Machine Maintenance', 'Quality Inspection', 'Blueprint Reading', 'Industrial Safety'],
      4, 'published', true, NOW() - INTERVAL '3 days'
    ),
    (
      v_biz_tech, v_demo_user_id,
      'Digital Marketing & Social Media Coordinator [DEMO]',
      'Manage local brand campaigns, Instagram reels, and WhatsApp business outreach for retail clients. Creative writing skills in Kannada and English.',
      'IT & Office', 'full_time', 'intermediate',
      18000, 26000, 'month', 'Hubli', 'Navanagar',
      'Monday to Friday: 10:00 AM – 6:30 PM', ARRAY['Canva', 'Social Media Management', 'Content Writing', 'Kannada Copywriting', 'SEO Basics'],
      2, 'published', true, NOW() - INTERVAL '4 days'
    ),
    (
      v_biz_retail, v_demo_user_id,
      'Delivery & Logistics Executive (Dharwad Route) [DEMO]',
      'Deliver retail merchandise and parcels across Dharwad (Line Bazar, Sadhankeri, Toll Naka). Fuel allowance and delivery incentive provided.',
      'Logistics & Delivery', 'full_time', 'no_experience_required',
      14000, 19000, 'month', 'Dharwad', 'Line Bazar',
      'Day Shift with OT', ARRAY['Two-Wheeler Driving License', 'Local Route Knowledge', 'Mobile App Navigation'],
      5, 'published', true, NOW() - INTERVAL '5 days'
    ),
    (
      v_biz_cafe, v_demo_user_id,
      'Accountant & Billing Clerk [DEMO]',
      'Maintain day-to-day accounts, vendor invoices, Tally data entry, and monthly GST filing reconciliation.',
      'Accounts & Finance', 'full_time', 'intermediate',
      18000, 24000, 'month', 'Hubli', 'Keshwapur',
      '10:00 AM – 7:00 PM', ARRAY['Tally Prime', 'MS Excel', 'GST Filing', 'Invoicing'],
      1, 'published', true, NOW() - INTERVAL '6 days'
    );
END $$;
