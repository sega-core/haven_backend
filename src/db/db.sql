CREATE TABLE blagodarnost (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  date DATE NOT NULL,
  text VARCHAR(1000) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  CONSTRAINT blagodarnost_text_length CHECK (char_length(text) <= 1000),
  CONSTRAINT unique_blagodarnost_per_day UNIQUE (user_id, date)
);


CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  service VARCHAR(50) NOT NULL,
  username VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
