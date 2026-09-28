-- =====================================================================
-- SPENDWISE AI: COMPLETE DATABASE SCHEMA & RLS POLICIES
-- Target: Supabase PostgreSQL (Project ref: ngqvqmhjooowoxlmwfun)
-- Instructions: Run this entire script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/ngqvqmhjooowoxlmwfun/sql/new
-- =====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================================
-- 1. USERS PROFILE TABLE & SECURITY
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE,
    full_name TEXT,
    username TEXT,
    phone_number TEXT,
    password_hash TEXT,
    needs_username BOOLEAN DEFAULT FALSE,
    avatar_url TEXT,
    primary_currency TEXT DEFAULT 'INR',
    currency_symbol TEXT DEFAULT '₹',
    locale TEXT DEFAULT 'en',
    target_monthly_budget NUMERIC(12, 2) DEFAULT 35000.00 CHECK (target_monthly_budget >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Case-insensitive unique handle indexing
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username_unique 
ON public.users (LOWER(username)) 
WHERE username IS NOT NULL;

-- Rapid phone number lookup indexing
CREATE INDEX IF NOT EXISTS idx_users_phone_number 
ON public.users (phone_number) 
WHERE phone_number IS NOT NULL;

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own profile" ON public.users;
CREATE POLICY "Users can read own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
CREATE POLICY "Users can insert own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- =====================================================================
-- 2. EXPENSES & ITEMIZATION
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
    amount NUMERIC(12, 2) NOT NULL CHECK (amount >= 0),
    merchant TEXT NOT NULL,
    category TEXT NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    payment_method TEXT NOT NULL,
    notes TEXT,
    source TEXT DEFAULT 'manual' CHECK (source IN ('manual', 'receipt', 'voice', 'upi', 'statement')),
    need_want_tag TEXT CHECK (need_want_tag IN ('Need', 'Want', 'Unclear')),
    location_tag TEXT,
    is_anomaly BOOLEAN DEFAULT FALSE,
    anomaly_z_score NUMERIC(5, 2),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own expenses" ON public.expenses;
CREATE POLICY "Users can manage own expenses" ON public.expenses
    FOR ALL USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_expenses_user_date ON public.expenses(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_expenses_user_category ON public.expenses(user_id, category);

CREATE TABLE IF NOT EXISTS public.expense_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    expense_id UUID REFERENCES public.expenses(id) ON DELETE CASCADE,
    item_name TEXT NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
    quantity NUMERIC(6, 2) DEFAULT 1 CHECK (quantity > 0),
    total_price NUMERIC(10, 2) NOT NULL CHECK (total_price >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.expense_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own expense items" ON public.expense_items;
CREATE POLICY "Users can manage own expense items" ON public.expense_items
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.expenses e
            WHERE e.id = expense_items.expense_id AND e.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.expenses e
            WHERE e.id = expense_items.expense_id AND e.user_id = auth.uid()
        )
    );

-- =====================================================================
-- 3. BUDGETS
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.budgets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
    category TEXT NOT NULL,
    allocated_amount NUMERIC(12, 2) NOT NULL CHECK (allocated_amount >= 0),
    period TEXT DEFAULT 'monthly',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, category, period)
);

ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own budgets" ON public.budgets;
CREATE POLICY "Users can manage own budgets" ON public.budgets
    FOR ALL USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- =====================================================================
-- 4. SAVINGS GOALS
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.savings_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
    goal_name TEXT NOT NULL,
    target_amount NUMERIC(12, 2) NOT NULL CHECK (target_amount > 0),
    current_amount NUMERIC(12, 2) DEFAULT 0 CHECK (current_amount >= 0),
    target_date DATE NOT NULL,
    is_paused BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.savings_goals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own savings goals" ON public.savings_goals;
CREATE POLICY "Users can manage own savings goals" ON public.savings_goals
    FOR ALL USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- =====================================================================
