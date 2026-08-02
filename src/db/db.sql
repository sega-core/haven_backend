CREATE TABLE users (
  id VARCHAR(12) PRIMARY KEY,
  platform_id BIGINT NOT NULL,
  platform VARCHAR(50) NOT NULL,
  username VARCHAR(50) NOT NULL,
  onboarding_completed BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE (platform_id, platform)
);

CREATE TABLE gratitude (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  comment VARCHAR(1000) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE mood (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  level SMALLINT NOT NULL CHECK (level BETWEEN 1 AND 5),
  tags TEXT[] DEFAULT '{}',
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE daily_question (
  id SERIAL PRIMARY KEY,
  question TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE user_daily_question (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  question_id INTEGER NOT NULL REFERENCES daily_question(id) ON DELETE CASCADE,
  answer VARCHAR(1000) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE target (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  start_date DATE NOT NULL, --YYYY-MM-DD
  end_date DATE NOT NULL, --YYYY-MM-DD
  weekdays TEXT[] DEFAULT '{}',
  notify_time TIME,
  color VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE target_completion (
  id SERIAL PRIMARY KEY,
  target_id INTEGER NOT NULL REFERENCES target(id) ON DELETE CASCADE,
  date DATE NOT NULL, --YYYY-MM-DD
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (target_id, date)
);

CREATE TABLE coin_balance (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  daily_streak INT NOT NULL DEFAULT 0,
  last_bonus_at DATE NOT NULL, --YYYY-MM-DD
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (user_id)
);

CREATE TABLE coin_transaction (
  id SERIAL PRIMARY KEY,
  balance_id BIGINT NOT NULL REFERENCES coin_balance(id) ON DELETE CASCADE,
  amount INT NOT NULL,
  type VARCHAR(32) NOT NULL, -- 'ACCRUE' | 'SPEND'
  meta JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE practice (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  instructions TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  price_zen INT NOT NULL,
  price_rub INT,
  is_active BOOLEAN DEFAULT true,
  img_url VARCHAR(200),
  sequence INT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE practice_bundle (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  price_rub INT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  img_url VARCHAR(200),
  sequence INT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE practice_bundle_item (
  id SERIAL PRIMARY KEY,
  bundle_id INTEGER NOT NULL REFERENCES practice_bundle(id) ON DELETE CASCADE,
  practice_id INTEGER NOT NULL REFERENCES practice(id) ON DELETE CASCADE,
  position INT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),  
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (bundle_id, practice_id)
);

CREATE TABLE meta_card (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  img_url VARCHAR(200),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


CREATE TABLE user_meta_card_answer (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  meta_card_id INTEGER NOT NULL REFERENCES meta_card(id) ON DELETE CASCADE,
  seen VARCHAR(200) NOT NULL,
  felt VARCHAR(200) NOT NULL,
  understood VARCHAR(200) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE order_rub (
  id BIGINT NOT NULL PRIMARY KEY, -- InvId от Robokassa,
  item_id INTEGER NOT NULL,
  user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount INT NOT NULL,
  purchase_type VARCHAR(20) NOT NULL CHECK (purchase_type IN ('practice', 'bundle')),
  status VARCHAR(50)  NOT NULL DEFAULT 'pending', -- ENUM('pending', 'paid', 'failed')
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE order_zen (
  id SERIAL PRIMARY KEY,  
  item_id INTEGER NOT NULL,
  user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount INT NOT NULL,
  purchase_type VARCHAR(20) NOT NULL CHECK (purchase_type IN ('practice', 'bundle')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE admin_users (
  id SERIAL PRIMARY KEY,  
  user_id VARCHAR(12) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE (user_id)
);

CREATE TABLE notification_history (
  id BIGSERIAL PRIMARY KEY,
  message TEXT NOT NULL,
  recipients VARCHAR(50) NOT NULL,
  recipient_count INTEGER NOT NULL DEFAULT 0,
  success_count INTEGER NOT NULL DEFAULT 0,
  fail_count INTEGER NOT NULL DEFAULT 0,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  error TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

--TODO: добавить индексы с таблицам--
