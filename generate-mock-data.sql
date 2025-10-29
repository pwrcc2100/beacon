-- Beacon Mock Data Generator
-- Run this in Supabase SQL Editor to populate analytics with realistic data
-- Replace 'YOUR_CLIENT_ID' with your actual client_id from the clients table

-- Set your client_id here
DO $$
DECLARE
  v_client_id uuid := 'd8b81223-5580-4c91-9fe9-60eb6e5c91df';
  v_employee_id uuid;
  v_token_id uuid;
  v_division_id uuid;
  v_department_id uuid;
  v_team_id uuid;
  v_week_offset int;
  v_sentiment int;
  v_clarity int;
  v_workload int;
  v_safety int;
  v_leadership int;
  v_base_date timestamp;
BEGIN
  -- Clear existing mock data for this client (optional - comment out if you want to keep existing data)
  -- DELETE FROM responses_v3 WHERE client_id = v_client_id;
  -- DELETE FROM tokens WHERE client_id = v_client_id;
  -- DELETE FROM employees WHERE client_id = v_client_id;

  -- Generate data for the last 12 weeks
  FOR v_week_offset IN 0..11 LOOP
    v_base_date := NOW() - (v_week_offset || ' weeks')::interval;
    
    -- Get all divisions for this client
    FOR v_division_id IN 
      SELECT division_id FROM divisions WHERE client_id = v_client_id AND active = true
    LOOP
      -- Get departments in this division
      FOR v_department_id IN 
        SELECT department_id FROM departments WHERE division_id = v_division_id AND active = true
      LOOP
        -- Get teams in this department
        FOR v_team_id IN 
          SELECT team_id FROM teams WHERE department_id = v_department_id AND active = true
        LOOP
          -- Generate 3-8 responses per team per week
          FOR i IN 1..(3 + floor(random() * 6)::int) LOOP
            -- Create or get employee
            SELECT employee_id INTO v_employee_id
            FROM employees 
            WHERE client_id = v_client_id 
              AND division_id = v_division_id
              AND department_id = v_department_id
              AND team_id = v_team_id
            LIMIT 1;
            
            IF v_employee_id IS NULL THEN
              INSERT INTO employees (
                client_id, division_id, department_id, team_id,
                first_name, last_name, email, phone, unique_token, active
              ) VALUES (
                v_client_id, v_division_id, v_department_id, v_team_id,
                'Mock', 'Employee' || i, 'mock' || i || '@example.com',
                '+614' || LPAD(floor(random() * 100000000)::text, 8, '0'), -- Generate random Australian mobile
                'MOCK-' || gen_random_uuid()::text, -- Generate unique token
                true
              ) RETURNING employee_id INTO v_employee_id;
            END IF;
            
            -- Create token
            INSERT INTO tokens (
              client_id, employee_id, valid_until, status, channel, created_at, consumed_at
            ) VALUES (
              v_client_id, v_employee_id, 
              v_base_date + interval '7 days',
              'consumed', 'web',
              v_base_date,
              v_base_date + (random() * interval '3 days')
            ) RETURNING id INTO v_token_id;
            
            -- Generate realistic scores with some variation
            -- Sentiment: Generally positive with some variation (3-5 range, weighted toward 4)
            v_sentiment := CASE 
              WHEN random() < 0.1 THEN 3
              WHEN random() < 0.6 THEN 4
              ELSE 5
            END;
            
            -- Clarity: Usually good (3-5 range, weighted toward 4)
            v_clarity := CASE 
              WHEN random() < 0.15 THEN 3
              WHEN random() < 0.65 THEN 4
              ELSE 5
            END;
            
            -- Workload: More variation, some stress (2-5 range)
            v_workload := CASE 
              WHEN random() < 0.1 THEN 2
              WHEN random() < 0.3 THEN 3
              WHEN random() < 0.7 THEN 4
              ELSE 5
            END;
            
            -- Safety: Generally positive but some concerns (3-5 range)
            v_safety := CASE 
              WHEN random() < 0.2 THEN 3
              WHEN random() < 0.6 THEN 4
              ELSE 5
            END;
            
            -- Leadership: Varied responses (2-5 range)
            v_leadership := CASE 
              WHEN random() < 0.1 THEN 2
              WHEN random() < 0.25 THEN 3
              WHEN random() < 0.65 THEN 4
              ELSE 5
            END;
            
            -- Add some trending: older weeks have slightly lower scores
            IF v_week_offset > 6 THEN
              v_sentiment := GREATEST(1, v_sentiment - 1);
              v_workload := GREATEST(1, v_workload - 1);
              v_leadership := GREATEST(1, v_leadership - 1);
            END IF;
            
            -- Insert response
            INSERT INTO responses_v3 (
              token_id, client_id, employee_id,
              sentiment_3, sentiment_5,
              clarity_3, clarity_5,
              workload_3, workload_5,
              safety_3, safety_5,
              leadership_3, leadership_5,
              submitted_at
            ) VALUES (
              v_token_id, v_client_id, v_employee_id,
              -- Map 5-point to 3-point (5,4 -> 3; 3 -> 2; 2,1 -> 1)
              CASE WHEN v_sentiment >= 4 THEN 3 WHEN v_sentiment = 3 THEN 2 ELSE 1 END, v_sentiment,
              CASE WHEN v_clarity >= 4 THEN 3 WHEN v_clarity = 3 THEN 2 ELSE 1 END, v_clarity,
              CASE WHEN v_workload >= 4 THEN 3 WHEN v_workload = 3 THEN 2 ELSE 1 END, v_workload,
              CASE WHEN v_safety >= 4 THEN 3 WHEN v_safety = 3 THEN 2 ELSE 1 END, v_safety,
              CASE WHEN v_leadership >= 4 THEN 3 WHEN v_leadership = 3 THEN 2 ELSE 1 END, v_leadership,
              v_base_date + (random() * interval '3 days')
            );
          END LOOP;
        END LOOP;
      END LOOP;
    END LOOP;
  END LOOP;
  
  RAISE NOTICE 'Mock data generation complete!';
  RAISE NOTICE 'Generated responses for % weeks across all divisions/departments/teams', 12;
END $$;

-- Refresh the materialized view if you're using one
-- REFRESH MATERIALIZED VIEW wellbeing_responses;

-- Check the results
SELECT 
  DATE_TRUNC('week', submitted_at) as week,
  COUNT(*) as responses,
  ROUND(AVG(sentiment_5), 2) as avg_sentiment,
  ROUND(AVG(clarity_5), 2) as avg_clarity,
  ROUND(AVG(workload_5), 2) as avg_workload,
  ROUND(AVG(safety_5), 2) as avg_safety,
  ROUND(AVG(leadership_5), 2) as avg_leadership
FROM responses_v3
WHERE client_id = '85dd3327-e84f-48e9-a82c-5165378558de' -- Replace with your client_id
GROUP BY DATE_TRUNC('week', submitted_at)
ORDER BY week DESC
LIMIT 12;