-- 5. SUBSCRIPTIONS & RECURRING BILLS
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
    service_name TEXT NOT NULL,
    amount NUMERIC(10, 2) NOT NULL CHECK (amount >= 0),
    frequency TEXT DEFAULT 'monthly' CHECK (frequency IN ('weekly', 'monthly', 'quarterly', 'yearly')),
    next_due_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own subscriptions" ON public.subscriptions;
CREATE POLICY "Users can manage own subscriptions" ON public.subscriptions
    FOR ALL USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.bills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
    bill_name TEXT NOT NULL,
    estimated_amount NUMERIC(10, 2) NOT NULL CHECK (estimated_amount >= 0),
    due_date DATE NOT NULL,
    is_paid BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.bills ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own bills" ON public.bills;
CREATE POLICY "Users can manage own bills" ON public.bills
    FOR ALL USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- =====================================================================
-- 6. SHARED EXPENSE GROUPS & SPLITTING
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.shared_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_name TEXT NOT NULL,
    created_by UUID REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.shared_groups ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.group_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID REFERENCES public.shared_groups(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member',
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(group_id, user_id)
);

ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_member_of_group(lookup_group_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.group_members
        WHERE group_id = lookup_group_id AND user_id = auth.uid()
    );
$$;

DROP POLICY IF EXISTS "Members can view shared group" ON public.shared_groups;
CREATE POLICY "Members can view shared group" ON public.shared_groups
    FOR SELECT USING (
        created_by = auth.uid() OR public.is_member_of_group(id)
    );

DROP POLICY IF EXISTS "Group members can view memberships" ON public.group_members;
CREATE POLICY "Group members can view memberships" ON public.group_members
    FOR SELECT USING (
        user_id = auth.uid() OR public.is_member_of_group(group_id)
    );

CREATE TABLE IF NOT EXISTS public.group_expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_id UUID REFERENCES public.shared_groups(id) ON DELETE CASCADE,
    payer_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount >= 0),
    split_type TEXT DEFAULT 'equal' CHECK (split_type IN ('equal', 'exact', 'percentage')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.group_expenses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Group members can access group expenses" ON public.group_expenses;
CREATE POLICY "Group members can access group expenses" ON public.group_expenses
    FOR ALL USING (public.is_member_of_group(group_id))
    WITH CHECK (public.is_member_of_group(group_id));

CREATE TABLE IF NOT EXISTS public.group_splits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    group_expense_id UUID REFERENCES public.group_expenses(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    amount_owed NUMERIC(12, 2) NOT NULL CHECK (amount_owed >= 0),
    is_settled BOOLEAN DEFAULT FALSE
);

ALTER TABLE public.group_splits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Members can access group splits" ON public.group_splits;
CREATE POLICY "Members can access group splits" ON public.group_splits
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.group_expenses ge
            WHERE ge.id = group_splits.group_expense_id AND public.is_member_of_group(ge.group_id)
        )
    );

-- =====================================================================
-- 7. AI GAMIFIED CHALLENGES
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.challenges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE DEFAULT auth.uid(),
    title TEXT NOT NULL,
    target_savings NUMERIC(12, 2) NOT NULL CHECK (target_savings > 0),
    deadline DATE NOT NULL,
    status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'failed')),
    reward_points INTEGER DEFAULT 50,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own challenges" ON public.challenges;
CREATE POLICY "Users can manage own challenges" ON public.challenges
    FOR ALL USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- =====================================================================
-- 8. ANALYTICAL VIEWS
-- =====================================================================
CREATE OR REPLACE VIEW public.v_monthly_expense_summary AS
SELECT
    user_id,
    TO_CHAR(date, 'YYYY-MM') AS month_year,
    category,
    SUM(amount) AS total_spent,
    COUNT(*) AS transaction_count,
    AVG(amount) AS avg_transaction_amount,
    STDDEV(amount) AS stddev_transaction_amount
FROM public.expenses
GROUP BY user_id, TO_CHAR(date, 'YYYY-MM'), category;
