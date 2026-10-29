
CREATE TABLE IF NOT EXISTS employees (
  id SERIAL PRIMARY KEY,                  
  name VARCHAR(100) NOT NULL,            
  email VARCHAR(150) UNIQUE NOT NULL,     
  password VARCHAR(255) NOT NULL,         
  created_at TIMESTAMP DEFAULT NOW()
);


CREATE TABLE IF NOT EXISTS leads (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,         
  email VARCHAR(150) NOT NULL,         
  course_interest VARCHAR(150),          
  claimed_by INTEGER REFERENCES employees(id) ON DELETE SET NULL, 
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leads_claimed_by ON leads(claimed_by);